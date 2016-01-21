/******
 * ks.seats.js
 * 画面上の座席エリアを操作するJS
 * 
 */
( function() {
  //extends prototype.
  var _wt = new KsWidgetTmpl();

  //seat template
  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/seats.html',
    obj: {},
    loaded: false
  };

  //button on seat header template
  _wt._htmlSeatedBtn = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/cast-seated-button.html',
    obj: {},
    loaded: false
  };


  //
  //initialize seat area
  //
  _wt.initSeats = function(){
    console.log('initSeats() called.');
    initHtml();
    $('#'+_wt.allSeatsId).hide();
    $('#seat-accordion').empty();
    _wt.initSeatsModals();
    _wt.findAllSeats(_wt.shopObj,function(res){
      _wt.showAllSeats(res);
      //TEST
    });
    $('#'+_wt.allSeatsId).show();
  };
  
  // 2/3 席追加
  _wt.addSeat = function(){
    console.log("addSeat",this);
    _wt.openSeat();
  };
  
  //
  //initialize modals for seats
  //
  _wt.initSeatsModals = function(){
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-new-visitor.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-wait-visitor.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-wait-visitor2.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-cast-seated.html', function(res){
      $('body').append(res);
    });
    
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-cast-called.html', function(res){
      $('body').append(res);
    });
    
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-order-item.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-order-service.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-order-penalty.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-order-revision.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-order-set.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-order-pay.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-seat.html', function(res){
      $('body').append(res);
    });
  };

  //
  //show all seats.
  //
  _wt.showAllSeats = function(_seats){
    for(var i = 0; i < _seats.length; i++ ){
      if(!_seats[i].isWait){
        var _vNow = $('#'+_wt.allSeatsId).find('#sid-'+_seats[i].id);
        if(_vNow.length === 0){ _wt.showNewSeat(_seats[i] ); }else{ _wt.showUpdateSeat(_seats[i].id); }
      }else{
        _wt.showWaitSeats(_seats[i]);
      }
    }
  };

  //
  //show a seat.
  //
  _wt.showNewSeat = function( _seat ){
    // load object from template.
    _wt.fromHtml(_wt._html, function(_v,_p) {
      _v.attr('id','sid-'+_seat.id);
      _v.find('.seat-name').text(_seat.name);
      
      if(_seat.tempFlag == '1') {
        _v.find('.seat-delete-button').css('display', '');
      }
      
      //if seat is already exist ,replace it.
      var _vNow = $('#'+_wt.allSeatsId).find('#sid-'+_seat.id);
      if(_vNow.length === 0){
        $('#'+_wt.allSeatsId).append(_v).fadeIn(500);
      }else{
        //if not, append new seat.
        _v.replaceAll(_vNow).fadeIn(500);
      }
      //search visitor seated from database.
      _wt.findVisSeated(_seat.id,function(vis){
      //_wt.findVisSeated(_seat.seatId,function(vis){
        //TODO: いるいないだけでなく、状態（会計中など）によって振り分ける必要がある。
        if(vis.length === 0){
          _wt.attachNoVisitor(_v,_seat);
        }else{
          _wt.attachVisitor(_v,vis[0],_seat);
        }
      });
    });//fromHtml()
  };

  //
  //update a seat when received socket msg.
  //
  _wt.showUpdateSeat = function(_sid){
    console.log('seats update.',_sid);
    _wt.findSeatById(_sid,function(_seat){
      if(_seat.isWait !== undefined){
        _wt.showNewSeat(_seat);
      }
    });
  };
  // 12/8 visitor更新時再読み込み（待機席有のため分岐）
  _wt.showUpdateSeat2 = function(vis){
    console.log('seats refind',vis);
    _wt.findSeatById2(vis,function(_seat){
      if(_seat.isWait !== undefined){
        if(_seat.isWait === false) {
          _wt.showNewSeat(_seat);
        } else {
          _wt.showWaitSeats(_seat);
        }
      }
    });
  }; 

  //
  //attach a pane-body to seat panel with seated visitor.
  //
  _wt.attachVisitor = function(_v,vis,_seat){
    //visitor is seated.
    _v.find('.seat-name').unbind();
    _v.find('.panel-title-caret').addClass('caret');
    _v.find('.toggle').attr('href','#collapse-'+_seat.id);
    _v.find('.panel-collapse').attr('id','collapse-'+_seat.id);
    _v.addClass('panel-primary');
    _v.find('.vis-number').addClass('label-danger').text(vis.number+'名');
    //Timer Icon
    _v.find('.vis-timer-icon').addClass('glyphicon glyphicon-time');
    // 12/8 タイマー実装
    var endDateTime = vis.endTime;
    if( endDateTime !== null ) {
      _v.find('.vis-timer-value').addClass('livetime-minute');
      _v.find('.livetime-minute').attr('live-time',endDateTime);
    }
    _v.find('.vis-set-value').text('('+vis.setTime+'分)');
    //var _exit = _v.find('.exit');
    //_exit.on('click', function(){
    _v.find('.exit').on('click',function(e){
      _wt.exitVisForced(vis,_seat);//強制退店
    });
    _v.find('.vis-exit').removeAttr('style');
    // 12/9 商品のオーダー(テーブルより)
    _v.find('.order-item-action').on('click',function(e){
      _wt.openOrder(vis,null,_seat,null);
    });
    // 12/11 サービスのオーダー(テーブルより)
    _v.find('.order-service-action').on('click',function(e){
      _wt.openService(vis,null,_seat);
    });
    // 12/11 オーダー修正(テーブルより)
    _v.find('.order-revision-action').on('click',function(e){
      _wt.openRevision(vis,null,_seat);
    });
    // 12/16 延長
    _v.find('.order-set-action').on('click',function(e){
      _wt.openSet(vis,null,_seat);
    });
    // 12/16 会計
    _v.find('.order-pay-action').on('click',function(e){
      _wt.openPay(vis,null,_seat);
    });
    // 2/3 一時テーブル削除
    _v.find('.seat-delete-action').on('click',function(e){
      if(!confirm("この追加テーブルを削除します。よろしいですか？")){
        return false;
      }
      _wt.deleteTempSeat(vis,_seat);
    });
    //set visitor id to panel-body
    _v.find('.panel-body').attr('id','seated-vid-' + vis.id );
    //casts called.
    addCalledCastInWell(_v,vis,_seat);
    //casts seated
    addSeatedCastInWell(_v,vis,_seat);
  };

  //
  //attach a pane-body to seat panel with no visitor.
  //
  _wt.attachNoVisitor = function(_v,_seat){
    //no visitor on this seat.
    _v.addClass('panel-default');
    //_v.find('.seat-name').unbind();
    //_v.find('.seat-name').bind('click',function(){
    _v.unbind();
    _v.bind('click',function(){
       _wt.attachModalForNewVis(_seat);
    });
    _v.find('.vis-head').removeClass('glyphicon glyphicon-user');
    _v.find('.vis-number').removeClass('label-danger').empty();
    _v.find('.vis-number').addClass('label-default').text('空席');
    _v.find('.vis-timer').removeClass('glyphicon glyphicon-time');
    _v.find('.vis-exit').empty();
    // 2/3 一時テーブル削除
    _v.find('.seat-delete-action').on('click',function(e){
      if(!confirm("この追加テーブルを削除します。よろしいですか？")){
        return false;
      }
      _v.unbind();
      _wt.deleteTempSeat(null,_seat);
    });
    //attach droppable
    _wt.ddui.attachDroppableForNewVis( _v,function(_e,_u){
      _wt.attachModalForNewVis(_seat);
    });
  };

  //
  // show a seat panel in waiting area
  //
  _wt.showWaitSeats = function(_seat){
    var _v = $('#all_waiting_visitors').find('#sid-'+_seat.id);
    if( _v.length === 0 ){
      //TODO: TEMPLATE FILE NEEDED.
      _v = $(_wt.tmplId).find('.waiting-seats').clone();
      $('#all_waiting_visitors').append(_v);
      _v.attr('id','sid-'+_seat.id);
      _v.find('.seat-name').text(_seat.name);
    
//      _wt.ddui.attachDroppableForNewVis(_v);

    }
    
    _wt.findVisSeated(_seat.id,function(vis){
    //_wt.findVisSeated(_seat.seatId,function(vis){
      //TODO: いるいないだけでなく、状態（会計中など）によって振り分ける必要がある。
      if(vis.length === 0){
        _wt.attachNoVisitor2(_v,_seat);
      }else{
        _wt.attachVisitor2(_v,vis[0],_seat);
      }
    });
  };
  
  _wt.attachNoVisitor2 = function(_v,_seat){
    _v.addClass('panel-default');
    _v.find('.seat-name').unbind();
    _v.find('.seat-name').bind('click',function(){
       _wt.attachModalForNewVis(_seat);
    });
    _v.find('.vis-number').removeClass('label-danger').empty();
    _wt.ddui.attachDroppableForNewVis( _v,function(_e,_u){
      _wt.attachModalForNewVis(_seat);
    });
  };
  
  _wt.attachVisitor2 = function(_v,vis,_seat){
    _v.find('.seat-name').unbind();
    _v.find('.seat-name').bind('click',function(){
       _wt.attachModalForNewVis(_seat);
    });
    //_v.find('.vis-number').addClass('label-danger').text(vis.number+'名');
    _v.find('.vis-number').addClass('label-danger').text('待ち有');
    // 12/4 待ち客がいる席のみ、ドラッグ可能に
    // _v.find('.panel-heading').draggable({
    //   snapTolerance: 50,
    //   opacity: 0.5,
    //   distance: 5,
    //   revert: true,
    //   zIndex: 100
    // });
    
  };

