(function() {
  
  var masterDetail = {};
  var detail_companyID = "";
  var detail_tenpoId = "";
  var detail_tenpoName = "";
  var _companyID = "00001"; // TODO:企業ID固定

  masterDetail.loaded = function(companyId){
    
    // 初期処理、TenpoDBから店舗IDと店舗名を取得して一覧表示
    load_tenpo_list();
    
    $('#store_refresh').live("click", function(){
      load_tenpo_list();
    });

    // 店舗一覧から<<店舗追加>>
    $(document).on("click", '#master-tenpo-add', function(){
      tenpo_detail_add();
    });
    /// >> 店舗情報修正 << ///
    // 店舗情報詳細から<<登録>>
    $(document).on("click", '#master-tenpo-detail-create', function(){
      tenpo_create();
    });
    // 店舗情報詳細から<<更新>>
    $(document).on("click", '#master-tenpo-detail-update', function(){
      tenpo_update();
    });
    // 店舗情報詳細から<<キャンセル>>
    $(document).on("click", '#master-tenpo-detail-cancel', function(){
      // 表示切替
      $('#top-pane-stores').children().css({"display": "none" });
      $('#top-pane-stores').children("#middle-pane-master").css({"display": "inline" });
      
      // 変数初期化
      variableInitialize();
    });
    
    /// >> その他管理 << ///
    // メニューから<<給料計算方法の設定>>選択
    $(document).on("click", '.master-detail-menu-button:eq(0)', function(){
      // 給与計算方法マスタ検索
      io.socket.get('/master_salary_calc',{ companyId: detail_companyID, shopId: detail_tenpoId },function(calc){
        if(calc[0] !== undefined) {
          $('#master_salary_type0_payhour').val(calc[0].basePayHour);
          $('#master_salary_type1_percentage').val(calc[0].percentage);
          $('#master_salary_welfare').val(calc[0].welfare);
          $('#master_salary_trans').val(calc[0].trans);
        }
        
        // 2/12 30件over取得対応：getをcontroller処理へ移送
        io.socket.get('/MainPage/getMasterSlide', { companyId: detail_companyID, shopId: detail_tenpoId },function(res){
          // 初期化
          var delindex = $('.master_salary_type0_element1_del').parent().parent().index();
          for( var i = 1; i < delindex; i++ ) {
            $("#master_salary_type0_element1_table tr:last").remove();
          }
          var delindex2 = $('.master_salary_type0_element2_del').parent().parent().index();
          for( var j = 1; j < delindex2; j++ ) {
            $("#master_salary_type0_element2_table tr:last").remove();
          }
          
          var cnt = 1;
          var cnt2 = 1;
          $.each(res.slide, function() {
            if(this.slideType === '1'){
              // テンプレートをclone
              var master_salary_type0_element1_Div = $('#master_salary_type0_element1_template').clone();
              $('#master_salary_type0_element1_table').append(master_salary_type0_element1_Div);
              // 追加した行を活性化
              $( '#master_salary_type0_element1_table tr:last' ).css('display', '');
              // 項目をセット
              $('.master_salary_type0_element1_from').eq(cnt).val(this.slideFrom);
              $('.master_salary_type0_element1_to').eq(cnt).val(this.slideTo);
              $('.master_salary_type0_element1_payhour').eq(cnt).val(this.slidePayHour);
              
              cnt++;
              
            } else {
              // テンプレートをclone
              var master_salary_type0_element2_Div = $('#master_salary_type0_element2_template').clone();
              $('#master_salary_type0_element2_table').append(master_salary_type0_element2_Div);
              // 追加した行を活性化
              $( '#master_salary_type0_element2_table tr:last' ).css('display', '');
              // 項目をセット
              $('.master_salary_type0_element2_from').eq(cnt2).val(this.slideFrom);
              $('.master_salary_type0_element2_to').eq(cnt2).val(this.slideTo);
              $('.master_salary_type0_element2_payhour').eq(cnt2).val(this.slidePayHour);
              
              cnt2++;
            }
          });
        });
      });
        
      $('#middle-pane-master-detail-menu').css({"display": "none" });
      $('#middle-pane-master-salary').children('div').css({"display": "none" });
      $('#middle-pane-master-salary').css({"display": "inline" });
      $('#master_salary').css({"display": "inline" });
    });
    
    // tmp版
    $(document).on("click", '.master-detail-menu-button2:eq(0)', function(){
      // 給与計算方法マスタ検索
      io.socket.get('/master_salary_calc',{ companyId: _companyID, shopId: 'temp' },function(calc){
        if(calc[0] !== undefined) {
          $('#tmp_master_salary_type0_payhour').val(calc[0].basePayHour);
          $('#tmp_master_salary_type1_percentage').val(calc[0].percentage);
          $('#tmp_master_salary_welfare').val(calc[0].welfare);
          $('#tmp_master_salary_trans').val(calc[0].trans);
        }
        
        // 2/12 30件over取得対応：getをcontroller処理へ移送
        io.socket.get('/MainPage/getMasterSlide', { companyId: detail_companyID, shopId: 'temp' },function(res){
          // 初期化
          var delindex = $('.tmp_master_salary_type0_element1_del').parent().parent().index();
          for( var i = 1; i < delindex; i++ ) {
            $("#tmp_master_salary_type0_element1_table tr:last").remove();
          }
          var delindex2 = $('.tmp_master_salary_type0_element2_del').parent().parent().index();
          for( var j = 1; j < delindex2; j++ ) {
            $("#tmp_master_salary_type0_element2_table tr:last").remove();
          }
          var cnt = 1;
          var cnt2 = 1;
          $.each(res.slide, function() {
            if(this.slideType === '1'){
              // テンプレートをclone
              var master_salary_type0_element1_Div = $('#tmp_master_salary_type0_element1_template').clone();
              $('#tmp_master_salary_type0_element1_table').append(master_salary_type0_element1_Div);
              // 追加した行を活性化
              $( '#tmp_master_salary_type0_element1_table tr:last' ).css('display', '');
              // 項目をセット
              $('.tmp_master_salary_type0_element1_from').eq(cnt).val(this.slideFrom);
              $('.tmp_master_salary_type0_element1_to').eq(cnt).val(this.slideTo);
              $('.tmp_master_salary_type0_element1_payhour').eq(cnt).val(this.slidePayHour);
              
              cnt++;
              
            } else {
              // テンプレートをclone
              var master_salary_type0_element2_Div = $('#tmp_master_salary_type0_element2_template').clone();
              $('#tmp_master_salary_type0_element2_table').append(master_salary_type0_element2_Div);
              // 追加した行を活性化
              $( '#tmp_master_salary_type0_element2_table tr:last' ).css('display', '');
              // 項目をセット
              $('.tmp_master_salary_type0_element2_from').eq(cnt2).val(this.slideFrom);
              $('.tmp_master_salary_type0_element2_to').eq(cnt2).val(this.slideTo);
              $('.tmp_master_salary_type0_element2_payhour').eq(cnt2).val(this.slidePayHour);
              
              cnt2++;
            }
          });
        });
      });
        
      $('#master-detail-menu').css({"display": "none" });
      $('#tmp_middle-pane-master-salary').children('div').css({"display": "none" });
      $('#tmp_middle-pane-master-salary').css({"display": "inline" });
      $('#tmp_master_salary').css({"display": "inline" });
    });
    
    // 12/18 給料計算方法TOP画面「次へ」押下時処理
    $(document).on("click", '.master_salary_next', function(){
      // 次画面に編集した内容を表示
      var buf = "";
      buf = "<li>歩合： " + $('#master_salary_type1_percentage').val() + "％</li><br>";
      
      buf = buf + "<li>基本時給： " + $('#master_salary_type0_payhour').val() + "円 ＋</li>";
      
      // ポイント設定
      var cnt = $('#master_salary_type0_element1_table tr').index();
      for(var i=1; i<cnt; i++){
        buf = buf + "<li>ポイント " + $('.master_salary_type0_element1_from').eq(i).val();
        buf = buf + "～" + $('.master_salary_type0_element1_to').eq(i).val();
        buf = buf + "まで時給： " + $('.master_salary_type0_element1_payhour').eq(i).val() + "円</li>";
      }
      
      // キャリア設定
      var cnt2 = $('#master_salary_type0_element2_table tr').index();
      for(var i=1; i<cnt2; i++){
        buf = buf + "<li>キャリアの期間" + $('.master_salary_type0_element2_from').eq(i).val();
        buf = buf + "～" + $('.master_salary_type0_element2_to').eq(i).val();
        buf = buf + "ヶ月まで時給： " + $('.master_salary_type0_element2_payhour').eq(i).val() + "円</li>";
      }
      
      // 2/5 控除欄追加
      buf = buf + "<br><li>福利厚生費： " + $('#master_salary_welfare').val() + "円</li>";
      buf = buf + "<li>送り賃： " + $('#master_salary_trans').val() + "円</li>";
      
      // 初期化
      $('.master_salary_type0_setting').children().remove();
      $('.master_salary_type0_setting').append(buf);
      
      $('#master_salary').css({"display": "none" });
      $('#master_salary_result').css({"display": "inline" });
    });
    
    // tmp版
    $(document).on("click", '.tmp_master_salary_next', function(){
      // 次画面に編集した内容を表示
      var buf = "";
      buf = "<li>歩合： " + $('#tmp_master_salary_type1_percentage').val() + "％</li><br>";
      
      buf = buf + "<li>基本時給： " + $('#tmp_master_salary_type0_payhour').val() + "円 ＋</li>";
      
      // ポイント設定
      var cnt = $('#tmp_master_salary_type0_element1_table tr').index();
      for(var i=1; i<cnt; i++){
        buf = buf + "<li>ポイント " + $('.tmp_master_salary_type0_element1_from').eq(i).val();
        buf = buf + "～" + $('.tmp_master_salary_type0_element1_to').eq(i).val();
        buf = buf + "まで時給： " + $('.tmp_master_salary_type0_element1_payhour').eq(i).val() + "円</li>";
      }
      
      // キャリア設定
      var cnt2 = $('#tmp_master_salary_type0_element2_table tr').index();
      for(var i=1; i<cnt2; i++){
        buf = buf + "<li>キャリアの期間 " + $('.tmp_master_salary_type0_element2_from').eq(i).val();
        buf = buf + "～" + $('.tmp_master_salary_type0_element2_to').eq(i).val();
        buf = buf + "ヶ月まで時給： " + $('.tmp_master_salary_type0_element2_payhour').eq(i).val() + "円</li>";
      }
      
      // 2/5 控除欄追加
      buf = buf + "<br><li>福利厚生費： " + $('#tmp_master_salary_welfare').val() + "円</li>";
      buf = buf + "<li>送り賃： " + $('#tmp_master_salary_trans').val() + "円</li>";
      
      // 初期化
      $('.tmp_master_salary_type0_setting').children().remove();
      $('.tmp_master_salary_type0_setting').append(buf);
      
      $('#tmp_master_salary').css({"display": "none" });
      $('#tmp_master_salary_result').css({"display": "inline" });
    });
    
    // 給料計算方法確認画面「戻る」押下時処理
    $(document).on("click", '.master_salary_prev', function(){
      $('#master_salary').css({"display": "inline" });
      $('#master_salary_result').css({"display": "none" });
    });
    // tmp版
    $(document).on("click", '.tmp_master_salary_prev', function(){
      $('#tmp_master_salary').css({"display": "inline" });
      $('#tmp_master_salary_result').css({"display": "none" });
    });
    
    // 給与計算方法要素行追加
    $(document).on("click", '.master_salary_type0_element1_add', function(){
      var master_salary_type0_element_Div = $('#master_salary_type0_element1_template').clone();
      $('#master_salary_type0_element1_table').append(master_salary_type0_element_Div);
      $('#master_salary_type0_element1_table tr:last').css('display', '');
    });
    $(document).on("click", '.master_salary_type0_element2_add', function(){
      var master_salary_type0_element_Div = $('#master_salary_type0_element2_template').clone();
      $('#master_salary_type0_element2_table').append(master_salary_type0_element_Div);
      $('#master_salary_type0_element2_table tr:last').css('display', '');
    });
    // tmp版
    $(document).on("click", '.tmp_master_salary_type0_element1_add', function(){
      var master_salary_type0_element_Div = $('#tmp_master_salary_type0_element1_template').clone();
      $('#tmp_master_salary_type0_element1_table').append(master_salary_type0_element_Div);
      $('#tmp_master_salary_type0_element1_table tr:last').css('display', '');
    });
    $(document).on("click", '.tmp_master_salary_type0_element2_add', function(){
      var master_salary_type0_element_Div = $('#tmp_master_salary_type0_element2_template').clone();
      $('#tmp_master_salary_type0_element2_table').append(master_salary_type0_element_Div);
      $('#tmp_master_salary_type0_element2_table tr:last').css('display', '');
    });
    // 給与計算方法要素行削除
    $(document).on("click", '.master_salary_type0_element1_del', function(){
      var index = $(this).parent().parent().index();
      $('table#master_salary_type0_element1_table tr').eq(index).remove();
    });
    $(document).on("click", '.master_salary_type0_element2_del', function(){
      var index = $(this).parent().parent().index();
      $('table#master_salary_type0_element2_table tr').eq(index).remove();
    });
    // tmp版
    $(document).on("click", '.tmp_master_salary_type0_element1_del', function(){
      var index = $(this).parent().parent().index();
      $('table#tmp_master_salary_type0_element1_table tr').eq(index).remove();
    });
    $(document).on("click", '.tmp_master_salary_type0_element2_del', function(){
      var index = $(this).parent().parent().index();
      $('table#tmp_master_salary_type0_element2_table tr').eq(index).remove();
    });
    
    // 給料計算方法確認画面「完了」押下時処理
    $(document).on("click", '.master_salary_ok', function(){
      // 存在チェック；あるなら削除
      io.socket.get('/master_salary_calc',{ companyId: detail_companyID, shopId: detail_tenpoId },function(res){
        for(var c in res){
          io.socket.delete('/master_salary_calc',{ id: res[c].id },function(res){
            console.log('master_salary_calc :'+ '前回master_salary_calc削除');
          });
        }
        
        // 給与計算方法マスタ登録
        io.socket.post('/master_salary_calc',{
          companyId: detail_companyID,
          shopId: detail_tenpoId,
          percentage: $('#master_salary_type1_percentage').val(),
          basePayHour: $('#master_salary_type0_payhour').val(),
          welfare: $('#master_salary_welfare').val(),
          trans: $('#master_salary_trans').val()
          
        },function(res,err){
          console.log(res,err);
          
          // スライドマスタ登録
          // ポイント設定
          delete_Create_Slide1();
          
          // キャリア設定
          delete_Create_Slide2();
        });
        
      });
      
      // 表示切替
      $('#top-pane-stores').children().css({"display": "none" });
      $('#middle-pane-master-detail-menu').css({"display": "inline" });
      $('#master-ditail-tenpo-name').css({"display": "inline" });
    });
    
    // tmp版
    $(document).on("click", '.tmp_master_salary_ok', function(){
      // 存在チェック；あるなら削除
      io.socket.get('/master_salary_calc',{ companyId: _companyID, shopId: 'temp' },function(res){
        if(res[0] !== undefined) {
          io.socket.delete('/master_salary_calc',{ id: res[0].id },function(res){
            console.log('master_salary_calc :'+ '前回master_salary_calc削除');
          });
        }
        
        // 給与計算方法マスタ登録
        io.socket.post('/master_salary_calc',{
          companyId: _companyID,
          shopId: 'temp',
          percentage: $('#tmp_master_salary_type1_percentage').val(),
          basePayHour: $('#tmp_master_salary_type0_payhour').val(),
          welfare: $('#tmp_master_salary_welfare').val(),
          trans: $('#tmp_master_salary_trans').val()
          
        },function(res,err){
          console.log(res,err);
          
          // スライドマスタ登録
          // ポイント設定
          tmp_delete_Create_Slide1();
          
          // キャリア設定
          tmp_delete_Create_Slide2();
        });
        
      });
      
      // 表示切替
      $('#top-pane-templates').children().css({"display": "none" });
      $('#master-detail-menu').css({"display": "inline" });
    });
    
    // メニューから<<出退勤管理>>選択
    $(document).on("click", '.master-detail-menu-append', function(){
      append_expression('');
    });
    $(document).on("click", '.master-detail-menu-append2', function(){
      append_expression('temp');
    });
    // メニューから<<セット管理>>選択
    $(document).on("click", '.master-detail-menu-button:eq(1)', function(){
      tenpo_set_expression('');
    });
    $(document).on("click", '.master-detail-menu-button2:eq(1)', function(){
      tenpo_set_expression('temp');
    });
    // メニューから<<座席管理>>選択
    $(document).on("click", '.master-detail-menu-button:eq(2)', function(){
      tenpo_seat_expression('');
    });
    $(document).on("click", '.master-detail-menu-button2:eq(2)', function(){
      tenpo_seat_expression('temp');
    });
    // メニューから<<控除管理>>選択
    $(document).on("click", '.master-detail-menu-button:eq(3)', function(){
      tenpo_deduction_expression('');
    });
    $(document).on("click", '.master-detail-menu-button2:eq(3)', function(){
      tenpo_deduction_expression('temp');
    });
    // メニューから<<指名管理>>選択
    $(document).on("click", '.master-detail-menu-button:eq(4)', function(){
      tenpo_choose_expression('');
    });
    $(document).on("click", '.master-detail-menu-button2:eq(4)', function(){
      tenpo_choose_expression('temp');
    });
    // メニューから<<サービス管理>>選択
    $(document).on("click", '.master-detail-menu-button:eq(5)', function(){
      tenpo_service_expression('');
    });
    $(document).on("click", '.master-detail-menu-button2:eq(5)', function(){
      tenpo_service_expression('temp');
    });
    // メニューから<<ペナルティ管理>>選択
    $(document).on("click", '.master-detail-menu-button:eq(6)', function(){
      tenpo_penalty_expression('');
    });
    $(document).on("click", '.master-detail-menu-button2:eq(6)', function(){
      tenpo_penalty_expression('temp');
    });
    // メニューから<<商品管理>>選択
    $(document).on("click", '.master-detail-menu-button:eq(7)', function(){
      tenpo_product_expression('');
    });
    $(document).on("click", '.master-detail-menu-button2:eq(7)', function(){
      tenpo_product_expression('temp');
    });
    // メニューから<<商品種別管理>>選択
    $(document).on("click", '.master-detail-menu-button:eq(8)', function(){
      tenpo_productType_expression('');
    });
    $(document).on("click", '.master-detail-menu-button2:eq(8)', function(){
      tenpo_productType_expression('temp');
    });
    
    // テンプレート反映ボタン押下時
    $(document).on("click", '#master-detail-menu-templates-copy', function(){
      if(!confirm("マスタ管理の各店舗下管理情報をコピーします。よろしいですか？")){
        return false;
      }
      tenpo_templates_copy();
    });
    
    // メニューから<<戻る>>選択
    $(document).on("click", '#master-detail-menu-cancel', function(){
      // 表示切替
      $('#top-pane-stores').children().css({"display": "none" });
      $('#top-pane-stores').children("#middle-pane-master").css({"display": "inline" });
      
      // 変数初期化
      variableInitialize();
    });
    
    /// >> その他管理 共通 << ///
    // メニューから各管理画面選択後、<<キャンセル>>ボタン
    $(document).on("click", '.master-detail-menu-detail-cancel-button', function(){
      // 表示切替
      $('#top-pane-stores').children().css({"display": "none" });
      $('#middle-pane-master-detail-menu').css({"display": "inline" });
      $('#master-ditail-tenpo-name').css({"display": "inline" });
    });
    // 各管理画面選択後、<<キャンセル>>ボタン(tmp)
    $(document).on("click", '.master-detail-menu-detail-cancel-button2', function(){
      // 表示切替
      $('#top-pane-templates').children().css({"display": "none" });
      $('#master-detail-menu').css({"display": "inline" });
    });
    
    
    /// >> その他管理 出退勤管理 << ///
    // 出退勤管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-append-create', function(){
      if(!confirm("画面の内容で出退勤管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_append_create('');
    });
    // 出退勤管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-append-create2', function(){
      if(!confirm("画面の内容で出退勤管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_append_create('temp');
    });
    // 出退勤管理「+」ボタン
    $(document).on('click', '#master-tenpo-detail-append-addrow', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-append');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      $('#middle-pane-master-append > .master-table-append > .master-table-rowfoot-append').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_append delBtn');
    });
    // 控除管理「+」ボタン(temp)
    $(document).on('click', '#master-tenpo-detail-append-addrow2', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-append2');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      $('.master-table-append2 > .master-table-rowfoot-append2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_append2 delBtn');
    });
    // 控除管理削除ボタン
    $(document).on('click', '.row_delete_append', function(){
      var delnum = $('.row_delete_append').index(this);
      $(".master-table-row-append:eq(" + delnum + ")").remove();
    });
    // 控除管理削除ボタン(temp)
    $(document).on('click', '.row_delete_append2', function(){
      var delnum = $('.row_delete_append2').index(this);
      $(".master-table-row-append2:eq(" + delnum + ")").remove();
    });
    
    
    /// >> その他管理 セット管理 << ///
    // セット管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-set-create', function(){
      if(!confirm("画面の内容でセット管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_set_create('');
    });
    // セット管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-set-create2', function(){
      if(!confirm("画面の内容でセット管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_set_create('temp');
    });
    // セット管理の「+」ボタンの効果
    $(document).on('click', '#master-tenpo-detail-set-addrow', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(3)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(4)>input').remove();
      tableNewrow.find('div:eq(4)').append('<input type="checkbox" class="checkbox" value="1"/>');
      tableNewrow.find('div:eq(6),div:eq(7)').remove();
      $('.master-table > .master-table-rowfoot').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete delBtn');
    });
    // セット管理の「+」ボタンの効果(temp)
    $(document).on('click', '#master-tenpo-detail-set-addrow2', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row2');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(3)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(4)>input').remove();
      tableNewrow.find('div:eq(4)').append('<input type="checkbox" class="checkbox" value="1"/>');
      tableNewrow.find('div:eq(6),div:eq(7)').remove();
      $('.master-table2 > .master-table-rowfoot2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete2 delBtn');
    });
    // セット管理 削除ボタン
    $(document).on('click', '.row_delete', function(){
      var delnum = $('.row_delete').index(this);
      $(".master-table-row:eq(" + delnum + ")").remove();
    });
     // セット管理 削除ボタン(temp)
    $(document).on('click', '.row_delete2', function(){
      var delnum = $('.row_delete2').index(this);
      $(".master-table-row2:eq(" + delnum + ")").remove();
    });
    
    
    /// >> その他管理 座席管理 << ///
    // 座席管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-seat-create', function(){
      if(!confirm("画面の内容で座席管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_seat_create('');
    });
    // 座席管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-seat-create2', function(){
      if(!confirm("画面の内容で座席管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_seat_create('temp');
    });
    // 座席管理「+」ボタン
    $(document).on('click', '#master-tenpo-detail-seat-addrow', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-seat');
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 2, value: 0});
      tableNewrow.find('div:eq(3)>input').remove();
      tableNewrow.find('div:eq(3)').append('<input type="checkbox" class="checkbox" value="1"/>');
      tableNewrow.find('div:eq(5),div:eq(6),div:eq(7)').remove();
      $('#middle-pane-master-seat > .master-table-seat > .master-table-rowfoot-seat').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_seat delBtn');
    });
    // 座席管理「+」ボタン(temp)
    $(document).on('click', '#master-tenpo-detail-seat-addrow2', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-seat2');
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 2, value: 0});
      tableNewrow.find('div:eq(3)>input').remove();
      tableNewrow.find('div:eq(3)').append('<input type="checkbox" class="checkbox" value="1"/>');
      tableNewrow.find('div:eq(5),div:eq(6),div:eq(7)').remove();
      $('.master-table-seat2 > .master-table-rowfoot-seat2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_seat2 delBtn');
    });
    // 座席管理削除ボタン
    $(document).on('click', '.row_delete_seat', function(){
      var delnum = $('.row_delete_seat').index(this);
      $(".master-table-row-seat:eq(" + delnum + ")").remove();
    });
    // 座席管理削除ボタン(temp)
    $(document).on('click', '.row_delete_seat2', function(){
      var delnum = $('.row_delete_seat2').index(this);
      $(".master-table-row-seat2:eq(" + delnum + ")").remove();
    });
    
    
    /// >> その他管理 控除管理 << ///
    // 控除管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-deduction-create', function(){
      if(!confirm("画面の内容で控除管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_deduction_create('');
    });
    // 控除管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-deduction-create2', function(){
      if(!confirm("画面の内容で控除管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_deduction_create('temp');
    });
    // 控除管理「+」ボタン
    $(document).on('click', '#master-tenpo-detail-deduction-addrow', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-deduction');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      $('#middle-pane-master-deduction > .master-table-deduction > .master-table-rowfoot-deduction').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_deduction delBtn');
    });
    // 控除管理「+」ボタン(temp)
    $(document).on('click', '#master-tenpo-detail-deduction-addrow2', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-deduction2');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      $('.master-table-deduction2 > .master-table-rowfoot-deduction2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_deduction2 delBtn');
    });
    // 控除管理削除ボタン
    $(document).on('click', '.row_delete_deduction', function(){
      var delnum = $('.row_delete_deduction').index(this);
      $(".master-table-row-deduction:eq(" + delnum + ")").remove();
    });
    // 控除管理削除ボタン(temp)
    $(document).on('click', '.row_delete_deduction2', function(){
      var delnum = $('.row_delete_deduction2').index(this);
      $(".master-table-row-deduction2:eq(" + delnum + ")").remove();
    });
    
    
    /// >> その他管理 指名管理 << ///
    // 指名管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-choose-create', function(){
      if(!confirm("画面の内容で指名管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_choose_create('');
    });
    // 指名管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-choose-create2', function(){
      if(!confirm("画面の内容で指名管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_choose_create('temp');
    });
    // 指名管理「+」ボタン
    $(document).on('click', '#master-tenpo-detail-choose-addrow', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-choose');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(3)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(4)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(6),div:eq(7)').remove();
      $('#middle-pane-master-choose > .master-table-choose > .master-table-rowfoot-choose').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_choose delBtn');
    });
    // 指名管理「+」ボタン(temp)
    $(document).on('click', '#master-tenpo-detail-choose-addrow2', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-choose2');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(3)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(4)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(6),div:eq(7)').remove();
      $('.master-table-choose2 > .master-table-rowfoot-choose2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_choose2 delBtn');
    });
    // 指名管理削除ボタン
    $(document).on('click', '.row_delete_choose', function(){
      var delnum = $('.row_delete_choose').index(this);
      $(".master-table-row-choose:eq(" + delnum + ")").remove();
    });
    // 指名管理削除ボタン(temp)
    $(document).on('click', '.row_delete_choose2', function(){
      var delnum = $('.row_delete_choose2').index(this);
      $(".master-table-row-choose2:eq(" + delnum + ")").remove();
    });
    
    
    /// >> その他管理 サービス管理 << ///
    // サービス管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-service-create', function(){
      if(!confirm("画面の内容でサービス管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_service_create('');
    });
    // サービス管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-service-create2', function(){
      if(!confirm("画面の内容でサービス管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_service_create('temp');
    });
    // サービス管理「+」ボタン
    $(document).on('click', '#master-tenpo-detail-service-addrow', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-service');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(3)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(4)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(6),div:eq(7)').remove();
      $('#middle-pane-master-service > .master-table-service > .master-table-rowfoot-service').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_service delBtn');
    });
    // サービス管理「+」ボタン(temp)
    $(document).on('click', '#master-tenpo-detail-service-addrow2', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-service2');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(3)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(4)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(6),div:eq(7)').remove();
      $('.master-table-service2 > .master-table-rowfoot-service2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_service2 delBtn');
    });
    // サービス管理削除ボタン
    $(document).on('click', '.row_delete_service', function(){
      var delnum = $('.row_delete_service').index(this);
      $(".master-table-row-service:eq(" + delnum + ")").remove();
    });
    // サービス管理削除ボタン(temp)
    $(document).on('click', '.row_delete_service2', function(){
      var delnum = $('.row_delete_service2').index(this);
      $(".master-table-row-service2:eq(" + delnum + ")").remove();
    });
    
    
    /// >> その他管理 ペナルティ管理 << ///
    // ペナルティ管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-penalty-create', function(){
      if(!confirm("画面の内容でペナルティ管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_penalty_create('');
    });
    // ペナルティ管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-penalty-create2', function(){
      if(!confirm("画面の内容でペナルティ管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_penalty_create('temp');
    });
    // ペナルティ管理「+」ボタン
    $(document).on('click', '#master-tenpo-detail-penalty-addrow', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-penalty');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(3)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(5),div:eq(6),div:eq(7)').remove();
      $('#middle-pane-master-penalty > .master-table-penalty > .master-table-rowfoot-penalty').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_penalty delBtn');
    });
    // ペナルティ管理「+」ボタン(temp)
    $(document).on('click', '#master-tenpo-detail-penalty-addrow2', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.attr('class', 'master-table-row-penalty2');
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(2)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(3)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(5),div:eq(6),div:eq(7)').remove();
      $('.master-table-penalty2 > .master-table-rowfoot-penalty2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_penalty2 delBtn');
    });
    // ペナルティ管理削除ボタン
    $(document).on('click', '.row_delete_penalty', function(){
      var delnum = $('.row_delete_penalty').index(this);
      $(".master-table-row-penalty:eq(" + delnum + ")").remove();
    });
    // ペナルティ管理削除ボタン(temp)
    $(document).on('click', '.row_delete_penalty2', function(){
      var delnum = $('.row_delete_penalty2').index(this);
      $(".master-table-row-penalty2:eq(" + delnum + ")").remove();
    });
    
    
    /// >> その他管理 商品管理 << ///
    // 商品管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-product-create', function(){
      if(!confirm("画面の内容で商品管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_product_create('');
    });
    // 商品管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-product-create2', function(){
      if(!confirm("画面の内容で商品管理を登録します。よろしいですか？")){
        return false;
      }
      tenpo_product_create('temp');
    });
    // 商品管理「+」ボタン
    $(document).on('click', '#master-tenpo-detail-product-addrow', function(){
      var tableNewrow = $('#set_template2 > .master-table-row_template2').clone();
      
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(4)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(5)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(6)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.attr('class', 'master-table-row-product');
      $('#middle-pane-master-product > .master-table-product > .master-table-rowfoot-product').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_product delBtn');
    });
    // 商品管理「+」ボタン(temp)
    $(document).on('click', '#master-tenpo-detail-product-addrow2', function(){
      var tableNewrow = $('#set_template2_m > .master-table-row_template2_m').clone();
      
      // 数値項目は右寄せに
      tableNewrow.find('div:eq(4)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.find('div:eq(5)>input').attr({class: 'num', maxlength: 4, value: 0});
      tableNewrow.find('div:eq(6)>input').attr({class: 'num', maxlength: 10, value: 0});
      tableNewrow.attr('class', 'master-table-row-product2');
      $('.master-table-product2 > .master-table-rowfoot-product2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_product2 delBtn');
    });
    // 商品管理削除ボタン
    $(document).on('click', '.row_delete_product', function(){
      var delnum = $('.row_delete_product').index(this);
      $(".master-table-row-product:eq(" + delnum + ")").remove();
    });
    // 商品管理削除ボタン(temp)
    $(document).on('click', '.row_delete_product2', function(){
      var delnum = $('.row_delete_product2').index(this);
      $(".master-table-row-product2:eq(" + delnum + ")").remove();
    });
    
    
    /// >> その他管理 商品種別管理 << ///
    // 商品種別管理<<登録>>
    $(document).on("click", '#master-tenpo-detail-productType-create', function(){
      if(!confirm("画面の内容で商品種別管理を登録します。\n登録した場合、商品管理の商品種別がリセットされます。よろしいですか？")){
        return false;
      }
      tenpo_productType_create('');
    });
    // 商品種別管理<<登録>>(temp)
    $(document).on("click", '#master-tenpo-detail-productType-create2', function(){
      if(!confirm("画面の内容で商品種別管理を登録します。\n登録した場合、商品管理の商品種別がリセットされます。よろしいですか？")){
        return false;
      }
      tenpo_productType_create('temp');
    });
    // 商品種別管理「+」ボタン
    $(document).on('click', '#master-tenpo-detail-productType-addrow', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.find('div:eq(2)>input').remove();
      tableNewrow.find('div:eq(2)').append('<input type="checkbox" class="checkbox" value="1"/>');
      tableNewrow.attr('class', 'master-table-row-productType');
      tableNewrow.find('div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      $('#middle-pane-master-productType > .master-table-productType > .master-table-rowfoot-productType').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_productType delBtn');
    });
    // 商品種別管理「+」ボタン(temp)
    $(document).on('click', '#master-tenpo-detail-productType-addrow2', function(){
      var tableNewrow = $('#set_template > .master-table-row_template').clone();
      tableNewrow.find('div:eq(2)>input').remove();
      tableNewrow.find('div:eq(2)').append('<input type="checkbox" class="checkbox" value="1"/>');
      tableNewrow.attr('class', 'master-table-row-productType2');
      tableNewrow.find('div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      $('.master-table-productType2 > .master-table-rowfoot-productType2').before( tableNewrow );
      
      var deleteButton = tableNewrow.find('.set_del');
      deleteButton.attr('class', 'row_delete_productType2 delBtn');
    });
    // 商品種別管理削除ボタン
    $(document).on('click', '.row_delete_productType', function(){
      var delnum = $('.row_delete_productType').index(this);
      $(".master-table-row-productType:eq(" + delnum + ")").remove();
    });
    // 商品種別管理削除ボタン(temp)
    $(document).on('click', '.row_delete_productType2', function(){
      var delnum = $('.row_delete_productType2').index(this);
      $(".master-table-row-productType2:eq(" + delnum + ")").remove();
    });
  };

////////////////////////////////////////////////////////////////////////////////
// function ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/// 店舗一覧 /////////////////////////////////////////////////////////////////////////////////////
  // 店舗一覧を表示(DB使用)
  function load_tenpo_list(){
    // 店舗一覧に項目があれば削除
    $("#tenpolists>div").remove();
    // DBから店舗一覧を取得して作成
    // TODO:企業IDが固定値
    io.socket.get('/tenpodb/getAllTenpo', {
        companyId: _companyID
    }, function(data) {
      var tenpolistsDiv = $('#tenpolists');
      tenpolistsDiv.find('a').remove();
      
      var index = 0;
      $.each(data.tenpos, function() {
        
        var tenpoDiv = $('#tenpo_template').clone();
        tenpoDiv.attr('id', 'tenpo' + String(index));
  
        // 店舗名
        var link = tenpoDiv.find('#tenpoDetailName');
        link.attr('id', link.attr('id') + String(index));
        //link.text(this.tenpoName);
        link.text(this.shopName);
        
        // <<詳細>>ボタンを押したときの挙動
        var detailButton = tenpoDiv.find('#detail_button');
        detailButton.attr('id', detailButton.attr('id') + String(index));
        //detailButton.click({ tenpoId: this.tenpoId }, function(eventArgs) {
        detailButton.click({ tenpoId: this.shopId }, function(eventArgs) {
          tenpo_detail(eventArgs.data.tenpoId);
          $('#top-pane-stores').children().css({"display": "none" });
          $('#middle-pane-master-detail').css({"display": "inline" });
          $('#master-tenpo-detail-create').css({"display": "none" });
          $('#master-tenpo-detail-update').css({"display": "inline" });
          $('#delete_button').css({"display": "inline" });
        });
        // <<その他管理>>ボタン
        var etcmenuButton = tenpoDiv.find('#etcmenu_button');
        etcmenuButton.attr('id', detailButton.attr('id') + String(index));
        //etcmenuButton.click({ tenpoId: this.tenpoId }, function(eventArgs) {
        etcmenuButton.click({ tenpoId: this.shopId }, function(eventArgs) {
          tenpo_etcmenu(eventArgs.data.tenpoId);
          $('#top-pane-stores').children().css({"display": "none" });
          $('#middle-pane-master-detail-menu').css({"display": "inline" });
          $('#master-ditail-tenpo-name').css({"display": "inline" });
        });
        
        // <<削除>>ボタンを押したときの挙動
        var deleteButton = tenpoDiv.find('#delete_button');
        deleteButton.attr('id', deleteButton.attr('id') + String(index));
        //deleteButton.click({ tenpoId: this.tenpoId }, function(eventArgs) {
        deleteButton.click({ tenpoId: this.shopId }, function(eventArgs) {

          if(confirm('店舗管理から「'+ link.text() +'」を削除します。\n店舗に紐付けられたその他情報も削除されます。\n削除したデータは戻せません、本当に削除してよろしいですか？')){
            tenpo_delete(eventArgs.data.tenpoId);
          }
        });
        
        
        $('#tenpolists').append(tenpoDiv);
        index++;
      });
    });
  }

  // 店舗一覧からの削除2(DB使用)
  function tenpo_delete(tmp){
    // TODO:企業IDが固定値
    io.socket.post('/tenpodb/deleteTenpo', {
      companyId: _companyID,
      tenpoId: tmp
    }, function(err) {
      load_tenpo_list();
    });
    
    // 変数初期化
    variableInitialize();
    
    // 表示切替
    $('#top-pane-stores').children().css({"display": "none" });
    $('#master-tenpo-detail-create').css({"display": "none" });
    $('#master-tenpo-detail-update').css({"display": "none" });
    $('#top-pane-stores').children("#middle-pane-master").css({"display": "inline" });
  }
  
/// 店舗詳細 /////////////////////////////////////////////////////////////////////////////////////

  // 新規店舗追加(DB使用)
  function tenpo_detail_add(){

      // 値を初期化
      $('#master-tenpo-name').val("");
      $('#master-tenpo-address').val("");
      $('#master-tenpo-tel').val("");
      $('#master-tenpo-service-opening_h').val("");
      $('#master-tenpo-service-opening_m').val("");
      $('#master-tenpo-service-closing_h').val("");
      $('#master-tenpo-service-closing_m').val("");
      $('#master-tenpo-tax').val("");
      $('#master-tenpo-cardfee').val("");
      $('#master-tenpo-week-mon').attr("checked", false);
      $('#master-tenpo-week-tue').attr("checked", false);
      $('#master-tenpo-week-wed').attr("checked", false);
      $('#master-tenpo-week-thu').attr("checked", false);
      $('#master-tenpo-week-fri').attr("checked", false);
      $('#master-tenpo-week-sat').attr("checked", false);
      $('#master-tenpo-week-sun').attr("checked", false);
      $('#master-tenpo-tax2').val("");
      
      // 表示切替
      $('#top-pane-stores').children().css({"display": "none" });
      $('#middle-pane-master-detail').css({"display": "inline" });
      $('#master-tenpo-detail-create').css({"display": "inline" });
      $('#master-tenpo-detail-update').css({"display": "none" });
      $('#delete_button').css({"display": "none" });
  }
  // 店舗詳細画面の表示2(DB使用)
  function tenpo_detail(tmp){
    // TODO:企業IDが固定値
    io.socket.get('/tenpodb/tenpoDetail', {
      companyId: _companyID,
      tenpoId: tmp
    }, function(data) {
      
      // 店舗idを変数として保持
      detail_companyID = data.OneCompanyId;
      detail_tenpoId   = data.OneTenpoId;
      detail_tenpoName = data.OneTenpoName;
      
      // 取得した情報を表示
      $('#master-tenpo-name').val( data.OneTenpoName );
      $('#master-tenpo-address').val( data.OneTenpoAddress );
      $('#master-tenpo-tel').val( data.OneTenpoTel );
      $('#master-tenpo-service-opening_h').val( data.OneServiceOpening.substr(0,2) );
      $('#master-tenpo-service-opening_m').val( data.OneServiceOpening.substr(3,2) );
      $('#master-tenpo-service-closing_h').val( data.OneServiceClosing.substr(0,2) );
      $('#master-tenpo-service-closing_m').val( data.OneServiceClosing.substr(3,2) );
      $('#master-tenpo-tax').val( data.OneTenpoTax1 );
      $('#master-tenpo-cardfee').val( data.OneCardTax );
      data.OneTenpoMon !== "" ? $('#master-tenpo-week-mon').prop("checked", true) : $('#master-tenpo-week-mon').prop("checked", false);
      data.OneTenpoTue !== "" ? $('#master-tenpo-week-tue').prop("checked", true) : $('#master-tenpo-week-tue').prop("checked", false);
      data.OneTenpoWed !== "" ? $('#master-tenpo-week-wed').prop("checked", true) : $('#master-tenpo-week-wed').prop("checked", false);
      data.OneTenpoThu !== "" ? $('#master-tenpo-week-thu').prop("checked", true) : $('#master-tenpo-week-thu').prop("checked", false);
      data.OneTenpoFri !== "" ? $('#master-tenpo-week-fri').prop("checked", true) : $('#master-tenpo-week-fri').prop("checked", false);
      data.OneTenpoSat !== "" ? $('#master-tenpo-week-sat').prop("checked", true) : $('#master-tenpo-week-sat').prop("checked", false);
      data.OneTenpoSun !== "" ? $('#master-tenpo-week-sun').prop("checked", true) : $('#master-tenpo-week-sun').prop("checked", false);
      $('#master-tenpo-tax2').val( data.OneTenpoTax2 );
      
      // <<削除>>ボタンを押したときの挙動
      $('#delete_button').unbind('click');
      $('#delete_button').click({ tenpoId: tmp }, function(eventArgs) {
        if(confirm('店舗管理から「'+ data.OneTenpoName +'」を削除します。\n店舗に紐付けられたその他情報も削除されます。\n削除したデータは戻せません、本当に削除してよろしいですか？')){
          tenpo_delete(tmp);
        }
      });
    });
  }

  // 店舗詳細画面のからの登録ボタン押下(DB使用)
  function tenpo_create(){
    
    var tName    = $('#master-tenpo-name').val();
    var tAddress = $('#master-tenpo-address').val();
    var tTell    = $('#master-tenpo-tel').val();
    var tOpen    = $('#master-tenpo-service-opening_h').val() + ":" + $("#master-tenpo-service-opening_m").val();
    var tClose   = $('#master-tenpo-service-closing_h').val() + ":" + $("#master-tenpo-service-closing_m").val();
    var tTax     = $('#master-tenpo-tax').val();
    var tCard    = $('#master-tenpo-cardfee').val();
    var tMon     = $("#master-tenpo-week-mon").attr("checked") == "checked" ? $('#master-tenpo-week-mon').val() : "";
    var tTue     = $('#master-tenpo-week-tue').attr("checked") == "checked" ? $('#master-tenpo-week-tue').val() : "";
    var tWed     = $('#master-tenpo-week-wed').attr("checked") == "checked" ? $('#master-tenpo-week-wed').val() : "";
    var tThu     = $('#master-tenpo-week-thu').attr("checked") == "checked" ? $('#master-tenpo-week-thu').val() : "";
    var tFri     = $('#master-tenpo-week-fri').attr("checked") == "checked" ? $('#master-tenpo-week-fri').val() : "";
    var tSat     = $('#master-tenpo-week-sat').attr("checked") == "checked" ? $('#master-tenpo-week-sat').val() : "";
    var tSun     = $('#master-tenpo-week-sun').attr("checked") == "checked" ? $('#master-tenpo-week-sun').val() : "";
    var tTax2    = $('#master-tenpo-tax2').val();

    // コントローラに情報を送信して登録
    // TODO:企業IDが固定値
    io.socket.post('/tenpodb/tcreate', {
      prm_companyId   : _companyID,
      prm_tenpoName   : tName,
      prm_tenpoAddress: tAddress,
      prm_tenpoTel    : tTell,
      prm_srvOpen     : tOpen,
      prm_srvClose    : tClose,
      prm_tenpoTax    : tTax,
      prm_tenpoCardfee: tCard,
      prm_tenpoWeekMon: tMon,
      prm_tenpoWeekTue: tTue,
      prm_tenpoWeekWed: tWed,
      prm_tenpoWeekThu: tThu,
      prm_tenpoWeekFri: tFri,
      prm_tenpoWeekSat: tSat,
      prm_tenpoWeekSun: tSun,
      prm_tenpoTax2   : tTax2
    }, function(err) {
     //location.href = 'master';
     load_tenpo_list();
    });

    // 変数初期化
    variableInitialize();
    
    // 表示切替
    $('#top-pane-stores').children().css({"display": "none" });
    $('#master-tenpo-detail-create').css({"display": "none" });
    $('#master-tenpo-detail-update').css({"display": "none" });
    $('#top-pane-stores').children("#middle-pane-master").css({"display": "inline" });
  }
  
  // 店舗情報詳細から更新ボタンを押下(DB使用)
  function tenpo_update(){
    
    var cId      = detail_companyID;
    var tId      = detail_tenpoId;
    var tName    = $('#master-tenpo-name').val();
    var tAddress = $('#master-tenpo-address').val();  
    var tTell    = $('#master-tenpo-tel').val();
    var tOpen    = $('#master-tenpo-service-opening_h').val() + ":" + $("#master-tenpo-service-opening_m").val();
    var tClose   = $('#master-tenpo-service-closing_h').val() + ":" + $("#master-tenpo-service-closing_m").val();
    var tTax     = $('#master-tenpo-tax').val();
    var tCard    = $('#master-tenpo-cardfee').val();
    var tMon     = $("#master-tenpo-week-mon").attr("checked") == "checked" ? $('#master-tenpo-week-mon').val() : "";
    var tTue     = $('#master-tenpo-week-tue').attr("checked") == "checked" ? $('#master-tenpo-week-tue').val() : "";
    var tWed     = $('#master-tenpo-week-wed').attr("checked") == "checked" ? $('#master-tenpo-week-wed').val() : "";
    var tThu     = $('#master-tenpo-week-thu').attr("checked") == "checked" ? $('#master-tenpo-week-thu').val() : "";
    var tFri     = $('#master-tenpo-week-fri').attr("checked") == "checked" ? $('#master-tenpo-week-fri').val() : "";
    var tSat     = $('#master-tenpo-week-sat').attr("checked") == "checked" ? $('#master-tenpo-week-sat').val() : "";
    var tSun     = $('#master-tenpo-week-sun').attr("checked") == "checked" ? $('#master-tenpo-week-sun').val() : "";
    var tTax2    = $('#master-tenpo-tax2').val();
    
    io.socket.post('/tenpodb/tupdate', {
      prm_companyId   : cId,
      prm_tenpoId     : tId,
      prm_tenpoName   : tName,
      prm_tenpoAddress: tAddress,
      prm_tenpoTel    : tTell,
      prm_srvOpen     : tOpen,
      prm_srvClose    : tClose,
      prm_tenpoTax    : tTax,
      prm_tenpoCardfee: tCard,
      prm_tenpoWeekMon: tMon,
      prm_tenpoWeekTue: tTue,
      prm_tenpoWeekWed: tWed,
      prm_tenpoWeekThu: tThu,
      prm_tenpoWeekFri: tFri,
      prm_tenpoWeekSat: tSat,
      prm_tenpoWeekSun: tSun,
      prm_tenpoTax2   : tTax2
    }, function(err) {
      load_tenpo_list();
    });
    
    // 変数初期化
    variableInitialize();
    
    // 表示切替
    $('#top-pane-stores').children().css({"display": "none" });
    $('#master-tenpo-detail-create').css({"display": "none" });
    $('#master-tenpo-detail-update').css({"display": "none" });
    $('#top-pane-stores').children("#middle-pane-master").css({"display": "inline" });
  }
  
  function tenpo_etcmenu(tmp){
    // TODO:企業IDが固定値
    io.socket.get('/tenpodb/tenpoDetail', {
      companyId: _companyID,
      tenpoId: tmp
    }, function(data) {
      // 店舗idを変数として保持
      detail_companyID = data.OneCompanyId;
      detail_tenpoId   = data.OneTenpoId;
      detail_tenpoName = data.OneTenpoName;
      
      $('#master-ditail-tenpo-name').text(detail_tenpoName);
    });
  }
  
  
/// 給与設定方法 /////////////////////////////////////////////////////////////////////////////////////
  // スライドマスタ：ポイント削除、登録
  function delete_Create_Slide1(){
    // 存在チェック；あるなら削除
    io.socket.get('/master_slide?limit=0',{ companyId: detail_companyID, shopId: detail_tenpoId, slideType: '1' },function(res){
      for(var c in res){
        io.socket.delete('/master_slide',{ id: res[c].id },function(del){
          console.log('master_slide :'+ '前回ポイント削除');
        });
      }
      
      var cnt = $('#master_salary_type0_element1_table tr').index();
      for(var i=1; i<cnt; i++){
        io.socket.post('/master_slide',{
          companyId: detail_companyID,
          shopId: detail_tenpoId,
          slideType: '1',
          slideFrom: $('.master_salary_type0_element1_from').eq(i).val(),
          slideTo: $('.master_salary_type0_element1_to').eq(i).val(),
          slidePayHour: $('.master_salary_type0_element1_payhour').eq(i).val()
        },function(res,err){
          console.log(res,err);
        });
      }
    });
  }
  
  // tmp版
  function tmp_delete_Create_Slide1(){
    // 存在チェック；あるなら削除
    io.socket.get('/master_slide?limit=0',{ companyId: _companyID, shopId: 'temp', slideType: '1' },function(res){
      for(var c in res){
        io.socket.delete('/master_slide',{ id: res[c].id },function(del){
          console.log('master_slide :'+ '前回ポイント削除');
        });
      }
      
      var cnt = $('#tmp_master_salary_type0_element1_table tr').index();
      for(var i=1; i<cnt; i++){
        io.socket.post('/master_slide',{
          companyId: _companyID,
          shopId: 'temp',
          slideType: '1',
          slideFrom: $('.tmp_master_salary_type0_element1_from').eq(i).val(),
          slideTo: $('.tmp_master_salary_type0_element1_to').eq(i).val(),
          slidePayHour: $('.tmp_master_salary_type0_element1_payhour').eq(i).val()
        },function(res,err){
          console.log(res,err);
        });
      }
    });
  }
  
  // スライドマスタ：キャリア期間削除、登録
  function delete_Create_Slide2(){
    // 存在チェック；あるなら削除
    io.socket.get('/master_slide?limit=0',{ companyId: detail_companyID, shopId: detail_tenpoId, slideType: '2' },function(res){
      for(var c in res){
        io.socket.delete('/master_slide',{ id: res[c].id },function(del){
          console.log('master_slide :'+ '前回キャリア期間削除');
        });
      }
      
      var cnt = $('#master_salary_type0_element2_table tr').index();
      for(var i=1; i<cnt; i++){
        io.socket.post('/master_slide',{
          companyId: detail_companyID,
          shopId: detail_tenpoId,
          slideType: '2',
          slideFrom: $('.master_salary_type0_element2_from').eq(i).val(),
          slideTo: $('.master_salary_type0_element2_to').eq(i).val(),
          slidePayHour: $('.master_salary_type0_element2_payhour').eq(i).val()
        },function(res,err){
          console.log(res,err);
        });
      }
    });
  }
  
  // tmp版
  function tmp_delete_Create_Slide2(){
    // 存在チェック；あるなら削除
    io.socket.get('/master_slide?limit=0',{ companyId: _companyID, shopId: 'temp', slideType: '2' },function(res){
      for(var c in res){
        io.socket.delete('/master_slide',{ id: res[c].id },function(del){
          console.log('master_slide :'+ '前回キャリア期間削除');
        });
      }
      
      var cnt = $('#tmp_master_salary_type0_element2_table tr').index();
      for(var i=1; i<cnt; i++){
        io.socket.post('/master_slide',{
          companyId: _companyID,
          shopId: 'temp',
          slideType: '2',
          slideFrom: $('.tmp_master_salary_type0_element2_from').eq(i).val(),
          slideTo: $('.tmp_master_salary_type0_element2_to').eq(i).val(),
          slidePayHour: $('.tmp_master_salary_type0_element2_payhour').eq(i).val()
        },function(res,err){
          console.log(res,err);
        });
      }
    });
  }
  
  
/// 出退勤管理 /////////////////////////////////////////////////////////////////////////////////////
  // 出退勤管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function append_expression(tmp){
    
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row-append2,.master-table-rowfoot-append2").remove();
    } else {
      $(".master-table-row-append,.master-table-rowfoot-append").remove();
    }
    
    io.socket.get('/master_append?limit=0',{ companyId: prm_companyId, tenpoId: prm_tenpoId, sort:{ appendId: 1 } },function(data){
    
      var index = 0;
      $.each(data, function() {
        var tablerowDiv = $('#set_template > .master-table-row_template').clone();
        
        tablerowDiv.find('div:eq(1)>input').val(this.appendName);
        tablerowDiv.find('div:eq(2)>input').val(this.append).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(3)>input').val(this.appendNote);
        tablerowDiv.find('div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
        
        var deleteButton = tablerowDiv.find('.set_del');
        if(tmp !== '') {
          tablerowDiv.attr('class', 'master-table-row-append2');
          deleteButton.attr('class', 'append2 delBtn');
          $('.master-table-append2 > div:last-child').after( tablerowDiv );
        } else {
          tablerowDiv.attr('class', 'master-table-row-append');
          deleteButton.attr('class', 'row_delete_append delBtn');
          $('.master-table-append > div:last-child').after( tablerowDiv );
        }
        
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template > .master-table-row_template').clone();
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot-append2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-append-addrow2', class: 'addBtn'});
        $('.master-table-append2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-append').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot-append');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-append-addrow', class: 'addBtn'});
        $('.master-table-append > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-append').css({"display": "inline" });
      }
    });
  }
  // 出退勤管理から<<登録>>ボタン押下
  // tmp:マスタ管理か識別
  function tenpo_append_create(tmp){
    var setrowDiv = $('.master-table-row-append');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row-append2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.get('/master_append?limit=0',{ companyId: prm_companyId, tenpoId: prm_tenpoId },function(res){
      for(var c in res){
        io.socket.delete('/master_append',{ id: res[c].id },function(res){
           console.log('detailrecord :'+ c +' 件削除');
        });
      }
    });
    
    // 行の情報からDBに登録
    var index   = 0;
  
    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row-append:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row-append2:eq(' + index + ')');
      }
  
      io.socket.post('/master_append', {
        companyId   : prm_companyId,
        tenpoId     : prm_tenpoId,
        appendId    : Number(index) + 1,
        appendName  : arryrow.find('div:eq(1)>input').val(),
        append      : arryrow.find('div:eq(2)>input').val(),
        appendNote  : arryrow.find('div:eq(3)>input').val()
      }, function(res,err) {
        console.log(res,err);
      });
      index ++;
    });

  }
  
  
