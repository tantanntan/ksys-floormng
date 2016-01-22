/**
 * 表示ウィジェットprototype
 * KsWidgetTmpl
 * ks.cast,ks.seatsなどの表示共通の処理や属性をまとめている
 */
(function(window,undefined) {
  function KsWidgetTmpl(){
    //prototype宣言
    var _proto = KsWidgetTmpl.prototype;
    //属性
    _proto.code = ks.codeUtil; //コード体系 ks.base.code.js
    _proto.ddui = new KsDragUi(); //UIアタッチ ks.base.dragUI.js
    _proto.cache = new KsHtmlCache(); //ks.base.htmlcache.js

    _proto.shopObj = {}; //api/model/MShop.js
    _proto.businessDate = {}; //api/models/businessDate.js
    
    _proto.companyId = '';
    _proto.shopId = '';
    _proto.accesslv = '';

    _proto._html = {}; //読み込みHTML用。継承先でそれぞれに初期化
    _proto.htmlLoader = {
      urlBase: '/panel'
    };

    _proto.visitorStatusWaiting = ["00","01"];
    _proto.visitorStatusActive = ["10","20","21","25","50"];
    _proto.castStatusCalled = [
      _proto.code.getCodeFromName('detailRecordStatus','ORDERED'),
      _proto.code.getCodeFromName('detailRecordStatus','DELIVERED')
    ];
    _proto.tmplId = '#widgetTemplates';
    _proto.allReadyId = 'all_ready';
    _proto.allRestId = 'all_rest';
    _proto.allCastId = 'all_cast';
    _proto.allWorkId = 'all_work';
    _proto.allRworkId = 'all_rwork';
    _proto.allBackId = 'all_back';
    _proto.castDivClass = '.castlady';
    _proto.castOnVisDivClass = '.cast-on-visitor';
    _proto.allVisitorId = 'all_visitors';
    _proto.allSeatsId = 'seat-accordion';
    _proto.seatDivClass = '.floor-seat';
    
    var date = new Date();
    // 12/8 日またぎ対応：0-8時までは前日を取得
    if(date.getHours() < 9) {
      date.setDate(date.getDate() - 1);
    }
    var yy = date.getFullYear();
    var mm = ('0' + (date.getMonth() + 1)).slice(-2);
    var dd = ('0' + date.getDate()).slice(-2);
    var today = yy + mm + dd;

//-----public functions
    //外部HTML読み込み＊シンプルバージョン
    _proto.getHtmlSimple = function( url, cb ){
      $("<div>").load(url, function(res){
        //console.log(url," loaded. ",res);
        cb(res);
      });
    };

    //外部HTML読み込み＊キャッシュバージョン
    _proto.fromHtml = function( p, cb ){
      if( p.loaded ){cb(p.obj.clone(),p); }else{ 
        console.log('Loading... ', p.url );
        $("<div>").load(p.url, function(res){
          p.obj = $(res);
          setTimeout(function(){if($(p.obj).size == 0){ setTimeout( arguments.callee, 100 ); }else{p.loaded = true;cb(p.obj.clone(),p);}},100);
        });
      }
    };
    
    // 3/3 デフォルト店舗ID取得
    _proto.getDefaultShopId = function(){
      return _proto.shopObj.shopId;
    };
    
    // 3/4 本日営業日取得
    _proto.getToday = function(){
      return today;
    };
    
    // 2/16 本日曜日取得
    _proto.getDateDay = function(){
      return date.getDay();
    };
    
    _proto.findReadyDivByCid = function(cid){
      return $( '#' + this.allReadyId ).find( '#' + 'rid-' + cid );
    };
    
    _proto.findReadyDivByCid2 = function(cid){
      return $( '#' + this.allRestId ).find( '#' + 'rid-' + cid );
    };
    
    _proto.findReadyDivByCid3 = function(cid){
      return $( '#' + this.allReadyId ).find( '.castId-' + cid ).text();
    };
    
    _proto.findPresenceDivByCid = function(cid){
      return $( '#' + this.allWorkId ).find( '#' + 'cid-' + cid );
    };
    
    _proto.findPresenceDivByCid2 = function(cid){
      return $( '#' + this.allRworkId ).find( '#' + 'cid-' + cid );
    };
    
    _proto.findPresenceDivByCid3 = function(cid){
      return $( '#' + this.allBackId ).find( '#' + 'cid-' + cid );
    };
    
    //idからキャストDIVを返す
    _proto.findCastDivByCid = function(cid){
      return $( '#' + this.allCastId ).find( '#' + 'cid-' + cid );
    };
        
    //キャストがどこかに着席中かを返す
    _proto.isCastSeated = function(cid){
      return $("#visitor-seats-area [id='seated-cid-"+cid+"']")?true:false;
    };
    
    _proto.isCastChoosed = function(vid){
      return $("#visitor-seats-area [id='well-called-vid-"+vid+"']");
    };
    _proto.isCastSeated2 = function(vid){
      return $("#visitor-seats-area [id='well-seated-vid-"+vid+"']");
    };

    /*
     *キャストが着席中のvidを返す 
     *いなければundefined.
     */
    _proto.findVidCastSeated = function(cid){
      var vid = $("#visitor-seats-area [id='seated-cid-"+cid+"']").parents("[id*='well-seated-vid-']").attr('id');
      if(vid){
        return vid.replace('well-seated-vid-','');
      }
      return vid;
    };
    /*
     *キャストがすでに指名されているか返す 
     *いなければundefined.
     */
    _proto.isCastWasAlreadyCalled = function(cid,vid){
      var vids = $(".seat-body-cast-called").find ('.called-cid-' + cid);
      if(!vids || vids.length === 0) return false;
      for( var i=0 ;i < vids.length; i++ ){
        var target = $(vids[i]).parents("[id*='well-called-vid-']").attr('id');
        if( !target ) continue;
        if(target.replace('well-called-vid-','') == vid){
          return true;
        }
      }
      return false;
    };

    /*
     *キャストIDから着席中の席名を返す 
     *いなければundefined.
     */
    _proto.findSeatNameCastSeated = function(cid){
      var sname = $("#visitor-seats-area [id='seated-cid-"+cid+"']").parents(".panel").find('.seat-name').text();
      if( !sname ){
        return undefined;
      }
      return sname.replace('well-seated-vid-','');
    };
    /*着席中の客の座席IDを返す*/
    _proto.findSeatIdFromVid = function(vid){
      return $("#visitor-seats-area [id='seated-vid-" + vid + "']").parents(".panel").attr('id').replace('sid-','');
    };

    /*着席中の客の座席名を返す*/
    _proto.findSeatNameFromVid = function(vid){
      return $("#visitor-seats-area [id='seated-vid-" + vid + "']").parents(".panel").find('.seat-name').text();
    };

    //キャストを着席
    _proto.addCastToVisitor = function (_ul, cast) {
      var _li = $(this.tmplId).find(this.castOnVisDivClass).clone();
      _li.addClass(cast.id);
      _li.find('.cast-name').text(cast.name);
      _ul.append(_li);
    };
        
    /*キャストIDから着席中の客のDIVを返す*/
    _proto.findVisDivByCid = function (vid){
      return $(this._allVDiv).find('#' + 'vid-' + vid);
    };
        
    //新規顧客モーダル
    _proto.attachModalForNewVis = function(_seat){
      var _m,_form;
      if(_seat.isWait){
        //待ち席
        //_m = $('#modal-wait-visitor');
        _m = $('#modal-wait-visitor2');
        _form = _m.find('form');
        //卓番
        _m.find('.seat-name').text(_seat.name);
        //人数SELECT
        // var _s1 = _m.find('.form-wait-vis-number');
        // _s1.find('option').remove();
        // for(var i = 0; i < _seat.max; i++){
        //   _s1.append( $('<option>').text(i + 1) );
        // }
        // //初期化
        // $('#modal-form-wait-vis-name').val('');
        // $('#modal-form-wait-vis-contact').val('');
        
        var _s0 = $('#modal-form-wait-vis-save-btn2');
        _s0.unbind();
        _s0.bind('click',function(e){
          e.preventDefault();
          _proto.seatVisitor2(_form,_seat,function(){
            _m.modal('hide');
          });
        });
        
      }else{
        _m = $('#modal-new-visitor');
        _form = _m.find('form');
        //卓番
        _m.find('.seat-name').text(_seat.name);
        //人数SELECT
        var _s1 = _m.find('.form-new-vis-number');
        _s1.find('option').remove();
        for(var i = 0; i < _seat.max; i++){
          _s1.append( $('<option>').text(i + 1) );
        }
        //セット
        var _s2 = _m.find('.form-new-vis-set-preset');
        _s2.find('option').remove();
        _s2.append($('<option>').attr('value','invalid: : ' ).text('選択して下さい'));
        _proto.findAllBeginSet(_seat, function(res){
          for(var i=0; i<res.length;i++){
            var _set = res[i];
            // var _tmp = $('<option>').attr('value',_set.id+':'+_set.minutes+":"+_set.price);
            // _tmp.text(_set.name);
            var _tmp = $('<option>').attr('value',_set.id+':'+_set.setTime+":"+_set.setPrice);
            _tmp.text(_set.setName);
            _s2.append(_tmp);
          }
          //初期化
          $('#modal-form-new-vis-price').val('');
          $('#modal-form-new-vis-minutes').val('');
          $('#modal-form-new-vis-service').attr("checked",false);   // 4/28 サービス0円チェック
          $('#modal-form-new-vis-tax').attr("checked",false);       // 2/2 TAX0円チェック
          $('#modal-form-new-vis-card').attr("checked",false);      // 2/2 カード手数料0円チェック
        });
        _s2.on('load change',function(){
          var _v = this.value.split(":");
          if(_v[0] == 'invalid'){
            $('#modal-form-new-vis-price').val('');
            $('#modal-form-new-vis-minutes').val('');
          } else {
            $('#modal-form-new-vis-price').val(_v[2]);
            $('#modal-form-new-vis-minutes').val(_v[1]);
          }
        });
        var _s3 = $('#modal-form-new-vis-save-btn');
        _s3.unbind();
        _s3.bind('click',function(e){
          e.preventDefault();
          
          // 4/28 セットが未選択の場合、確認メッセージ
          var _set = _m.find('.form-new-vis-set-preset option:selected').val().split(":");
          if(_set[0] == 'invalid'){
            if(!confirm("セットが選択されていません。このまま保存してもよろしいですか？")){
              return false;
            }
          }
          _proto.seatVisitor(_form,_seat,function(){
            _m.modal('hide');
          });
        });
        var _s4 = $('.btn_minutes_del');
        _s4.unbind();
        _s4.bind('click',function(e){
          e.preventDefault();
          $('#modal-form-new-vis-minutes').val('');
        });
        var _s5 = $('.btn_price_del');
        _s5.unbind();
        _s5.bind('click',function(e){
          e.preventDefault();
          $('#modal-form-new-vis-price').val('');
        });
          
        //_s2.append( $('<option>').text(i + 1) );
      }
      _m.modal();
    };
      
    /** キャストを着席（castlady.seatedの更新）  */
    _proto.attachModalForCastSeated = function(seat,vis,ui){
      var _m = $('#modal-cast-seated');
      var cname = $(ui.draggable).find('.cast-name').text();
      var cid = $(ui.draggable).attr('id').replace('cid-','');
      
      // 1/27 キャストの状態(待機or同伴or席)
      var sta = $(ui.draggable).find('.cast-seated').text();
      
      //確定ボタン（新規・移動）
      var _btnNew = $('#modal-form-cast-seated-save-btn');
      _btnNew.unbind();
      _btnNew.bind('click', function(e){
        console.log(cname+'がクリック' , e);
        _proto.seatCast({id: cid,name: cname},seat,vis.id,function(res,JWR){
          _m.modal('hide');
        });
      });
      //重複判定
      var oldVid = _proto.findVidCastSeated(cid);
      if( !oldVid && sta !='同伴' ){
        //着席確認
        _m.find('.modal-title').text('キャストの着席');
        _m.find('.modal-body > .message:first-child').html(
          '<strong>' + cname +'</strong>を<strong>' + seat.name + 'に着席</strong>させます．'
        );
        _m.modal();
        return;
      }else if(oldVid !== vis.id && sta !='同伴' ){
        //席移動確認
        _m.find('.modal-title').text('キャストの移動');
        //席名を取得
        var oldSeatName = _proto.findSeatNameFromVid(oldVid);
        _m.find('.modal-body > .message:first-child').html(
          '<strong>' + cname +'</strong>を<strong>' + oldSeatName + 'から' + seat.name + 'へ移動</strong>させます．'
        );
        _m.modal();
        return;
      }else{
        //TODO:重複エラー表示
      }
    };

    /** キャストを指名（castlady.seatedの更新）  */
    _proto.attachModalForCastCalled = function( seat, vis, ui){
      var _m = $('#modal-cast-called');
      var cname = $(ui.draggable).find('.cast-name').text();
      var cid = $(ui.draggable).attr('id').replace('cid-','');
      //重複判定 重複してたらなにもしない。
      if( _proto.isCastWasAlreadyCalled(cid,vis.id) ) return;
      
      _m.find('.modal-body > .message:first-child').html(
        '<strong>' + cname +'</strong>が<strong>' + seat.name + 'に指名</strong>されます．'
      );
      var _s1 = _m.find('.form-called-cast-preset');
      _s1.find('option').remove();
      _s1.append($('<option>').attr('value','invalid: : ' ).text('選択して下さい'));
      _proto.findAllCallItem(seat, function(items){
        for(var i=0; i < items.length;i++){
          var _set = items[i];
          // var _tmp = $('<option>').attr('value',_set.id + ':' + _set.point + ":" + _set.price );
          // _tmp.text(_set.name);
          var _tmp = $('<option>').attr('value',_set.id + ':' + _set.castPoint + ":" + _set.salesPrice + ":" + _set.cashBack );
          _tmp.text(_set.chooseName);
          _s1.append(_tmp);
        }
        //初期化
        $('#modal-form-called-cast-point').val('');
        $('#modal-form-called-cast-price').val('');
        $('#modal-form-called-cast-cashBack').val('');  // 1/26 キャッシュバック追加
        $('#modal-form-called-cast-setSales').attr("checked",false);  // 1/27 セット売上追加
      });
      _s1.on('load change',function(){
        var _v = this.value.split(":");
        if(_v[0] == 'invalid'){
          $('#modal-form-called-cast-point').val('');
          $('#modal-form-called-cast-price').val('');
          $('#modal-form-called-cast-cashBack').val('');
        } else {
          $('#modal-form-called-cast-point').val(_v[1]);
          $('#modal-form-called-cast-price').val(_v[2]);
          $('#modal-form-called-cast-cashBack').val(_v[3]);
        }
      });
      
      var _s2 = $('.btn_called_cast_point_del');
      _s2.unbind();
      _s2.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-called-cast-point').val('');
      });
      var _s3 = $('.btn_called_cast_price_del');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-called-cast-price').val('');
      });
      var _s4 = $('.btn_called_cast_cashBack_del');
      _s4.unbind();
      _s4.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-called-cast-cashBack').val('');
      });
      
      //確定ボタン
      var _btnNew = $('#modal-form-cast-called-save-btn');
      _btnNew.unbind();
      _btnNew.bind('click',function(e){
        var w_setSales = '';
        if($('#modal-form-called-cast-setSales').attr("checked") !== undefined){
          w_setSales = $('#modal-form-called-cast-setSales').val();
        }
        
        _proto.callCast(
          { id: cid, name: cname, seated: _proto.findVidCastSeated(cid) },
          { id: _s1.val(), itemName: _s1.find('option:selected').text(),
            point: $('#modal-form-called-cast-point').val(),
            cashBack:$('#modal-form-called-cast-cashBack').val(),
            price:$('#modal-form-called-cast-price').val(),
            setSales:w_setSales
          },
          seat,
          vis.id,
        function(res,JWR){
          //_m.modal('hide');
        });
      });
      _m.modal();
    };

