/**
 * MainPageController
 *
 * @description :: Server-side logic for managing Mainpages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
  getTenpoMaster: function(req, res) {
    
    // 店舗マスタから各店舗情報を取得
    MShop.find( { companyId: req.param('k_id') }, { sort:{ shopId: 1 } }, function(err, docs) {
      res.json( { shop: docs } );
    });
  },
  
  
  getCast: function(req, res) {
    
    // キャストマスタから取得
    MCast.find( { k_id: req.param('k_id') }, { sort:{ createdAt: 1 },sort:{ endday: 1 } }, function(err, docs) {
      res.json( { personal: docs } );
    });
  },
  
  
  // クライアント側でgetしても30件までしか取得できない。controllerで取得(クライアント側でやりたい場合は?limit=0をつけることでも対応可)
  getMasterSlide: function(req, res) {
    
    // スライドマスタから取得
    Master_Slide.find( { companyId: req.param('companyId'), shopId: req.param('shopId') }, { sort:{ slideFrom: 1 } }, function(err, docs) {
      res.json( { slide: docs } );
    });
  },
  
  
  getTable: function(req, res) {
    
    // 営業日テーブルから取得(1件)
    BusinessDate.findOne( { e_id: req.param('e_id') }, function(err, docs) {
      res.json( { table: docs } );
    });
  },
  
  
  getTableCast: function(req, res) {
    
    // キャストテーブルから取得
    CastLady.find( { e_id: req.param('e_id') }, { sort:{ castId: 1 } }, function(err, docs) {
      res.json( { personal: docs } );
    });
  },
  
  
  getMemberMaster: function(req, res) {
    
    // 従業員マスタから取得
    Master_member.find( { k_id: req.param('k_id') }, { sort:{ m_id: 1 } }, function(err, docs) {
      res.json( { member: docs } );
    });
  },
  
  
  getAccesslv: function(req, res) {
    
    // 権限マスタから権限情報を取得
    Master_Accesslv.find( { k_id: req.param('k_id') }, { sort:{accesslv: 1} }, function(err, docs) {
      res.json( { accesslv: docs } );
    });
  },
  
  _config: {}

};