//--------------- private methods.
  function initHtml(){
    _wt.fromHtml(_wt._html,function(obj,p){console.log(obj,p);});
    _wt.fromHtml(_wt._htmlSeatedBtn,function(obj,p){console.log(obj,p);});
  }
  
  //function addCastSeatedButtonToSeat(_v,_c,_s){
  function addCastSeatedButtonToSeat(_v,_c,_s,vis){
    _wt.fromHtml(_wt._htmlSeatedBtn,function(obj,p){
      obj.attr('id','seated-cid-'+_c.id);//.btn-group
      obj.find('.cast-name').text(_c.name);
      obj.find('.livetime-minute').attr('live-time',_c.startTime);
      obj.find('.livetime-minute').attr('set-time',vis.setTime);
      // 3/26 経過時間(分)の入れ物作成
      obj.find('.livetime-minute').attr('live-minutes',0);
      // 2/2 クイックオーダー
      obj.find('.order-quick-action').on('click',function(e){
        _wt.openOrder(vis,_c,_s,'quick');
      });
      // 12/9 商品のオーダー
      obj.find('.order-item-action').on('click',function(e){
        _wt.openOrder(vis,_c,_s,null);
      });
      // 12/11 サービスのオーダー
      obj.find('.order-service-action').on('click',function(e){
        _wt.openService(vis,_c,_s);
      });
      // 12/11 ペナルティのオーダー
      obj.find('.order-penalty-action').on('click',function(e){
        _wt.openPenalty(vis,_c,_s);
      });
      // 12/11 オーダー修正
      obj.find('.order-revision-action').on('click',function(e){
        _wt.openRevision(vis,_c,_s);
      });
      // 退席
      obj.find('.cast-seat-action-leave').on('click',function(e){
        _wt.unseatCast2(_c,'');
      });
      _v.append( $('<li>').append(obj) );
      //cast div (seat label)
      $(_wt.findCastDivByCid(_c.id))
      .find('.cast-seated').addClass('label-primary').text(_s.name);
    });
  }
  //指名キャストエリアの作成
  function addCalledCastInWell(_v,vis,_seat){
    var _calledcast = _v.find('.seat-body-cast-called');
    _calledcast.attr('id','well-called-vid-' + vis.id );
    var _lic = $('<li>').append( $('<span>').addClass('label label-default').append('<span>').addClass('glyphicon glyphicon-plus') );

    //指名済みキャストの取得
    _wt.findCastCalled(vis.id,function(res,JWR){
      if( res.length !== 0 ) console.log(res,JWR);
      var ccount = vis.number;
      if(ccount <= res.length) ccount = res.length + 1;
      for(var i=0; i < ccount; i++){
        if(res.length > i){
          var _r = res[i];
          var sts = _r.status == _wt.code.getCodeFromName('detailRecordStatus','DELIVERED') ? 'warning' : 'danger';
          sts = _wt.findVidCastSeated(_r.castId) == _r.visitorId ? 'info' : sts ;
          //_calledcast.find('ul').append($('<li>').append( $('<span>').addClass('label label-' + sts + ' called-cid-'+_r.castId ).text(_r.castName).append('<span>').addClass('glyphicon glyphicon-remove-sign') ) );
          // 12/5 ラベルに名称exit追加、指名キャンセル処理追加
          //var calc = Math.floor(_r.setTime / vis.setTime * 100);
          //_calledcast.find('ul').append($('<li>').append( $('<span>').addClass('choose_exit label label-' + sts + ' called-cid-'+_r.castId ).text(_r.castName).attr('id',_r.id).attr('time',_r.setTime).addClass('glyphicon glyphicon-remove-sign').append( $('<span>').addClass('live-percentage').text("(" + calc + "%)")) ) );
          _calledcast.find('ul').append($('<li>').append( $('<span>').addClass('choose_exit label label-' + sts + ' called-cid-'+_r.castId ).text(_r.castName).attr('id',_r.id).attr('time',_r.setTime).addClass('glyphicon glyphicon-remove-sign').append( $('<span>').addClass('live-percentage').text("(" + _r.setTime + "分)")) ) );
          var _exit = _v.find('.choose_exit');
          _exit.unbind();
          _exit.bind('click', function(){
            if(!confirm("指名をキャンセルします。よろしいですか？")){
              return false;
            }
            
            _wt.exitChoosed(this.id);
          });
        }else{
          _calledcast.find('ul').append(_lic.clone());
        }
      }
    });
  
//    for (var i=0; i < vis.number; i++ ){
//      _calledcast.find('ul').append(_lic.clone());
//    }
    //attach modal.
    var _calledcast2 = _v.find('.cast-called');
    _wt.ddui.attachDroppableForCastSeated(_calledcast2,function(e,ui){
      _wt.attachModalForCastCalled( _seat, vis, ui);
    });
    
  }
  //着席キャストエリアの作成
  function addSeatedCastInWell(_v,vis,_seat){
    //casts seated
    var _lic = $('<li>').append( $('<span>').addClass('label label-default').append('<span>').addClass('glyphicon glyphicon-plus') );
    var _ncast = _v.find('.seat-body-cast-seated');
    _ncast.attr('id','well-seated-vid-' + vis.id );
    var _ul = _ncast.find('ul');
    _wt.findCastSeated(vis.id,function(res){
      var scount = vis.number; 
      if( scount <= res.length ) scount = res.length + 1;
      for (var j = 0; j < scount; j++ ){
        if(j < res.length){
          //cast exists.
          var _c = res[j];
          $('#well-called-vid-'+vis.id).find('.called-cid-'+_c.id).removeClass("label-danger label-warning").addClass('label-info');
          //addCastSeatedButtonToSeat(_ul,_c,_seat);
          addCastSeatedButtonToSeat(_ul,_c,_seat,vis);
        }else{
          //empty
          _ul.append(_lic.clone());
        }
      }
    });
        //attach modal.
    var _ncast2 = _v.find('.cast-seated');
    _wt.ddui.attachDroppableForCastSeated(_ncast2,function(e,ui){
      _wt.attachModalForCastSeated(_seat,vis,ui);
    });
    _v.find('.collapse').collapse('show');

  }

  
