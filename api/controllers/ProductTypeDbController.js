/**
 * ProductTypeDbController
 *
 * @description :: Server-side logic for managing tenpodbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // 一覧を取得
  getAllProductType: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    ProductTypeDb.find( { companyId: cid,tenpoId: tid },{sort: 'productTypeId ASC'}, function(err, sets) {
      res.json( { setlist: sets } );
    });
  },

  productTypeDelete: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    ProductTypeDb.find( { companyId: cid, tenpoId: tid }, function(err, sets) {
      for(var col=0; col<sets.length; col++){
        var setdel = sets[col];
        setdel.destroy(function(err) { res.send(err) });
      }
    });
    
    // 商品種別マスタ削除時、商品マスタの商品種別をクリアする
    // ProductDb.find( { companyId: cid, tenpoId: tid }, function(err, items) {
    //   for(var col=0; col<items.length; col++){
    //     var itemsdiv = items[col];
    //     itemsdiv.productTypeId = null;
    //     itemsdiv.save(function(err) {
    //       res.send(err);
    //     });
    //   }
    // });
  },
    
  productTypeCreate: function (req, res) {
    var setArry = req.param('prm_arry');
  
    ProductTypeDb.create({ 
      companyId             : req.param('prm_companyId'),
      tenpoId               : req.param('prm_tenpoId'),
      productTypeId         : setArry[0],
      productTypeName       : setArry[1],
      immediatePaymentFlag  : setArry[2]
    }, function(err, created) {
      res.send(err);
    });
  }

};