/// セット管理 /////////////////////////////////////////////////////////////////////////////////////
  // セット管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function tenpo_set_expression(tmp){
    
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row2,.master-table-rowfoot2").remove();
    } else {
      $(".master-table-row,.master-table-rowfoot").remove();
    }
    
    io.socket.get('/setdb/getAllSet', { 
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data){
      var index = 0;
      $.each(data.setlist, function() {
        var tablerowDiv = $('#set_template > .master-table-row_template').clone();
        
        tablerowDiv.find('div:eq(1)>input').val(this.setName);
        tablerowDiv.find('div:eq(2)>input').val(this.setPrice).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(3)>input').val(this.setTime).attr({class: 'num', maxlength: 4});
        tablerowDiv.find('div:eq(4)>input').remove();
        tablerowDiv.find('div:eq(4)').append('<input type="checkbox" class="checkbox" value="1"/>');
        if(this.setExtend == "1") {
          tablerowDiv.find('div:eq(4)>input').attr("checked", true);
        }
        tablerowDiv.find('div:eq(5)>input').val(this.setNote);
        tablerowDiv.find('div:eq(6),div:eq(7)').remove();
        
        var deleteButton = tablerowDiv.find('.set_del');
        
        if(tmp !== '') {
          deleteButton.attr('class', 'row_delete2 delBtn');
          tablerowDiv.attr('class', 'master-table-row2');
          $('.master-table2 > div:last-child').after( tablerowDiv );
        } else {
          deleteButton.attr('class', 'row_delete delBtn');
          tablerowDiv.attr('class', 'master-table-row');
          $('.master-table > div:last-child').after( tablerowDiv );
        }
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template > .master-table-row_template').clone();
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-set-addrow2', class: 'addBtn'});
        $('.master-table2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-set').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-set-addrow', class: 'addBtn'});
        $('.master-table > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-set').css({"display": "inline" });
      }
    });
  }
  
  // セット管理から<<登録>>ボタン押下
  // tmp:マスタ管理か識別
  function tenpo_set_create(tmp){
    var setrowDiv = $('.master-table-row');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.post('/setdb/setDelete', {
      prm_companyId: prm_companyId,
      prm_tenpoId  : prm_tenpoId
    }, function(err) {
      //load_tenpo_list();
    });
    
    // 行の情報からDBに登録
    var index = 0;
    var setarry = [];

    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row2:eq(' + index + ')');
      }
      setarry[index] = [];

      setarry[index][0] = Number(index) + 1;
      setarry[index][1] = arryrow.find('div:eq(1)>input').val();
      setarry[index][2] = arryrow.find('div:eq(2)>input').val();
      setarry[index][3] = arryrow.find('div:eq(3)>input').val();
      setarry[index][4] = arryrow.find('div:eq(5)>input').val();
      var setExtend = "";
      if(arryrow.find('div:eq(4)>input').attr("checked") !== undefined){
        setExtend = arryrow.find('div:eq(4)>input').val();
      }
      setarry[index][5] = setExtend;  // 延長フラグ

      io.socket.post('/setdb/setCreate', {
        prm_companyId   : prm_companyId,
        prm_tenpoId     : prm_tenpoId,
        prm_arry        : setarry[index]
      }, function(err) {
        //load_tenpo_list();
      });
      index ++;
    });

  }