//user socket.
    // 3/3 店舗マスタ検索
    _proto.findAllShop = function(cb){
      io.socket.get('/mshop?limit=0', {
        companyId: _proto.shopObj.companyId
      }, cb);
    };
    
    // 3/4 自店舗マスタ検索
    _proto.findMyShop = function(cb){
      io.socket.get('/mshop', {
        companyId: _proto.shopObj.companyId,
        shopId: _proto.shopObj.shopId
      }, cb);
    };
    
    // 3/4 営業日テーブル検索
    _proto.findBusinessDate = function(cb){
      var _e_id = _proto.shopObj.companyId + _proto.shopObj.shopId + today;
      io.socket.get('/businessdate', {
        companyId: _proto.shopObj.companyId,
        shopId: _proto.shopObj.shopId,
        e_id: _e_id
      }, cb);
    };
    
    // 2/16 キャストテーブル検索
    _proto.findAllReadyCast = function(cb){
      var _e_id = _proto.shopObj.companyId + _proto.shopObj.shopId + today;
      io.socket.get('/castlady?limit=0', {
        companyId: _proto.shopObj.companyId,
        shopId: _proto.shopObj.shopId,
        e_id: _e_id,
        sort:{ cj_time_to: -1, cj_time_fr: -1, c_time_fr: 1 }
      }, cb);
    };
    
    // キャストマスタ検索
    _proto.findAllReadyCastMaster = function(cb){
      io.socket.get('/mcast?limit=0', {
        k_id: _proto.shopObj.companyId,
        t_id: _proto.shopObj.shopId,
        endday: ''
      }, cb);
    };
    
    // キャストマスタ検索(店舗指定)
    _proto.findSelectCastMaster = function(_shopid,cb){
      io.socket.get('/mcast?limit=0', {
        k_id: _proto.shopObj.companyId,
        t_id: _shopid,
        endday: ''
      }, cb);
    };
    
    // 【営業中】出勤キャスト検索
    _proto.findAllCast = function(cb){
      var _e_id = _proto.shopObj.companyId + _proto.shopObj.shopId + today;
      io.socket.get('/castlady?limit=0', {
        companyId: _proto.shopObj.companyId,
        shopId: _proto.shopObj.shopId,
        e_id: _e_id,
        "$and": [ { "$or": [ { cj_time_fr: {$ne:':'} }, { cd_time: {$ne:':'} } ] }, { cj_time_to: ':' } ]
      }, cb);
    };
    //着席中の客を検索
    _proto.findVisSeated = function(_seatid,cb){
      var _e_id = _proto.shopObj.companyId + _proto.shopObj.shopId + today;
      io.socket.get('/visitor?limit=0',{ seatId:_seatid, e_id: _e_id, status: _proto.visitorStatusActive },cb);
    };
    //着席中のキャストを検索
    _proto.findCastSeated = function(_visid,cb){
      io.socket.get('/castlady?limit=0', {
        seated:_visid,
        e_id: _proto.businessDate.e_id
      },cb );
    };
    //指名中のキャスト情報を検索
    _proto.findCastCalled = function(_vid,cb){
      io.socket.get('/detailrecord?limit=0',{
        visitorId: _vid,
        status: [
          _proto.code.getCodeFromName('detailRecordStatus','ORDERED'),
          _proto.code.getCodeFromName('detailRecordStatus','DELIVERED')
        ],
        itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','CALL')
        //delFlag:false
      },cb );
    };
    //指名中のキャスト情報を検索
    _proto.findCastCalledById = function(_cid, _vid,cb){
      io.socket.get('/detailrecord?limit=0',{
        castId: _cid,
        visitorId: _vid,
        status: [
          _proto.code.getCodeFromName('detailRecordStatus','ORDERED'),
          //_proto.code.getCodeFromName('detailRecordStatus','DELIVERED')
        ],
        itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','CALL')
        //delFlag:false
      },cb );
    };
    
    // 3/1 MCast情報取得(id)
    _proto.findMcasById = function(_id,cb){
      io.socket.get('/mcast',{id: _id},cb);
    };
    
    // 12/9 visitor情報取得
    _proto.findVidById = function(_vid,cb){
      io.socket.get('/visitor',{id: _vid},cb);
    };
    
    // 12/17 detailrecord情報取得
    _proto.findDetailById = function(_id,cb){
      io.socket.get('/detailrecord',{id: _id},cb);
    };

    //席を検索
    _proto.findAllSeats = function(_res,cb){
      //io.socket.get('/mseats?sort=name ASC',{companyId: _res.companyId, shopId: _res.shopId },cb);
      io.socket.get('/mseats?limit=0',{companyId: _res.companyId, shopId: _res.shopId, sort:{ name: 1 } },cb);
    };
    //席を検索
    _proto.findSeatById = function( _sid,cb){
      io.socket.get('/mseats',{id:_sid },cb);
    };
    // 12/8 席を検索（待機席有のため分岐）
    _proto.findSeatById2 = function( vis,cb){
      io.socket.get('/mseats',{id:vis.seatId },cb);
    };
    //初回セット商品を検索(4/7 延長セットでないもの)
    _proto.findAllBeginSet = function(_res,cb){
      io.socket.get('/setdb?limit=0',{companyId: _res.companyId, tenpoId: _res.shopId, setExtend: '', sort:{ setId: 1 } },cb);
    };
    //4/7 延長セットを検索
    _proto.findAllExtendSet = function(_res,cb){
      io.socket.get('/setdb?limit=0',{companyId: _res.companyId, tenpoId: _res.shopId, setExtend: '1', sort:{ setId: 1 } },cb);
    };
    //指名商品を検索
    _proto.findAllCallItem = function(_res,cb){
      io.socket.get('/choosedb?limit=0',{companyId: _proto.shopObj.companyId, tenpoId: _proto.shopObj.shopId, sort:{ chooseId: 1 } },cb);
    };
    // 2/20 出退勤マスタを検索
    _proto.findAllAppend = function(_res,cb){
      io.socket.get('/master_append?limit=0',{companyId: _res.companyId, tenpoId: _res.shopId, sort:{ appendId: 1 } },cb);
    };
    // 2/20 detailrecordを検索(出退勤状況)
    _proto.findCastAppend = function(_res,cb){
      io.socket.get('/detailrecord?limit=0',{
        companyId: _res.companyId,
        shopId: _res.shopId,
        orderDate: today,
        castId: _res.id,
        itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','APPEND')
      },cb);
    };
        
    _proto.seatVisitor = function(form,seat,cb){
      //TODO: validate
      //console.log(form);
      var _disc = form.find('#modal-form-new-vis-set-disc1').val() + form.find('#modal-form-new-vis-set-disc2').val();
      var _serviceZeroFlg = '';
      if(form.find('#modal-form-new-vis-service').attr("checked") !== undefined){
        _serviceZeroFlg = form.find('#modal-form-new-vis-service').val();
      }
      var _taxZeroFlg = '';
      if(form.find('#modal-form-new-vis-tax').attr("checked") !== undefined){
        _taxZeroFlg = form.find('#modal-form-new-vis-tax').val();
      }
      var _cardZeroFlg = '';
      if(form.find('#modal-form-new-vis-card').attr("checked") !== undefined){
        _cardZeroFlg = form.find('#modal-form-new-vis-card').val();
      }
      var minutes = _proto.transNullBlankToZero(form.find('#modal-form-new-vis-minutes').val());
      var price = _proto.transNullBlankToZero(form.find('#modal-form-new-vis-price').val());
      io.socket.post('/visitor',{
        companyId: _proto.shopObj.companyId,
        shopId: _proto.shopObj.shopId,
        e_id: _proto.businessDate.e_id,
        businessDate:_proto.businessDate.date,
        status: _proto.code.getCodeFromName('visitorStatus','SEATED'),
        number: form.find('.form-new-vis-number').val(),
        name: _disc,
        contact: '',
        seatId: seat.id,
        //seatId: seat.seatId,
        startTime: null,
        endTime: null,
        setTime: minutes,
        serviceZeroFlg: _serviceZeroFlg,
        taxZeroFlg: _taxZeroFlg,
        cardZeroFlg: _cardZeroFlg,
        paytype: ''
        
      },function(visitor,err){
        //console.log(err,res);
        io.socket.post('/detailrecord',{
          companyId: _proto.shopObj.companyId ,
          //shopId: _proto.shopObj.id,
          shopId: _proto.shopObj.shopId,
          shopName: _proto.shopObj.shopName,
          businessDate: _proto.businessDate.id,
          orderDate: _proto.businessDate.date,
          businessDateLabel: _proto.businessDate.dateLabel,
          seatId: seat.id,
          seatName: seat.name,
          visitorId: visitor.id,
          orderTime: moment().format('HH:mm', new Date()),
          itemCategoryCd:_proto.code.getCodeFromName('itemCategoryCd','SET'),
          itemId: form.find("#modal-form-new-vis-set-preset option:selected").val(),
          itemName:form.find("#modal-form-new-vis-set-preset option:selected").text(),
          price: price,
          amount: visitor.number,
          totalPrice: price * visitor.number,
          status: _proto.code.getCodeFromName('detailRecordStatus','ORDERED')
        },function(res,JWR){
          console.log(res,JWR);
          cb;
        });
      });
    };
    
    _proto.seatVisitor2 = function(form,seat,cb){
      var status = '';
      // 12/5 既に待ち席として登録されている場合、削除
      io.socket.get('/visitor',{ e_id: _proto.businessDate.e_id, seatId: seat.id },function(res){
        if(res[0] !== undefined) {
          io.socket.delete('/visitor',{ id: res[0].id },function(res){
            console.log('visitor :'+ seat.id +' 削除');
            //console.log('visitor :'+ seat.seatId +' 削除');
          });
        }
      });
      // 12/5 待ち席を設定する場合のみ、登録
      if($("input[name='form-wait-vis-number']:checked").val() == "1") {
        status = _proto.code.getCodeFromName('visitorStatus','WAITING');
        
        io.socket.post('/visitor',{
          companyId: _proto.shopObj.companyId ,
          shopId: _proto.shopObj.shopId,
          e_id: _proto.businessDate.e_id ,
          businessDate:_proto.businessDate.date ,
          //visitorId: 'dummy' ,
          status: status,
          // number: form.find('.form-wait-vis-number').val() ,
          // name: form.find('#modal-form-wait-vis-name').val() ,
          // contact: form.find('#modal-form-wait-vis-contact').val() ,
          number: 0 ,
          name: 'dummy' ,
          contact: '' ,
          startTime: null ,
          endTime: null ,
          seatId: seat.id,
          //seatId: seat.seatId
        
        },function(res,JWR){
          console.log(res,JWR);
          cb;
        });
      }
      
    };

    /* キャスト着席 */
    _proto.seatCast = function(cast,seat,vid,cb){
      // キャストテーブルより、現在着席しているかを検索
      io.socket.get('/castlady',{id: cast.id},function(cas) {
         if(cas.seated != ''){
           _proto.unseatCast2(cas,'1');
         }
      });
      
      //update castlady.seated starttime
      io.socket.put('/castlady/' + cast.id,{
        seated: vid,
        startTime: new Date()
      },function(res,JWR){
        //TODO: insert detailRecord
        //TODO: 指名時のdetailRecordステータス更新
        _proto.findCastCalledById(cast.id,vid,function(res,JWR){
          if(res.length > 0){
            //指名したキャストがはじめて座った！ドキドキ！
            console.log('指名したキャストがはじめて座った！ドキドキ！',res,JWR);
            _proto.updateCastCalledStatus(res[0].id,_proto.code.getCodeFromName('detailRecordStatus','DELIVERED'),function(res,JWR){
              console.log('cast seated!',res,JWR);
            });                
          }
        });
        
        // 12/9 着席した来客グループテーブルに初めてキャストが着席したか
        // 3/27 延長時対応
        _proto.findVidById(vid,function(res,JWR){
          if(res.status !== _proto.code.getCodeFromName('visitorStatus','SET_START')
          && res.status !== _proto.code.getCodeFromName('visitorStatus','EXTENDED')){
            // visitor更新
            io.socket.put('/visitor/' + vid, {
              companyId: res.companyId,
              shopId: res.shopId,
              seatId: res.seatId,
              status: _proto.code.getCodeFromName('visitorStatus','SET_START'),
              startTime: new Date(),
              endTime: moment().add(res.setTime,'minutes').format()
            },function(res,JWR){
              console.log('set start!',res,JWR);
            });
          }
        });
        
        cb();
      });
    };
    
    /* 会計支払い */
    _proto.paidVisitor = function(vis,pay,paytype,cb){
      //update visitor.status pay
      io.socket.put('/visitor/' + vis.id,{
        companyId: vis.companyId,
        shopId: vis.shopId,
        seatId: vis.seatId,
        status: _proto.code.getCodeFromName('visitorStatus','FINISHED'),
        pay: pay,
        payType: paytype
      },function(res,err){
        // キャスト退席
        io.socket.get('/castlady?limit=0',{ seated: vis.id },function(res){
          for(var c in res){
            _proto.unseatCast(res[c]);
          }
        });
        
        cb();
      });
    };

    /* キャスト移動 */
    _proto.seatCastMove = function(cast,vis,cb){
      //update castlady.seated starttime
      io.socket.put('/castlady/' + cast.id,{
        seated: vis.id,
        startTime: new Date()
      },function(res,err){
        //TODO: detailRecord
        cb();
      });
    };

    /* キャスト指名 */
    _proto.callCast = function(cast,form,seat,vid,cb){
      //insert detailrecord for call.
      console.log(this.auguments);
      io.socket.post('/detailrecord',{
        companyId: _proto.shopObj.companyId ,
        //shopId: _proto.shopObj.id,
        shopId: _proto.shopObj.shopId,
        shopName: _proto.shopObj.shopName,
        businessDate: _proto.businessDate.id,
        orderDate: _proto.businessDate.date,
        businessDateLabel: _proto.businessDate.dateLabel,
        seatId: seat.id,
        seatName: seat.name,
        visitorId: vid,
        orderTime: moment().format('HH:mm', new Date()),
        castId:cast.id,
        castName:cast.name,
        status: cast.seated == vid ? _proto.code.getCodeFromName('detailRecordStatus','DELIVERED') : _proto.code.getCodeFromName('detailRecordStatus','ORDERED'),
        itemCategoryCd:_proto.code.getCodeFromName('itemCategoryCd','CALL'),
        itemId: form.id,
        itemName:form.itemName,
        price: form.price,
        amount: 1,
        totalPrice: form.price,
        point: form.point,
        cashBack: form.cashBack
        
      },function(res,JWR){
        // 売上チェックがONの場合、セット売上のdetailrecord更新
        if(form.setSales != '') {
          io.socket.get('/detailrecord',{
            itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','SET'),
            visitorId: vid
            
          },function(det){
            io.socket.put('/detailrecord/' + det[0].id, {
              castId:cast.id,
              castName:cast.name
            },cb(res,JWR));
          });
        }
        //console.log(res,JWR);
        cb(res,JWR);
      });
    };
    
    // 3/9【出退勤画面】出勤予定から出勤へステータスを変更
    _proto.updateCastStatus = function(id){
      var xdate = new Date();
      var hh = ('0' + xdate.getHours()).slice(-2);
      var mi = ('0' + xdate.getMinutes()).slice(-2);
      var _cj_time_fr = hh + ':' + mi;
      io.socket.put('/castlady/' + id ,{
        status: _proto.code.getCodeFromName('castStatus','ON_THE_FLOOR'),
        startTime: new Date(),
        cj_time_fr: _cj_time_fr
      }, function(res,JWR){
          console.log(res.name + ' 出勤',res,JWR);
      });
    };
    
    // 3/9【出退勤画面】出勤から退勤へステータスを変更
    _proto.updateCastStatus2 = function(id){
      var xdate = new Date();
      var hh = ('0' + xdate.getHours()).slice(-2);
      var mi = ('0' + xdate.getMinutes()).slice(-2);
      var _cj_time_to = hh + ':' + mi;
      io.socket.put('/castlady/' + id ,{
        status: _proto.code.getCodeFromName('castStatus','FINISHED'),
        startTime: new Date(),
        cj_time_to: _cj_time_to
      }, function(res,JWR){
          console.log(res.name + ' 退勤',res,JWR);
      });
    };
    
    // 4/9【出退勤画面】出勤キャンセル
    _proto.updateCastStatus3 = function(id){
      io.socket.put('/castlady/' + id ,{
        status: _proto.code.getCodeFromName('castStatus','SCHEDULED'),
        startTime: new Date(),
        cj_time_fr: ':'
      }, function(res,JWR){
        console.log(res.name + ' 出勤キャンセル',res,JWR);
      });
    };
    
    // 4/9【出退勤画面】退勤キャンセル
    _proto.updateCastStatus4 = function(id){
      io.socket.put('/castlady/' + id ,{
        status: _proto.code.getCodeFromName('castStatus','ON_THE_FLOOR'),
        startTime: new Date(),
        cj_time_to: ':'
      }, function(res,JWR){
        console.log(res.name + ' 退勤キャンセル',res,JWR);
      });
    };
    
    //指名ステータスを変更する。
    _proto.updateCastCalledStatus = function(id,after,cb){
      io.socket.put('/detailrecord/' + id, {status: after},cb);
    };
    //キャスト退席
    _proto.unseatCast = function(cast){
      io.socket.put('/castlady/' + cast.id ,{ seated: '', startTime: new Date() }, function(res,JWR){
        console.log('cast :'+ cast.name +' 退席',res,JWR);
      });
    };
    //キャスト退席(着席時間対応)
    _proto.unseatCast2 = function(cast,move){
      // 指名に退席キャストが存在する場合、detailrecord更新
      io.socket.get('/detailrecord',{
        itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','CALL'),
        visitorId: cast.seated,
        castId: cast.id
            
      },function(det){
        if(det[0] != undefined){
          var _div = _proto.isCastSeated2(cast.seated);
          
          var _setTime = det[0].setTime + parseInt(_div.find('#seated-cid-'+cast.id).find('.minute-from').attr('live-minutes'),10);
          console.log('着席時間：' + _setTime);
          io.socket.put('/detailrecord/' + det[0].id, {
            setTime: _setTime
          });
        }
        
        if(move == ''){
          io.socket.put('/castlady/' + cast.id ,{ seated: '', startTime: new Date() }, function(res,JWR){
            console.log('cast :'+ cast.name +' 退席',res,JWR);
          });
        }
        
      });
      
    };
    
    // 3/24 指名キャスト着席率計算
    _proto.calcSeatCastPercentage = function(cid,min){
      var calc = min;
      
      // detailrecordから指名キャストを検索
      io.socket.get('/detailrecord',{
        itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','CALL'),
        visitorId: _proto.findVidCastSeated(cid),
        castId: cid
            
      },function(det){
        if(det[0] != undefined){
          calc = calc + det[0].setTime;
          
          // visitorから合計セット時間を検索
          io.socket.get('/visitor',{id:_proto.findVidCastSeated(cid) },function(res){
            calc = Math.floor(calc / res.setTime * 100);
            var _div = _proto.isCastChoosed(_proto.findVidCastSeated(cid));
            _div.find('.called-cid-'+cid).find('.live-percentage').text('(' + calc + '%)');
            //console.log(calc);
          });
        }
      });
    };
    
    // 12/9 オーダー画面モーダル展開
    _proto.openOrder = function(vis,cast,seat,quick){
      var _m,_form;
      _m = $('#modal-order-item');
      _form = _m.find('form');
        
      // 商品マスタ検索
      var ret;
      if(quick != null) {
        $( '.order-item-0' ).css('display', 'none');
        io.socket.get('/productdb?limit=0',{ companyId: vis.companyId, tenpoId: vis.shopId, quickOrder:'1', sort:{ productId: 1 } },function(res){
          ret = res;
          // 商品SELECT
          var _s1 = _m.find('.form-order-item-1');
          _s1.find('option').remove();
          for(var c in res){
            var _tmp = $('<option>').attr('value',res[c].productId );
            _tmp.text(res[c].productName);
            _s1.append(_tmp);
          }
          // 初期化
          $('#modal-form-order-item-2').val(res[0].salesPrice);
          $('#modal-form-order-item-3').val(res[0].castPoint);
          $('#modal-form-order-item-4').val(res[0].cashBack);
          $('#modal-form-order-item-5').val(res[0].productNote);
          $('#modal-form-order-item-6').val(1);
        });
        
      } else {
        // 2/12 商品種別プルダウン追加
        $( '.order-item-0' ).css('display', '');
        // 初期化
        $('#modal-form-order-item-2').val(0);
        $('#modal-form-order-item-3').val(0);
        $('#modal-form-order-item-4').val(0);
        $('#modal-form-order-item-5').val('');
        $('#modal-form-order-item-6').val(1);
        _m.find('.form-order-item-1').find('option').remove();
        
        // 商品種別マスタ検索
        io.socket.get('/producttypedb?limit=0',{ companyId: vis.companyId, tenpoId: vis.shopId, sort:{ productTypeId: 1 } },function(res){
          var _s0 = _m.find('.form-order-item-0');
          _s0.find('option').remove();
          var _tmp = $('<option>').attr('value','' );
          _tmp.text('選択してください');
          _s0.append(_tmp);
          
          for(var c in res){
            _tmp = $('<option>').attr('value',res[c].productTypeId );
            _tmp.text(res[c].productTypeName);
            _s0.append(_tmp);
          }
          
        });
        
        var _s0_1 = $('#modal-form-order-item-0');
        _s0_1.unbind();
        _s0_1.bind('change',function(e){
          io.socket.get('/productdb?limit=0',{
            companyId: vis.companyId,
            tenpoId: vis.shopId,
            productTypeId: parseFloat(_form.find("#modal-form-order-item-0 option:selected").val()),
            sort:{ productId: 1 }
          },function(res){
            ret = res;
            // 商品SELECT
            var _s1 = _m.find('.form-order-item-1');
            _s1.find('option').remove();
            for(var c in res){
              var _tmp = $('<option>').attr('value',res[c].productId );
              _tmp.text(res[c].productName);
              _s1.append(_tmp);
              //_s1.append( $('<option>').text(res[c].productName) );
            }
            
            $('#modal-form-order-item-2').val(res[0].salesPrice);
            $('#modal-form-order-item-3').val(res[0].castPoint);
            $('#modal-form-order-item-4').val(res[0].cashBack);
            $('#modal-form-order-item-5').val(res[0].productNote);
            $('#modal-form-order-item-6').val(1);
          });
        });
      }
      
      $( '.order-item-6' ).css('display', 'none');
      if(cast == null) {
        $( '.order-item-6' ).css('display', '');
        // detailrecprd検索
        io.socket.get('/detailrecord?limit=0',{ visitorId: vis.id, itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','CALL') },function(tbl){
          // 指名キャストSELECT
          var _s4 = _m.find('.form-order-item-6');
          _s4.find('option').remove();
          for(var d in tbl){
            var _tmp = $('<option>').attr('value',tbl[d].castId );
            _tmp.text(tbl[d].castName);
            _s4.append(_tmp);
          }
        });
      }
      
      var _s2 = $('#modal-form-order-item-1');
      _s2.unbind();
      _s2.bind('change',function(e){
        for(var c in ret){
          if($('#modal-form-order-item-1').val() == ret[c].productId){
            // 該当した商品名の情報をセット
            $('#modal-form-order-item-2').val(ret[c].salesPrice);
            $('#modal-form-order-item-3').val(ret[c].castPoint);
            $('#modal-form-order-item-4').val(ret[c].cashBack);
            $('#modal-form-order-item-5').val(ret[c].productNote);
            $('#modal-form-order-item-6').val(1);
            break;
          }
        }
      });
      
      var _s3 = $('#modal-form-order-item-save-btn');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        var castId = '';
        var castName = '';
        // cast:null時は客席タブからの操作
        if(cast != null) {
          castId = cast.id;
          castName = cast.name;
        } else {
          castId = _form.find("#modal-form-order-item-6 option:selected").val();
          castName = _form.find("#modal-form-order-item-6 option:selected").text();
        }
        
        // 12/11 detailrecord登録
        var price = _proto.transNullBlankToZero(_form.find('#modal-form-order-item-2').val());
        var amount = _proto.transNullBlankToZero(_form.find('#modal-form-order-item-6').val());
        var point = _proto.transNullBlankToZero(_form.find('#modal-form-order-item-3').val());
        var cashBack = _proto.transNullBlankToZero(_form.find('#modal-form-order-item-4').val());
        
        io.socket.post('/detailrecord',{
          companyId: _proto.shopObj.companyId,
          //shopId: _proto.shopObj.id,
          shopId: _proto.shopObj.shopId,
          shopName: _proto.shopObj.shopName,
          businessDate: _proto.businessDate.id,
          orderDate: _proto.businessDate.date,
          businessDateLabel: _proto.businessDate.dateLabel,
          seatId: seat.id,
          seatName: seat.name,
          visitorId: vis.id,
          orderTime: moment().format('HH:mm', new Date()),
          castId: castId,
          castName: castName,
          status: _proto.code.getCodeFromName('detailRecordStatus','ORDERED'),
          itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','DRINK'),
          itemId: _form.find("#modal-form-order-item-1 option:selected").val(),
          itemName: _form.find("#modal-form-order-item-1 option:selected").text(),
          price: price,
          amount: amount,
          totalPrice: price * amount,
          point: point * amount,
          cashBack: cashBack * amount
        },function(res,JWR){
          //console.log(res,JWR);
        });
      });
      
      var _s4 = $('.btn_order_item2_del');
      _s4.unbind();
      _s4.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-item-2').val('');
      });
      var _s5 = $('.btn_order_item6_del');
      _s5.unbind();
      _s5.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-item-6').val('');
      });
      var _s6 = $('.btn_order_item3_del');
      _s6.unbind();
      _s6.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-item-3').val('');
      });
      var _s7 = $('.btn_order_item4_del');
      _s7.unbind();
      _s7.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-item-4').val('');
      });
      
      _m.modal();
    };
    
    // 12/11 サービス画面モーダル展開
    _proto.openService = function(vis,cast,seat){
      var _m,_form;
      _m = $('#modal-order-service');
      _form = _m.find('form');
        
      // サービスマスタ検索
      var ret;
      io.socket.get('/servicedb?limit=0',{ companyId: vis.companyId, tenpoId: vis.shopId, sort:{ serviceId: 1 } },function(res){
        ret = res;
        // サービスSELECT
        var _s1 = _m.find('.form-order-service-1');
        _s1.find('option').remove();
        for(var c in res){
          var _tmp = $('<option>').attr('value',res[c].serviceId );
          _tmp.text(res[c].serviceName);
          _s1.append(_tmp);
          //_s1.append( $('<option>').text(res[c].serviceName) );
        }
        // 初期化
        $('#modal-form-order-service-2').val(res[0].salesPrice);
        $('#modal-form-order-service-3').val(res[0].castPoint);
        $('#modal-form-order-service-4').val(res[0].cashBack);
        $('#modal-form-order-service-5').val(res[0].serviceNote);
      });
      
      var _s2 = $('#modal-form-order-service-1');
      _s2.unbind();
      _s2.bind('change',function(e){
        for(var c in ret){
          if($('#modal-form-order-service-1').val() == ret[c].serviceId){
            // 該当したサービス名の情報をセット
            $('#modal-form-order-service-2').val(ret[c].salesPrice);
            $('#modal-form-order-service-3').val(ret[c].castPoint);
            $('#modal-form-order-service-4').val(ret[c].cashBack);
            $('#modal-form-order-service-5').val(ret[c].serviceNote);
            break;
          }
        }
      });
      
      var _s3 = $('#modal-form-order-service-save-btn');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        var castId = '';
        var castName = '';
        // cast:null時は客席タブからの操作
        if(cast != null) {
          castId = cast.id;
          castName = cast.name;
        }
        
        // detailrecord登録
        var price = _proto.transNullBlankToZero(_form.find('#modal-form-order-service-2').val());
        var point = _proto.transNullBlankToZero(_form.find('#modal-form-order-service-3').val());
        var cashBack = _proto.transNullBlankToZero(_form.find('#modal-form-order-service-4').val());
        
        io.socket.post('/detailrecord',{
          companyId: _proto.shopObj.companyId,
          //shopId: _proto.shopObj.id,
          shopId: _proto.shopObj.shopId,
          shopName: _proto.shopObj.shopName,
          businessDate: _proto.businessDate.id,
          orderDate: _proto.businessDate.date,
          businessDateLabel: _proto.businessDate.dateLabel,
          seatId: seat.id,
          seatName: seat.name,
          visitorId: vis.id,
          orderTime: moment().format('HH:mm', new Date()),
          castId: castId,
          castName: castName,
          status: _proto.code.getCodeFromName('detailRecordStatus','ORDERED'),
          itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','SERVICE'),
          itemId: _form.find("#modal-form-order-service-1 option:selected").val(),
          itemName: _form.find("#modal-form-order-service-1 option:selected").text(),
          price: price,
          amount: 1,
          totalPrice: price,
          point: point,
          cashBack: cashBack
        },function(res,JWR){
          //console.log(res,JWR);
        });
      });
      
      var _s4 = $('.btn_order_service2_del');
      _s4.unbind();
      _s4.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-service-2').val('');
      });
      var _s5 = $('.btn_order_service3_del');
      _s5.unbind();
      _s5.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-service-3').val('');
      });
      var _s6 = $('.btn_order_service4_del');
      _s6.unbind();
      _s6.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-service-4').val('');
      });
      
      _m.modal();
    };
    
    // 12/11 ペナルティ画面モーダル展開
    _proto.openPenalty = function(vis,cast,seat){
      var _m,_form;
      _m = $('#modal-order-penalty');
      _form = _m.find('form');
        
      // ペナルティマスタ検索
      var ret;
      io.socket.get('/penaltydb?limit=0',{ companyId: cast.companyId, tenpoId: cast.shopId, sort:{ penaltyId: 1 } },function(res){
        ret = res;
        // ペナルティSELECT
        var _s1 = _m.find('.form-order-penalty-1');
        _s1.find('option').remove();
        for(var c in res){
          var _tmp = $('<option>').attr('value',res[c].penaltyId );
          _tmp.text(res[c].penaltyName);
          _s1.append(_tmp);
          //_s1.append( $('<option>').text(res[c].penaltyName) );
        }
        // 初期化
        $('#modal-form-order-penalty-2').val(res[0].balancePoint);
        $('#modal-form-order-penalty-3').val(res[0].deduction);
        $('#modal-form-order-penalty-4').val(res[0].penaltyNote);
      });
      
      var _s2 = $('#modal-form-order-penalty-1');
      _s2.unbind();
      _s2.bind('change',function(e){
        for(var c in ret){
          if($('#modal-form-order-penalty-1').val() == ret[c].penaltyId){
            // 該当したペナルティの情報をセット
            $('#modal-form-order-penalty-2').val(ret[c].balancePoint);
            $('#modal-form-order-penalty-3').val(ret[c].deduction);
            $('#modal-form-order-penalty-4').val(ret[c].penaltyNote);
            break;
          }
        }
      });
      
      var _s3 = $('#modal-form-order-penalty-save-btn');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        // detailrecord登録
        var point = _proto.transNullBlankToZero(_form.find('#modal-form-order-penalty-2').val());
        var cashBack = _proto.transNullBlankToZero(_form.find('#modal-form-order-penalty-3').val());
        
        io.socket.post('/detailrecord',{
          companyId: _proto.shopObj.companyId,
          //shopId: _proto.shopObj.id,
          shopId: _proto.shopObj.shopId,
          shopName: _proto.shopObj.shopName,
          businessDate: _proto.businessDate.id,
          orderDate: _proto.businessDate.date,
          businessDateLabel: _proto.businessDate.dateLabel,
          seatId: seat.id,
          seatName: seat.name,
          visitorId: vis.id,
          orderTime: moment().format('HH:mm', new Date()),
          castId: cast.id,
          castName: cast.name,
          status: _proto.code.getCodeFromName('detailRecordStatus','FINISHED'),
          itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','PENALTY'),
          itemId: _form.find("#modal-form-order-penalty-1 option:selected").val(),
          itemName: _form.find("#modal-form-order-penalty-1 option:selected").text(),
          //price: _form.find('#modal-form-order-penalty-3').val(),
          //amount: 1,
          totalPrice: 0,
          point: point,
          cashBack: cashBack
        },function(res,JWR){
          //console.log(res,JWR);
        });
      });
      
      var _s4 = $('.btn_order_penalty2_del');
      _s4.unbind();
      _s4.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-penalty-2').val('');
      });
      var _s5 = $('.btn_order_penalty3_del');
      _s5.unbind();
      _s5.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-penalty-3').val('');
      });
      
      _m.modal();
    };
    
    // 12/11 オーダー修正画面モーダル展開
    _proto.openRevision = function(vis,cast,seat){
      var _m;
      _m = $('#modal-order-revision');
      
      // detailrecord検索
      var cnt = 1;
      
      // 前回表示していた内容をリセット
      var _s1 = _m.find('.reset-target');
      _s1.remove();
      
      io.socket.get('/detailrecord?limit=0',{ visitorId: vis.id, sort:{ createdAt: 1 } },function(res){
        for(var c in res){
          if(cast === null || (cast != null && res[c].castId == cast.id)) { 
            // テンプレート行をclone
            var orderDiv = $('#modal-form-order-revision-template').clone();
            $('#modal-form-order-revision-table').append(orderDiv);
            // 追加した行を活性化
            $('#modal-form-order-revision-table tr:last').css('display', '');
            $('#modal-form-order-revision-table tr:last').addClass('reset-target');
            // 1/27 商品種別：セットのものは削除ボタンを表示しない
            if(res[c].itemCategoryCd ==_proto.code.getCodeFromName('itemCategoryCd','SET')) {
              _m.find('.delBtn').eq(cnt).css('display', 'none');
            }
            $('.modal-form-order-revision-0').eq(cnt).val(res[c].id);
            $('.modal-form-order-revision-1').eq(cnt).val(res[c].orderTime);
            $('.modal-form-order-revision-2').eq(cnt).val(res[c].seatName);
            $('.modal-form-order-revision-3').eq(cnt).val(res[c].castName);
            $('.modal-form-order-revision-4').eq(cnt).val(res[c].itemName);
            $('.modal-form-order-revision-5').eq(cnt).val(res[c].totalPrice);
            $('.modal-form-order-revision-6').eq(cnt).val(res[c].point);
          
            var _s2 = $('.btn-modal-form-order-revision-del').eq(cnt);
            _s2.unbind();
            _s2.bind('click',function(e){
              var index = $(this).parent().parent().index();
              var _id = $('.modal-form-order-revision-0').eq(index-1).val();
              _proto.findDetailById(_id,function(res,JWR){
                // 12/17 商品種別が「延長」の場合、visitorセット時間更新
                if(res.itemCategoryCd == _proto.code.getCodeFromName('itemCategoryCd','EXTEND')){
                  io.socket.put('/visitor/' + vis.id,{
                    companyId: vis.companyId,
                    shopId: vis.shopId,
                    seatId: vis.seatId,
                    endTime: moment(vis.endTime).subtract(res.setTime,'minutes').format(),
                    setTime: vis.setTime - res.setTime
                  },function(res,err){
                    console.log(res,JWR);
                  });
                }
                
                // 指定したdetailrecordを削除
                io.socket.delete('/detailrecord/',{ id: _id },function(res){
                  console.log('detailrecord :'+ _id +' 削除');
                  $('#modal-form-order-revision-table tr').eq(index).remove();
                });
              });
            
            });
          
            cnt++;
          }
        }
      });
      
      var _s3 = $('#modal-form-order-revision-save-btn');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        var index = $('.modal-form-order-revision-1').parent().parent().index();
        // テンプレート行が存在するため、1からスタート
        for( var i=1; i<index; i++){
          var _id = $('.modal-form-order-revision-0').eq(i).val();
          var _price = $('.modal-form-order-revision-5').eq(i).val();
          var _point = $('.modal-form-order-revision-6').eq(i).val();
          // detailrecord更新
          io.socket.put('/detailrecord/' + _id,{
            totalPrice: _price,
            point: _point
          },function(res,JWR){
            console.log(res,JWR);
          });
        }
      });
      
      _m.modal();
    };
    
    // 12/16 セット設定（延長）画面モーダル展開
    _proto.openSet = function(vis,cast,seat){
      var _m = $('#modal-order-set');
      var _form = _m.find('form');
      //人数SELECT
      var _s1 = _m.find('.form-order-set-number');
      _s1.find('option').remove();
      for(var i = 0; i < vis.number; i++){
        _s1.append( $('<option>').text(i + 1) );
      }
      //セット
      var _s2 = _m.find('.form-order-set-set-preset');
      _s2.find('option').remove();
      _s2.append($('<option>').attr('value','invalid: : ' ).text('選択して下さい'));
      _proto.findAllExtendSet(vis, function(res){
        for(var i=0; i<res.length;i++){
          var _set = res[i];
          var _tmp = $('<option>').attr('value',_set.id+':'+_set.setTime+":"+_set.setPrice);
          _tmp.text(_set.setName);
          _s2.append(_tmp);
        }
        //初期化
        _s1.val(vis.number);
        $('#modal-form-order-set-price').val('');
        $('#modal-form-order-set-minutes').val('');
      });
      _s2.on('load change',function(){
        var _v = this.value.split(":");
        if(_v[0] == 'invalid'){
          $('#modal-form-order-set-price').val('');
          $('#modal-form-order-set-minutes').val('');
        } else {
          $('#modal-form-order-set-price').val(_v[2]);
          $('#modal-form-order-set-minutes').val(_v[1]);
        }
      });
      var _s3 = $('#modal-form-order-set-save-btn');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        var minutes = _proto.transNullBlankToZero(_form.find('#modal-form-order-set-minutes').val());
        var price = _proto.transNullBlankToZero(_form.find('#modal-form-order-set-price').val());
        
        io.socket.post('/detailrecord',{
          companyId: _proto.shopObj.companyId ,
          //shopId: _proto.shopObj.id,
          shopId: _proto.shopObj.shopId,
          shopName: _proto.shopObj.shopName,
          businessDate: _proto.businessDate.id,
          orderDate: _proto.businessDate.date,
          businessDateLabel: _proto.businessDate.dateLabel,
          seatId: seat.id,
          seatName: seat.name,
          visitorId: vis.id,
          orderTime: moment().format('HH:mm', new Date()),
          itemCategoryCd:_proto.code.getCodeFromName('itemCategoryCd','EXTEND'),
          itemId: _form.find("#modal-form-order-set-set-preset option:selected").val(),
          itemName:_form.find("#modal-form-order-set-set-preset option:selected").text(),
          setTime: minutes,
          price: price,
          amount: vis.number,
          totalPrice: price * vis.number,
          status: _proto.code.getCodeFromName('detailRecordStatus','ORDERED')
        },function(res,JWR){
          // TODO:visitorステータス、endTime更新
          io.socket.put('/visitor/' + vis.id,{
            companyId: vis.companyId,
            shopId: vis.shopId,
            seatId: vis.seatId,
            status: _proto.code.getCodeFromName('visitorStatus','EXTENDED'),
            endTime: moment(vis.endTime).add(parseInt(minutes,10),'minutes').format(),
            setTime: vis.setTime + parseInt(minutes,10)
          },function(res,err){
            console.log(res,JWR);
          });
        });
      });
      
      var _s4 = $('.btn_set_minutes_del');
      _s4.unbind();
      _s4.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-set-minutes').val('');
      });
      var _s5 = $('.btn_set_price_del');
      _s5.unbind();
      _s5.bind('click',function(e){
        e.preventDefault();
        $('#modal-form-order-set-price').val('');
      });
      
      _m.modal();
    };
    
    // 12/16 会計画面モーダル展開
    _proto.openPay = function(vis,cast,seat){
      var _m;
      _m = $('#modal-order-pay');
      
      // 前回表示していた内容をリセット
      var _s1 = _m.find('#modal-form-order-pay-table div');
      _s1.remove();
      
      var subtotal = 0;   // 小計
      var servicetax = 0; // サービス料
      var tax = 0;        // TAX
      var cardtax = 0;    // カード手数料
      var totalcash = 0;
      var totalcard = 0;
      // 各taxを検索（店舗マスタ）
      io.socket.get('/mshop',{ companyId: vis.companyId, shopId: vis.shopId },function(shop){
        if(shop[0] !== undefined) {
          
          io.socket.get('/detailrecord?limit=0',{ visitorId: vis.id, itemCategoryCd: {$ne:_proto.code.getCodeFromName('itemCategoryCd','PENALTY')}, sort:{ createdAt: 1 } },function(res){
            for(var c in res){
              if(c === "0") {
                $('#order-pay-time-from').text(res[c].orderTime);
                $('#order-pay-time-to').text(moment().format('HH:mm', new Date()));
              }
              // テンプレート行をclone
              var orderDiv = $('#modal-form-order-pay-template').clone();
              $('#modal-form-order-pay-table').append(orderDiv);
              // 追加した行を活性化
              $('#modal-form-order-pay-table div:last').css('display', '');
          
              $('.order-pay-1').eq(c).text(res[c].itemName);
              var buf = "× " + res[c].amount;
              $('.order-pay-2').eq(c).text(buf);
              $('.order-pay-3').eq(c).text(_proto.addFigure(res[c].totalPrice));
              $('.order-pay-4').eq(c).text(_proto.addFigure(res[c].price));
              subtotal = subtotal + res[c].totalPrice;
            }
            
            if(vis.serviceZeroFlg != '1') {
              // 4/28 サービス料 = 小計 × サービス料 / 100
              servicetax = subtotal * shop[0].tenpoTax2 / 100;
              servicetax = Math.floor(servicetax);
            }
            if(vis.taxZeroFlg != '1') {
              // 4/28 TAX = (小計+サービス料) × TAX / 100
              tax = (subtotal + servicetax) * shop[0].tenpoTax1 / 100;
              tax = Math.floor(tax);
            }
            if(vis.cardZeroFlg != '1') {
              // 4/28 カード手数料 = (小計+サービス料+TAX) × カード手数料 / 100
              cardtax = (subtotal + servicetax + tax) * shop[0].cardTax / 100;
              cardtax = Math.floor(cardtax);
            }
            
            $('#order-pay-subtotal').text(_proto.addFigure(subtotal));
            $('#order-pay-tax').text(_proto.addFigure(tax));
            $('#order-pay-cardtax').text(_proto.addFigure(cardtax));
            $('#order-pay-servicetax').text(_proto.addFigure(servicetax));
            totalcash = subtotal + servicetax + tax;
            totalcard = subtotal + servicetax + tax + cardtax;
            $('#order-pay-total-cash').text(_proto.addFigure(totalcash));
            $('#order-pay-total-card').text(_proto.addFigure(totalcard));
          });
          
        }
      });
      
      // 現金支払い
      var _s3 = $('#modal-form-order-pay-save-btn');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        _proto.paidVisitor(vis,totalcash,'1',function(){
          _m.modal('hide');
        });
      });
      
      // カード支払い
      var _s4 = $('#modal-form-order-pay-save-btn2');
      _s4.unbind();
      _s4.bind('click',function(e){
        e.preventDefault();
        _proto.paidVisitor(vis,totalcard,'0',function(){
          _m.modal('hide');
        });
      });
      
      _m.modal();
    };
    
    // 4/30 店舗毎権限モーダル画面展開
    _proto.openAccessStoreModal = function(oindex){
      var _m = $('#modal-access-store');
      var _form = _m.find('form');
      var _store = $('.accessmaster_store').eq(oindex-1).val().split(",");
      
      // 前回表示していた内容をリセット
      var _s1 = _m.find('#modal-form-access-store-table div');
      _s1.remove();
      
      // 店舗マスタから店舗を取得
      io.socket.get('/mshop',{ companyId: _proto.shopObj.companyId },function(shop){
        for(var c in shop){
          var storeDiv = $('#modal-form-access-store-template').clone();
          $('#modal-form-access-store-table').append(storeDiv);
          // 追加した行を活性化
          $('#modal-form-access-store-table div:last').css('display', '');
          
          $('.modal-form-access-store-check').eq(c).val(shop[c].id);
          // 初期化
          $('.modal-form-access-store-check').eq(c).attr("checked",false);
          for(var i in _store){
            // 選択店舗デフォルトチェック
            if(_store[i] == shop[c].id ){
              $('.modal-form-access-store-check').eq(c).attr("checked",true);
              break;
            }
          }
          $('.access-store-name').eq(c).text(shop[c].shopName);
        }
      });
      
      // OKボタン押下時
      var _s2 = $('#modal-form-access-store-save-btn');
      _s2.unbind();
      _s2.bind('click',function(e){
        e.preventDefault();
        
        // 元画面の該当行に選択したチェック情報をセット
        var index = $('.modal-form-access-store-check').parent().parent().index();
        var ret = '';
        for( var i=0; i<index; i++){
          // チェックされている店舗IDのみ貯めこむ
          if(_form.find('.modal-form-access-store-check').eq(i).attr("checked") !== undefined){
            if(ret == ''){
              ret = _form.find('.modal-form-access-store-check').eq(i).val();
            } else {
              ret = ret + ',' + _form.find('.modal-form-access-store-check').eq(i).val();
            }
          }
        }
        $('.accessmaster_store').eq(oindex-1).val(ret);
        
        _m.modal('hide');
      });
      
      _m.modal();
    };
    
    // 2/3 席追加モーダル画面展開
    _proto.openSeat = function(){
      var _m = $('#modal-seat');
      var _form = _m.find('form');
      
      var _s1 = $('#modal-form-seat-save-btn');
      _s1.unbind();
      _s1.bind('click',function(e){
        e.preventDefault();
        
        // 座席マスタ登録(一時テーブル)
        var max = _proto.transNullBlankToZero(_form.find('#modal-form-seat-max').val());
        io.socket.post('/mseats',{
          companyId: _proto.shopObj.companyId,
          shopId: _proto.shopObj.shopId,
          name: _form.find("#modal-form-seat-name").val(),
          max: max,
          isWait: false,
          tempFlag: '1'
        },function(res,JWR){
          console.log(res,JWR);
        });
      });
      
      _m.modal();
    };
    
    // 5/7 パスワード変更モーダル画面展開
    _proto.openPassword = function(oindex){
      var _m = $('#modal-member-password');
      var _form = _m.find('form');
      _m.find('.member-name').text($('.membermaster_name').eq(oindex-1).val());
      
      // 初期化
      $('#modal-form-member-password-password').val('');
      
      var _s1 = $('#modal-form-member-password-save-btn');
      _s1.unbind();
      _s1.bind('click',function(e){
        e.preventDefault();
        
        // 従業員マスタ更新（パスワードのみ）
        io.socket.put('/master_member/' + $(".membermaster_id").eq(oindex-1).val(), {
          password: _form.find("#modal-form-member-password-password").val()
        },function(res,JWR){
          console.log(res,JWR);
        });
      });
      
      _m.modal();
    };
    
    // 2/20 出退勤画面モーダル展開
    _proto.openPresence = function(cast){
      var _m = $('#modal-presence');
      var _form = _m.find('form');
      var buf = cast.name + ' ' + cast.c_time_fr + '～' + cast.c_time_to;
      
      var _s0 = _m.find('.modal-title');
      _s0.text(buf);
      
      var _s1 = _m.find('.form-presence-fr');
      _s1.find('option').remove();
      _proto.getPulldown_h(_s1);
      _s1.val(cast.cj_time_fr.substr(0,2));
      
      var _s2 = _m.find('.form-presence-to');
      _s2.find('option').remove();
      _proto.getPulldown_m(_s2);
      _s2.val(cast.cj_time_fr.substr(3,2));
      
      var _s3 = _m.find('.form-presence-fr2');
      _s3.find('option').remove();
      _proto.getPulldown_h(_s3);
      _s3.val(cast.cd_time.substr(0,2));
      
      var _s4 = _m.find('.form-presence-to2');
      _s4.find('option').remove();
      _proto.getPulldown_m(_s4);
      _s4.val(cast.cd_time.substr(3,2));
      
      var _s5 = _m.find('.form-presence-fr3');
      _s5.find('option').remove();
      _proto.getPulldown_h(_s5);
      _s5.val(cast.cj_time_to.substr(0,2));
      
      var _s6 = _m.find('.form-presence-to3');
      _s6.find('option').remove();
      _proto.getPulldown_m(_s6);
      _s6.val(cast.cj_time_to.substr(3,2));
      
      var _s7 = _m.find('.form-presence-status');
      _s7.find('option').remove();
      _s7.append($('<option>').attr('value','' ).text('通常'));
      _proto.findAllAppend(cast, function(res){
        for(var i=0; i<res.length;i++){
          var _ape = res[i];
          var _tmp = $('<option>').attr('value',_ape.appendId);
          _tmp.text(_ape.appendName);
          _s7.append(_tmp);
          
          // クリックしたキャストの出退勤状況を検索
          _proto.findCastAppend(cast, function(res){
            if(res[0] != undefined) {
              _s7.val(res[0].itemId);
            }
          });
        }
      });
      
      // 保存ボタン
      var _s8 = $('#modal-form-presence-save-btn');
      _s8.unbind();
      _s8.bind('click',function(e){
        e.preventDefault();
        
        var _cj_time_fr = _form.find('#modal-form-presence-fr').val() + ':' + _form.find('#modal-form-presence-to').val();
        var _cd_time = _form.find('#modal-form-presence-fr2').val() + ':' + _form.find('#modal-form-presence-to2').val();
        var _cj_time_to = _form.find('#modal-form-presence-fr3').val() + ':' + _form.find('#modal-form-presence-to3').val();
        var ape = _form.find('#modal-form-presence-status').val();
        
        var sta = '';
        if(_cj_time_to != ':') {
          sta = _proto.code.getCodeFromName('castStatus','FINISHED');
        } else if(_cj_time_fr != ':') {
          sta = _proto.code.getCodeFromName('castStatus','ON_THE_FLOOR');
        } else if(_cd_time != ':') {
          sta = _proto.code.getCodeFromName('castStatus','DOUHAN');
        } 
        
        io.socket.put('/castlady/' + cast.id,{
          status: sta,
          startTime: new Date(),
          cj_time_fr: _cj_time_fr,
          cd_time: _cd_time,
          cj_time_to: _cj_time_to
        },function(cas,err){
          console.log('CastLady update!',cas);
          
          // 出退勤状況が登録されている場合、削除
          _proto.findCastAppend(cast, function(append){
            if(append[0] != undefined) {
              io.socket.delete('/detailrecord',{ id: append[0].id },function(del,err){
                console.log('DetailRecord delete!',del,err);
              });
            }
          });
          
          // 出退勤状況が選択されている場合、登録
          if(ape != '') {
            // 出退勤マスタ検索
            io.socket.get('/master_append',{
              companyId: cast.companyId,
              tenpoId: cast.shopId,
              appendId: Number(ape)
            },function(app){
              io.socket.post('/detailrecord',{
                companyId: cast.companyId,
                shopId: cast.shopId,
                shopName: 'dummy',
                businessDate: 'dummy',
                orderDate: today,
                businessDateLabel: _proto.getDateDay(),
                castId: cas.id,
                castName: cas.name,
                itemCategoryCd: _proto.code.getCodeFromName('itemCategoryCd','APPEND'),
                itemId: ape,
                itemName: app[0].appendName,
                totalPrice: app[0].append
              },function(res,JWR){
                console.log('DetailRecord insert!',res,JWR);
                
                _proto.makeReload('CastLady,DetailRecord');
              });
            });
          } else {
            _proto.makeReload('CastLady,DetailRecord');
          }
        });
      });
      
      _m.modal();
    };
    
    // 2/13 他端末間画面同期マスタ登録/更新
    _proto.makeReload = function(db){
      io.socket.get('/mreload',{
        companyId: _proto.shopObj.companyId,
        shopId: _proto.shopObj.shopId,
      },function(res){
        
        var msg = '';
        if(res[0] !== undefined) {
          io.socket.put('/mreload/' + res[0].id,{
            companyId: _proto.shopObj.companyId,
            shopId: _proto.shopObj.shopId,
            accessDb: db
          },function(rel,err){
            msg = db + ':update reload!';
            console.log(msg,rel);
          });
        
        } else {
          io.socket.post('/mreload',{
            companyId: _proto.shopObj.companyId,
            shopId: _proto.shopObj.shopId,
            accessDb: db
          },function(rel,JWR){
            msg = db + ':insert reload!';
            console.log(msg,rel,JWR);
          });
        }
      });
    };
    
    // 2/3 一時テーブル削除
    _proto.deleteTempSeat = function(vis,_seat){
      io.socket.delete('/mseats/',{ id: _seat.id },function(res){
        console.log('mseats :'+ _seat.name +' 削除');
        if(vis !== null) {
          _proto.exitVisForced(vis,_seat);
        }
      });
    };
    
    // 指名キャンセル（detailrecord削除）
    _proto.exitChoosed = function(_id){
      io.socket.delete('/detailrecord/',{ id: _id },function(res){
        console.log('detailrecord :'+ _id +' 削除');
      });
    };
      
    // 強制退店⇒リセット機能として実装
    _proto.exitVisForced = function(vis,_seat){
      io.socket.put( '/visitor/' + vis.id, { status: '99', seatId: _seat.id }, function(res){
        console.log('visitor :'+ vis.name +' 退席');
      });
      // 12/8 detailrecord削除
      io.socket.get('/detailrecord?limit=0',{ visitorId: vis.id },function(res){
        for(var c in res){
          io.socket.delete('/detailrecord',{ id: res[c].id },function(res){
            console.log('detailrecord :'+ vis.id +' 削除');
          });
        }
      });
      io.socket.get('/castlady?limit=0',{ seated: vis.id },function(res){
        for(var c in res){
          _proto.unseatCast(res[c]);
        }
      });
    };
    
    
    // NSYS
    _proto.nshopObj = {}; //api/model/NShop.js
    _proto.allCustomerId = 'all_customer';
    _proto.allMobileId = 'mobile_all_customer';
    _proto.allCusAbsId = 'all_abs';
    _proto.allStaffId = 'all_staff';
    _proto.allAbsenceId = 'all_absence';
    _proto.ncompanyId = '';
    _proto.nshopId = '';
    _proto.mobileFlg = '';
    
    // 施設マスタ検索
    _proto.findNShop = function(cb){
      io.socket.get('/nshop', {
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId
      }, cb);
    };
    
    // オプションマスタ検索
    _proto.findNOption = function(cb){
      io.socket.get('/noption?limit=0', {
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId,
        sort:{ createdAt: 1 }
      }, cb);
    };
    
    // 営業時間マスタ検索
    _proto.findNRecep = function(cb){
      io.socket.get('/nrecep?limit=0', {
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId,
        sort:{ serviceOpening: 1 }
      }, cb);
    };
    
    // 来客テーブル検索
    _proto.findNVisitor = function(cb){
      io.socket.get('/nvisitor?limit=0', {
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId,
        sort:{ no: 1 }
      }, cb);
    };
    
    _proto.findCustomerDivByCid = function(cid){
      return $( '#' + this.allCustomerId ).find( '#' + 'cid-' + cid );
    };
    
    _proto.findMobileDivByCid = function(cid){
      return $( '#' + this.allMobileId ).find( '#' + 'cid-' + cid );
    };
    
    _proto.findCusAbsDivByCid = function(cid){
      return $( '#' + this.allCusAbsId ).find( '#' + 'cid-' + cid );
    };
    
    _proto.findStaffDivByCid = function(cid){
      return $( '#' + this.allStaffId ).find( '#' + 'cid-' + cid );
    };
    
    _proto.findAbsenceDivByCid = function(cid){
      return $( '#' + this.allAbsenceId ).find( '#' + 'cid-' + cid );
    };
    
    // 来客テーブル登録（英語版）
    _proto.createNVisitor_en = function(){
      var _option1 = '';
      var _option2 = '';
      var _option3 = '';
      var _option4 = '';
      if ($('#option1_en').css('display') == 'block') {
        _option1 = $("input[name='rdo1_en']:checked").val();
      }
      if ($('#option2_en').css('display') == 'block') {
        _option2 = $("input[name='rdo2_en']:checked").val();
      }
      if ($('#option3_en').css('display') == 'block') {
        _option3 = $("input[name='rdo3_en']:checked").val();
      }
      if ($('#option4_en').css('display') == 'block') {
        _option4 = $("input[name='rdo4_en']:checked").val();
      }
      
      var _newNo = 0;
      io.socket.get('/nvisitor?limit=0', {
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId,
        sort:{ no: -1 }
      },function(res){
        if(res[0] != undefined){
          _newNo = res[0].no + 1;
        } else {
          _newNo = 1;
        }
        
        io.socket.post('/nvisitor',{
          companyId: _proto.ncompanyId,
          shopId: _proto.nshopId,
          no: _newNo,
          name: $('#cus-name-en').val(),
          member: parseInt($('#cus-member-en').val(),10),
          option1: _option1,
          option2: _option2,
          option3: _option3,
          option4: _option4,
          origin: '',
          call: '',
          noFlg: ''
        },function(res,JWR){
          console.log(res,JWR);
          
          $('#inputform-en').css('display', 'none');
          $('#confirmation-en').css('display', '');
          $('#inputform2-en').css('display', 'none');
          $('#confirmation2-en').css('display', '');
          $('#confirmation_no-en').text(_newNo);
          
          // nshop検索（ならばないくんURL取得）
          var url = "";
          _proto.findNShop(function(shop){
            url = shop[0].gurl + '?id=' + res.id;
            
            $('#qcdemo1-en canvas').remove();
            // QRコードセット
    	      $('#qcdemo1-en').qrcode({
              width: 150,
              height: 150,
              text: url
            });
            
            // 30秒後に自動的に閉じる
            setTimeout(function(){
              $('#modal-nsys-customer-en').modal('hide');
            },30000);
          });
        });
      });
    };
    
    // 来客テーブル登録
    _proto.createNVisitor = function(){
      var _option1 = '';
      var _option2 = '';
      var _option3 = '';
      var _option4 = '';
      if ($('#option1').css('display') == 'block') {
        _option1 = $("input[name='rdo1']:checked").val();
      }
      if ($('#option2').css('display') == 'block') {
        _option2 = $("input[name='rdo2']:checked").val();
      }
      if ($('#option3').css('display') == 'block') {
        _option3 = $("input[name='rdo3']:checked").val();
      }
      if ($('#option4').css('display') == 'block') {
        _option4 = $("input[name='rdo4']:checked").val();
      }
      
      var _newNo = 0;
      io.socket.get('/nvisitor?limit=0', {
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId,
        sort:{ no: -1 }
      },function(res){
        if(res[0] != undefined){
          _newNo = res[0].no + 1;
        } else {
          _newNo = 1;
        }
        
        io.socket.post('/nvisitor',{
          companyId: _proto.ncompanyId,
          shopId: _proto.nshopId,
          no: _newNo,
          name: $('#cus-name').val(),
          member: parseInt($('#cus-member').val(),10),
          option1: _option1,
          option2: _option2,
          option3: _option3,
          option4: _option4,
          origin: '',
          call: '',
          noFlg: ''
        },function(add,JWR){
          console.log(add,JWR);
          
          $('#inputform').css('display', 'none');
          $('#confirmation').css('display', '');
          $('#inputform2').css('display', 'none');
          $('#confirmation2').css('display', '');
          $('#confirmation_no').text(_newNo);
          
          // nshop検索（ならばないくんURL取得）
          var url = "";
          _proto.findNShop(function(shop){
            url = shop[0].gurl + '?id=' + add.id;
            
            $('#qcdemo1 canvas').remove();
            // QRコードセット
    	      $('#qcdemo1').qrcode({
              width: 150,
              height: 150,
              text: url
            });
            
            // 60秒後に自動的に閉じる
            _proto.countdown(60);
            // setTimeout(function(){
            //   $('#modal-nsys-customer').modal('hide');
            // },30000);
          });
          
        });
      });
    };
    
    // カウントダウン処理
    _proto.countdown = function($count){
      $('#count').text($count);
      if($count) {
        setTimeout(function() {
          // 既に閉じられた場合、抜ける
          if($('#modal-nsys-customer')[0].style.display == 'none'){
            return;
          }
          
          $count = $count-1;
          _proto.countdown($count);
        }, 1000);
      } else {
        $('#modal-nsys-customer').modal('hide');
      }
    };
    
    // 来客テーブル登録(モバイル用)
    _proto.createMobVisitor = function(){
      var _option1 = '';
      var _option2 = '';
      var _option3 = '';
      var _option4 = '';
      if ($('#moboption1').css('display') == 'block') {
        _option1 = $("input[name='rdo1']:checked").val();
      }
      if ($('#moboption2').css('display') == 'block') {
        _option2 = $("input[name='rdo2']:checked").val();
      }
      if ($('#moboption3').css('display') == 'block') {
        _option3 = $("input[name='rdo3']:checked").val();
      }
      if ($('#moboption4').css('display') == 'block') {
        _option4 = $("input[name='rdo4']:checked").val();
      }
      
      var _newNo = 0;
      io.socket.get('/nvisitor?limit=0', {
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId,
        sort:{ no: -1 }
      },function(res){
        if(res[0] != undefined){
          _newNo = res[0].no + 1;
        } else {
          _newNo = 1;
        }
        
        io.socket.post('/nvisitor',{
          companyId: _proto.ncompanyId,
          shopId: _proto.nshopId,
          no: _newNo,
          name: $('#mob-name').val(),
          member: parseInt($('#mob-member').val(),10),
          option1: _option1,
          option2: _option2,
          option3: _option3,
          option4: _option4,
          origin: '1',
          call: '',
          noFlg: ''
        },function(add,JWR){
          // モバイル版のみ、cookieでidを保存
          if(add.id != undefined){
            $.cookie("KEY", add.id, { expires: 7 });
          }
          console.log(add,JWR);
        });
      });
    };
    
    // 来客テーブル登録(モバイル用・英語版)
    _proto.createMobVisitor_en = function(){
      var _option1 = '';
      var _option2 = '';
      var _option3 = '';
      var _option4 = '';
      if ($('#moboption1_en').css('display') == 'block') {
        _option1 = $("input[name='rdo1_en']:checked").val();
      }
      if ($('#moboption2_en').css('display') == 'block') {
        _option2 = $("input[name='rdo2_en']:checked").val();
      }
      if ($('#moboption3_en').css('display') == 'block') {
        _option3 = $("input[name='rdo3_en']:checked").val();
      }
      if ($('#moboption4_en').css('display') == 'block') {
        _option4 = $("input[name='rdo4_en']:checked").val();
      }
      
      var _newNo = 0;
      io.socket.get('/nvisitor?limit=0', {
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId,
        sort:{ no: -1 }
      },function(res){
        if(res[0] != undefined){
          _newNo = res[0].no + 1;
        } else {
          _newNo = 1;
        }
        
        io.socket.post('/nvisitor',{
          companyId: _proto.ncompanyId,
          shopId: _proto.nshopId,
          no: _newNo,
          name: $('#mob-name-en').val(),
          member: parseInt($('#mob-member-en').val(),10),
          option1: _option1,
          option2: _option2,
          option3: _option3,
          option4: _option4,
          origin: '1',
          call: '',
          noFlg: ''
        },function(add,JWR){
          // モバイル版のみ、cookieでidを保存
          if(add.id != undefined){
            $.cookie("KEY", add.id, { expires: 7 });
          }
          console.log(add,JWR);
        });
      });
    };
    
    // 不在処理
    _proto.updateNVisitor = function(cid,nflg){
      io.socket.put('/nvisitor/' + cid,{
        noFlg: nflg
      },function(res,JWR){
        console.log(res,JWR);
      });
    };
    
    // 呼出処理
    _proto.calledNvisitor = function(cid){
      io.socket.put('/nvisitor/' + cid,{
        call: cid
      },function(res,JWR){
        console.log(res,JWR);
      });
    };
    
    // 入店処理（nvisitor削除）
    _proto.deleteNVisitor = function(_id){
      io.socket.delete('/nvisitor/',{ id: _id },function(res){
        console.log('nvisitor :'+ _id +' 削除');
      });
    };
    
    // 施設マスタ登録/更新
    // オプション設定時、オプションマスタも削除/登録
    _proto.createShop = function(){
      console.log('createShop called.');
      
      var _opening = $("#master-tenpo-service-opening_h").val() + ":" + $("#master-tenpo-service-opening_m").val();
      var _closing = $("#master-tenpo-service-closing_h").val() + ":" + $("#master-tenpo-service-closing_m").val();
      var _mon = _proto.setCheckboxVal($("#master-tenpo-week-mon"));
      var _tue = _proto.setCheckboxVal($("#master-tenpo-week-tue"));
      var _wed = _proto.setCheckboxVal($("#master-tenpo-week-wed"));
      var _thu = _proto.setCheckboxVal($("#master-tenpo-week-thu"));
      var _fri = _proto.setCheckboxVal($("#master-tenpo-week-fri"));
      var _sat = _proto.setCheckboxVal($("#master-tenpo-week-sat"));
      var _sun = _proto.setCheckboxVal($("#master-tenpo-week-sun"));
      
      io.socket.get('/nshop',{
        companyId: _proto.ncompanyId,
        shopId: _proto.nshopId
      },function(res){
        if(res[0] !== undefined) {
          io.socket.put('/nshop/' + res[0].id,{
            companyId: res[0].companyId,
            shopId: res[0].shopId,
            shopName: $('#master-tenpo-name').val(),
            number: $('#master-tenpo-number').val(),
            tenpoAddress: $('#master-tenpo-address').val(),
            tenpoTel: $('#master-tenpo-tel').val(),
            fax: $('#master-tenpo-fax').val(),
            url: $('#master-tenpo-url').val(),
            gurl: $('#master-tenpo-gurl').val(),
            serviceOpening: _opening,
            serviceClosing: _closing,
            tenpoMon: _mon,
            tenpoTue: _tue,
            tenpoWed: _wed,
            tenpoThu: _thu,
            tenpoFri: _fri,
            tenpoSat: _sat,
            tenpoSun: _sun,
            waitT: parseInt($('#master-tenpo-wait').val(),10),
            m_id: $('#master-tenpo-mid').val()
          },function(upd,err){
            console.log(upd,err);
          });
        } else {
          io.socket.post('/nshop',{
            companyId: _proto.ncompanyId,
            shopId: _proto.nshopId,
            shopName: $('#master-tenpo-name').val(),
            number: $('#master-tenpo-number').val(),
            tenpoAddress: $('#master-tenpo-address').val(),
            tenpoTel: $('#master-tenpo-tel').val(),
            fax: $('#master-tenpo-fax').val(),
            url: $('#master-tenpo-url').val(),
            gurl: $('#master-tenpo-gurl').val(),
            serviceOpening: _opening,
            serviceClosing: _closing,
            tenpoMon: _mon,
            tenpoTue: _tue,
            tenpoWed: _wed,
            tenpoThu: _thu,
            tenpoFri: _fri,
            tenpoSat: _sat,
            tenpoSun: _sun,
            waitT: parseInt($('#master-tenpo-wait').val(),10),
            m_id: $('#master-tenpo-mid').val(),
            password: $('#master-tenpo-password').val(),
            tempFlg:''
          },function(cre,JWR){
            console.log(cre,JWR);
          });
        }
        
        // Deferredと後処理をコールバック外へ
        var df = $.Deferred();
        df.done(function(){
          for(var i=1; i<$('.option_title').length; i++){
            // タイトルが入力されているもののみ登録する
            if($(".option_title").eq(i).val() != ''){
              io.socket.post('/noption',{
                companyId: _proto.ncompanyId,
                shopId: _proto.nshopId,
                otitle: $(".option_title").eq(i).val(),
                oetitle: $(".option_title_en").eq(i).val(),
                oname1: $(".option_name1").eq(i).val(),
                oename1: $(".option_name1_en").eq(i).val(),
                omark1: $(".option_mark1").eq(i).val(),
                oname2: $(".option_name2").eq(i).val(),
                oename2: $(".option_name2_en").eq(i).val(),
                omark2: $(".option_mark2").eq(i).val(),
                oname3: $(".option_name3").eq(i).val(),
                oename3: $(".option_name3_en").eq(i).val(),
                omark3: $(".option_mark3").eq(i).val()
              },function(nop,JWR){
                console.log(nop,JWR);
              });
            }
          }
          
          // 営業時間マスタ登録
          _proto.createNRecep();
        });
        
        // オプションマスタ登録
        _proto.findNOption(function(opt){
          // 1件も存在しない場合、resolve
          if(opt.length == 0){
            df.resolve();
          }
          for(var c in opt){
            io.socket.delete('/noption',{ id: opt[c].id },function(del){
              console.log('noption :'+ opt[c].id +' 削除');
              
              // 全て削除したらresolve
              if(opt.length == parseInt(c,10)+1){
                df.resolve();
              }
            });
          }
        });
      });
    };
    
    // 営業時間マスタ削除/登録
    _proto.createNRecep = function(){
      // Deferredと後処理をコールバック外へ
      var df = $.Deferred();
      df.done(function(){
        var index = $('.master-tenpo-chk').parent().parent().length;
        for(var i=1; i<index; i++){
          var _opening = $(".master-tenpo-service-opening_h").eq(i).val() + ":" + $(".master-tenpo-service-opening_m").eq(i).val();
          var _closing = $(".master-tenpo-service-closing_h").eq(i).val() + ":" + $(".master-tenpo-service-closing_m").eq(i).val();
          var _mopening = $(".master-tenpo-mobile-opening_h").eq(i).val() + ":" + $(".master-tenpo-mobile-opening_m").eq(i).val();
          var _mclosing = $(".master-tenpo-mobile-closing_h").eq(i).val() + ":" + $(".master-tenpo-mobile-closing_m").eq(i).val();
          io.socket.post('/nrecep',{
            companyId: _proto.ncompanyId,
            shopId: _proto.nshopId,
            serviceOpening: _opening,
            serviceClosing: _closing,
            smartOpening: _mopening,
            smartClosing: _mclosing
          },function(nop,JWR){
            console.log(nop,JWR);
          });
        }
      });
      
      // 営業時間マスタ検索
      _proto.findNRecep(function(rec){
        // 1件も存在しない場合、resolve
        if(rec.length == 0){
          df.resolve();
        }
        for(var c in rec){
          io.socket.delete('/nrecep',{ id: rec[c].id },function(del){
            console.log('nrecep :'+ rec[c].id +' 削除');
            
            // 全て削除したらresolve
            if(rec.length == parseInt(c,10)+1){
              df.resolve();
            }
          });
        }
      });
    };
    
    // 新規受付モーダル画面展開（英語版）
    _proto.openCustomer_en = function(){
      var _m = $('#modal-nsys-customer-en');
      
      // 初期化
      $('#inputform-en').css('display', '');
      $('#confirmation-en').css('display', 'none');
      $('#inputform2-en').css('display', '');
      $('#confirmation2-en').css('display', 'none');
      $('#cus-name-en').val('');
      $('#cus-member-en').val('');
      
      // オプションマスタ検索
      _proto.findNOption(function(opt){
        for(var c in opt){
          switch (c) {
            case '0':
              $('#option1_en').css('display', '');
              $('#option1_rdoname1_en').prop('checked', true);
              $('#option1_opttitle_en').text(opt[c].oetitle);
              $('#option1_optname1_en').text(opt[c].oename1);
              $('#option1_optname2_en').text(opt[c].oename2);
              $('#option1_optname3_en').text(opt[c].oename3);
              $('#option1_rdoname1_en').val(opt[c].omark1);
              $('#option1_rdoname2_en').val(opt[c].omark2);
              $('#option1_rdoname3_en').val(opt[c].omark3);
              break;
              
            case '1':
              $('#option2_en').css('display', '');
              $('#option2_rdoname1_en').prop('checked', true);
              $('#option2_opttitle_en').text(opt[c].oetitle);
              $('#option2_optname1_en').text(opt[c].oename1);
              $('#option2_optname2_en').text(opt[c].oename2);
              $('#option2_optname3_en').text(opt[c].oename3);
              $('#option2_rdoname1_en').val(opt[c].omark1);
              $('#option2_rdoname2_en').val(opt[c].omark2);
              $('#option2_rdoname3_en').val(opt[c].omark3);
              break;
              
            case '2':
              $('#option3_en').css('display', '');
              $('#option3_rdoname1_en').prop('checked', true);
              $('#option3_opttitle_en').text(opt[c].oetitle);
              $('#option3_optname1_en').text(opt[c].oename1);
              $('#option3_optname2_en').text(opt[c].oename2);
              $('#option3_optname3_en').text(opt[c].oename3);
              $('#option3_rdoname1_en').val(opt[c].omark1);
              $('#option3_rdoname2_en').val(opt[c].omark2);
              $('#option3_rdoname3_en').val(opt[c].omark3);
              break;
              
            case '3':
              $('#option4_en').css('display', '');
              $('#option4_rdoname1_en').prop('checked', true);
              $('#option4_opttitle_en').text(opt[c].oetitle);
              $('#option4_optname1_en').text(opt[c].oename1);
              $('#option4_optname2_en').text(opt[c].oename2);
              $('#option4_optname3_en').text(opt[c].oename3);
              $('#option4_rdoname1_en').val(opt[c].omark1);
              $('#option4_rdoname2_en').val(opt[c].omark2);
              $('#option4_rdoname3_en').val(opt[c].omark3);
              break;
              
            default:
              console.log('想定外の件数が検索されました。');
          }
        }
      });
      
      // 名前クリアボタン
      var _s1 = $('#btn_name_del_en');
      _s1.unbind();
      _s1.bind('click',function(e){
        e.preventDefault();
        
        $('#cus-name-en').val('');
      });
      
      // 名前1文字クリアボタン
      var _s2 = $('#btn_name_del-1_en');
      _s2.unbind();
      _s2.bind('click',function(e){
        e.preventDefault();
        
        $('#cus-name-en').val($('#cus-name-en').val().slice(0, -1));
      });
      
      // 人数クリアボタン
      var _s3 = $('#btn_member_del_en');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        $('#cus-member-en').val('');
      });
      
      // ＯＫボタン
      var _s4 = $('#modal-form-nsys-customer-save-btn-en');
      _s4.unbind();
      _s4.bind('click',function(e){
        e.preventDefault();
        
        _proto.createNVisitor_en();
      });
      
      _m.modal();
    };
    
    // 新規受付モーダル画面展開
    _proto.openCustomer = function(){
      var _m = $('#modal-nsys-customer');
      
      // 初期化
      $('#inputform').css('display', '');
      $('#confirmation').css('display', 'none');
      $('#inputform2').css('display', '');
      $('#confirmation2').css('display', 'none');
      $('#cus-name').val('');
      $('#cus-member').val('');
      $('#count').text('');
      
      // オプションマスタ検索
      _proto.findNOption(function(opt){
        for(var c in opt){
          switch (c) {
            case '0':
              $('#option1').css('display', '');
              $('#option1_rdoname1').prop('checked', true);
              $('#option1_opttitle').text(opt[c].otitle);
              $('#option1_optname1').text(opt[c].oname1);
              $('#option1_optname2').text(opt[c].oname2);
              $('#option1_optname3').text(opt[c].oname3);
              $('#option1_rdoname1').val(opt[c].omark1);
              $('#option1_rdoname2').val(opt[c].omark2);
              $('#option1_rdoname3').val(opt[c].omark3);
              break;
              
            case '1':
              $('#option2').css('display', '');
              $('#option2_rdoname1').prop('checked', true);
              $('#option2_opttitle').text(opt[c].otitle);
              $('#option2_optname1').text(opt[c].oname1);
              $('#option2_optname2').text(opt[c].oname2);
              $('#option2_optname3').text(opt[c].oname3);
              $('#option2_rdoname1').val(opt[c].omark1);
              $('#option2_rdoname2').val(opt[c].omark2);
              $('#option2_rdoname3').val(opt[c].omark3);
              break;
              
            case '2':
              $('#option3').css('display', '');
              $('#option3_rdoname1').prop('checked', true);
              $('#option3_opttitle').text(opt[c].otitle);
              $('#option3_optname1').text(opt[c].oname1);
              $('#option3_optname2').text(opt[c].oname2);
              $('#option3_optname3').text(opt[c].oname3);
              $('#option3_rdoname1').val(opt[c].omark1);
              $('#option3_rdoname2').val(opt[c].omark2);
              $('#option3_rdoname3').val(opt[c].omark3);
              break;
              
            case '3':
              $('#option4').css('display', '');
              $('#option4_rdoname1').prop('checked', true);
              $('#option4_opttitle').text(opt[c].otitle);
              $('#option4_optname1').text(opt[c].oname1);
              $('#option4_optname2').text(opt[c].oname2);
              $('#option4_optname3').text(opt[c].oname3);
              $('#option4_rdoname1').val(opt[c].omark1);
              $('#option4_rdoname2').val(opt[c].omark2);
              $('#option4_rdoname3').val(opt[c].omark3);
              break;
              
            default:
              console.log('想定外の件数が検索されました。');
          }
        }
      });
      
      // 名前クリアボタン
      var _s1 = $('#btn_name_del');
      _s1.unbind();
      _s1.bind('click',function(e){
        e.preventDefault();
        
        $('#cus-name').val('');
      });
      
      // 名前1文字クリアボタン
      var _s2 = $('#btn_name_del-1');
      _s2.unbind();
      _s2.bind('click',function(e){
        e.preventDefault();
        
        $('#cus-name').val($('#cus-name').val().slice(0, -1));
      });
      
      // 人数クリアボタン
      var _s3 = $('#btn_member_del');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        $('#cus-member').val('');
      });
      
      // ＯＫボタン
      var _s4 = $('#modal-form-nsys-customer-save-btn');
      _s4.unbind();
      _s4.bind('click',function(e){
        e.preventDefault();
        
        _proto.createNVisitor();
      });
      
      _m.modal();
    };
    
    // 新規受付モーダル画面展開(モバイル用)
    _proto.openMobile = function(){
      var _m = $('#modal-nsys-mobile');
      
      // 初期化
      $('#mob-name').val('');
      $('#mob-member').val('');
      
      // オプションマスタ検索
      _proto.findNOption(function(opt){
        for(var c in opt){
          switch (c) {
            case '0':
              $('#moboption1').css('display', '');
              $('#moboption1_rdoname1').prop('checked', true);
              $('#moboption1_opttitle').text(opt[c].otitle);
              $('#moboption1_optname1').text(opt[c].oname1);
              $('#moboption1_optname2').text(opt[c].oname2);
              $('#moboption1_optname3').text(opt[c].oname3);
              $('#moboption1_rdoname1').val(opt[c].omark1);
              $('#moboption1_rdoname2').val(opt[c].omark2);
              $('#moboption1_rdoname3').val(opt[c].omark3);
              break;
              
            case '1':
              $('#moboption2').css('display', '');
              $('#moboption2_rdoname1').prop('checked', true);
              $('#moboption2_opttitle').text(opt[c].otitle);
              $('#moboption2_optname1').text(opt[c].oname1);
              $('#moboption2_optname2').text(opt[c].oname2);
              $('#moboption2_optname3').text(opt[c].oname3);
              $('#moboption2_rdoname1').val(opt[c].omark1);
              $('#moboption2_rdoname2').val(opt[c].omark2);
              $('#moboption2_rdoname3').val(opt[c].omark3);
              break;
              
            case '2':
              $('#moboption3').css('display', '');
              $('#moboption3_rdoname1').prop('checked', true);
              $('#moboption3_opttitle').text(opt[c].otitle);
              $('#moboption3_optname1').text(opt[c].oname1);
              $('#moboption3_optname2').text(opt[c].oname2);
              $('#moboption3_optname3').text(opt[c].oname3);
              $('#moboption3_rdoname1').val(opt[c].omark1);
              $('#moboption3_rdoname2').val(opt[c].omark2);
              $('#moboption3_rdoname3').val(opt[c].omark3);
              break;
              
            case '3':
              $('#moboption4').css('display', '');
              $('#moboption4_rdoname1').prop('checked', true);
              $('#moboption4_opttitle').text(opt[c].otitle);
              $('#moboption4_optname1').text(opt[c].oname1);
              $('#moboption4_optname2').text(opt[c].oname2);
              $('#moboption4_optname3').text(opt[c].oname3);
              $('#moboption4_rdoname1').val(opt[c].omark1);
              $('#moboption4_rdoname2').val(opt[c].omark2);
              $('#moboption4_rdoname3').val(opt[c].omark3);
              break;
              
            default:
              console.log('想定外の件数が検索されました。');
          }
        }
      });
      
      // 名前クリアボタン
      var _s1 = $('#btn_mobname_del');
      _s1.unbind();
      _s1.bind('click',function(e){
        e.preventDefault();
        
        $('#mob-name').val('');
      });
      
      // 人数クリアボタン
      var _s2 = $('#btn_mobmember_del');
      _s2.unbind();
      _s2.bind('click',function(e){
        e.preventDefault();
        
        $('#mob-member').val('');
      });
      
      // ＯＫボタン
      var _s3 = $('#modal-form-nsys-mobile-save-btn');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        _proto.createMobVisitor();
      });
      
      // 名前入力制限
      var _s4 = $('#mob-name');
      _s4.unbind();
      _s4.bind('blur',function(e){
        e.preventDefault();
        
        var nameKana = _s4.val();
        $("#kana_alert").text('');
        
        if(nameKana == '') {
          $("#kana_alert").text("お名前（カナ）を入力して下さい。");
        } else if(!nameKana.match(/^[ァ-ロワヲンー 　\r\n\t]*$/)){
          // カタカナ、ー、全角半角スペースを許可
          $("#kana_alert").text("お名前（カナ）は全角カタカナで入力して下さい。");
        }
      });
      
      // 名前入力制限
      var _s5 = $('#mob-member');
      _s5.unbind();
      _s5.bind('blur',function(e){
        e.preventDefault();
        
        var memNum = _s5.val();
        $("#num_alert").text('');
        
        if(memNum == '') {
          $("#num_alert").text("人数を入力して下さい。");
        } else if(!memNum.match(/^[0-9]+$/)){
          // 数字のみ許可
          $("#num_alert").text("人数は半角数字で入力して下さい。");
        }
      });
      
      _m.modal();
    };
    
    // 新規受付モーダル画面展開(モバイル用・英語版)
    _proto.openMobile_en = function(){
      var _m = $('#modal-nsys-mobile-en');
      
      // 初期化
      $('#mob-name-en').val('');
      $('#mob-member-en').val('');
      
      // オプションマスタ検索
      _proto.findNOption(function(opt){
        for(var c in opt){
          switch (c) {
            case '0':
              $('#moboption1_en').css('display', '');
              $('#moboption1_rdoname1_en').prop('checked', true);
              $('#moboption1_opttitle_en').text(opt[c].oetitle);
              $('#moboption1_optname1_en').text(opt[c].oename1);
              $('#moboption1_optname2_en').text(opt[c].oename2);
              $('#moboption1_optname3_en').text(opt[c].oename3);
              $('#moboption1_rdoname1_en').val(opt[c].omark1);
              $('#moboption1_rdoname2_en').val(opt[c].omark2);
              $('#moboption1_rdoname3_en').val(opt[c].omark3);
              break;
              
            case '1':
              $('#moboption2_en').css('display', '');
              $('#moboption2_rdoname1_en').prop('checked', true);
              $('#moboption2_opttitle_en').text(opt[c].oetitle);
              $('#moboption2_optname1_en').text(opt[c].oename1);
              $('#moboption2_optname2_en').text(opt[c].oename2);
              $('#moboption2_optname3_en').text(opt[c].oename3);
              $('#moboption2_rdoname1_en').val(opt[c].omark1);
              $('#moboption2_rdoname2_en').val(opt[c].omark2);
              $('#moboption2_rdoname3_en').val(opt[c].omark3);
              break;
              
            case '2':
              $('#moboption3_en').css('display', '');
              $('#moboption3_rdoname1_en').prop('checked', true);
              $('#moboption3_opttitle_en').text(opt[c].oetitle);
              $('#moboption3_optname1_en').text(opt[c].oename1);
              $('#moboption3_optname2_en').text(opt[c].oename2);
              $('#moboption3_optname3_en').text(opt[c].oename3);
              $('#moboption3_rdoname1_en').val(opt[c].omark1);
              $('#moboption3_rdoname2_en').val(opt[c].omark2);
              $('#moboption3_rdoname3_en').val(opt[c].omark3);
              break;
              
            case '3':
              $('#moboption4_en').css('display', '');
              $('#moboption4_rdoname1_en').prop('checked', true);
              $('#moboption4_opttitle_en').text(opt[c].oetitle);
              $('#moboption4_optname1_en').text(opt[c].oename1);
              $('#moboption4_optname2_en').text(opt[c].oename2);
              $('#moboption4_optname3_en').text(opt[c].oename3);
              $('#moboption4_rdoname1_en').val(opt[c].omark1);
              $('#moboption4_rdoname2_en').val(opt[c].omark2);
              $('#moboption4_rdoname3_en').val(opt[c].omark3);
              break;
              
            default:
              console.log('想定外の件数が検索されました。');
          }
        }
      });
      
      // 名前クリアボタン
      var _s1 = $('#btn_mobname_del_en');
      _s1.unbind();
      _s1.bind('click',function(e){
        e.preventDefault();
        
        $('#mob-name-en').val('');
      });
      
      // 人数クリアボタン
      var _s2 = $('#btn_mobmember_del_en');
      _s2.unbind();
      _s2.bind('click',function(e){
        e.preventDefault();
        
        $('#mob-member-en').val('');
      });
      
      // ＯＫボタン
      var _s3 = $('#modal-form-nsys-mobile-save-btn-en');
      _s3.unbind();
      _s3.bind('click',function(e){
        e.preventDefault();
        
        _proto.createMobVisitor_en();
      });
      
      // 名前入力制限
      var _s4 = $('#mob-name-en');
      _s4.unbind();
      _s4.bind('blur',function(e){
        e.preventDefault();
        
        var nameKana = _s4.val();
        $("#kana_alert_en").text('');
        
        if(nameKana == '') {
          $("#kana_alert_en").text("Please input name.");
        } else if(nameKana.match(/[^0-9A-Za-z]+/)){
          // 半角英数を許可
          $("#kana_alert_en").text("Please input with a half size British number.");
        }
      });
      
      // 名前入力制限
      var _s5 = $('#mob-member-en');
      _s5.unbind();
      _s5.bind('blur',function(e){
        e.preventDefault();
        
        var memNum = _s5.val();
        $("#num_alert_en").text('');
        
        if(memNum == '') {
          $("#num_alert_en").text("Please input member.");
        } else if(!memNum.match(/^[0-9]+$/)){
          // 数字のみ許可
          $("#num_alert_en").text("Please input with a half size number.");
        }
      });
      
      _m.modal();
    };
    
    // パスワード変更モーダル画面展開
    _proto.openPasswordNsys = function(){
      var _m = $('#modal-member-password');
      var _form = _m.find('form');
      _m.find('.member-name').text($('#master-tenpo-name').val());
      
      // 初期化
      $('#modal-form-member-password-password').val('');
      
      var _s1 = $('#modal-form-member-password-save-btn');
      _s1.unbind();
      _s1.bind('click',function(e){
        e.preventDefault();
        
        if(!confirm("パスワードを変更しますか？")){
          return false;
        }
        
        // 施設マスタ更新（パスワードのみ）
        io.socket.put('/nshop/' + $("#master-tenpo-id").val(), {
          password: _form.find("#modal-form-member-password-password").val()
        },function(res,JWR){
          console.log(res,JWR);
        });
      });
      
      _m.modal();
    };
    
    // 受付停止/再開
    _proto.stopNvisitor = function(){
      _proto.findNShop(function(shop){
        var _stopFlg = '';
        if(shop[0].stopFlg == ''){
          _stopFlg = '1';
        }
        io.socket.put('/nshop/' + shop[0].id,{
            stopFlg: _stopFlg
          },function(upd,err){
            console.log(upd,err);
          });
      });
    };
    
    // 1/5 数値カンマ区切り
    _proto.addFigure = function(str){
      var num = new String(str).replace(/,/g, "");
      while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
      return num;
    };
    
    // 数値項目nullブランク対応
    _proto.transNullBlankToZero = function(obj){
      var res = obj;
      if(obj == null || obj == '') {
        res = 0;
      }
      return res;
    };
    
    // プルダウン時間範囲取得(00-40)
    _proto.getPulldown_h = function(obj) {
      var o_hour = '<option value=""></option>';
      var hour = "";
      for( var i=0; i<36; i++){
        if( i < 10) {
          hour = "0" + i;
        } else {
          hour = i;
        }
        o_hour = o_hour + '<option value="' + hour + '">' + hour + '</option>';
      }
      obj.append(o_hour);
    };
    
    // プルダウン分範囲取得(00-59)
    _proto.getPulldown_m = function(obj) {
      var o_min = '<option value=""></option>';
      var min = "";
      for( var i=0; i<60; i++){
        if( i < 10) {
          min = "0" + i;
        } else {
          min = i;
        }
        o_min = o_min + '<option value="' + min + '">' + min + '</option>';
      }
      obj.append(o_min);
    };
    
    // プルダウン分範囲取得(10分単位)
    _proto.getPulldown_m10 = function(obj) {
      var o_min = '<option value=""></option>';
      var min = "";
      for( var i=0; i<=60; i= i+10){
        if( i < 10) {
          min = "0" + i;
        } else {
          min = i;
        }
        o_min = o_min + '<option value="' + min + '">' + min + '</option>';
      }
      obj.append(o_min);
    };
    
    // チェックボックスの値を取得する
    _proto.setCheckboxVal = function(obj) {
      if(obj.attr("checked") !== undefined){
        return obj.val();
      } else {
        return "";
      }
    };
    
    // チェックボックスON判定
    _proto.checkboxCheck = function(day,obj) {
      if(day == obj.val()) {
        obj.attr("checked",true);
      }
    };
    
  }
 //////exports
    window.KsWidgetTmpl = KsWidgetTmpl;
})(window);