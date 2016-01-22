(function() {
//  var visitor = {};
  var _wt = new KsWidgetTmpl();

  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/global-tab.html',
    obj: {},
    loaded: false
  };

  //タブ一覧
  var _tabs = [
    { label: '営業準備'    , content: 'top-pane-ready'    , active: false, display: false },
    { label: '営業中'      , content: 'top-pane-floor'    , active: false, display: false },
    { label: '出退勤'      , content: 'top-pane-presence' , active: false, display: false },
    { label: 'キャスト'    , content: 'top-pane-cast'     , active: false, display: false },
    { label: '店舗情報'    , content: 'top-pane-stores'   , active: false, display: false },
    { label: '集計'        , content: 'top-pane-report'   , active: false, display: false },
    { label: 'マスタ'      , content: 'top-pane-templates', active: false, display: false },
    { label: '企業情報'    , content: 'top-pane-master'   , active: false, display: false }
  ];

  //全タブ初期化
  //タブの選択はサーバ側に置くと思う
  _wt.initAllTab = function(){
    if($('#login_shopId').val() != undefined){
      //企業ID、店舗IDを取得
      io.socket.get('/mshop', {
        id: $('#login_shopId').val()
      }, function(res,err) {
        KsWidgetTmpl.prototype.shopObj=res;
        $('.login-shopname').text(res.shopName);
        //店名の表示
        setTimeout(function(){if($('.login-shopname').size() == 0){setTimeout(arguments.callee, 100);}else{$('.login-shopname').text(res.shopName);}},100);
        //io.socket.get('/businessdate', { dateLabel: '2014-05-27' }, function(res) {
        var date = new Date();
        // 12/8 日またぎ対応：0-8時までは前日を取得
        if(date.getHours() < 9) {
          date.setDate(date.getDate() - 1);
        }
        var yy = date.getFullYear();
        var mm = ('0' + (date.getMonth() + 1)).slice(-2);
        var dd = ('0' + date.getDate()).slice(-2);
        var today = yy + mm + dd;
        var _e_id = res.companyId + res.shopId + today;
        io.socket.get('/businessdate', { e_id: _e_id }, function(res) {
          if(res.length === 0) {
            window._top_pane_floor_load = true;
          }
          KsWidgetTmpl.prototype.businessDate = res[0];
          
          // 権限マスタ検索
          io.socket.get('/master_accesslv', {
            accesslv: KsWidgetTmpl.prototype.accesslv
          }, function(acc,err) {
      
            var activeFlg = '';
            if(acc[0].check1 == '1'){
              _tabs[0].display = true;
              if(activeFlg == '' && res[0] == undefined){
                _tabs[0].active = true;
                activeFlg = '1';          
              }
            }
            if(acc[0].check2 == '1'){
              _tabs[1].display = true;
              if(activeFlg == ''){
                _tabs[1].active = true;
                activeFlg = '1';          
              }
            }
            if(acc[0].check3 == '1'){
              _tabs[2].display = true;
              if(activeFlg == ''){
                _tabs[2].active = true;
                activeFlg = '1';          
              }
            }
            if(acc[0].check4 == '1'){
              _tabs[3].display = true;
              if(activeFlg == ''){
                _tabs[3].active = true;
                activeFlg = '1';          
              }
            }
            if(acc[0].check5 == '1'){
              _tabs[4].display = true;
              if(activeFlg == ''){
                _tabs[4].active = true;
                activeFlg = '1';          
              }
            }
            if(acc[0].check6 == '1'){
              _tabs[5].display = true;
              if(activeFlg == ''){
                _tabs[5].active = true;
                activeFlg = '1';          
              }
            }
            if(acc[0].check7 == '1'){
              _tabs[6].display = true;
              if(activeFlg == ''){
                _tabs[6].active = true;
                activeFlg = '1';          
              }
            }
            if(acc[0].check8 == '1'){
              _tabs[7].display = true;
              if(activeFlg == ''){
                _tabs[7].active = true;
                activeFlg = '1';          
              }
            }
          });
          
          $("#global-tab").empty();
          $("#global-tab-content").empty();
          _wt.fromHtml(_wt._html,function(res){
            for(var _ti in _tabs){
              var _t = _tabs[_ti];
              
              if(_t.display == true){
                _wt.initTab(_t,res);
              }
            }
            $("#global-tab").append(res).fadeIn(500);
          });
          
        });

      });
      
    }
    
    
  };

  //タブひとつ初期化
  _wt.initTab = function( _t,res ){
    var _li = $('<li>');
    if(_t.active){
      _li.addClass('active');
    }
    _li.append( $('<a role="tab" data-toggle="tab"></a>').attr('href','#'+_t['content']).text( _t.label ) );
    res.append(_li);
    _wt.loadTabContent(_t);
  };

  //タブに対応するコンテンツのロード
  _wt.loadTabContent = function(_t){
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase+'/tab-content/' + _t.content +'.html',function(res){
      $("#global-tab-content").append(res).fadeIn(500);
      // 4/20 タブactiveがtrueのものは初期画面に表示させる
      if(_t.active){
        $('#'+_t.content).addClass('active in');
      }
    });
  };

//events
  io.socket.on('connect', function() {
    $("#global-nav").ready(function(){
      // 4/23 ログインしていなければタブ展開する必要なし
      if(KsWidgetTmpl.prototype.accesslv != '') {
        console.log("add tabs 1.");
        _wt.initAllTab();
      }
    });
  });

//////exports
    if('undefined' == typeof module){
        if( !window.ks ){window.ks = {};}
        window.ks.globalTab = _wt;
    } else {
        module.exports = _wt;
    }
})()