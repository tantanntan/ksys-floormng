/**
 * ProductDbController
 *
 * @description :: Server-side logic for managing tenpodbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // 一覧を取得
  getAllproduct: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    ProductDb.find( { companyId: cid,tenpoId: tid },{sort: 'productId ASC'}, function(err, sets) {
      // memo: {sort: {seatId: 1}}  昇順 ASC
      //       {sort: {seatId: -1}} 降順 DEC
        res.json( { setlist: sets } );
      });
  },

  productDelete: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    ProductDb.find( { companyId: cid, tenpoId: tid }, function(err, sets) {
      for(var col=0; col<sets.length; col++){
        var setdel = sets[col];
        setdel.destroy(function(err) { res.send(err) });
      }
    });
  },
    
  productCreate: function (req, res) {
    var setArry = req.param('prm_arry');
  
    ProductDb.create({ 
      companyId     : req.param('prm_companyId'),
      tenpoId       : req.param('prm_tenpoId'),
      productTypeId : setArry[0],
      productId     : setArry[1],
      productName	  : setArry[2],
      quickOrder    : setArry[3],
      castPoint     : setArry[4],
      cashBack      : setArry[5],
      salesPrice    : setArry[6],
      productNote	  : setArry[7]
    }, function(err, created) {
      res.send(err);
    });
  }

};