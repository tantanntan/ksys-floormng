(function() {
//  var cast = {};
  var _wt = new KsWidgetTmpl();
  var _allCDiv = "#"+_wt.allCastId;
  var _allVDiv = "#"+_wt.allVisitorId;
  var _cidPrefix = "cid-";
  var _collapsePrefix = 'collapse-';

  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/cast.html',
    obj: {},
    loaded: false
  };

  _wt.initCast = function(){
    console.log('initCast() called.');
    _wt.findAllCast(
      function(res){
        $('#all_cast div').remove();
        _wt.addAllCast(res);

      }
    );
  };
  _wt.addAllCast = function(casts){
    $.each(casts, function() {
      _wt.showCast(this);
    });
  };
  
  //
  //show a cast.
  //
  _wt.showCast = function(_c) {
    var _div = _wt.findCastDivByCid(_c.id);
    _wt.addCast(_c);
  };

  //
  //show a cast.
  //
  /** Clone from widget template, Fill it from argument and Display it */
  _wt.addCast = function (_c) {
    _wt.fromHtml(_wt._html, function(_div,_p) {
      _div.attr('id', _cidPrefix + _c.id);
      _div.find('.toggle').attr('href','#'+_collapsePrefix+_c.id);
      _div.find('.panel-collapse').attr('id',_collapsePrefix + _c.id);
      _div.find('.cast-name').text(_c.name);
      _div.find('.livetime-minute').attr('live-time',_c.startTime);
      var sname = _wt.findSeatNameCastSeated(_c.id);
      if( _c.seated && _c.seated !== '' ){
        _div.find('.cast-seated').addClass('label-primary').text(sname);
        _div.find('.cast-status').removeClass().addClass('cast-status '+'glyphicon glyphicon-heart');
      }else{
        if( _c.cd_time != ':' && _c.cj_time_fr == ':' ) {
          _div.find('.cast-seated').addClass('label-danger').text('同伴');
        } else {
          _div.find('.cast-seated').addClass('label-warning').text('待機');
        }
        _div.find('.cast-status').removeClass().addClass('cast-status '+'glyphicon glyphicon-user');
      }
      _wt.ddui.attachDraggableForCast(_div,_c);
      var old = _wt.findCastDivByCid(_c.id);
      if(old.length === 0){
        $(_allCDiv).append(_div).fadeIn(500);
      }else{
        _div.replaceAll(old).fadeIn(500);
      }
    });
  };
  
//--------------- private methods.

//--------------- socket events.

  io.socket.on('castlady', function (e) {
    switch(e.verb){
//      case 'created': break;
//      case 'deleted': break;
//      case 'updated':
      default:_wt.initCast();
    }

  });
//////exports
    if('undefined' == typeof module){
        if( !window.ks ){window.ks = {};}
        window.ks.cast = _wt;
    } else {
        module.exports = _wt;
    }
})()