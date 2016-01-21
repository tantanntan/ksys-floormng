(function() {
//  var visitor = {};
  var _wt = new KsWidgetTmpl();
  var _allVDiv = "#" + _wt.allVisitorId;

  /** Clone from widget template, Fill it from argument and Display it */

  _wt.addAllVisitors = function (visitors) {
    $.each(visitors, function() {
       addVisitor(this);
    });
  };

  //卓に客を追加
  _wt.addVisitor = function(visitor) {
    var _v,_vd,_new = false;

    if( $('#all_visitors').find('#vid-'+visitor.id).length === 0){
      _v = $('#widgetTemplates').find('.visitor').clone();
      _v.attr('id','vid-'+visitor.id);
      _v.find('.toggle').attr('href','#collapse-'+visitor.id);
      _v.find('.panel-collapse').attr('id','collapse-'+visitor.id);
      
      _new = true;
    }else{
      _v = $('#all_visitors').find('#vid-'+visitor.id);
    }
    _vd = _v.find('#collapse-'+visitor.id);
    _v.find('.table').text(visitor.tableName);
    _v.find('.name').text(visitor.name);
    _v.find('.status').text(visitor.number);
    _v.find('.visitor-time').text('00:00');
    _v.find('.visitor-amount').text('00,000円');
    if(_new){
      _v.find('.panel').droppable({
          tolerance: "pointer",
          hoverClass: "panel-warning",
          over: function(){
            _v.find('.panel-collapse').collapse('hide');
            _vd.collapse('show');
          },
          out: function(){
            _vd.collapse('hide');
          },
          drop: function(event, ui) {
            dropToVisitor(event, ui);
          }
        });
      //TODO: ここ、newでなければreplace()
      $('#all_visitors').append(_v).fadeIn(500);
    }else{
      
    }

  };

  _wt.findVisDivByCid = function (vid){
    return $(_allVDiv).find('#' + 'vid-' + vid);
  };
  _wt.initNewVisBtn = function (){
     $( '#new-visitor-drag' ).draggable({
      snapTolerance: 50,
      opacity: 0.5,
      distance: 5,
      revert: true,
      zIndex: 100
    });
  };
//events
  io.socket.on('connect', function() {


    io.socket.on('visitor', function (cometEvent) {
      console.log("ksvisitorで受信",cometEvent);
    });
  });

//  $("#top-pane-floor").ready( function(){
//    visitor.initNewVisBtn( );
//  });


//////exports
    if('undefined' == typeof module){
        if( !window.ks ){window.ks = {};}
        window.ks.visitor = _wt;
    } else {
        module.exports = _wt;
    }
})()