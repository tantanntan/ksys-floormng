/******
 * ns.staff.js
 * マスタ画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  var _allCDiv = "#"+'all_staff';
  var _allADiv = "#"+'all_absence';
  var _cidPrefix = "cid-";
  
  var waitC = 0;
  var waitM = 0;
  
  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/staff-nsys.html',
    obj: {},
    loaded: false
  };
  
  _wt.initStaff = function(){
    console.log('initStaff() called.');
    
    // 来客テーブルから来客情報取得
    _wt.findNVisitor(function(res){
      // 初期化
     	$('#all_staff div').remove();
     	$('#all_absence div').remove();
     	$('#waitComer-2').text('0組（0名）');
     	$('#waitTime-2').text('約0分');
     	$('#staff-visitor-stop').val('受付停止');
     	$('#staff_stopping').css('display', 'none');
     	
      _wt.findNShop(function(shop){
        if(shop[0].stopFlg != ''){
          $('#staff-visitor-stop').val('受付再開');
          $('#staff_stopping').css('display', '');
        }
        _wt.addAllCustomerStaff(res);
      });
      
      $('#staff-visitor-stop').unbind();
      $('#staff-visitor-stop').bind('click',function(e){
        _wt.stopNvisitor();
      });
    });
  };
  
  // 各来客情報セット
  _wt.addAllCustomerStaff = function(cus){
    waitC = 0;
    waitM = 0;
    for(var c in cus){
      if(cus[c].noFlg != ''){
        _wt.addAbsenceStaff(cus[c],c,cus.length);
      } else {
        _wt.addCustomerStaff(cus[c],c,cus.length);
      }
    }
    
    // 入店ドラッグイベント
    _wt.ddui.attachDroppableForNewCas2( $('#all_enter'),'.staff','.absence','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('cid-','');
      _wt.deleteNVisitor(_c_id);
    });
    
    // 不在ドラッグイベント
    _wt.ddui.attachDroppableForNewCas( $('#all_absence'),'.staff','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('cid-','');
      _wt.updateNVisitor(_c_id,'1');
    });
    
    // 不在キャンセルドラッグイベント
    _wt.ddui.attachDroppableForNewCas( $('#all_staff'),'.absence','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('cid-','');
      _wt.updateNVisitor(_c_id,'');
    });
    
    // キャンセルドラッグイベント
    _wt.ddui.attachDroppableForNewCas2( $('#all_cancel'),'.staff','.absence','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('cid-','');
      _wt.deleteNVisitor(_c_id);
    });
  };
  
  _wt.addAbsenceStaff = function (_c,c,len) {
    // Deferredと後処理をコールバック外へ
    var df = $.Deferred();
    df.done(function(){
      // 後処理
      var msg = waitC + '組（' + waitM + '名）';
      $('#waitComer-2').text(msg);
      
      // 合計組数を利用して待ち時間をセット
      _wt.findNShop(
        function(res){
          var waitT = res[0].waitT * waitC;
          $('#waitTime-2').text('約' + waitT + '分');
        });
    });
    
    _wt.fromHtml(_wt._html, function(_div,_p) {
      _div.attr('id', _cidPrefix + _c.id);
      _div.find('.customer-no').text(_c.no);
      _div.find('.customer-name').text(_c.name);
      _div.find('.customer-member').text(_c.member);
      _div.addClass('absence');
      
      _wt.ddui.attachDraggableForCast(_div,_c);
      var old = _wt.findAbsenceDivByCid(_c.id);
      if(old.length === 0){
        $(_allADiv).append(_div).fadeIn(500);
      }else{
        _div.replaceAll(old).fadeIn(500);
      }
      
      // 最後の行を出力しきったところでresolve
      if(len == parseInt(c,10)+1){
        df.resolve();
      }
    });
  };
  
  _wt.addCustomerStaff = function (_c,c,len) {
    // Deferredと後処理をコールバック外へ
    var df = $.Deferred();
    df.done(function(){
      // 後処理
      var msg = waitC + '組（' + waitM + '名）';
      $('#waitComer-2').text(msg);
      
      // 合計組数を利用して待ち時間をセット
      _wt.findNShop(
        function(res){
          var waitT = res[0].waitT * waitC;
          $('#waitTime-2').text('約' + waitT + '分');
        });
    });
    
    _wt.fromHtml(_wt._html, function(_div,_p) {
      waitC++;
      waitM = waitM + _c.member;
      _div.attr('id', _cidPrefix + _c.id);
      _div.find('.customer-no').text(_c.no);
      _div.find('.customer-name').text(_c.name);
      _div.find('.customer-member').text(_c.member);
      if(_c.call != ''){
        _div.find('.customer-call').addClass('label-success').text('呼');
      }
      if(_c.origin == ''){
        _div.find('.customer-origin').addClass('label-warning').text('店');
      } else {
        _div.find('.customer-origin').addClass('label-warning').text('ス');
      }
      _div.find('.customer-option1').addClass('label-primary').text(_c.option1);
      _div.find('.customer-option2').addClass('label-primary').text(_c.option2);
      _div.find('.customer-option3').addClass('label-primary').text(_c.option3);
      _div.find('.customer-option4').addClass('label-primary').text(_c.option4);
      _div.addClass('staff');
      
      // 行クリック時アクション
      _div.unbind();
      _div.bind('click',function(e){
        e.preventDefault();
        if(!confirm(_c.name + "様を呼び出します。よろしいですか？")){
          return false;
        }
        _wt.calledNvisitor(_c.id);
      });
      
      _wt.ddui.attachDraggableForCast(_div,_c);
      var old = _wt.findStaffDivByCid(_c.id);
      if(old.length === 0){
        $(_allCDiv).append(_div).fadeIn(500);
      }else{
        _div.replaceAll(old).fadeIn(500);
      }
      
      // 最後の行を出力しきったところでresolve
      if(len == parseInt(c,10)+1){
        df.resolve();
      }
    });
  };
  
  io.socket.on('nvisitor', function (e) {
    switch(e.verb){
      default:_wt.initStaff();
    }

  });
  
  io.socket.on('nshop', function (e) {
    switch(e.verb){
      default:_wt.initStaff();
    }

  });
  
//////exports
  if('undefined' == typeof module){
    if( !window.ns ){window.ns = {};}
      window.ns.staff = _wt;
  } else {
    module.exports = _wt;
  }
})();