//--------------- socket events.
  io.socket.on('mseats', function (e) {
    switch(e.verb){
      default: _wt.initSeats();
    }
  });

  /** Visitor追加時、更新時 */
  io.socket.on('visitor', function (e) {
    switch(e.verb){
      //default: _wt.showUpdateSeat(e.data.seatId);
      case 'destroyed': _wt.showUpdateSeat2(e.previous);  // 12/8 削除時（1件前提）
      break;
      default: _wt.showUpdateSeat2(e.data);
    }
  });

  /** detailrecord追加時、更新時 */
  io.socket.on('detailrecord', function (e) {
    switch(e.verb){
      case 'updated': if( !e.data.seatId || e.data.seatId.length ===0 ) break;
      case 'destroyed': _wt.showUpdateSeat(e.previous.seatId);  // 12/5 削除時（1件前提）
      break;
      default: _wt.showUpdateSeat(e.data.seatId);
    }
  });

  /** castlady追加時、更新時 */
  io.socket.on('castlady', function (e) {
    console.log('cast is ',e);
    switch(e.verb){
      case 'created': break; //do nothing.
      case 'destroyed': break; //do nothing.
      case 'updated':
        
        //座席の更新でなければ、（いまのところ）何もしない。
        if( e.data.seated == undefined ) break;
        if(e.data.seated.length !== 0){
          console.log(e.previous.name + '着席または移動');
          _wt.showUpdateSeat(_wt.findSeatIdFromVid(e.data.seated));
        }
        if(!e.previous.seated || e.previous.seated === null || e.previous.seated.length === 0){
//          console.log(e.previous.name + '新規着席');
        }else{
          console.log(e.previous.name + '移動または退席');
          _wt.showUpdateSeat( _wt.findSeatIdFromVid(e.previous.seated ));
        }
        break;
  //       _wt.showUpdateSeat(e.data.seatId);
      default:
    }
  });

//export
  if('undefined' == typeof module){
    if( !window.ks ){window.ks = {};}
        window.ks.seats = _wt;
    } else {
        module.exports = _wt;
    }
})()