/// 座席管理 /////////////////////////////////////////////////////////////////////////////////////
  // 座席管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function tenpo_seat_expression(tmp){
    
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row-seat2,.master-table-rowfoot-seat2").remove();
    } else {
      $(".master-table-row-seat,.master-table-rowfoot-seat").remove();
    }
    
    io.socket.get('/seatdb/getAllSeat', {
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data){
      var index = 0;
      $.each(data.setlist, function() {
        var tablerowDiv = $('#set_template > .master-table-row_template').clone();
        
        // tablerowDiv.find('div:eq(1)>input').val(this.seatName);
        tablerowDiv.find('div:eq(1)>input').val(this.name);
        tablerowDiv.find('div:eq(2)>input').val(this.max).attr({class: 'num', maxlength: 2});
        tablerowDiv.find('div:eq(3)>input').remove();
        tablerowDiv.find('div:eq(3)').append('<input type="checkbox" class="checkbox" value="1"/>');
        if(this.isWait === true) {
          tablerowDiv.find('div:eq(3)>input').attr("checked", true);
        }
        tablerowDiv.find('div:eq(4)>input').val(this.seatNote);
        tablerowDiv.find('div:eq(5),div:eq(6),div:eq(7)').remove();
        
        var deleteButton = tablerowDiv.find('.set_del');
        
        if(tmp !== '') {
          tablerowDiv.attr('class', 'master-table-row-seat2');
          deleteButton.attr('class', 'row_delete_seat2 delBtn');
          $('.master-table-seat2 > div:last-child').after( tablerowDiv );
        } else {
          tablerowDiv.attr('class', 'master-table-row-seat');
          deleteButton.attr('class', 'row_delete_seat delBtn');
          $('.master-table-seat > div:last-child').after( tablerowDiv );
        }
        
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template > .master-table-row_template').clone();
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot-seat2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-seat-addrow2', class: 'addBtn'});
        $('.master-table-seat2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-seat').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot-seat');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-seat-addrow', class: 'addBtn'});
        $('.master-table-seat > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-seat').css({"display": "inline" });
      }
    });
  }
  // 座席管理から<<登録>>ボタン押下
  // tmp:マスタ管理か識別
  function tenpo_seat_create(tmp){
    var setrowDiv = $('.master-table-row-seat');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row-seat2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.post('/seatdb/seatDelete', {
      prm_companyId: prm_companyId,
      prm_tenpoId  : prm_tenpoId
    }, function(err) {
      //load_tenpo_list();
    });
    
    // 行の情報からDBに登録
    var index   = 0;
    var setarry = [];
  
    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row-seat:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row-seat2:eq(' + index + ')');
      }
      setarry[index] = [];
  
      setarry[index][0] = Number(index) + 1;
      setarry[index][1] = arryrow.find('div:eq(1)>input').val();
      setarry[index][2] = arryrow.find('div:eq(2)>input').val();
      var isWait = false;
      if(arryrow.find('div:eq(3)>input').attr("checked") !== undefined){
        isWait = true;
      }
      setarry[index][3] = isWait;
      setarry[index][4] = arryrow.find('div:eq(4)>input').val();
  
      io.socket.post('/seatdb/seatCreate', {
        prm_companyId   : prm_companyId,
        prm_tenpoId     : prm_tenpoId,
        prm_arry        : setarry[index]
      }, function(err) {
        //load_tenpo_list();
      });
      index ++;
    });

  }


