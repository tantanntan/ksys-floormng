var passport = require('passport');

// express middleware hook
// expressの middleware へ passport モジュールを使用するための設定
module.exports = {  
    express: {
        customMiddleware: function(app){
            // app: express() オブジェクト
            console.log("passport module initialize");
            app.use(passport.initialize());
            app.use(passport.session());
        }
    }
};