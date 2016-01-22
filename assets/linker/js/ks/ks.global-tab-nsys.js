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
    { label: 'スタッフ', content: 'top-pane-staff-nsys'   , active: true, display: true },
    { label: 'お客様'  , content: 'top-pane-customer-nsys', active: false, display: true },
    { label: 'マスタ'  , content: 'top-pane-master-nsys'  , active: false, display: true }
  ];

  //全タブ初期化
  //タブの選択はサーバ側に置くと思う
  _wt.initAllTab = function(){
    $("#global-tab-nsys").empty();
    $("#global-tab-content-nsys").empty();
    _wt.fromHtml(_wt._html,function(res){
      for(var _ti in _tabs){
        var _t = _tabs[_ti];
        
        if(_t.display == true){
          _wt.initTab(_t,res);
        }
      }
      $("#global-tab-nsys").append(res).fadeIn(500);
    });
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
      $("#global-tab-content-nsys").append(res).fadeIn(500);
      // 4/20 タブactiveがtrueのものは初期画面に表示させる
      if(_t.active){
        $('#'+_t.content).addClass('active in');
      }
    });
  };

//events
  io.socket.on('connect', function() {
    $("#global-nav-nsys").ready(function(){
      setTimeout(function(){
        // 4/23 ログインしていなければタブ展開する必要なし
        if(KsWidgetTmpl.prototype.mobileFlg == '' && KsWidgetTmpl.prototype.nshopId != '') {
          console.log("add tabs nsys.");
          _wt.initAllTab();
        }
      },500);
    });
  });

//////exports
    if('undefined' == typeof module){
        if( !window.ks ){window.ks = {};}
        window.ks.globalTabNsys = _wt;
    } else {
        module.exports = _wt;
    }
})();