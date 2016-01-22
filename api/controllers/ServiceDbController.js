/**
 * ServiceDbController
 *
 * @description :: Server-side logic for managing tenpodbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // 一覧を取得
  getAllService: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    ServiceDb.find( { companyId: cid,tenpoId: tid },{sort: 'serviceId ASC'}, function(err, sets) {
      // memo: {sort: {seatId: 1}}  昇順(ASC)
      //       {sort: {seatId: -1}} 降順(DEC)
        res.json( { setlist: sets } );
      });
  },

  serviceDelete: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    ServiceDb.find( { companyId: cid, tenpoId: tid }, function(err, sets) {
      for(var col=0; col<sets.length; col++){
        var setdel = sets[col];
        setdel.destroy(function(err) { res.send(err) });
      }
    });
  },
    
  serviceCreate: function (req, res) {
    var setArry = req.param('prm_arry');
  
    ServiceDb.create({ 
      companyId     : req.param('prm_companyId'),
      tenpoId       : req.param('prm_tenpoId'),
      serviceId     : setArry[0],
      serviceName	  : setArry[1],
      castPoint     : setArry[2],
      cashBack    	: setArry[3],
      salesPrice	  : setArry[4],
      serviceNote	  : setArry[5]
    }, function(err, created) {
      res.send(err);
    });
  }
  
};