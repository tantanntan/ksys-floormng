/**
 * DeductionDbController
 *
 * @description :: Server-side logic for managing tenpodbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // 一覧を取得
  getAllDeduction: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    DeductionDb.find( { companyId: cid,tenpoId: tid },{sort: 'deductionId ASC'}, function(err, sets) {
      // memo: {sort: {seatId: 1}}  昇順 ASC
      //       {sort: {seatId: -1}} 降順 DEC
        res.json( { setlist: sets } );
      });
  },

  deductionDelete: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    DeductionDb.find( { companyId: cid, tenpoId: tid }, function(err, sets) {
      for(var col=0; col<sets.length; col++){
        var setdel = sets[col];
        setdel.destroy(function(err) { res.send(err) });
      }
    });
  },
    
  deductionCreate: function (req, res) {
    var setArry = req.param('prm_arry');
  
    DeductionDb.create({ 
      companyId     : req.param('prm_companyId'),
      tenpoId       : req.param('prm_tenpoId'),
      deductionId   : setArry[0],
      deductionName	: setArry[1],
      deduction     : setArry[2],
      deductionNote	: setArry[3]
    }, function(err, created) {
      res.send(err);
    });
  }

};