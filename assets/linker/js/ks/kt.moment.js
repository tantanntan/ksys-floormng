( function( ){
  var _m = {};
  //extends prototype.
  var _wt = new KsWidgetTmpl();

  function updMin(){
    var m = moment(); //現在の時刻が入る
    var n = m.format("HH:mm");
    var _x = $('.time_from');
    
    // 【nsysスマホ】
    var f = $('#mobile-time-sta').text();
    var e = $('#mobile-time-end').text();
    if(((f != '' && f > n) || (e != '' && e < n)) && $('#mobile_stopping').css('display') == 'none'){
      ns.mobile.initMobile();
    }
    // TODO:else条件をどうするか
    
    // 【出退勤】出勤予定時刻を過ぎた場合、赤字に
    for(var k = 0; k < _x.length; k++){
      var _v3 = $(_x[k]);
      if(_v3.text() < n){
        _v3.css("color", "red");
      }
    }
    
    var _f = $('.livetime-minute');
    for(var i = 0; i < _f.length; i++){
      var _v = $(_f[i]);
      var _t = _v.attr('live-time');
      if(_v.hasClass('minute-from')){
        // _v.text(moment.duration(
        //   moment( _t ).diff(moment())
        //   ).humanize());
        var hours1 = moment.duration(moment( _t ).diff(moment())).hours() * -1;
        var minutes1 = moment.duration(moment( _t ).diff(moment())).minutes() * -1;
        if(hours1 !== 0) {
          minutes1 = minutes1 + hours1 * 60;
        }
        _v.text("(" + minutes1 + "分)");
        _v.attr('live-minutes',minutes1);
        
        var _c_id = _v.parent().parent().attr('id');
        if(_c_id != undefined){
          _c_id = _c_id.replace('seated-cid-','');
        }
        var _v_id = _v.parent().parent().parent().parent().parent().attr('id');
        if(_v_id != undefined){
          _v_id = _v_id.replace('well-seated-vid-','');
          var _div = _wt.isCastChoosed(_v_id);
          //var _setTime = parseInt(_v.attr('set-time'),10);
          var _callTime = parseInt(_div.find('.called-cid-'+_c_id).attr('time'),10);
          //var calc = Math.floor((minutes1 + _callTime) / _setTime * 100);
          //_div.find('.called-cid-'+_c_id).find('.live-percentage').text('(' + calc + '%)');
          var calc = minutes1 + _callTime;
          _div.find('.called-cid-'+_c_id).find('.live-percentage').text('(' + calc + '分)');
        }
        
        //_wt.calcSeatCastPercentage(_c_id,minutes1);
        //console.log(_wt.findVidCastSeated(_c_id));
      }
      
    }
    for(var j = _f.length; j >= 0; j--){
      var _v2 = $(_f[j]);
      var _t2 = _v2.attr('live-time');
      if(_v2.hasClass('minute-to')){
        var hours = moment.duration(moment( _t2 ).diff(moment())).hours();
        var minutes = moment.duration(moment( _t2 ).diff(moment())).minutes();
        if(hours !== 0) {
          minutes = minutes + hours * 60;
        }
        _v2.text(minutes + "分");
        // 10分以下になった場合、時間を赤くする
        if(minutes<=10) {
          _v2.css("background-color", "red");
        } else {
          _v2.css("background-color", "blue");
        }
      }
    }
  }
///event
  setTimeout(function(){
    if(!$){
      setTimeout(arguments.callee, 100);
    }else{
      setInterval(updMin,1000);
    }},100);
//////exports
  if('undefined' == typeof module){
      if( !window.ks ){window.ks = {};}
      window.ks.moment = _m;
  } else {
      module.exports = _m;
  }
})()