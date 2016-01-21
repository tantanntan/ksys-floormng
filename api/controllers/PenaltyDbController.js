/**
 * PenaltyDbController
 *
 * @description :: Server-side logic for managing tenpodbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // 一覧を取得
  getAllPenalty: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    PenaltyDb.find( { companyId: cid,tenpoId: tid },{sort: 'penaltyId ASC'}, function(err, sets) {
      // memo: {sort: {seatId: 1}}  昇順 ASC
      //       {sort: {seatId: -1}} 降順 DEC
        res.json( { setlist: sets } );
      });
  },

  penaltyDelete: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    PenaltyDb.find( { companyId: cid, tenpoId: tid }, function(err, sets) {
      for(var col=0; col<sets.length; col++){
        var setdel = sets[col];
        setdel.destroy(function(err) { res.send(err) });
      }
    });
  },
    
  penaltyCreate: function (req, res) {
    var setArry = req.param('prm_arry');
  
    PenaltyDb.create({ 
      companyId     : req.param('prm_companyId'),
      tenpoId       : req.param('prm_tenpoId'),
      penaltyId     : setArry[0],
      penaltyName	  : setArry[1],
      balancePoint  : setArry[2],
      deduction     : setArry[3],
      penaltyNote	  : setArry[4]
    }, function(err, created) {
      res.send(err);
    });
  }

};