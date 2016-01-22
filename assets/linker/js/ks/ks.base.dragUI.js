// ksys/ksys.base.dragUI.js
// injected as "KsWidgetTmpl(ks.widgettmpl.js).ddui"
(function(window,undefined) {
  function KsDragUi(){
    var _proto = KsDragUi.prototype;
    
    //新規顧客のドロップイベントをアタッチ
    _proto.attachDroppableForNewVis = function(_elm,cb){
        _elm.droppable({
            accept: ".ddui-waiting-visitor",
            hoverClass: "panel-warning",
            drop: function(event, ui) {
                cb(event,ui);
            }
        });
    };

    //キャス着席のドロップイベントをアタッチ
    _proto.attachDroppableForCastSeated = function(_elm,cb){
        _elm.droppable({
            accept: ".castlady",
            hoverClass: "btn-info",
            over: function(event, ui) {
//                console.log('over!',event,ui);
            },
            drop: function(event, ui) {
                cb(event,ui);
            }
        });
    };
    
    // 【汎用】ドロップイベントをアタッチ
    _proto.attachDroppableForNewCas = function(_elm,acc,cla,cb){
        _elm.droppable({
            accept: acc,
            hoverClass: cla,
            drop: function(event, ui) {
                cb(event,ui);
            }
        });
    };
    
    // 【汎用】ドロップイベントをアタッチ(accept2つ用)
    _proto.attachDroppableForNewCas2 = function(_elm,acc1,acc2,cla,cb){
        var acc = '"' + acc1 + ',' + acc2 + '"';
        _elm.droppable({
            accept: acc,
            hoverClass: cla,
            drop: function(event, ui) {
                cb(event,ui);
            }
        });
    };
    
    
  //ツールチップをアタッチ
  _proto.attachTooltip = function(_v,_title){
      _v.tooltip({ 
        title: _title, 
        delay: {'show':0 , 'hide':200 }
      }).tooltip('show');
      setTimeout( function(_v){_proto.hideTooltip(_v)}, 2000 );
    };
    _proto.hideTooltip = function(_v){_v.tooltip('hide');};
    
    // appendTo   :helper のコンテナ要素を指定
    // containment:ドラッグの範囲を制限
    // scroll     :true に指定すると、ドラッグ中にオートスクロールが実行される
    _proto.attachDraggableForCast = function(_v,_c){
      _v.draggable({
        appendTo: 'body',
        containment: 'window',
        scroll: false,
        snapTolerance: 50,
        opacity: 0.5,
        distance: 5,
        helper: "clone",
        // helper: function( event ) {
        //   return $( "<div><span class='glyphicon glyphicon-plus-sign' ></span>" + _c.name + "</div>" );
        // },
        stop: function(e, ui) {
      }});
    };
  }
    //exports
    window.KsDragUi = KsDragUi;
})(window);