/// 控除管理 /////////////////////////////////////////////////////////////////////////////////////
  // 控除管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function tenpo_deduction_expression(tmp){
    
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row-deduction2,.master-table-rowfoot-deduction2").remove();
    } else {
      $(".master-table-row-deduction,.master-table-rowfoot-deduction").remove();
    }
    
    io.socket.get('/deductiondb/getAllDeduction', { 
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data){
      var index = 0;
      $.each(data.setlist, function() {
        var tablerowDiv = $('#set_template > .master-table-row_template').clone();
        
        tablerowDiv.find('div:eq(1)>input').val(this.deductionName);
        tablerowDiv.find('div:eq(2)>input').val(this.deduction).attr({class: 'num', maxlength: 3});
        tablerowDiv.find('div:eq(3)>input').val(this.deductionNote);
        tablerowDiv.find('div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
        
        var deleteButton = tablerowDiv.find('.set_del');
        if(tmp !== '') {
          tablerowDiv.attr('class', 'master-table-row-deduction2');
          deleteButton.attr('class', 'row_delete_deduction2 delBtn');
          $('.master-table-deduction2 > div:last-child').after( tablerowDiv );
        } else {
          tablerowDiv.attr('class', 'master-table-row-deduction');
          deleteButton.attr('class', 'row_delete_deduction delBtn');
          $('.master-table-deduction > div:last-child').after( tablerowDiv );
        }
        
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template > .master-table-row_template').clone();
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot-deduction2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-deduction-addrow2', class: 'addBtn'});
        $('.master-table-deduction2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-deduction').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot-deduction');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-deduction-addrow', class: 'addBtn'});
        $('.master-table-deduction > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-deduction').css({"display": "inline" });
      }
    });
  }
  // 控除管理から<<登録>>ボタン押下
  // tmp:マスタ管理か識別
  function tenpo_deduction_create(tmp){
    var setrowDiv = $('.master-table-row-deduction');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row-deduction2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.post('/deductiondb/deductionDelete', {
      prm_companyId: prm_companyId,
      prm_tenpoId  : prm_tenpoId
    }, function(err) {
      //load_tenpo_list();
    });
    
    // 行の情報からDBに登録
    var index   = 0;
    var setarry = [];
  
    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row-deduction:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row-deduction2:eq(' + index + ')');
      }
      setarry[index] = [];
      
      setarry[index][0] = Number(index) + 1;
      setarry[index][1] = arryrow.find('div:eq(1)>input').val();
      setarry[index][2] = arryrow.find('div:eq(2)>input').val();
      setarry[index][3] = arryrow.find('div:eq(3)>input').val();
  
      io.socket.post('/deductiondb/deductionCreate', {
        prm_companyId   : prm_companyId,
        prm_tenpoId     : prm_tenpoId,
        prm_arry        : setarry[index]
      }, function(err) {
        //load_tenpo_list();
      });
      index ++;
    });

  }


