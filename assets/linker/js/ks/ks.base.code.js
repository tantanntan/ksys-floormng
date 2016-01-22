(function() {
  var _code = {};

  _code.attributes = {};

  _code.init = function(){
    //コードの初期化
    io.socket.get('/code',{ksyscode: 'ALLCODE'},function(res){
      _code.attributes = res;
      console.log("kscode",_code.attributes);
    });
  };

  //引数と同じ名称のコード体系OBJを返す
  //一致しない場合はundefined.
  _code.getCodeList = function(name){
    for(var codes in _code.attributes){ if( codes != name ) continue; else return _code.attributes[name];}
    return undefined;
  };

  //コードOBJを返す
  _code.getCodeObj = function(name,attr){
    var codes = _code.getCodeList(name);
    if(codes == undefined) return undefined;
    for(var _attr in codes){if( _attr != attr) continue; else return _code.attributes[name][attr];}
    return undefined;
  };

  //コードからコード名を返す
  _code.getNameFromCode = function(name,code){
    var codes = _code.getCodeList(name);
    if(codes == undefined) return undefined;
    for(var _attr in codes){if( _code.attributes[name][_attr].code != code) continue; else return _attr;}
    return undefined;
  };

  //コードからラベルを返す
  _code.getLabelFromCode = function(name,code){
    var codes = _code.getCodeList(name);
    if(codes == undefined) return undefined;
    for(var _attr in codes){if( codes[_attr].code != code) continue; else return codes[_attr].label;}
    return undefined;
  };
  
  //コード名からコードを返す
  _code.getCodeFromName = function(code,attr){
    var codes = _code.getCodeList(code);
    if(codes == undefined) return undefined;
    for(var _attr in codes){if( _attr != attr ) continue; else return codes[_attr].code;}
    return undefined;
  };

  //init events
  io.socket.on('connect', function() {
    _code.init();
  });

//////exports
    if('undefined' == typeof module){
        if( !window.ks ){window.ks = {};}
        window.ks.codeUtil = _code;
    } else {
        module.exports = _code;
    }
})()