/******
 * ns.customer.js
 * マスタ画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  var _allCDiv = "#"+'all_customer';
  var _allADiv = "#"+'all_abs';
  var _cidPrefix = "cid-";
  
  var waitC = 0;
  var waitM = 0;
  
  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/customer-nsys.html',
    obj: {},
    loaded: false
  };
  
  _wt.initCustomer = function(){
    console.log('initCustomer() called.');
    
    _wt.initCustomerModals();
    
    // 来客テーブルから来客情報取得
    _wt.findNVisitor(function(res){
      // 初期化
      $('#all_customer div').remove();
      $('#all_abs div').remove();
      $('#waitComer').text('0組（0名）');
     	$('#waitTime').text('約0分');
     	$('#customer_stopping').css('display', 'none');
     	$('#customer_btn').css('display', '');
     	
     	_wt.findNShop(function(shop){
        if(shop[0].stopFlg != ''){
          $('#customer_stopping').css('display', '');
          $('#customer_btn').css('display', 'none');
        }
        _wt.addAllCustomer(res);
      });
      
      $('#customer-visitor-create').unbind();
      $('#customer-visitor-create').bind('click',function(e){
        _wt.openCustomer();
      });
      
      $('#customer-visitor-create-en').unbind();
      $('#customer-visitor-create-en').bind('click',function(e){
        _wt.openCustomer_en();
      });
    });
  };
  
  //
  //initialize modals for presence
  //
  _wt.initCustomerModals = function(){
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-nsys-customer.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-nsys-customer-en.html', function(res){
      $('body').append(res);
    });
  };
  
  // 各来客情報セット
  _wt.addAllCustomer = function(cus){
    waitC = 0;
    waitM = 0;
    for(var c in cus){
      if(cus[c].noFlg != ''){
        _wt.addAbsence(cus[c],c,cus.length);
      } else {
        _wt.addCustomer(cus[c],c,cus.length);
      }
      
    }
  };
  
  _wt.addAbsence = function (_c,c,len) {
    // Deferredと後処理をコールバック外へ
    var df = $.Deferred();
    df.done(function(){
      // 後処理
      var msg = waitC + '組（' + waitM + '名）';
      $('#waitComer').text(msg);
      
      // 合計組数を利用して待ち時間をセット
      _wt.findNShop(
        function(res){
          var waitT = res[0].waitT * waitC;
          $('#waitTime').text('約' + waitT + '分');
        });
    });
    
    _wt.fromHtml(_wt._html, function(_div,_p) {
      _div.attr('id', _cidPrefix + _c.id);
      _div.find('.customer-no').text(_c.no);
      _div.find('.customer-name').text(_c.name);
      _div.find('.customer-member').text(_c.member);
      
      var old = _wt.findCusAbsDivByCid(_c.id);
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
  
  _wt.addCustomer = function (_c,c,len) {
    // Deferredと後処理をコールバック外へ
    var df = $.Deferred();
    df.done(function(){
      // 後処理
      var msg = waitC + '組（' + waitM + '名）';
      $('#waitComer').text(msg);
      
      // 合計組数を利用して待ち時間をセット
      _wt.findNShop(
        function(res){
          var waitT = res[0].waitT * waitC;
          $('#waitTime').text('約' + waitT + '分');
        });
    });
    
    _wt.fromHtml(_wt._html, function(_div,_p) {
      waitC++;
      waitM = waitM + _c.member;
      _div.attr('id', _cidPrefix + _c.id);
      _div.find('.customer-no').text(_c.no);
      _div.find('.customer-name').text(_c.name);
      _div.find('.customer-member').text(_c.member);
      _div.find('.customer-option1').addClass('label-primary').text(_c.option1);
      _div.find('.customer-option2').addClass('label-primary').text(_c.option2);
      _div.find('.customer-option3').addClass('label-primary').text(_c.option3);
      _div.find('.customer-option4').addClass('label-primary').text(_c.option4);
      
      var old = _wt.findCustomerDivByCid(_c.id);
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
  
  // 名前パネル押下
  _wt.addVal = function(obj){
    $('#cus-name').val($('#cus-name').val() + obj);
  };
  _wt.addVal_en = function(obj){
    $('#cus-name-en').val($('#cus-name-en').val() + obj);
  };
  
  // 人数パネル押下
  _wt.addVal2 = function(obj){
    $('#cus-member').val($('#cus-member').val() + obj);
  };
  _wt.addVal2_en = function(obj){
    $('#cus-member-en').val($('#cus-member-en').val() + obj);
  };
  
  io.socket.on('nvisitor', function (e) {
    switch(e.verb){
      default:_wt.initCustomer();
    }

  });
  
  io.socket.on('nshop', function (e) {
    switch(e.verb){
      default:_wt.initCustomer();
    }

  });
  
//////exports
  if('undefined' == typeof module){
    if( !window.ns ){window.ns = {};}
      window.ns.customer = _wt;
  } else {
    module.exports = _wt;
  }
})();