/// 指名管理 /////////////////////////////////////////////////////////////////////////////////////
  // 指名管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function tenpo_choose_expression(tmp){
    
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row-choose2,.master-table-rowfoot-choose2").remove();
    } else {
      $(".master-table-row-choose,.master-table-rowfoot-choose").remove();
    }
    
    io.socket.get('/choosedb/getAllChoose', {
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data){
      var index = 0;
      $.each(data.setlist, function() {
        var tablerowDiv = $('#set_template > .master-table-row_template').clone();
        
        tablerowDiv.find('div:eq(1)>input').val(this.chooseName);
        tablerowDiv.find('div:eq(2)>input').val(this.salesPrice).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(3)>input').val(this.castPoint).attr({class: 'num', maxlength: 4});
        tablerowDiv.find('div:eq(4)>input').val(this.cashBack).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(5)>input').val(this.chooseNote);
        tablerowDiv.find('div:eq(6),div:eq(7)').remove();
        
        var deleteButton = tablerowDiv.find('.set_del');
        
        if(tmp !== '') {
          tablerowDiv.attr('class', 'master-table-row-choose2');
          deleteButton.attr('class', 'row_delete_choose2 delBtn');
          $('.master-table-choose2 > div:last-child').after( tablerowDiv );
        } else {
          tablerowDiv.attr('class', 'master-table-row-choose');
          deleteButton.attr('class', 'row_delete_choose delBtn');
          $('.master-table-choose > div:last-child').after( tablerowDiv );
        }
        
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template > .master-table-row_template').clone();
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot-choose2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-choose-addrow2', class: 'addBtn'});
        $('.master-table-choose2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-choose').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot-choose');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-choose-addrow', class: 'addBtn'});
        $('.master-table-choose > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-choose').css({"display": "inline" });
      }
    });
  }
  // 指名管理から<<登録>>ボタン押下
  function tenpo_choose_create(tmp){
    var setrowDiv = $('.master-table-row-choose');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row-choose2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.post('/choosedb/chooseDelete', {
      prm_companyId: prm_companyId,
      prm_tenpoId  : prm_tenpoId
    }, function(err) {
      //load_tenpo_list();
    });
    
    // 行の情報からDBに登録
    var index   = 0;
    var setarry = [];
  
    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row-choose:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row-choose2:eq(' + index + ')');
      }
      setarry[index] = [];
      
      setarry[index][0] = Number(index) + 1;
      setarry[index][1] = arryrow.find('div:eq(1)>input').val(); //種別
      setarry[index][2] = arryrow.find('div:eq(3)>input').val(); //ポイント
      setarry[index][3] = arryrow.find('div:eq(4)>input').val(); //キャッシュバック
      setarry[index][4] = arryrow.find('div:eq(2)>input').val(); //価格
      setarry[index][5] = arryrow.find('div:eq(5)>input').val(); //備考
  
      io.socket.post('/choosedb/chooseCreate', {
        prm_companyId   : prm_companyId,
        prm_tenpoId     : prm_tenpoId,
        prm_arry        : setarry[index]
      }, function(err) {
        //load_tenpo_list();
      });
      index ++;
    });

  }


