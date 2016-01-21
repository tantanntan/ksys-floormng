/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport'),  
LocalStrategy = require('passport-local').Strategy,  
bcrypt = require('bcrypt');
var shopId = '';

//helper functions
function findById(id, fn) {
    // findOneならオブジェクトが返ってくるが、findByIdやfindByUsernameを使うとArrayで返ってくるので注意！
    Master_member.findOne(id).exec(function (err, user) {
        if (err) {
            return fn(null, null);
            
        } else {
            if(user == undefined){
                // nsys
                Nshop.findOne(id).exec(function (err, user) {
                    if (err) {
                        return fn(null, null);
                    } else {
                        return fn(null, user);
                    }
                });
            } else {
                // ログイン画面で選択した店舗IDをセット
                user.shopId = shopId;
                return fn(null, user);
            }
        }
    });
}

function findByUsername(u, fn) {  
    Master_member.findOne({
        m_id: u
    }).exec(function (err, user) {
        // Error handling
        if (err) {
            return fn(null, null);
            
        // The User was found successfully!
        } else {
            if(user == undefined){
                Nshop.findOne({
                    m_id: u
                }).exec(function (err, user) {
                    if (err) {
                        return fn(null, null);
                    } else {
                        return fn(null, user);
                    }
                });
            } else {
                return fn(null, user);
            }
        }
    });
}

// passport コアモジュール 基本動作定義
// コアの処理としてデータシリアライズなどの定義を行う。user.id のみをキーとして持ち回り
passport.serializeUser(function (user, done) {  
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {  
    findById(id, function (err, user) {
        done(err, user);
    });
});

// passport-local サブモジュール ID/Password認証定義
// ログイン処理時に実行される処理を定義。引数として渡された userneme,password を元にUserデータを確認し、
// 必要なデータ(任意のオブジェクト)を、コールバックの引数へ渡す
passport.use(new LocalStrategy(
    function (username, password, done) {
        process.nextTick(function () {

            findByUsername(username, function (err, user) {
                if (err)
                    return done(null, err);
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user ' + username
                    });
                }

                bcrypt.compare(password, user.password, function (err, res) {
                    if (!res)
                        return done(null, false, {
                            message: 'Invalid Password'
                        });
                    var returnUser = {
                        username: user.m_id,
                        id: user.id
                    };
                    return done(null, returnUser, {
                        message: 'Logged In Successfully'
                    });
                });
            });
        });
    }
));

module.exports = {

    // 初期表示処理
    login: function (req, res) {
    
        // ログイン画面表示
        return res.view();
    },
    
    
    // 初期表示処理(nsys)
    nlogin: function (req, res) {
    
        // ログイン画面表示
        return res.view();
    },


    // 認証処理
    process: function (req, res) {
        passport.authenticate('local', function(err, user, info) {

            console.log(info);
            shopId = req.body.shopId;
            if(shopId == undefined){
                if ((err) || (!user)) {
                    return res.send({
                        message: 'ユーザーIDかパスワードが間違っています。'
                    });
                }
                
                req.logIn(user, function(err) {
                    if (err) res.send(err);
                    // 承認後 /dashboardへ
                    return res.redirect("/nsys/main");
                });
            }

            if ((err) || (!user)) {
                return res.send({
                    message: 'ユーザーIDかパスワードが間違っています。'
                });
            } else {
                // ユーザーIDから権限を取得し、権限マスタからログインしようとした店舗の権限が存在するかチェック
                var accesschk = false;
                Master_member.findOne({
                    m_id: req.body.username
                    
                }).exec(function (err_m, user_m) {
                    if(user_m != undefined){
                        
                        Master_Accesslv.findOne({
                            k_id: user_m.k_id,
                            accesslv: user_m.accesslv
                            
                        }).exec(function (err_a, acc) {
                            if(acc != undefined){
                                var _store = acc.accshop.split(",");
                                
                                for(var i in _store){
                                    if(_store[i] == shopId ){
                                        accesschk = true;
                                        break;
                                    }
                                }
                            }
                            
                            if(!accesschk){
                                return res.send({
                                    message: 'この店舗のアクセス権限がありません。'
                                });
                            } else {
                                // req.isAuthenticated() -> false
                                // req.user -> undefined

                                req.logIn(user, function(err) {
                                    if (err) res.send(err);

                                    // req.isAuthenticated() -> true
                                    // req.user -> user -> When new LocalStrategy, Callback user Object

                                    // 承認後 /panel/mainへ
                                    return res.redirect("/panel/main");

                                });
                            }
                        });
                    } else {
                        
                    }
                });
            }

            
        })(req, res);
    },


    // ログアウト処理
    logout: function (req, res) {
    
        // ログイン承認解除
        //req.logout;
        req.session.destroy();
        
        //解除後、topページへ
        res.redirect("/login");
    },
    
    
    // ログアウト処理(nsys)
    nlogout: function (req, res) {
    
        // ログイン承認解除
        //req.logout;
        req.session.destroy();
        
        //解除後、topページへ
        res.redirect("/nlogin");
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}

  
};
