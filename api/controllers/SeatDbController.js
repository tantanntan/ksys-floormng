/**
 * SeatDbController
 *
 * @description :: Server-side logic for managing tenpodbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // 店舗一覧を取得
  getAllSeat: function (req, res) {
    // SeatDbからセットを全件取得
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');
    
    MSeats.find( { companyId: cid, shopId: tid, tempFlag: {$ne:'1'} }, {sort: 'name ASC'}, function(err, sets) {
      res.json( { setlist: sets } );
    });
  },
  
  seatDelete: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    //SeatDb.find( { companyId: cid, tenpoId: tid }, function(err, seats) {
    MSeats.find( { companyId: cid, shopId: tid }, function(err, seats) {
      for(var col=0; col<seats.length; col++){
        var seatdel = seats[col];
        seatdel.destroy(function(err) { res.send(err) });
      }
    });
  },
    
  seatCreate: function (req, res) {
    var setArry = req.param('prm_arry');
      
    // SeatDb.create({ 
    //   companyId     : req.param('prm_companyId'),
    //   tenpoId       : req.param('prm_tenpoId'),
    //   seatId        : setArry[0],
    //   seatName	    : setArry[1],
    //   hideFlag      : setArry[2],
    //   tempFlag	    : setArry[3],
    //   seatNote	    : setArry[4]
    MSeats.create({ 
      companyId     : req.param('prm_companyId'),
      shopId        : req.param('prm_tenpoId'),
      seatId        : setArry[0],
      name	        : setArry[1],
      max           : setArry[2],
      isWait        : setArry[3],
      hideFlag      : '',
      tempFlag	    : '',
      seatNote	    : setArry[4]
    }, function(err, created) {
      res.send(err);
    });
  }
  
};