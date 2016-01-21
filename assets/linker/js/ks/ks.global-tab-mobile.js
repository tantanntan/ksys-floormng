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
    { label: '再読込', content: 'top-pane-reload-nsys', active: false, display: true },
    { label: 'スマホ', content: 'top-pane-mobile-nsys', active: true , display: true }
  ];

  //全タブ初期化
  //タブの選択はサーバ側に置くと思う
  _wt.initAllTab = function(){
    $("#global-tab-mobile").empty();
    $("#global-tab-content-mobile").empty();
    _wt.fromHtml(_wt._html,function(res){
      for(var _ti in _tabs){
        var _t = _tabs[_ti];
        
        if(_t.display == true){
          _wt.initTab(_t,res);
        }
      }
      $("#global-tab-mobile").append(res).fadeIn(500);
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
      $("#global-tab-content-mobile").append(res).fadeIn(500);
      // 4/20 タブactiveがtrueのものは初期画面に表示させる
      if(_t.active){
        $('#'+_t.content).addClass('active in');
      }
    });
  };

//events
  io.socket.on('connect', function() {
    $("#global-nav-mobile").ready(function(){
      // KSYS/NSYSにログインしていない場合のみタブ展開
      if(KsWidgetTmpl.prototype.mobileFlg != '') {
        console.log("add tabs mobile.");
        _wt.initAllTab();
      }
    });
  });

//////exports
    if('undefined' == typeof module){
        if( !window.ks ){window.ks = {};}
        window.ks.globalTabMobile = _wt;
    } else {
        module.exports = _wt;
    }
})();