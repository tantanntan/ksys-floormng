(function() {
  var login = {};
  login.loaded = function() {
    // 4/27 【ログイン画面】ログインボタン押下処理
    $('#btn_submit').live("click", function(){
      console.log('店舗：' + $('#tenponame').val() + 'でログイン');
      io.socket.get('/master_member',{
        m_id: $('#username').val()
      },function(res){
        if(res[0] != undefined){
          io.socket.put('/master_member/' + res[0].id,{
            shopId: $('#tenponame').val()
          },function(member,err){
            console.log('店舗：' + $('#tenponame').val() + 'で更新');
          });
        }
      });
    });
  };
  
  if('undefined' == typeof module) {
    
    if(!window.ks) {
      window.ks = {};
    }
    
    window.ks.login = login;
    
  } else {
    module.exports = login;
  }
})();