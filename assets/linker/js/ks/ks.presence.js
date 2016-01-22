/******
 * ks.presence.js
 * 出退勤画面上のキャストエリアを操作するJS
 * 
 */
(function() {
//  var cast = {};
  var _wt = new KsWidgetTmpl();
  var _allRDiv = "#"+'all_work';
  var _allR2Div = "#"+'all_rwork';
  var _allR3Div = "#"+'all_back';
  var _cidPrefix = "cid-";

  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/presence.html',
    obj: {},
    loaded: false
  };

  _wt.initPresence = function(){
    console.log('initPresence() called.');
    _wt.initPresenceModals();
    // CastLady検索
    _wt.findAllReadyCast(
      function(res){
        $('#all_work div').remove();
        $('#all_rwork div').remove();
        $('#all_back div').remove();
        
        _wt.addAllPresenceCast(res);

      }
    );
  };
  
  //
  //initialize modals for presence
  //
  _wt.initPresenceModals = function(){
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-presence.html', function(res){
      $('body').append(res);
    });
  };
  
  _wt.addAllPresenceCast = function(casts){
    $.each(casts, function() {
      _wt.addCast(this);
    });
    
    // 出勤予定キャストゾーンドラッグイベント(出勤キャンセル)
    _wt.ddui.attachDroppableForNewCas( $('#all_rwork'),'.presence_in','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('cid-','');
      _wt.updateCastStatus3(_c_id);
    });
    
    // 出勤キャストゾーンドラッグイベント(退勤キャンセル追加)
    _wt.ddui.attachDroppableForNewCas2( $('#all_work'),'.presence_ready','.presence_out','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('cid-','');
      console.log('name=' + $(_u.draggable).attr('name'));
      if($(_u.draggable).attr('name') == 'ready'){
        _wt.updateCastStatus(_c_id);
      }
      if($(_u.draggable).attr('name') == 'out'){
        _wt.updateCastStatus4(_c_id);
      }
    });
    
    // 退勤キャストゾーンドラッグイベント
    _wt.ddui.attachDroppableForNewCas( $('#all_back'),'.presence_in','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('cid-','');
      _wt.updateCastStatus2(_c_id);
    });
  };
  
  _wt.addCast = function (_c) {
    _wt.fromHtml(_wt._html, function(_div,_p) {
      _div.attr('id', _cidPrefix + _c.id);
      _div.find('.cast-status').removeClass().addClass('cast-status '+'glyphicon glyphicon-user');
      _div.find('.cast-name').text(_c.name);
      
      _wt.findCastAppend(_c, function(res){
        if(res[0] != undefined) {
          _div.find('.cast-append').removeClass().addClass('label').addClass('label-danger').text(res[0].itemName);
        }
      });
      
      var old = '';
      // ステータスにより分岐
      switch (_c.status) {
        // 「出勤」の場合
        case _wt.code.getCodeFromName('castStatus','ON_THE_FLOOR'):
          _wt.ddui.attachDraggableForCast(_div,_c);
          
          _div.find('.cast-time_fr').text(_c.cj_time_fr);
          if(_c.cj_time_fr > _c.c_time_fr){
            _div.find('.cast-time_fr').css("color", "red");
          }
          _div.addClass('presence_in');
          _div.attr('name','in');
          old = _wt.findPresenceDivByCid(_c.id);
          if(old.length === 0){
            $(_allRDiv).append(_div).fadeIn(500);
          }else{
            _div.replaceAll(old).fadeIn(500);
          }
          
          break;
        // 「同伴」の場合
        case _wt.code.getCodeFromName('castStatus','DOUHAN'):
          _wt.ddui.attachDraggableForCast(_div,_c);
          
          _div.find('.cast-time_fr').text(_c.c_time_fr);
          _div.find('.cast-time_fr').addClass('time_from');
          _div.find('.cast-time_to').text(_c.c_time_to);
          _div.find('.cast-option').removeClass().addClass('label').addClass('label-danger').text('同伴');
          _div.addClass('presence_ready');
          _div.attr('name','ready');
          old = _wt.findPresenceDivByCid2(_c.id);
          if(old.length === 0){
            $(_allR2Div).append(_div).fadeIn(500);
          }else{
            _div.replaceAll(old).fadeIn(500);
          }
          break;
        // 「退勤」の場合
        case _wt.code.getCodeFromName('castStatus','FINISHED'):
          _wt.ddui.attachDraggableForCast(_div,_c);
          
          _div.find('.cast-status').removeClass().addClass('cast-status '+'glyphicon glyphicon-home');
          _div.find('.cast-time_fr').text(_c.cj_time_fr);
          if(_c.cj_time_fr > _c.c_time_fr){
            _div.find('.cast-time_fr').css("color", "red");
          }
          _div.find('.cast-time_to').text(_c.cj_time_to);
          _div.addClass('presence_out');
          _div.attr('name','out');
          old = _wt.findPresenceDivByCid3(_c.id);
          if(old.length === 0){
            $(_allR3Div).append(_div).fadeIn(500);
          }else{
            _div.replaceAll(old).fadeIn(500);
          }
          
          break;
        // まだ来ていない場合
        default:
          _wt.ddui.attachDraggableForCast(_div,_c);
        
          _div.find('.cast-time_fr').text(_c.c_time_fr);
          _div.find('.cast-time_fr').addClass('time_from');
          _div.find('.cast-time_to').text(_c.c_time_to);
          _div.addClass('presence_ready');
          _div.attr('name','ready');
          old = _wt.findPresenceDivByCid2(_c.id);
          if(old.length === 0){
            $(_allR2Div).append(_div).fadeIn(500);
          }else{
            _div.replaceAll(old).fadeIn(500);
          }
      }
      
      _div.unbind('click');
      _div.bind('click',function(e){
        //e.preventDefault();
        
        _wt.openPresence(_c);
      });
    });
  };
  
//--------------- private methods.

//--------------- socket events.

  io.socket.on('businessdate', function (e) {
    switch(e.verb){
      default:_wt.initPresence();
    }

  });
  
  io.socket.on('castlady', function (e) {
    switch(e.verb){
      case 'updated':
        _wt.initPresence();
        break;
      default:break;
    }

  });
  
  io.socket.on('mreload', function (e) {
    switch(e.verb){
      case 'created':
        _wt.initPresence();
        break;
      case 'updated':
        _wt.initPresence();
        break;
      default:break;
    }

  });
//////exports
    if('undefined' == typeof module){
        if( !window.ks ){window.ks = {};}
        window.ks.presence = _wt;
    } else {
        module.exports = _wt;
    }
})();