/// サービス管理 /////////////////////////////////////////////////////////////////////////////////////
  // 指名管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function tenpo_service_expression(tmp){
    
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row-service2,.master-table-rowfoot-service2").remove();
    } else {
      $(".master-table-row-service,.master-table-rowfoot-service").remove();
    }
    
    io.socket.get('/servicedb/getAllService', {
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data){
      var index = 0;
      $.each(data.setlist, function() {
        var tablerowDiv = $('#set_template > .master-table-row_template').clone();
        
        tablerowDiv.find('div:eq(1)>input').val(this.serviceName);
        tablerowDiv.find('div:eq(2)>input').val(this.salesPrice).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(3)>input').val(this.castPoint).attr({class: 'num', maxlength: 4});
        tablerowDiv.find('div:eq(4)>input').val(this.cashBack).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(5)>input').val(this.serviceNote);
        tablerowDiv.find('div:eq(6),div:eq(7)').remove();
        
        var deleteButton = tablerowDiv.find('.set_del');
        
        if(tmp !== '') {
          tablerowDiv.attr('class', 'master-table-row-service2');
          deleteButton.attr('class', 'row_delete_service2 delBtn');
          $('.master-table-service2 > div:last-child').after( tablerowDiv );
        } else {
          tablerowDiv.attr('class', 'master-table-row-service');
          deleteButton.attr('class', 'row_delete_service delBtn');
          $('.master-table-service > div:last-child').after( tablerowDiv );
        }
        
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template > .master-table-row_template').clone();
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot-service2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-service-addrow2', class: 'addBtn'});
        $('.master-table-service2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-service').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot-service');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-service-addrow', class: 'addBtn'});
        $('.master-table-service > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-service').css({"display": "inline" });
      }
    });
  }
  // サービス管理から<<登録>>ボタン押下
  function tenpo_service_create(tmp){
    var setrowDiv = $('.master-table-row-service');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row-service2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.post('/servicedb/serviceDelete', {
      prm_companyId: prm_companyId,
      prm_tenpoId  : prm_tenpoId
    }, function(err) {
      //load_tenpo_list();
    });
    
    // 行の情報からDBに登録
    var index   = 0;
    var setarry = [];
  
    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row-service:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row-service2:eq(' + index + ')');
      }
      setarry[index] = [];
      
      setarry[index][0] = Number(index) + 1;//arryrow.find('div:eq(1)>input').val();
      setarry[index][1] = arryrow.find('div:eq(1)>input').val();
      setarry[index][2] = arryrow.find('div:eq(3)>input').val();
      setarry[index][3] = arryrow.find('div:eq(4)>input').val();
      setarry[index][4] = arryrow.find('div:eq(2)>input').val();
      setarry[index][5] = arryrow.find('div:eq(5)>input').val();
      
      io.socket.post('/servicedb/serviceCreate', {
        prm_companyId   : prm_companyId,
        prm_tenpoId     : prm_tenpoId,
        prm_arry        : setarry[index]
      }, function(err) {
        //load_tenpo_list();
      });
      index ++;
    });

  }
  
  
