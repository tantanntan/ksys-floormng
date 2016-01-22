/**
 * app.js
 *
 */
(function() {

  // as soon as this file is loaded, connect automatically,
  //TODO:namespace,room
//  var socket = io.connect();
//  var socket = io.socket;
  
  
  
  
  
  //接続前処理
  if (typeof console !== 'undefined') {
    log('Connecting to Server...');
  }

  // Listen for Comet messages from Sails
  //////////////////////////////////////////////////////
  //new 0.10.5
  io.socket.on('connect', function() {
    console.log("接続されました");
    
    io.socket.on('disconnect', function(){
      console.log('user disconnected.try to reconnect');
      //io.connect();
    });

    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////

    //★暫定初期処理
    $(document).ready(function() {
      if(KsWidgetTmpl.prototype.accesslv != ''){
        //グロナビ
        $("#global-header").load('/panel/global-nav.html #global-nav', function(res){
          window._top_pane_floor_load = false;
          window._top_pane_ready_load = false;
          window._top_pane_presence_load = false;
          window._top_pane_stores_load = false;
          console.log(res);
          //$('.login-shopname').text(res.shopName);
        });
      }
      
      if(KsWidgetTmpl.prototype.nshopId != '' && KsWidgetTmpl.prototype.mobileFlg == ''){
        $("#global-header-nsys").load('/panel/global-nav-nsys.html #global-nav-nsys', function(res){
          window._top_pane_master_load = false;
          window._top_pane_customer_load = false;
          window._top_pane_staff_load = false;
          window._top_pane_mobile_load = false;
          console.log(res);
        });
      }
      
      if(KsWidgetTmpl.prototype.mobileFlg != ''){
        $("#global-header-mobile").load('/panel/global-nav-mobile.html #global-nav-mobile', function(res){
          window._top_pane_mobile_load = false;
          console.log(res);
        });
      }
      
      //momentロケール設定
      moment.locale('ja');

      //ローカル日付設定
      setTimeout(function(){
        if($('#current-local-time').size() == 0){
          setTimeout(arguments.callee, 100);
        }else{
          $('#current-local-time').toDate({
            format : 'm月d日(W) H時i分'
          });
        }
      },100);

    });

    //営業日を取得
    //座席を取得
      //socket.get('/visitor', {}, function(res) {
      //  $('#all_visitors div').remove();
      //  addAllVisitors(res);
      //});
  
  });//document.ready
    
  $( $('#visitor-seats-area') ).ready(function(){
    console.log("#visitor-seats-area is ready");
  });
  //log('Socket is now connected and globally accessible as `socket`.\n' + 'e.g. to send a GET request to Sails, try \n' + '`socket.get("/", function (response) ' + '{ console.log(response); })`');


  //window.socket = socket;

  // Simple log function to keep the example simple
  function log() {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }

})();