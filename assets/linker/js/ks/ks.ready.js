/******
 * ks.ready.js
 * 営業準備画面上のキャストエリアを操作するJS
 * 
 */
(function() {
//  var cast = {};
  var _wt = new KsWidgetTmpl();
  var _allRDiv = "#"+'all_ready';
  var _allR2Div = "#"+'all_rest';
  var _ridPrefix = "rid-";

  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/ready.html',
    obj: {},
    loaded: false
  };
  
  // 初期表示検索
  _wt.initReady = function(){
    console.log('initReady() called.');
    
    // 店舗マスタから各店舗情報取得
    _wt.findAllShop(
      function(res){
        // 本日営業日取得
        $('#today').text(_wt.getToday());
    
        // 営業時間プルダウン
        $('#time_fr_h option').remove();
        $('#time_fr_m option').remove();
        $('#time_to_h option').remove();
        $('#time_to_m option').remove();
        _wt.getPulldown_h($('#time_fr_h'));
	      _wt.getPulldown_m($('#time_fr_m'));
	      _wt.getPulldown_h($('#time_to_h'));
	      _wt.getPulldown_m($('#time_to_m'));
    
        // 【営業準備画面】店舗プルダウン
        $('#t_name2 option').remove();
        $('#t_name2').append($('<option>').html('店舗未定').val(''));
        
        $.each(res, function() {
          $('#t_name2').append($('<option>').html(this.shopName).val(this.shopId));
        });
        
        // 店舗プルダウン切り替えイベント
        $('#t_name2').unbind();
        $('#t_name2').bind('change',function(e){
          $('#all_rest div').remove();
          _wt.findSelectCastMaster($('#t_name2').val(),function(res){
            _wt.addAllRestCastMaster(res);
          });
        });
      }
    );
    
    // 営業日テーブルが作成されているかチェック
    _wt.findBusinessDate(
      function(bus){
        if(bus[0] != undefined) {
          $('#time_fr_h').val(bus[0].openTime.substr(0,2));
          $('#time_fr_m').val(bus[0].openTime.substr(3,2));
          $('#time_to_h').val(bus[0].closeTime.substr(0,2));
          $('#time_to_m').val(bus[0].closeTime.substr(3,2));
          
          $('.ready-option').removeClass().addClass('label').addClass('label-danger').text('完了');
          $('#btn_createReady2').val("修正");
          
        } else {
          // 存在しない場合、店舗マスタから営業時間を取得
          _wt.findMyShop(
            function(res){
              // 店舗マスタが存在しないことはありえないので存在判定は不要
              $('#time_fr_h').val(res[0].serviceOpening.substr(0,2));
              $('#time_fr_m').val(res[0].serviceOpening.substr(3,2));
              $('#time_to_h').val(res[0].serviceClosing.substr(0,2));
              $('#time_to_m').val(res[0].serviceClosing.substr(3,2));
            }
          );
        }
      }
    );
    
    // CastLady検索
    _wt.findAllReadyCast(
      function(res){
        // 【営業準備画面】店舗プルダウン初期値設定
        $('#t_name2').val(_wt.getDefaultShopId());
        
        $('#all_ready div').remove();
        $('#all_rest div').remove();
        
        // キャストテーブルにデータが存在するか否かで処理分岐
        if(res[0] !== undefined) {
          
          // 前処理
          _wt.addAllReadyCast(res);
          
          // var myPromise = $.when(

          //   _wt.addAllReadyCast(res)

          // );
          // myPromise.done(function() {

          //   // MCast検索
          //   _wt.findAllReadyCastMaster(
          //     function(ret){
          //       // キャストテーブルに存在したキャスト以外を非番予定キャストへ
          //       _wt.addAllRestCastMaster(ret);
          //     }
          //   );
          
          // });
          
        } else {
          // MCast検索
          _wt.findAllReadyCastMaster(
            function(ret){
              _wt.addAllReadyCastMaster(ret);
            }
          );
        }
      }
    );
  };
  
  // キャストテーブルにデータが存在する
  _wt.addAllReadyCast = function(casts){

    for(var c in casts){
      _wt.addCast(casts[c],casts.length,c);
    }
    // $.each(casts, function() {
    //   _wt.addCast(this);
    // });
    
    // 出勤予定キャストゾーンドラッグイベント
    _wt.ddui.attachDroppableForNewCas( $('#all_ready'),'.rest','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('rid-','');
      _wt.findMcasById(_c_id,function(res,JWR){
        _wt.addCastMaster(res,'ready');
      });
      $(_u.draggable).remove();
    });
    
    // 非番予定キャストゾーンドラッグイベント
    _wt.ddui.attachDroppableForNewCas( $('#all_rest'),'.ready','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('rid-','');
      _wt.findMcasById(_c_id,function(res,JWR){
        _wt.addCastMaster(res,'rest');
      });
      $(_u.draggable).remove();
    });
  };
  
  // キャストテーブルのデータを出勤予定キャストに出力後、キャストマスタからキャストテーブルに存在したキャスト以外を非番予定キャストへ
  _wt.addCast = function (_c,len,c) {
    // Deferredと後処理をコールバック外へ
    var df = $.Deferred();
    df.done(function(){
      // 後処理
      // MCast検索
      _wt.findAllReadyCastMaster(
        function(ret){
          // キャストテーブルに存在したキャスト以外を非番予定キャストへ
          _wt.addAllRestCastMaster(ret);
        }
      );
    });
  
    _wt.fromHtml(_wt._html, function(_div,_p) {
      _div.attr('id', _ridPrefix + _c.id);
      _div.addClass('end_ready');
      _div.addClass('castId-' + _c.castId);
      _div.find('.cast-status').removeClass().addClass('cast-status '+'glyphicon glyphicon-user');
      _div.find('.cast-name').text(_c.name);
      _div.find('.cast-time_fr').text(_c.c_time_fr);
      _div.find('.cast-time_to').text(_c.c_time_to);
      
      _wt.ddui.attachDraggableForCast(_div,_c);
      var old = _wt.findReadyDivByCid(_c.id);
      if(old.length === 0){
        $(_allRDiv).append(_div).fadeIn(500);
      }else{
        _div.replaceAll(old).fadeIn(500);
      }
      
      // 最後の行を出力しきったところでresolve
      if(len == parseInt(c,10)+1) {
        df.resolve();
      }
    });
  };
  
  // キャストテーブルのキャスト以外のキャストを表示
  _wt.addAllRestCastMaster = function(casts){
    for(var d in casts){
      var old = _wt.findReadyDivByCid(casts[d].id);
      var oldc = _wt.findReadyDivByCid3(casts[d].id);
      // キャストテーブルより出勤予定になっているキャストは表示しない
      if(old.length === 0 && oldc.length === 0){
        _wt.addCastMaster(casts[d],'rest');
      }
    }
    // $.each(casts, function() {
    //   var old = _wt.findReadyDivByCid(this.id);
    //   var oldc = _wt.findReadyDivByCid3(this.id);
    //   // キャストテーブルより出勤予定になっているキャストは表示しない
    //   if(old.length === 0 && oldc.length === 0){
    //     _wt.addCastMaster(this,'rest');
    //   }
    // });
  };
  
  // キャストテーブルにデータが存在しない
  _wt.addAllReadyCastMaster = function(casts){
    
    // 本日の曜日を取得
    var _day = _wt.getDateDay();
    $.each(casts, function() {
      if(_day == this.mon
      || _day == this.tue
      || _day == this.wed
      || _day == this.thu
      || _day == this.fri
      || _day == this.sat
      || _day == this.sun){
        // 出勤予定日のキャストは出勤予定キャストへ
        _wt.addCastMaster(this,'ready');
      } else {
        // 上記以外は非番予定キャストへ
        _wt.addCastMaster(this,'rest');
      }
    });
    
    // 出勤予定キャストゾーンドラッグイベント
    _wt.ddui.attachDroppableForNewCas( $('#all_ready'),'.rest','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('rid-','');
      _wt.findMcasById(_c_id,function(res,JWR){
        _wt.addCastMaster(res,'ready');
      });
      $(_u.draggable).remove();
    });
    
    // 非番予定キャストゾーンドラッグイベント
    _wt.ddui.attachDroppableForNewCas( $('#all_rest'),'.ready','btn-default',function(_e,_u){
      var _c_id = $(_u.draggable).attr('id').replace('rid-','');
      _wt.findMcasById(_c_id,function(res,JWR){
        _wt.addCastMaster(res,'rest');
      });
      $(_u.draggable).remove();
    });
  };
  
  _wt.addCastMaster = function (_c, set) {
    _wt.fromHtml(_wt._html, function(_div,_p) {
      _div.attr('id', _ridPrefix + _c.id);
      _div.find('.cast-status').removeClass().addClass('cast-status '+'glyphicon glyphicon-home');
      _div.find('.cast-name').text(_c.gname);
      _div.find('.cast-time_fr').text(_c.c_time_from);
      _div.find('.cast-time_to').text(_c.c_time_to);
      _div.addClass(set);
      
      var old = '';
      if(set == 'ready'){
        _wt.ddui.attachDraggableForCast(_div,_c);
        old = _wt.findReadyDivByCid(_c.id);
        if(old.length === 0){
          $(_allRDiv).append(_div).fadeIn(500);
        }else{
          _div.replaceAll(old).fadeIn(500);
        }
        
      } else {
        _wt.ddui.attachDraggableForCast(_div,_c);
        old = _wt.findReadyDivByCid2(_c.id);
        if(old.length === 0){
          $(_allR2Div).append(_div).fadeIn(500);
        }else{
          _div.replaceAll(old).fadeIn(500);
        }
      }
      
    });
  };
  
//--------------- private methods.

//--------------- socket events.

  io.socket.on('businessdate', function (e) {
    switch(e.verb){
      default:_wt.initReady();
    }

  });
  
  io.socket.on('mcast', function (e) {
    switch(e.verb){
      default:_wt.initReady();
    }

  });
//////exports
    if('undefined' == typeof module){
        if( !window.ks ){window.ks = {};}
        window.ks.ready = _wt;
    } else {
        module.exports = _wt;
    }
})();