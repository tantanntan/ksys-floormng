(function() {
  
  var main = {};
  var _k_id = "00001";
  var date = new Date();
  // 12/8 日またぎ対応：0-8時までは前日を取得
  if(date.getHours() < 9) {
    date.setDate(date.getDate() - 1);
  }
  var yy = date.getFullYear();
  var mm = ('0' + (date.getMonth() + 1)).slice(-2);
  var dd = ('0' + date.getDate()).slice(-2);
  var today = yy + mm + dd;
  var today_sla = yy + '/' + mm + '/' + dd;
  var _day = "";
  
  var _wt = new KsWidgetTmpl();
  
  // 初期表示
  main.loaded = function() {
    
    // データ読み込み
    dataLoad();
    
    _wt.initAccessStoreModals();
    
    // 4/30 【権限マスタ管理】店舗情報管理チェック時
    $('.accessmaster_store_link').live("click", function(){
      var index = $(this).parent().parent().index();
      // 店舗毎権限モーダル画面展開、チェック方法セット
      _wt.openAccessStoreModal(index);
    });
    
    // 3/3【営業準備画面】「準備完了」ボタン押下時
    $('#btn_createReady2').live("click", function(){
      
      if(!confirm("準備完了処理を行います。よろしいですか？")){
        return false;
      }
      
      createReady2();
    });
    
    
    // 【キャスト管理画面】キャスト管理行に行追加
    $('#btn_castmaster_add').live("click", function(){
      
      var incnt = $('.btn_castmaster_del').parent().parent().index();
      
      var castmaster_Div = $('#castmaster_template').clone();
      $('#castmaster_table').append(castmaster_Div);
      
      // 追加した行を活性化
      $( '#castmaster_table tr:last' ).css('display', '');
      
      // プルダウン内容追加
      getPulldown_h($('.castmaster_time_fr_h').eq(incnt));
      getPulldown_m($('.castmaster_time_fr_m').eq(incnt));
      getPulldown_h($('.castmaster_time_to_h').eq(incnt));
      getPulldown_m($('.castmaster_time_to_m').eq(incnt));
      
      // カレンダーアイコン追加
      makeCalender($(".castmaster_startday").eq(incnt));
      makeCalender($(".castmaster_endday").eq(incnt));
      makeCalender($(".castmaster_birthday").eq(incnt));
    });
    
    // 【キャスト管理画面】キャスト管理行削除
    $('.btn_castmaster_del').live("click", function(){
      
      var index = $(this).parent().parent().index();
      var _id = $(".castmaster_c_id").eq(index-1).val();
      if(_id != '') {
        if(!confirm("このキャストを削除します。よろしいですか？")){
          return false;
        }
        io.socket.delete('/mcast/',{ id: _id },function(res){
          console.log('MCast 削除');
          
          makeReload('MCast');
        });
      }
      $('table#castmaster_table tr').eq(index).remove();
      
    });
    
    // 【キャスト管理画面】カレンダー値削除
    $('.btn_castmaster_startday_del').live("click", function(){
      clearCalenderVal($(this),$(".castmaster_startday"));
    });
    $('.btn_castmaster_birthday_del').live("click", function(){
      clearCalenderVal($(this),$(".castmaster_birthday"));
    });
    $('.btn_castmaster_endday_del').live("click", function(){
      clearCalenderVal($(this),$(".castmaster_endday"));
    });
    
    // 5/7【キャスト管理画面】パスワード変更モーダル画面起動
    $('.membermaster_password').live("focus", function(){
      var index = $(this).parent().parent().index();
      if($('.membermaster_id').eq(index-1).val() != ''){
        _wt.openPassword(index);
      }
      
    });
    
    // 【キャスト管理画面】「登録」ボタン押下時
    $('#btn_castmaster_create').live("click", function(){
      
      if(!confirm("画面の内容でキャストマスタを登録します。よろしいですか？")){
        return false;
      }
      
      var index = $('.castmaster_truename').parent().parent().index();
      
      // テンプレート行が存在するため、1からスタート
      for( var i=1; i<index; i++){
        // 項目チェック
        
        // 1/30 キャストID取得
        var _c_id = $(".castmaster_c_id").eq(i).val();
        var mon = setCheckboxVal($(".castmaster_mon").eq(i));
        var tue = setCheckboxVal($(".castmaster_tue").eq(i));
        var wed = setCheckboxVal($(".castmaster_wed").eq(i));
        var thu = setCheckboxVal($(".castmaster_thu").eq(i));
        var fri = setCheckboxVal($(".castmaster_fri").eq(i));
        var sat = setCheckboxVal($(".castmaster_sat").eq(i));
        var sun = setCheckboxVal($(".castmaster_sun").eq(i));
        var c_time_fr = $(".castmaster_time_fr_h").eq(i).val() + ":" + $(".castmaster_time_fr_m").eq(i).val();
        var c_time_to = $(".castmaster_time_to_h").eq(i).val() + ":" + $(".castmaster_time_to_m").eq(i).val();
        
        // 1/30 キャストIDに値が入っている場合、更新処理を行う
        if(_c_id != '') {
          io.socket.put('/mcast/' + _c_id, {
            k_id: _k_id,
            t_id: $(".castmaster_t_name").eq(i).val(),
            gname: $(".castmaster_castname").eq(i).val(),
            name: $(".castmaster_truename").eq(i).val(),
            basehour: $(".castmaster_basehour").eq(i).val(),
            trans: $(".castmaster_trans").eq(i).val(),
            startday: $(".castmaster_startday").eq(i).val(),
            endday: $(".castmaster_endday").eq(i).val(),
            birthday: $(".castmaster_birthday").eq(i).val(),
            address: $(".castmaster_address").eq(i).val(),
            tel: $(".castmaster_tel").eq(i).val(),
            mail: $(".castmaster_mail").eq(i).val(),
            mon: mon,
            tue: tue,
            wed: wed,
            thu: thu,
            fri: fri,
            sat: sat,
            sun: sun,
            c_time_from: c_time_fr,
            c_time_to: c_time_to
          },function(res,JWR){
            console.log('MCast update!',res,JWR);
          });
          
        } else {
          // 登録処理
          io.socket.post('/mcast', {
            k_id: _k_id,
            t_id: $(".castmaster_t_name").eq(i).val(),
            gname: $(".castmaster_castname").eq(i).val(),
            name: $(".castmaster_truename").eq(i).val(),
            basehour: $(".castmaster_basehour").eq(i).val(),
            trans: $(".castmaster_trans").eq(i).val(),
            startday: $(".castmaster_startday").eq(i).val(),
            endday: $(".castmaster_endday").eq(i).val(),
            birthday: $(".castmaster_birthday").eq(i).val(),
            address: $(".castmaster_address").eq(i).val(),
            tel: $(".castmaster_tel").eq(i).val(),
            mail: $(".castmaster_mail").eq(i).val(),
            mon: mon,
            tue: tue,
            wed: wed,
            thu: thu,
            fri: fri,
            sat: sat,
            sun: sun,
            c_time_from: c_time_fr,
            c_time_to: c_time_to
          },function(res,JWR){
            console.log('MCast insert!',res,JWR);
          });
        }
      }
      
      makeReload('MCast');
    });
    
    
    // 【マスタ管理画面】各リンク押下時の展開/収納処理
    $('#master_member').live("click", function(){
      
      $('#master_member').toggleClass("link");
      $('#master_member').toggleClass("link2");
      if($('#membermaster_div').css('display') == 'none') {
        $('#membermaster_div').css('display','');
        
        // 従業員マスタ検索
        io.socket.get('/MainPage/getMemberMaster', {
          k_id: _k_id
        }, function(data) {
          // 【従業員管理画面】従業員全員を表示
          var membercnt = 1;
      
          $.each(data.member, function() {
            // 【キャスト管理画面】キャストマスタテンプレートをclone
            var membermaster_Div = $('#membermaster_template').clone();
            $('#membermaster_table').append(membermaster_Div);
            // 追加した行を活性化
            $( '#membermaster_table tr:last' ).css('display', '');
            $('.membermaster_name').eq(membercnt).val(this.name);
            $('.membermaster_id').eq(membercnt).val(this.id);     // 4/15 id
            $('.membermaster_m_id').eq(membercnt).val(this.m_id);
            $('.membermaster_tel').eq(membercnt).val(this.tel);
            $('.membermaster_mail').eq(membercnt).val(this.mail);
            $('.membermaster_password').eq(membercnt).val(this.password);
            $('.membermaster_accesslv').eq(membercnt).val(this.accesslv);
            
            membercnt++;
          });
        });
        
      } else {
        $('#membermaster_div').css('display','none');
        
        // 【マスタ管理画面】企業単位従業員
        var delindex = $('.btn_membermaster_del').parent().parent().index();
        for( var i = 1; i < delindex; i++ ) {
          $("#membermaster_table tr:last").remove();
        }
      }
    });
    
    // 【権限管理画面】
    $('#master_access').live("click", function(){
      
      $('#master_access').toggleClass("link");
      $('#master_access').toggleClass("link2");
      if($('#accessmaster_div').css('display') == 'none') {
        $('#accessmaster_div').css('display','');
      } else {
        $('#accessmaster_div').css('display','none');
      }
    });
    
    // 【従業員管理画面】従業員管理行に行追加
    $('#btn_membermaster_add').live("click", function(){
      
      var membermaster_Div = $('#membermaster_template').clone();
      $('#membermaster_table').append(membermaster_Div);
      
      // 追加した行を活性化
      $( '#membermaster_table tr:last' ).css('display', '');
    });
    
    // 【従業員管理画面】従業員管理行削除
    $('.btn_membermaster_del').live("click", function(){
      
      var index = $(this).parent().parent().index();
      var _id = $(".membermaster_id").eq(index-1).val();
      if(_id != '') {
        if(!confirm("この従業員を削除します。よろしいですか？")){
          return false;
        }
        io.socket.delete('/master_member/',{ id: _id },function(res){
          console.log('従業員マスタ 削除');
          
          makeReload('Master_member');
        });
      }
      $('table#membermaster_table tr').eq(index).remove();
    });
    
    // 【従業員管理画面】「登録」ボタン押下時
    $('#btn_membermaster_create').live("click", function(){
      if(!confirm("画面の内容で従業員マスタを登録します。よろしいですか？")){
        return false;
      }
      
      var index = $('.membermaster_name').parent().parent().index();
      
      // テンプレート行が存在するため、1からスタート
      for( var i=1; i<index; i++){
        // 項目チェック
        var _id = $(".membermaster_id").eq(i).val();
        
        // 4/15 IDに値が入っている場合、更新処理を行う
        if(_id != '') {
          io.socket.put('/master_member/' + _id, {
            k_id: _k_id,
            shopId: '',
            m_id: $(".membermaster_m_id").eq(i).val(),
            //password: $(".membermaster_password").eq(i).val(),
            name: $(".membermaster_name").eq(i).val(),
            accesslv: $(".membermaster_accesslv").eq(i).val(),
            tel: $(".membermaster_tel").eq(i).val(),
            mail: $(".membermaster_mail").eq(i).val()
          },function(res,JWR){
            console.log('従業員マスタ update!',res,JWR);
          });
          
        } else {
          // 登録処理
          io.socket.post('/master_member', {
            k_id: _k_id,
            shopId: '',
            m_id: $(".membermaster_m_id").eq(i).val(),
            password: $(".membermaster_password").eq(i).val(),
            name: $(".membermaster_name").eq(i).val(),
            accesslv: $(".membermaster_accesslv").eq(i).val(),
            tel: $(".membermaster_tel").eq(i).val(),
            mail: $(".membermaster_mail").eq(i).val()
          },function(res,JWR){
            console.log('従業員マスタ insert!',res,JWR);
          });
        }
      }
      
      makeReload('Master_member');
    });
    
    
    // 【権限マスタ管理画面】権限マスタ管理行に行追加
    $('#btn_accessmaster_add').live("click", function(){
      
      var accessmaster_Div = $('#accessmaster_template').clone();
      $('#accessmaster_table').append(accessmaster_Div);
      
      // 追加した行を活性化
      $( '#accessmaster_table tr:last' ).css('display', '');
    });
    
    // 【権限マスタ管理画面】権限マスタ管理行削除
    $('.btn_accessmaster_del').live("click", function(){
      
      var index = $(this).parent().parent().index();
      var _id = $(".accessmaster_id").eq(index-1).val();
      if(_id != '') {
        if(!confirm("この権限を削除します。\n削除した場合、この権限を持つ従業員の権限がリセットされます。本当によろしいですか？")){
          return false;
        }
        io.socket.delete('/master_accesslv/',{ id: _id },function(res){
          console.log('権限マスタ 削除');
          
          makeReload('Master_Accesslv');
        });
      }
      $('table#accessmaster_table tr').eq(index).remove();
    });
    
    // 【権限マスタ管理画面】「登録」ボタン押下時
    $('#btn_accessmaster_create').live("click", function(){
      if(!confirm("画面の内容で権限マスタを登録します。よろしいですか？")){
        return false;
      }
      
      var index = $('.accessmaster_accessname').parent().parent().index();
      
      var accessmaster_id = 0;
      
      // テンプレート行が存在するため、1からスタート
      for( var i=1; i<index; i++){
        // 項目チェック
        var _id = $(".accessmaster_id").eq(i).val();
        var accessname = $(".accessmaster_accessname").eq(i).val();
        // 権限IDを振り直す(1-)
        accessmaster_id++;
        
        var check1 = setCheckboxVal($(".accessmaster_check1").eq(i));
        var check2 = setCheckboxVal($(".accessmaster_check2").eq(i));
        var check3 = setCheckboxVal($(".accessmaster_check3").eq(i));
        var check4 = setCheckboxVal($(".accessmaster_check4").eq(i));
        var check5 = setCheckboxVal($(".accessmaster_check5").eq(i));
        var accshop =  $(".accessmaster_store").eq(i).val();
        var check6 = setCheckboxVal($(".accessmaster_check6").eq(i));
        var check7 = setCheckboxVal($(".accessmaster_check7").eq(i));
        var check8 = setCheckboxVal($(".accessmaster_check8").eq(i));
        
        // 1行ずつ値を取得
        // 4/15 IDに値が入っている場合、更新処理を行う
        if(_id != '') {
          io.socket.put('/master_accesslv/' + _id, {
            k_id: _k_id,
            accesslv: accessmaster_id,
            accessname: accessname,
            check1: check1,
            check2: check2,
            check3: check3,
            check4: check4,
            check5: check5,
            check6: check6,
            check7: check7,
            check8: check8,
            check9: "",
            check10: "",
            accshop: accshop
          },function(res,JWR){
            console.log('権限マスタ update!',res,JWR);
          });
          
        } else {
          // 登録処理
          io.socket.post('/master_accesslv', {
            k_id: _k_id,
            accesslv: accessmaster_id,
            accessname: accessname,
            check1: check1,
            check2: check2,
            check3: check3,
            check4: check4,
            check5: check5,
            check6: check6,
            check7: check7,
            check8: check8,
            check9: "",
            check10: "",
            accshop: accshop
          },function(res,JWR){
            console.log('従業員マスタ insert!',res,JWR);
          });
        }
      }
      
      makeReload('Master_Accesslv');
    });
    
    // 【集計画面】カレンダー値削除
    $('.btn_report_day_from_del').live("click", function(){
      $("#report_day_from").val('');
    });
    $('.btn_report_day_to_del').live("click", function(){
      $("#report_day_to").val('');
    });
    
    // 【集計画面】給料計算
    $('#report_salary_calc').live("click", function(){
      
      $('#report_salary_calc').toggleClass("link");
      $('#report_salary_calc').toggleClass("link2");
      if($('#report_salary_calc_div').css('display') == 'none') {
        $('#report_salary_calc_div').css('display','');
        
        // キャスト給料計算
        calcCastSalary();
        
      } else {
        $('#report_salary_calc_div').css('display','none');
        
        // 前回検索結果を削除
        var delindex = $('.report_salary_castname').parent().parent().index();
        for( var i = 2; i < delindex; i++ ) {
          $("#report_salary_table tr:last").remove();
        }
      }
      
    });
    
    // 【集計画面】店舗売上
    $('#report_salary_shop_calc').live("click", function(){
      
      $('#report_salary_shop_calc').toggleClass("link");
      $('#report_salary_shop_calc').toggleClass("link2");
      if($('#report_salary_shop_calc_div').css('display') == 'none') {
        $('#report_salary_shop_calc_div').css('display','');
        
        // 店舗売上計算
        calcShopSales();
        
      } else {
        $('#report_salary_shop_calc_div').css('display','none');
        
        // 前回検索結果を削除
        var delindex = $('.report_salary_shop_businessdate').parent().parent().index();
        for( var i = 1; i < delindex; i++ ) {
          $("#report_salary_shop_table tr:last").remove();
        }
      }
      
    });
    
    // 数値項目編集時、デフォルトで値を全選択状態にする
    $('.num').live('mouseup', function() {
      $(this).select();
    });
    
    $('#cast_refresh').live("click", function(){
      dataLoad();
    });
    $('#report_refresh').live("click", function(){
      dataLoad();
    });
    
    // 
    $(".nav-tabs li").click(function() {
      var num = $("#.nav-tabs li").index(this);
      console.log($("#.nav-tabs li a").eq(num).text);
      
      // ステータスにより分岐
      switch ($("#.nav-tabs li a").eq(num).text()) {
        case '営業準備':
          ks.ready.initReady();
          break;
        case '営業中':
          ks.seats.initSeats();
          ks.cast.initCast();
          break;
        case '出退勤':
          ks.presence.initPresence();
          break;
        default:
      }
    });

  };
  
  //
  //initialize modals for presence
  //
  _wt.initAccessStoreModals = function(){
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-access-store.html', function(res){
      $('body').append(res);
    });
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-member-password.html', function(res){
      $('body').append(res);
    });
  };
  
  // カレンダー入力値をクリア
  function clearCalenderVal(x,obj) {
    var index = x.parent().parent().index();
    obj.eq(index-1).val('');
  }
  
  // 店舗売上計算
  function calcShopSales() {
    var fromdate = $('#report_day_from').val().split("/").join("");
    var todate = $('#report_day_to').val().split("/").join("");
    
    // 来客グループテーブル検索
    // 条件：ステータスが90(完了)のもの
    io.socket.get('/visitor?limit=0',{
      companyId: _k_id,
      shopId: KsWidgetTmpl.prototype.shopObj.shopId,
      status: '90',
      sort:{ businessDate: 1 }
    },function(res){
      
      var cnt = 0;
      var w_date = '';
      var f_date = '';
      var w_sales = 0;
      var w_cashsales = 0;
      var w_cardsales = 0;
      var w_totalsales = 0;
      
      for(var c in res){
        // タイトル行を表示
        $('#report_salary_shop_table').css('display', '');
        
        // 指定期間範囲のデータかチェック
        if(fromdate <= res[c].businessDate
        && todate >= res[c].businessDate){
          // 直前に処理したデータが同一営業日でない場合、次データへ
          if( w_date != res[c].businessDate ) {
            cnt++;
            w_date = res[c].businessDate;
            w_sales = 0;
            w_cashsales = 0;
            w_cardsales = 0;
            
            // 店舗売上templatesをclone
            var report_salary_shop_Div = $('#report_salary_shop_template').clone();
            $('#report_salary_shop_table').append(report_salary_shop_Div);
            // 追加した行を活性化
            $('#report_salary_shop_table tr:last').css('display', '');
            
            // 日付スラッシュ編集
            f_date = res[c].businessDate.substr(0,4) + '/' + res[c].businessDate.substr(4,2) + '/' + res[c].businessDate.substr(6,2);
            $('.report_salary_shop_businessdate').eq(cnt).val(f_date);
            
            w_sales = res[c].pay;
            w_totalsales = w_totalsales + res[c].pay;
            
            // 現金支払
            if(res[c].payType == '1'){
              w_cashsales = w_cashsales + res[c].pay;
              $('.report_salary_shop_sales_cash').eq(cnt).val(addFigure(w_sales));
            }
            
            // カード支払
            if(res[c].payType == '0'){
              w_cardsales = w_cardsales + res[c].pay;
              $('.report_salary_shop_sales_card').eq(cnt).val(addFigure(w_sales));
            }
            
            $('.report_salary_shop_sales').eq(cnt).val(addFigure(w_sales));
            
          // 同一営業日の場合、売上を加算
          } else {
            w_sales = parseFloat($('.report_salary_shop_sales').eq(cnt).val().split(",").join("")) + res[c].pay;
            w_totalsales = w_totalsales + res[c].pay;
            
            // 現金支払
            if(res[c].payType == '1'){
              w_cashsales = parseFloat($('.report_salary_shop_sales_cash').eq(cnt).val().split(",").join("")) + res[c].pay;
              $('.report_salary_shop_sales_cash').eq(cnt).val(addFigure(w_cashsales));
            }
            
            // カード支払
            if(res[c].payType == '0'){
              w_cardsales = parseFloat($('.report_salary_shop_sales_card').eq(cnt).val().split(",").join("")) + res[c].pay;
              $('.report_salary_shop_sales_card').eq(cnt).val(addFigure(w_cardsales));
            }
            
            $('.report_salary_shop_sales').eq(cnt).val(addFigure(w_sales));
          }
          
        }
      }
      cnt++;
      // 店舗売上templatesをclone
      report_salary_shop_Div = $('#report_salary_shop_template').clone();
      $('#report_salary_shop_table').append(report_salary_shop_Div);
      // 追加した行を活性化
      $('#report_salary_shop_table tr:last').css('display', '');
      
      $('.report_salary_shop_businessdate').eq(cnt).addClass("TBL_AQUA");
      $('.report_salary_shop_businessdate').eq(cnt).val("総売上");
      $('.report_salary_shop_sales_cash').eq(cnt).addClass("TBL_AQUA");
      $('.report_salary_shop_sales_cash').eq(cnt).val(addFigure(w_cashsales));
      $('.report_salary_shop_sales_card').eq(cnt).addClass("TBL_AQUA");
      $('.report_salary_shop_sales_card').eq(cnt).val(addFigure(w_cardsales));
      $('.report_salary_shop_sales').eq(cnt).addClass("TBL_AQUA");
      $('.report_salary_shop_sales').eq(cnt).val(addFigure(w_totalsales));
    });
  }
  
  // キャスト給料計算
  function calcCastSalary() {
    // 給料計算方法マスタ検索
    io.socket.get('/master_salary_calc?limit=0',{
      companyId: _k_id,
      shopId: KsWidgetTmpl.prototype.shopObj.shopId
    },function(calc){
      
      if(calc[0] !== undefined) {
        // キャストマスタ検索
        io.socket.get('/mcast?limit=0',{
          k_id: _k_id,
          t_id: KsWidgetTmpl.prototype.shopObj.shopId,
          sort:{ createdAt: 1 }
        },function(res){
          // タイトル行を表示
          $('#report_salary_table').css('display', '');
          
          var cnt = 1;
          for(var c in res){
            // キャスト一覧templatesをclone
            var report_salary_Div = $('#report_salary_template').clone();
            $('#report_salary_table').append(report_salary_Div);
            // 追加した行を活性化
            $('#report_salary_table tr:last').css('display', '');
            
            $('.report_salary_truename').eq(cnt).val(res[c].name);
            $('.report_salary_castname').eq(cnt).val(res[c].gname);
            // 上記で取得した歩合、基本時給をセット
            $('.report_salary_percentage').eq(cnt).val(calc[0].percentage);
            $('.report_salary_base').eq(cnt).val(addFigure(res[c].basehour));
            
            // 個人の給料計算を行う
            findCastlady(res[c],cnt,calc[0]);
            
            cnt++;
          }
        });
      }
    });
  }
  
  // 給料計算メイン処理
  function findCastlady(res,cnt,calc) {
    var fromdate = $('#report_day_from').val().split("/").join("");
    var todate = $('#report_day_to').val().split("/").join("");
    
    // キャストテーブル検索
    io.socket.get('/castlady?limit=0',{
      companyId: res.k_id,
      castId: res.id
    },function(cas){
      
      var worktime = 0;
      var workday = 0;
      var w_point = 0;        // ポイント
      var w_pena = 0;         // ペナルティ
      var w_deduct = 0;       // 出退勤控除
      var w_sales = 0;        // 売上
      var w_cashb = 0;        // キャッシュバック
      var w_totalsalary0 = 0; // 歩合制給料合計
      var w_totalsalary1 = 0; // 時給スライド制給料合計
      for(var d in cas){
        // 指定期間範囲のデータかチェック
        if(fromdate <= cas[d].businessDate
        && todate >= cas[d].businessDate){
          io.socket.get('/detailrecord?limit=0',{
            companyId: cas[d].companyId,
            shopId: cas[d].shopId,
            orderDate: cas[d].businessDate,
            castId: cas[d].id
          },function(det){
            for(var e in det){
              w_point = w_point + det[e].point;
              
              // 商品種別によって処理分岐
              switch (det[e].itemCategoryCd) {
                // 「ペナルティ」の場合
                case '60':
                  w_pena = w_pena + det[e].cashBack;
                  break;
                // 「出退勤状況」の場合
                case '70':
                  w_deduct = w_deduct + det[e].totalPrice;
                  break;
                // 上記以外の場合
                default:
                  w_sales = w_sales + det[e].totalPrice;
                  w_cashb = w_cashb + det[e].cashBack;
              }
            }
            
            $('.report_salary_point').eq(cnt).val(addFigure(w_point));
            findSlideSalary(res,w_point,cas[d].businessDate,cnt);
            $('.report_salary_cashback').eq(cnt).val(addFigure(w_cashb));
            $('.report_salary_sales').eq(cnt).val(addFigure(w_sales));
            $('.report_salary_penalty').eq(cnt).val(addFigure(w_pena + w_deduct));
            // 総支給額を計算(売上×歩合/100)+キャッシュバック-ペナルティ-出退勤控除
            w_totalsalary0 = (w_sales * calc.percentage / 100) + w_cashb + w_pena + w_deduct;
            w_totalsalary1 = parseFloat($('.report_salary_base').eq(cnt).val().split(",").join("")) * worktime.toFixed(1) + w_cashb + w_pena + w_deduct;
      
            // 歩合制給料合計の控除額、差引額を計算
            calcDuductTotal(w_totalsalary0,cnt,0);
            calcDuductTotal(w_totalsalary1,cnt,1);
          });
            
          // 退勤時間 - 出勤時間を計算
          var starttime = cas[d].cj_time_fr.split(":").join("");
          var endtime = cas[d].cj_time_to.split(":").join("");
          
          // 正確な分(minutes)へ
          var x = (endtime - starttime);
          var y = x.toString().length;
          var z = x.toString().substr(y-2,2);
          if(z != ''){
            if(parseFloat(z) >= 90){
              x = x - 10;
            } else if(parseFloat(z) >= 80){
              x = x - 20;
            } else if(parseFloat(z) >= 70){
              x = x - 20;
            } else if(parseFloat(z) >= 60){
              x = x - 30;
            } else if(parseFloat(z) >= 50){
              x = x - 40;
            } else if(parseFloat(z) >= 40){
              x = x + 20;
            } else if(parseFloat(z) >= 30){
              x = x + 20;
            } else if(parseFloat(z) >= 20){
              x = x + 10;
            }
          }
          var daytime = x / 100;
          
          if(daytime > 0) {
            // 勤務時間を加算
            worktime = worktime + daytime;
            workday++;
          }
        }
      }
      
      $('.report_salary_days').eq(cnt).val(workday);
      $('.report_salary_hours').eq(cnt).val(worktime.toFixed(1));
      
      // 福利厚生費取得
      var welfare = (res.trans + calc.welfare) * workday * (-1);
      $('.report_salary_welfare').eq(cnt).val(addFigure(welfare));
    });
  }
  
  // スライド時給計算
  function findSlideSalary(res,p,d,cnt) {
    var w_slide = 0;
    io.socket.get('/master_slide?limit=0',{
      companyId: _k_id,
      shopId: KsWidgetTmpl.prototype.shopObj.shopId
    },function(sli){
      for(var g in sli){
        if(sli[g].slideType == '1') {
          if(sli[g].slideFrom <= p
          && sli[g].slideTo >= p){
            w_slide = w_slide + sli[g].slidePayHour;
            $('.report_salary_slide').eq(cnt).val(addFigure(w_slide));
          }
          
        } else if(sli[g].slideType == '2') {
          moment.defaultFormat = 'YYYYMMDD';
          var startday = moment(res.startday);
          var slidefrom = startday.add(sli[g].slideFrom, 'months').format();
          var slideto = startday.add(sli[g].slideTo, 'months').format();
          
          // キャリア期間の判定
          if(slidefrom <= d
          && slideto >= d){
            w_slide = w_slide + sli[g].slidePayHour;
            $('.report_salary_slide').eq(cnt).val(addFigure(w_slide));
          }
        }
      }
    });
  }
  
  // 総支給額から控除額、差引額を計算
  function calcDuductTotal(total,cnt,type) {
    // 控除マスタを検索
    io.socket.get('/deductiondb?limit=0',{
      companyId: _k_id,
      tenpoId: KsWidgetTmpl.prototype.shopObj.shopId
    },function(ded){
      var w_total = total;
      var w_duduction_p = 0;
      var w_duduction = 0;
      var w_salary = 0;
      
      // スライド時給制の場合、スライド時給を加算する
      if(type == 1) {
        w_total = w_total + $('.report_salary_slide').eq(cnt).val().split(",").join("") * $('.report_salary_hours').eq(cnt).val().split(",").join("");
      }
      // 合計額から福利厚生を引く
      w_total = w_total + parseFloat($('.report_salary_welfare').eq(cnt).val());
      w_total = Math.floor(w_total);
      
      for(var f in ded){
        w_duduction_p = w_duduction_p + parseFloat(ded[f].deduction) * (-1);
      }
      w_duduction = Math.floor(w_total * w_duduction_p / 100);
      // 総支給額がマイナスの場合
      if(w_duduction > 0) {
        w_duduction = 0;
      }
      w_salary = w_total + w_duduction;
      
      if(type == 0) {
        $('.report_salary_totalsalary0').eq(cnt).val(addFigure(w_total));
        $('.report_salary_deduction0').eq(cnt).val(addFigure(w_duduction));
        $('.report_salary_salary0').eq(cnt).val(addFigure(w_salary));
      } else {
        $('.report_salary_totalsalary1').eq(cnt).val(addFigure(w_total));
        $('.report_salary_deduction1').eq(cnt).val(addFigure(w_duduction));
        $('.report_salary_salary1').eq(cnt).val(addFigure(w_salary));
      }
      
    });
  }
  
  // 画面読み込み
  function dataLoad() {
    console.log('data loaded!');
    
    // テーブル、プルダウン初期化
    tableInit();
    
    // 本日の曜日を取得
    _day = date.getDay();
    
    // 営業日テーブルが作成されているかチェック
    // TODO:企業ID、店舗IDが固定
    var _e_id = _k_id + KsWidgetTmpl.prototype.shopObj.shopId + today;
    io.socket.get('/MainPage/getTable', {
      e_id: _e_id
    }, function(data) {
      
      // 店舗プルダウンを作成
      getTenpoPulldown();
    
      // 権限プルダウン、権限マスタ一覧を作成
      getAccesslvPulldown();
      
      // キャストマスタを検索
      io.socket.get('/MainPage/getCast', {
        k_id: _k_id
      }, function(data) {
        
        // 【キャスト管理画面】キャスト表示
        var castcnt = 1;
        // 2/6【キャスト管理画面】キャストマスタテンプレートの基本時給、送り賃のデフォルトをセット
        io.socket.get('/master_salary_calc',{ companyId: _k_id, shopId: KsWidgetTmpl.prototype.shopObj.shopId },function(sal){
          if(sal[0] != undefined) {
            $('.castmaster_basehour').eq(0).val(sal[0].basePayHour);
            $('.castmaster_trans').eq(0).val(sal[0].trans);
          }
        });
        
        $.each(data.personal, function() {
          
          // 【キャスト管理画面】キャストマスタテンプレートをclone
          var castmaster_Div = $('#castmaster_template').clone();
          $('#castmaster_table').append(castmaster_Div);
          // 追加した行を活性化
          $( '#castmaster_table tr:last' ).css('display', '');
          if(this.endday != ''){
            $( '#castmaster_table tr:last' ).css("background-color", "gray");
          }
          $('.castmaster_truename').eq(castcnt).val(this.name);
          // 1/30 c_id撤廃、idへ
          $('.castmaster_c_id').eq(castcnt).val(this.id);
          $('.castmaster_t_id').eq(castcnt).val(this.t_id);
          $('.castmaster_t_name').eq(castcnt).val(this.t_id);
          $('.castmaster_castname').eq(castcnt).val(this.gname);
          $('.castmaster_basehour').eq(castcnt).val(this.basehour);
          $('.castmaster_trans').eq(castcnt).val(this.trans);
          $('.castmaster_startday').eq(castcnt).val(this.startday);
          $('.castmaster_endday').eq(castcnt).val(this.endday);
          makeCalender($(".castmaster_startday").eq(castcnt));
          makeCalender($(".castmaster_endday").eq(castcnt));
          // 曜日チェックボックスは値が一致したらチェックONにする
          checkboxCheck(this.mon,$('.castmaster_mon').eq(castcnt));
          checkboxCheck(this.tue,$('.castmaster_tue').eq(castcnt));
          checkboxCheck(this.wed,$('.castmaster_wed').eq(castcnt));
          checkboxCheck(this.thu,$('.castmaster_thu').eq(castcnt));
          checkboxCheck(this.fri,$('.castmaster_fri').eq(castcnt));
          checkboxCheck(this.sat,$('.castmaster_sat').eq(castcnt));
          checkboxCheck(this.sun,$('.castmaster_sun').eq(castcnt));
          getPulldown_h($('.castmaster_time_fr_h').eq(castcnt));
          getPulldown_m($('.castmaster_time_fr_m').eq(castcnt));
          getPulldown_h($('.castmaster_time_to_h').eq(castcnt));
          getPulldown_m($('.castmaster_time_to_m').eq(castcnt));
          $('.castmaster_time_fr_h').eq(castcnt).val(this.c_time_from.substr(0,2));
          $('.castmaster_time_fr_m').eq(castcnt).val(this.c_time_from.substr(3,2));
          $('.castmaster_time_to_h').eq(castcnt).val(this.c_time_to.substr(0,2));
          $('.castmaster_time_to_m').eq(castcnt).val(this.c_time_to.substr(3,2));
          $('.castmaster_birthday').eq(castcnt).val(this.birthday);
          makeCalender($(".castmaster_birthday").eq(castcnt));
          $('.castmaster_address').eq(castcnt).val(this.address);
          $('.castmaster_tel').eq(castcnt).val(this.tel);
          $('.castmaster_mail').eq(castcnt).val(this.mail);
        
          castcnt++;
          
        });
        
      });
      
      // 【集計画面】カレンダーアイコン追加
      makeCalender($('#report_day_from'));
      makeCalender($('#report_day_to'));
      $('#report_day_from').val(today_sla);
      $('#report_day_to').val(today_sla);
      
    });
    
  }
  
  
  // テーブル、プルダウン初期化
  function tableInit() {
    
    // 【キャスト管理画面】企業単位キャスト
    var delindex = $('.btn_castmaster_del').parent().parent().index();
    for( var i = 1; i < delindex; i++ ) {
      $("#castmaster_table tr:last").remove();
    }
    
    // 【キャスト管理画面】店舗プルダウン
    $(".castmaster_t_name option").remove();
    
    // 【マスタ管理画面】企業単位権限
    delindex = $('.accessmaster_accessname').parent().parent().index();
    for( i = 1; i < delindex; i++ ) {
      $("#accessmaster_table tr:last").remove();
    }
    
    // 【マスタ管理画面】権限プルダウン
    $('.membermaster_accesslv option').remove();
    
  }
  
  
  // 店舗情報プルダウンの作成
  function getTenpoPulldown(){
    
    io.socket.get('/MainPage/getTenpoMaster', {
        k_id: _k_id
    }, function(data) {
      $('.castmaster_t_name').append($('<option>').html('店舗未定').val(''));
      
      $.each(data.shop, function() {
        $('.castmaster_t_name').append($('<option>').html(this.shopName).val(this.shopId));
      });
    });
  }
  
  
  // 権限情報プルダウン、権限マスタ一覧の作成
  function getAccesslvPulldown(){
    
    io.socket.get('/MainPage/getAccesslv', {
        k_id: _k_id
    }, function(data) {
      $('.membermaster_accesslv').append($('<option>').html('未設定').val(''));
      
      // 【権限マスタ管理画面】権限一覧を表示
      var accesscnt = 1;
      
      $.each(data.accesslv, function() {
        var accessmaster_Div = $('#accessmaster_template').clone();
        // 【権限マスタ管理画面】権限マスタ管理行テンプレートをclone
        $('#accessmaster_table').append(accessmaster_Div);
        // 追加した行を活性化
        $( '#accessmaster_table tr:last' ).css('display', '');
        
        $('.membermaster_accesslv').append($('<option>').html(this.accessname).val(this.accesslv));
        
        $('.accessmaster_accessname').eq(accesscnt).val(this.accessname);
        $('.accessmaster_id').eq(accesscnt).val(this.id);
        $('.accessmaster_accesslv').eq(accesscnt).val(this.accesslv);
        checkboxCheck(this.check1,$('.accessmaster_check1').eq(accesscnt));
        checkboxCheck(this.check2,$('.accessmaster_check2').eq(accesscnt));
        checkboxCheck(this.check3,$('.accessmaster_check3').eq(accesscnt));
        checkboxCheck(this.check4,$('.accessmaster_check4').eq(accesscnt));
        checkboxCheck(this.check5,$('.accessmaster_check5').eq(accesscnt));
        $('.accessmaster_store').eq(accesscnt).val(this.accshop);
        checkboxCheck(this.check6,$('.accessmaster_check6').eq(accesscnt));
        checkboxCheck(this.check7,$('.accessmaster_check7').eq(accesscnt));
        checkboxCheck(this.check8,$('.accessmaster_check8').eq(accesscnt));
        
        accesscnt++;
      });
    });
  }
  
  
  // 3/3【営業準備画面】準備完了処理
  function createReady2() {
    // 年月日のスラッシュ除去
    var splitDay = $('#today').text().split("/").join("");
    
    // 営業日IDを編集(企業ID+店舗ID+本日日付)
    // ※企業IDを桁数固定するなど考慮が必要
    // TODO:企業ID、店舗IDが固定
    var _e_id = _k_id + KsWidgetTmpl.prototype.shopObj.shopId + splitDay;
    
    // 営業日テーブルの作成
    var time_fr = $('#time_fr_h').val() + ":" + $('#time_fr_m').val();
    var time_to = $('#time_to_h').val() + ":" + $('#time_to_m').val();
    // TODO:企業ID、店舗IDが固定、ステータス使っていない
    io.socket.get('/businessdate',{ e_id: _e_id },function(res){
      if(res[0] != undefined) {
        // 存在する場合、営業時間のみ更新
        io.socket.put('/businessdate/' + res[0].id,{
          openTime: time_fr,
          closeTime: time_to
        },function(bus,err){
          console.log('BusinessDate update!',bus);
        });
        
      } else {
        // 存在しない場合、営業テーブル作成
        io.socket.post('/businessdate', {
          companyId: _k_id,
          shopId: KsWidgetTmpl.prototype.shopObj.shopId,
          e_id: _e_id,
          date: splitDay,
          dateLabel: _day,
          openTime: time_fr,
          closeTime: time_to,
          status: ''
        },function(bus,JWR){
          console.log('BusinessDate insert!',bus,JWR);
        });
      }
    });
    
    
    // キャストテーブルの作成
    // 既に登録したキャストについては何もしない
    $('.ready').each(function(){
      console.log($(this).find('.cast-name').text());
      
      var _c_id = $(this).attr('id').replace('rid-','');
      var _c_name = $(this).find('.cast-name').text();
      var _c_time_fr = $(this).find('.cast-time_fr').text();
      var _c_time_to = $(this).find('.cast-time_to').text();
      
      // 1行ずつ値を取得
      // TODO:企業ID、店舗IDが固定
      io.socket.post('/castlady', {
        companyId: _k_id,
        shopId: KsWidgetTmpl.prototype.shopObj.shopId,
        e_id: _e_id,
        castId: _c_id,
        businessDate: today,
        name: _c_name,
        point: 0,
        status:"",
        startTime: new Date(),
        c_time_fr: _c_time_fr,
        c_time_to: _c_time_to,
        cj_time_fr: ":",
        cd_time: ":",
        cj_time_to: ":",
        seated: ""
      });
    });
    
    //makeReload('BusinessDate,CastLady');
  }
  
  
  // 2/13 他端末間画面同期マスタ登録/更新
  function makeReload(db) {
    io.socket.get('/mreload',{
      companyId: _k_id,
      shopId: KsWidgetTmpl.prototype.shopObj.shopId
    },function(res){
      
      var msg = '';
      if(res[0] !== undefined) {
        io.socket.put('/mreload/' + res[0].id,{
          companyId: _k_id,
          shopId: KsWidgetTmpl.prototype.shopObj.shopId,
          accessDb: db
        },function(rel,err){
          msg = db + ':update reload!';
          console.log(msg,rel);
        });
        
      } else {
        io.socket.post('/mreload',{
          companyId: _k_id,
          shopId: KsWidgetTmpl.prototype.shopObj.shopId,
          accessDb: db
        },function(rel,JWR){
          msg = db + ':insert reload!';
          console.log(msg,rel,JWR);
        });
      }
    });
  }
  
  
  // チェックボックスON判定
  function checkboxCheck(day,obj) {
    if(day == obj.val()) {
      obj.attr("checked",true);
    }
  }
  
  
  // チェックボックスの値を取得する
  function setCheckboxVal(obj) {
    if(obj.attr("checked") !== undefined){
      return obj.val();
    } else {
      return "";
    }
  }
  
  
  // 1/5 数値カンマ区切り
  function addFigure(str) {
    var num = new String(str).replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return num;
  }
  
  
  // プルダウン時間範囲取得(00-40)
  function getPulldown_h(obj) {
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
  }
	
	
  // プルダウン分範囲取得(00-59)
  function getPulldown_m(obj) {
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
  }
  
  
  // カレンダーアイコン作成
	function makeCalender(obj) {
	  obj.datepicker({
      // インプットに表示する日付フォーマット
      dateFormat: "yy/mm/dd",
      dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'],
      monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      // インプットの横にボタン画像を表示
      showOn: "button",
      buttonImage: "/linker/css/parts/3557.png",
      // ボタン画像をクリックした時のみカレンダーを表示
      buttonImageOnly: true,
      // ボタン画像のALTテキスト
      buttonText: "カレンダー",
      // 年のプルダウンを表示
      changeYear: true,
      // 月のプルダウンを表示
      changeMonth: true,
      // 年の後ろに月を表示
      showMonthAfterYear: true,
      // 年の表示を現在年から過去100年分、未来10年分表示する
      yearRange: "-100:+10"
    });
	}
	
	// 2/13 画面同期再読み込み
	// 当PGMで更新しているDBのいずれかが更新された場合、再読み込みを行う
	io.socket.on('mreload', function (e) {
	  switch(e.verb){
	    default:dataLoad();
    }
	});
  
  // businessdate再読み込み
  io.socket.on('businessdate', function (e) {
	  console.log(e);
    switch(e.verb){
      case 'created':
        console.log('businessdate営業中画面に反映');
        KsWidgetTmpl.prototype.businessDate = e.data;
        break;
      default:break;
    }

  });
  
  if('undefined' == typeof module) {
    
    if(!window.ks) {
      window.ks = {};
    }
    
    window.ks.main = main;
    
  } else {
    module.exports = main;
  }
})();