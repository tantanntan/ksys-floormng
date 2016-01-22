/**
 * SetDbController
 *
 * @description :: Server-side logic for managing tenpodbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // 店舗一覧を取得
  getAllSet: function (req, res) {
    // SetDbからセットを全件取得
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    SetDb.find( { companyId: cid,tenpoId: tid },{sort: 'setId ASC'}, function(err, sets) {
      // memo: {sort: {setId: 1}}  昇順 ASC
      //       {sort: {setId: -1}} 降順 DEC
        res.json( { setlist: sets } );
      });
  },
  
  setDelete: function (req, res) {
    var cid = req.param('prm_companyId');
    var tid = req.param('prm_tenpoId');

    SetDb.find( { companyId: cid, tenpoId: tid }, function(err, sets) {
      for(var col=0; col<sets.length; col++){
        var setdel = sets[col];
        setdel.destroy(function(err) { res.send(err) });
      }
    });
  },
    
  setCreate: function (req, res) {
      var setArry = req.param('prm_arry');
      
      SetDb.create({
        companyId     : req.param('prm_companyId'),
        tenpoId       : req.param('prm_tenpoId'),
        setId         : setArry[0],
        setName	      : setArry[1],
        setPrice      : setArry[2],
        setTime	      : setArry[3],
        setExtend     : setArry[5],
        setNote	      : setArry[4]
      }, function(err, created) {
        res.send(err);
      });
  }
  
};