/// ペナルティ管理 /////////////////////////////////////////////////////////////////////////////////////
  // ペナルティ管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function tenpo_penalty_expression(tmp){
    
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row-penalty2,.master-table-rowfoot-penalty2").remove();
    } else {
      $(".master-table-row-penalty,.master-table-rowfoot-penalty").remove();
    }
    
    io.socket.get('/penaltydb/getAllPenalty', {
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data){
      var index = 0;
      $.each(data.setlist, function() {
        var tablerowDiv = $('#set_template > .master-table-row_template').clone();
        
        tablerowDiv.find('div:eq(1)>input').val(this.penaltyName);
        tablerowDiv.find('div:eq(2)>input').val(this.balancePoint).attr({class: 'num', maxlength: 4});
        tablerowDiv.find('div:eq(3)>input').val(this.deduction).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(4)>input').val(this.penaltyNote);
        tablerowDiv.find('div:eq(5),div:eq(6),div:eq(7)').remove();
        
        var deleteButton = tablerowDiv.find('.set_del');
        
        if(tmp !== '') {
          tablerowDiv.attr('class', 'master-table-row-penalty2');
          deleteButton.attr('class', 'row_delete_penalty2 delBtn');
          $('.master-table-penalty2 > div:last-child').after( tablerowDiv );
        } else {
          tablerowDiv.attr('class', 'master-table-row-penalty');
          deleteButton.attr('class', 'row_delete_penalty delBtn');
          $('.master-table-penalty > div:last-child').after( tablerowDiv );
        }
        
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template > .master-table-row_template').clone();
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot-penalty2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-penalty-addrow2', class: 'addBtn'});
        $('.master-table-penalty2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-penalty').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot-penalty');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-penalty-addrow', class: 'addBtn'});
        $('.master-table-penalty > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-penalty').css({"display": "inline" });
      }
    });
  }
  // ペナルティ管理から<<登録>>ボタン押下
  function tenpo_penalty_create(tmp){
    var setrowDiv = $('.master-table-row-penalty');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row-penalty2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.post('/penaltydb/penaltyDelete', {
      prm_companyId: prm_companyId,
      prm_tenpoId  : prm_tenpoId
    }, function(err) {
      //load_tenpo_list();
    });
    
    // 行の情報からDBに登録
    var index   = 0;
    var setarry = [];
    
    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row-penalty:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row-penalty2:eq(' + index + ')');
      }
      setarry[index] = [];
      
      setarry[index][0] = Number(index) + 1;//arryrow.find('div:eq(1)>input').val();
      setarry[index][1] = arryrow.find('div:eq(1)>input').val();
      setarry[index][2] = arryrow.find('div:eq(2)>input').val();
      setarry[index][3] = arryrow.find('div:eq(3)>input').val();
      setarry[index][4] = arryrow.find('div:eq(4)>input').val();
      
      io.socket.post('/penaltydb/penaltyCreate', {
        prm_companyId   : prm_companyId,
        prm_tenpoId     : prm_tenpoId,
        prm_arry        : setarry[index]
      }, function(err) {
        //load_tenpo_list();
      });
      index ++;
    });

  }
  
  
