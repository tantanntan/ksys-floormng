/******
 * ns.mobile.js
 * マスタ画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  var _allCDiv = "#"+'mobile_all_customer';
  var _cidPrefix = "cid-";
  
  var waitC = 0;
  var waitM = 0;
  
  var _id = '';
  
  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/customer-mobile.html',
    obj: {},
    loaded: false
  };
  
  _wt.initMobile = function(){
    console.log('initMobile() called.');
    
    // cookieの取得
    _id = $.cookie( "KEY" );
    
    // urlからパラメータを取得（QRコード用）
    var url = location.href;
    
    // 「?」で分割「&」でも分割
    var params = url.split("?");
    
    // パラメータ用の配列を用意
    var paramArray = [];
    
    // 配列にパラメータを格納
    for(var i=0; i<params.length; i++){
      var neet = params[i].split("=");
      paramArray.push(neet[0]);
      paramArray[neet[0]] = neet[1];
    }
    
    // idが取得できた場合、cookieに保存
    if(paramArray["id"] != undefined) {
      _id = paramArray["id"];
      $.cookie("KEY", _id, { expires: 7 });
    }
    
    _wt.initMobileModals();
    
    // 来客テーブルから来客情報取得
    _wt.findNVisitor(function(res){
    	// 初期化
    	$('#mode1_1').css('display', '');
    	$('#mode1_2').css('display', '');
    	$('#mode1_3').css('display', '');
    	$('#mode2').css('display', 'none');
     	$('#mobile_all_customer div').remove();
     	
     	$('#mobile-time-sta').text('');
     	$('#mobile-time-end').text('');
     	
     	$('#mobile-waitComer').text('0組（0名）');
     	$('#mobile-waitTime').text('約0分');
     	$('#visitorid').val('');
     	$('#mobile_stopping').css('display', 'none');
     	$('#mobile_btn').css('display', '');
     	
     	_wt.findNShop(function(shop){
     	  $('#mobile-shopname').text(shop[0].shopName);
     	  $('#mobile-tel').text(shop[0].tenpoTel);
     	  
     	  _wt.findNRecep(function(rec){
          var m = moment();
          $('#mobile-today').text(m.format('YYYY年MM月DD日'));
          var nowtime = m.format('HH:mm');
          
          // 現在時刻がスマホ受付時刻の範囲内に当てはまる最初の時間帯を取得
          for(var d in rec){
            if(rec[d].smartOpening <= nowtime && rec[d].smartClosing >= nowtime){
              // var _time = rec[d].smartOpening + '～' + rec[d].smartClosing;
              // $('#mobile-time').text(_time);
              $('#mobile-time-sta').text(rec[d].smartOpening);
              $('#mobile-time-end').text(rec[d].smartClosing);
              break;
            }
          }
          
          // 受付停止または受付時間外の場合、編集不可
          if(shop[0].stopFlg != '' || $('#mobile-time-sta').text() == ""){
            $('#mobile_stopping').css('display', '');
            $('#mobile_btn').css('display', 'none');
          }
        });
        
        _wt.addAllCustomer(res);
      });
     	
     	// 新規受付
     	$('#mobile-visitor-create').unbind();
      $('#mobile-visitor-create').bind('click',function(e){
        _wt.openMobile();
      });
      
      // 新規受付（英語版）
     	$('#mobile-visitor-create-en').unbind();
      $('#mobile-visitor-create-en').bind('click',function(e){
        _wt.openMobile_en();
      });
      
      // cookie削除(テスト用)
      $('#mobile-cookie-delete').unbind();
      $('#mobile-cookie-delete').bind('click',function(e){
        $.removeCookie("KEY");
        
        _wt.initMobile();
      });
      
      // 呼出音(テスト用)
      $('#mobile-sound').unbind();
      $('#mobile-sound').bind('click',function(e){
        document.getElementById("btnsound").currentTime = 0;
		    document.getElementById("btnsound").play();
      });
    });
  };
  
  //
  //initialize modals for presence
  //
  _wt.initMobileModals = function(){
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-nsys-mobile.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-nsys-mobile-en.html', function(res){
      $('body').append(res);
    });
  };
  
  // 各来客情報セット
  _wt.addAllCustomer = function(cus){
    waitC = 0;
    waitM = 0;
    for(var c in cus){
      _wt.addCustomer(cus[c],c,cus.length);
    }
  };
  
  _wt.addCustomer = function (_c,c,len) {
    // Deferredと後処理をコールバック外へ
    var df = $.Deferred();
    df.done(function(){
      // 後処理
      var waitD = waitC + '組（' + waitM + '名）';
      $('#mobile-waitComer').text(waitD);
      
      _wt.findNShop(
        function(res){
          // 合計組数を利用して待ち時間をセット
          var waitT = res[0].waitT * waitC;
          $('#mobile-waitTotal').text('約' + waitT + '分');
        });
    });
    
    _wt.fromHtml(_wt._html, function(_div,_p) {
      if(_c.noFlg == '1'){
        _div.find('.mobile-customer-status').addClass('label-danger').text('不在');
      } else {
        waitC++;
        waitM = waitM + _c.member;
      }
      
      _div.attr('id', _cidPrefix + _c.id);
      _div.find('.mobile-customer-no').text(_c.no);
      if(_id == _c.id){
        $('#visitorid').val(_c.id);
        $('#mode1_1').css('display', 'none');
    	  $('#mode1_2').css('display', 'none');
    	  $('#mode1_3').css('display', 'none');
    	  $('#mode2').css('display', '');
    	  $('#mobile-waitName').text(_c.name);
    	  
    	  var myWaitC = waitC;
    	  var myWaitM = waitM;
    	  if(_c.noFlg != '1'){
    	    myWaitC = waitC - 1;
    	    myWaitM = waitM - _c.member;
    	  }
    	  var myWaitD = myWaitC + '組（' + myWaitM + '名）';
    	  $('#mobile-waitGroup').text(myWaitD);
    	  _wt.findNShop( function(res){
    	    var myWaitT = res[0].waitT * myWaitC;
    	    $('#mobile-waitTime').text('約' + myWaitT + '分');
    	  });
    	  
        _div.addClass('TBL_AQUA');
        _div.find('.mobile-customer-name').text(_c.name);
      }
      
      _div.find('.mobile-customer-member').text(_c.member);
      if(_c.call != ''){
        _div.find('.mobile-customer-call').addClass('label-success').text('呼');
      }
      _div.find('.mobile-customer-option1').addClass('label-primary').text(_c.option1);
      _div.find('.mobile-customer-option2').addClass('label-primary').text(_c.option2);
      _div.find('.mobile-customer-option3').addClass('label-primary').text(_c.option3);
      _div.find('.mobile-customer-option4').addClass('label-primary').text(_c.option4);
      
      var old = _wt.findMobileDivByCid(_c.id);
      if(old.length === 0){
        $(_allCDiv).append(_div).fadeIn(500);
      }else{
        _div.replaceAll(old).fadeIn(500);
      }
      
      // 行クリック時アクション
      _div.unbind();
      _div.bind('click',function(e){
        if(_id == undefined){
          $('#visitorid').val(_c.id);
          $('#mode1_1').css('display', 'none');
          $('#mode1_2').css('display', 'none');
          $('#mode1_3').css('display', 'none');
          $('#mode2').css('display', '');
          $('#mobile-waitName').text('No.' + _c.no);
          
          $('.mobiletable').removeClass('TBL_AQUA');
          _div.addClass('TBL_AQUA');
          
          // 自分が何番目か取得
          var index = $('.mobiletable').index(this);
          var _member = 0;
          var _group = 0;
          for(var i=0; i<index; i++){
            if($('.mobiletable').eq(i).find('.mobile-customer-status').text() == ''){
              _group++;
              _member = _member + parseInt($('.mobiletable').eq(i).find('.mobile-customer-member').text(),10);
            }
          }
          var _WaitD = _group + '組（' + _member + '名）';
          $('#mobile-waitGroup').text(_WaitD);
          
          _wt.findNShop( function(res){
    	      var _WaitT = res[0].waitT * _group;
    	      $('#mobile-waitTime').text('約' + _WaitT + '分');
    	    });
        }
      });
      
      // 最後の行を出力しきったところでresolve
      if(len == parseInt(c,10)+1){
        df.resolve();
      }
    });
  };
  
  // 呼出処理
  // cookie登録した行が存在する、またはいずれかの行をアクティブにしている場合、その行が更新された場合、通知と音を鳴らす
  _wt.openNotice = function(vis){
    console.log('openNotice moved.');
    if(vis == $('#visitorid').val()){
      // Deferredと後処理をコールバック外へ
      var df = $.Deferred();
      df.done(function(){
        // var se = $('#btnsound');
        // se[0].currentTime = 0;
        // se[0].play();
        document.getElementById("btnsound").currentTime = 0;
		    document.getElementById("btnsound").play();
      });
      
      var m = moment();
      var nowtime = m.format('HH:mm');
      var n = noty(
        {
          text: nowtime + ":まもなくお呼びいたします･･･", 
          layout:"center", 
          type:"information", 
          timeout:false
        }
      );
      df.resolve();
    }
  };
  
  io.socket.on('nvisitor', function (e) {
    switch(e.verb){
      case 'updated':
        if(e.data.call != undefined){
          _wt.openNotice(e.data.call);
        }
      default:_wt.initMobile();
    }

  });
  
  io.socket.on('nshop', function (e) {
    switch(e.verb){
      default:_wt.initMobile();
    }

  });
  
//////exports
  if('undefined' == typeof module){
    if( !window.ns ){window.ns = {};}
      window.ns.mobile = _wt;
  } else {
    module.exports = _wt;
  }
})();