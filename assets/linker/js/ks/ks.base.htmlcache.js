( function( window,undefined ){
  var cache = {};
  function KsHtmlCache(){    
    var _proto = KsHtmlCache.prototype;
    _proto.setCache = function( _opt ){
      cache[_opt.name] =  {
        name: _opt.name,
        url: _opt.url,
        obj: {},
        loaded: false
      };
    };
    _proto.getCache = function( name ){
      return cache[ name ];
    };
  }
window.KsHtmlCache = KsHtmlCache;
} )( window );