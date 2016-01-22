/******
 * ns.master.js
 * マスタ画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  
  _wt.initMaster = function(){
    console.log('initMaster() called.');
    
    _wt.initMasterModals();
    
    // 施設マスタから施設情報取得
    _wt.findNShop(
      function(res){
        $('.login-shopname').text(res[0].shopName);
        
        $('.master-tenpo-service-opening_h option').remove();
        $('.master-tenpo-service-opening_m option').remove();
        $('.master-tenpo-service-closing_h option').remove();
        $('.master-tenpo-service-closing_m option').remove();
        $('.master-tenpo-mobile-opening_h option').remove();
        $('.master-tenpo-mobile-opening_m option').remove();
        $('.master-tenpo-mobile-closing_h option').remove();
        $('.master-tenpo-mobile-closing_m option').remove();
        _wt.getPulldown_h($('.master-tenpo-service-opening_h'));
        _wt.getPulldown_m($('.master-tenpo-service-opening_m'));
        _wt.getPulldown_h($('.master-tenpo-service-closing_h'));
        _wt.getPulldown_m($('.master-tenpo-service-closing_m'));
        _wt.getPulldown_h($('.master-tenpo-mobile-opening_h'));
        _wt.getPulldown_m($('.master-tenpo-mobile-opening_m'));
        _wt.getPulldown_h($('.master-tenpo-mobile-closing_h'));
        _wt.getPulldown_m($('.master-tenpo-mobile-closing_m'));
        
        // 取得した情報をセット
        $('#master-tenpo-mid').val(res[0].m_id);
        $('#master-tenpo-id').val(res[0].id);
        $('#master-tenpo-name').val(res[0].shopName);
        $('#master-tenpo-number').val(res[0].number);
        $('#master-tenpo-address').val(res[0].tenpoAddress);
        $('#master-tenpo-tel').val(res[0].tenpoTel);
        $('#master-tenpo-fax').val(res[0].fax);
        $('#master-tenpo-url').val(res[0].url);
        $('#master-tenpo-gurl').val(res[0].gurl);
        _wt.checkboxCheck(res[0].tenpoMon, $('#master-tenpo-week-mon'));
        _wt.checkboxCheck(res[0].tenpoTue, $('#master-tenpo-week-tue'));
        _wt.checkboxCheck(res[0].tenpoWed, $('#master-tenpo-week-wed'));
        _wt.checkboxCheck(res[0].tenpoThu, $('#master-tenpo-week-thu'));
        _wt.checkboxCheck(res[0].tenpoFri, $('#master-tenpo-week-fri'));
        _wt.checkboxCheck(res[0].tenpoSat, $('#master-tenpo-week-sat'));
        _wt.checkboxCheck(res[0].tenpoSun, $('#master-tenpo-week-sun'));
        $('#master-tenpo-wait').val(res[0].waitT);
        
        // オプションマスタ検索
        _wt.findNOption(function(opt){
          // 初期化
          var delindex = $('.option_title').parent().parent().index() + 1;
          for( var i = 1; i < delindex; i++ ) {
            $("#nsys_master_table_option tr:last").remove();
          }
          
          var cnt = 1;
          for(var c in opt){
            var optionT_Div = $('#option_templateT').clone();
            $('#nsys_master_table_option').append(optionT_Div);
            $('#nsys_master_table_option tr:last').css('display', '');
            $('.option_title').eq(cnt).val(opt[c].otitle);
            $('.option_title_en').eq(cnt).val(opt[c].oetitle);
            
            var option1_Div = $('#option_template1').clone();
            $('#nsys_master_table_option').append(option1_Div);
            $('#nsys_master_table_option tr:last').css('display', '');
            $('.option_name1').eq(cnt).val(opt[c].oname1);
            $('.option_name1_en').eq(cnt).val(opt[c].oename1);
            $('.option_mark1').eq(cnt).val(opt[c].omark1);
            
            var option2_Div = $('#option_template2').clone();
            $('#nsys_master_table_option').append(option2_Div);
            $('#nsys_master_table_option tr:last').css('display', '');
            $('.option_name2').eq(cnt).val(opt[c].oname2);
            $('.option_name2_en').eq(cnt).val(opt[c].oename2);
            $('.option_mark2').eq(cnt).val(opt[c].omark2);
            
            var option3_Div = $('#option_template3').clone();
            $('#nsys_master_table_option').append(option3_Div);
            $('#nsys_master_table_option tr:last').css('display', '');
            $('.option_name3').eq(cnt).val(opt[c].oname3);
            $('.option_name3_en').eq(cnt).val(opt[c].oename3);
            $('.option_mark3').eq(cnt).val(opt[c].omark3);
            
            cnt++;
          }
        });
        
        // 営業時間マスタ検索
        _wt.findNRecep(function(rec){
          // 初期化
          var delindex2 = $('.master-tenpo-service-opening_h').parent().parent().length;
          for( var j = 1; j < delindex2; j++ ) {
            $("#nsys_master_table_business tr:last").remove();
          }
          
          var cnt2 = 1;
          for(var c in rec){
            var optionT_Div2 = $('#business_template').clone();
            $('#nsys_master_table_business').append(optionT_Div2);
            $('#nsys_master_table_business tr:last').css('display', '');
            $('.master-tenpo-service-opening_h').eq(cnt2).val(rec[c].serviceOpening.substr(0,2));
            $('.master-tenpo-service-opening_m').eq(cnt2).val(rec[c].serviceOpening.substr(3,2));
            $('.master-tenpo-service-closing_h').eq(cnt2).val(rec[c].serviceClosing.substr(0,2));
            $('.master-tenpo-service-closing_m').eq(cnt2).val(rec[c].serviceClosing.substr(3,2));
            $('.master-tenpo-mobile-opening_h').eq(cnt2).val(rec[c].smartOpening.substr(0,2));
            $('.master-tenpo-mobile-opening_m').eq(cnt2).val(rec[c].smartOpening.substr(3,2));
            $('.master-tenpo-mobile-closing_h').eq(cnt2).val(rec[c].smartClosing.substr(0,2));
            $('.master-tenpo-mobile-closing_m').eq(cnt2).val(rec[c].smartClosing.substr(3,2));
            
            cnt2++;
          }
        });
        
        $('#master-tenpo-detail-create').unbind();
        $('#master-tenpo-detail-create').bind('click',function(e){
          if(!confirm("上記の状態で施設情報を登録します。よろしいですか？")){
            return false;
          }
          _wt.createShop();
        });
        
        // オプション追加ボタン
        $('#btn_option_add').unbind();
        $('#btn_option_add').bind('click',function(e){
          // オプション最大登録数は４件まで
          if($('.option_title').length > 4) {
            alert('これ以上オプションは追加できません。');
            return false;
          }
          var optionT_Div = $('#option_templateT').clone();
          $('#nsys_master_table_option').append(optionT_Div);
          $('#nsys_master_table_option tr:last').css('display', '');
          
          var option1_Div = $('#option_template1').clone();
          $('#nsys_master_table_option').append(option1_Div);
          $('#nsys_master_table_option tr:last').css('display', '');
          
          var option2_Div = $('#option_template2').clone();
          $('#nsys_master_table_option').append(option2_Div);
          $('#nsys_master_table_option tr:last').css('display', '');
          
          var option3_Div = $('#option_template3').clone();
          $('#nsys_master_table_option').append(option3_Div);
          $('#nsys_master_table_option tr:last').css('display', '');
        });
        
        // オプション削除ボタン
        $('#btn_option_del').unbind();
        $('#btn_option_del').bind('click',function(e){
          // オプション行が表示されていなければ何もしない
          if($('.option_title').length < 2) {
            return false;
          }
          for(var i=0; i<4; i++){
            $('#nsys_master_table_option tr:last').remove();
          }
        });
        
        // 営業時間追加ボタン
        $('#btn_business_add').unbind();
        $('#btn_business_add').bind('click',function(e){
          // オプション最大登録数は４件まで
          if($('.master-tenpo-service-opening_h').length > 4) {
            alert('これ以上営業時間は追加できません。');
            return false;
          }
          var optionT_Div = $('#business_template').clone();
          $('#nsys_master_table_business').append(optionT_Div);
          $('#nsys_master_table_business tr:last').css('display', '');
        });
        
        // 営業時間削除ボタン
        $('#btn_business_del').unbind();
        $('#btn_business_del').bind('click',function(e){
          // 営業時間行が表示されていなければ何もしない
          if($('.master-tenpo-service-opening_h').length < 2) {
            return false;
          }
          $('#nsys_master_table_business tr:last').remove();
        });
        
        // パスワード変更モーダル画面起動
        $('#master-tenpo-password').unbind();
        $('#master-tenpo-password').bind("focus", function(){
          // 既に登録されている場合のみ起動
          if($('#master-tenpo-id').val() != ''){
            _wt.openPasswordNsys();
          }
        });
        
        // スマホ受付時間チェックボックス
        $('.master-tenpo-chk').live('click',function(e){
          var index = $(this).parent().parent().index();
          if(_wt.setCheckboxVal($('.master-tenpo-chk').eq(index)) != ''){
            $('.master-tenpo-mobile-opening_h').eq(index).val($('.master-tenpo-service-opening_h').eq(index).val());
            $('.master-tenpo-mobile-opening_m').eq(index).val($('.master-tenpo-service-opening_m').eq(index).val());
            $('.master-tenpo-mobile-closing_h').eq(index).val($('.master-tenpo-service-closing_h').eq(index).val());
            $('.master-tenpo-mobile-closing_m').eq(index).val($('.master-tenpo-service-closing_m').eq(index).val());
          }
        });
      });
  };
  
  //
  //initialize modals for presence
  //
  _wt.initMasterModals = function(){
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-member-password.html', function(res){
      $('body').append(res);
    });
  };
  
  // io.socket.on('nshop', function (e) {
  //   switch(e.verb){
  //     default:_wt.initMaster();
  //   }

  // });
  
//////exports
  if('undefined' == typeof module){
    if( !window.ns ){window.ns = {};}
      window.ns.master = _wt;
  } else {
    module.exports = _wt;
  }
})();