/// 商品管理 /////////////////////////////////////////////////////////////////////////////////////
  // 商品管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function tenpo_product_expression(tmp){
  
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row-product2,.master-table-rowfoot-product2").remove();
      // 商品種別プルダウンの初期化
      $('select#productTypePulldown2 option').remove();
      $('#productTypePulldown2').append($('<option>').html("未設定").val(""));
    } else {
      $(".master-table-row-product,.master-table-rowfoot-product").remove();
      // 商品種別プルダウンの初期化
      $('select#productTypePulldown option').remove();
      $('#productTypePulldown').append($('<option>').html("未設定").val(""));
    }
    
    // 商品種別プルダウンのデータ取得
    io.socket.get('/productTypedb/getAllProductType', {
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data) {
      $.each(data.setlist, function() {
        if(tmp !== '') {
          $('#productTypePulldown2').append($('<option>').html(this.productTypeName).val(this.productTypeId));
        } else {
          $('#productTypePulldown').append($('<option>').html(this.productTypeName).val(this.productTypeId));
        }
      });
    });
    
    io.socket.post('/productdb/getAllproduct', { 
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data){
      var index = 0;
      $.each(data.setlist, function() {
        var tablerowDiv = $('#set_template2 > .master-table-row_template2').clone();
        if(tmp !== '') {
          tablerowDiv = $('#set_template2_m > .master-table-row_template2_m').clone();
        }
        
        tablerowDiv.find('div:eq(1)>input').val(this.productName);
        tablerowDiv.find('div:eq(2)>select').val(this.productTypeId);
        if(this.quickOrder == "1") {
          tablerowDiv.find('div:eq(3)>input').attr("checked", true);
        }
        tablerowDiv.find('div:eq(4)>input').val(this.salesPrice).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(5)>input').val(this.castPoint).attr({class: 'num', maxlength: 4});
        tablerowDiv.find('div:eq(6)>input').val(this.cashBack).attr({class: 'num', maxlength: 10});
        tablerowDiv.find('div:eq(7)>input').val(this.productNote);
        
        var deleteButton = tablerowDiv.find('.set_del');
        
        if(tmp !== '') {
          tablerowDiv.attr('class', 'master-table-row-product2');
          deleteButton.attr('class', 'row_delete_product2 delBtn');
          $('.master-table-product2 > div:last-child').after( tablerowDiv );
        } else {
          tablerowDiv.attr('class', 'master-table-row-product');
          deleteButton.attr('class', 'row_delete_product delBtn');
          $('.master-table-product > div:last-child').after( tablerowDiv );
        }
        
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template2 > .master-table-row_template2').clone();
      if(tmp !== '') {
        tablerowDiv = $('#set_template2_m > .master-table-row_template2_m').clone();
      }
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot-product2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-product-addrow2', class: 'addBtn'});
        $('.master-table-product2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-product').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot-product');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-product-addrow', class: 'addBtn'});
        $('.master-table-product > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-product').css({"display": "inline" });
      }
      
    });
  }
  // 商品管理から<<登録>>ボタン押下
  function tenpo_product_create(tmp){
    var setrowDiv = $('.master-table-row-product');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row-product2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.post('/productdb/productDelete', {
      prm_companyId: prm_companyId,
      prm_tenpoId  : prm_tenpoId
    }, function(err) {
      //load_tenpo_list();
    });
    
    // 行の情報からDBに登録
    var index   = 0;
    var setarry = [];
  
    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row-product:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row-product2:eq(' + index + ')');
      }
      setarry[index] = [];
        
      setarry[index][0] = arryrow.find('div:eq(2)>select').val(); // 商品種別
      setarry[index][1] = Number(index) + 1; // 商品ID
      setarry[index][2] = arryrow.find('div:eq(1)>input').val(); // 商品名
      var quickOrder = "";
      if(arryrow.find('div:eq(3)>input').attr("checked") !== undefined){
        quickOrder = arryrow.find('div:eq(3)>input').val();
      }
      setarry[index][3] = quickOrder; // クイックオーダー
      setarry[index][4] = arryrow.find('div:eq(5)>input').val(); // ポイント
      setarry[index][5] = arryrow.find('div:eq(6)>input').val(); // キャッシュバック
      setarry[index][6] = arryrow.find('div:eq(4)>input').val(); // 販売価格
      setarry[index][7] = arryrow.find('div:eq(7)>input').val(); // 備考
  
      io.socket.post('/productdb/productCreate', {
        prm_companyId   : prm_companyId,
        prm_tenpoId     : prm_tenpoId,
        prm_arry        : setarry[index]
      }, function(err) {
        //load_tenpo_list();
      });
      index ++;
    });

  }
  
  
/// 商品種別管理 /////////////////////////////////////////////////////////////////////////////////////
  // 商品種別管理DBから読み込んで表作成
  // tmp:マスタ管理か識別
  function tenpo_productType_expression(tmp){
    
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
      $(".master-table-row-productType2,.master-table-rowfoot-productType2").remove();
    } else {
      $(".master-table-row-productType,.master-table-rowfoot-productType").remove();
    }
    

    io.socket.get('/productTypedb/getAllProductType', {
      prm_companyId : prm_companyId,
      prm_tenpoId   : prm_tenpoId
    }, function(data){
      var index = 0;
      $.each(data.setlist, function() {
        var tablerowDiv = $('#set_template > .master-table-row_template').clone();
        
        tablerowDiv.find('div:eq(1)>input').val(this.productTypeName);
        tablerowDiv.find('div:eq(2)>input').remove();
        tablerowDiv.find('div:eq(2)').append('<input type="checkbox" class="checkbox" value="1"/>');
        if(this.immediatePaymentFlag == "1") {
          tablerowDiv.find('div:eq(2)>input').attr("checked", true);
        }
        tablerowDiv.find('div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();

        var deleteButton = tablerowDiv.find('.set_del');
        
        if(tmp !== '') {
          tablerowDiv.attr('class', 'master-table-row-productType2');
          deleteButton.attr('class', 'row_delete_productType2 delBtn');
          $('.master-table-productType2 > div:last-child').after( tablerowDiv );
        } else {
          tablerowDiv.attr('class', 'master-table-row-productType');
          deleteButton.attr('class', 'row_delete_productType delBtn');
          $('.master-table-productType > div:last-child').after( tablerowDiv );
        }
        index++;
      });
      // 行追加ボタンを設置
      var tablerowDiv = $('#set_template > .master-table-row_template').clone();
      tablerowDiv.find('div:eq(1),div:eq(2),div:eq(3),div:eq(4),div:eq(5),div:eq(6),div:eq(7)').remove();
      if(tmp !== '') {
        tablerowDiv.attr('class', 'master-table-rowfoot-productType2');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-productType-addrow2', class: 'addBtn'});
        $('.master-table-productType2 > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#master-detail-menu').css({"display": "none" });
        $('#master-productType').css({"display": "inline" });
      } else {
        tablerowDiv.attr('class', 'master-table-rowfoot-productType');
        tablerowDiv.find('div:eq(0)>button').text('+').attr({id: 'master-tenpo-detail-productType-addrow', class: 'addBtn'});
        $('.master-table-productType > div:last-child').after( tablerowDiv );
        // 表示切替
        $('#middle-pane-master-detail-menu').css({"display": "none" });
        $('#middle-pane-master-productType').css({"display": "inline" });
      }
    });
  }
  // 商品管理から<<登録>>ボタン押下
  function tenpo_productType_create(tmp){
    var setrowDiv = $('.master-table-row-productType');
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    if(tmp !== '') {
      setrowDiv = $('.master-table-row-productType2');
      prm_companyId = _companyID;
      prm_tenpoId = tmp;
    }
    
    // CompanyIDとTenpoIDが一致するIdをすべて削除する。
    io.socket.post('/productTypedb/productTypeDelete', {
      prm_companyId: prm_companyId,
      prm_tenpoId  : prm_tenpoId
    }, function(err) {
      //load_tenpo_list();
    });
    
    // 行の情報からDBに登録
    var index   = 0;
    var setarry = [];
  
    $.each(setrowDiv, function() {
      var arryrow = $('.master-table-row-productType:eq(' + index + ')');
      if(tmp !== '') {
        arryrow = $('.master-table-row-productType2:eq(' + index + ')');
      }
      setarry[index] = [];
  
      setarry[index][0] = Number(index) + 1; // 商品ID
      setarry[index][1] = arryrow.find('div:eq(1)>input').val(); // 商品種別名
      var immediatePaymentFlag = "";
      if(arryrow.find('div:eq(2)>input').attr("checked") !== undefined){
        immediatePaymentFlag = arryrow.find('div:eq(2)>input').val();
      }
      setarry[index][2] = immediatePaymentFlag; // 商品種別Flag
  
      io.socket.post('/productTypedb/productTypeCreate', {
        prm_companyId   : prm_companyId,
        prm_tenpoId     : prm_tenpoId,
        prm_arry        : setarry[index]
      }, function(err) {
        //load_tenpo_list();
      });
      index ++;
    });

  }
  
  // 各店舗下情報に店舗下情報テンプレートをコピーする
  function tenpo_templates_copy() {
    var prm_companyId = detail_companyID;
    var prm_tenpoId = detail_tenpoId;
    
    // 出退勤マスタ
    // CompanyIDとTenpoIDが一致するIdをすべて削除する
    io.socket.get('/master_append?limit=0',{ companyId: prm_companyId, tenpoId: prm_tenpoId },function(res){
      for(var c in res){
        io.socket.delete('/master_append',{ id: res[c].id },function(res){
           console.log('detailrecord :'+ c +' 件目削除');
        });
      }
      
      io.socket.get('/master_append?limit=0',{ companyId: prm_companyId, tenpoId: 'temp' },function(data){
        for(var col=0; col<data.length; col++){
          var temp = data[col];
        
          io.socket.post('/master_append',{
            companyId  : prm_companyId,
            tenpoId    : prm_tenpoId,
            appendId   : temp.appendId,
            appendName : temp.appendName,
            append	   : temp.append,
            appendNote : temp.appendNote
          }, function(ret,err) {
            console.log(ret,err);
          });
        }
      });
    });
    
    io.socket.post('/tenpodb/copyTemplatesToDb', {
      prm_companyId   : prm_companyId,
      prm_tenpoId     : prm_tenpoId,
      prm_templateId  : 'temp'
    }, function(err) {
      //load_tenpo_list();
    });
  }

////////////////////////////////////////////////////////////////////////////////////////////
  // 初期化
  function variableInitialize(){
    detail_companyID = "";
    detail_tenpoId   = "";
    detail_tenpoName = "";
  }
  
  // 更新されたら再読み込み
	io.socket.on('mshop', function (e) {
    switch(e.verb){
//      case 'created': break;
//      case 'deleted': break;
//      case 'updated':
      default:load_tenpo_list();
    }

  });

  if('undefined' == typeof module) {
    
    if(!window.ks) {
      window.ks = {};
    }
    
    window.ks.masterDetail = masterDetail;
    
  } else {
    module.exports = masterDetail;
  }
  
})();
