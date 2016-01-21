// ログインアクセスポリシーとして loginAuth という(任意の)名称でポリシーファイルを作成
// 承認したユーザーのみリダイレクトを行わないようにする
module.exports = function(req, res, next) {
    
    // 認証されていたら次の処理へ
    if(req.isAuthenticated()) {
        // This request is authenticated
        return next();
    }
    
    // 認証されていなければログイン画面へリダイレクト
    return res.redirect("/login");

};