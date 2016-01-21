/**
 * TenpoDbController
 *
 * @description :: Server-side logic for managing tenpodbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // 店舗一覧を取得
  getAllTenpo: function (req, res) {
    // tenpodb から同一の企業IDを持つものを全件抽出
    MShop.find( { companyId: req.param('companyId') }, { sort: 'shopId ASC' }, function(err, docs) {
      res.json( { tenpos: docs } );
    });
  },
  
  // 店舗詳細を取得
  tenpoDetail: function (req, res) {
    
    // tenpoDb から1件抽出
    MShop.findOne( {
      companyId: req.param('companyId'),
      shopId: req.param('tenpoId')
    }, function(err, tenpod) {
      res.json({
        OneCompanyId     : tenpod.companyId,
        OneTenpoId       : tenpod.shopId,
        OneTenpoName     : tenpod.shopName,
        OneTenpoAddress  : tenpod.tenpoAddress,
        OneTenpoTel      : tenpod.tenpoTel,
        OneServiceOpening: tenpod.serviceOpening,
        OneServiceClosing: tenpod.serviceClosing,
        OneTenpoTax1     : tenpod.tenpoTax1,
        OneCardTax       : tenpod.cardTax,
        OneTenpoMon      : tenpod.tenpoMon,
        OneTenpoTue      : tenpod.tenpoTue,
        OneTenpoWed      : tenpod.tenpoWed,
        OneTenpoThu      : tenpod.tenpoThu,
        OneTenpoFri      : tenpod.tenpoFri,
        OneTenpoSat      : tenpod.tenpoSat,
        OneTenpoSun      : tenpod.tenpoSun,
        OneTenpoTax2     : tenpod.tenpoTax2
      });
    });
  },
   
  // 店舗一覧から削除
  deleteTenpo: function(req, res) {
    MShop.findOne( {
      companyId: req.param('companyId'),
      shopId: req.param('tenpoId')
    }, function(err, tenpo) {
      tenpo.destroy(function(err) {
        
        // 削除した店舗に紐付く各DBの削除も行う
        // 給料計算方法
        Master_Salary_Calc.find( { companyId: req.param('companyId'), shopId: req.param('tenpoId') }, function(err, calc) {
          for(var col=0; col<calc.length; col++){
            var calcdel = calc[col];
            calcdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        Master_Slide.find( { companyId: req.param('companyId'), shopId: req.param('tenpoId') }, function(err, slide) {
          for(var col=0; col<slide.length; col++){
            var slidedel = slide[col];
            slidedel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // 出退勤マスタ
        Master_Append.find( { companyId: req.param('companyId'), tenpoId: req.param('tenpoId') }, function(err, ape) {
          for(var col=0; col<ape.length; col++){
            var apedel = ape[col];
            apedel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // セットマスタ
        SetDb.find( { companyId: req.param('companyId'), tenpoId: req.param('tenpoId') }, function(err, sets) {
          for(var col=0; col<sets.length; col++){
            var setdel = sets[col];
            setdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // 座席マスタ
        MSeats.find( { companyId: req.param('companyId'), shopId: req.param('tenpoId') }, function(err, seats) {
          for(var col=0; col<seats.length; col++){
            var seatdel = seats[col];
            seatdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // 控除マスタ
        DeductionDb.find( { companyId: req.param('companyId'), tenpoId: req.param('tenpoId') }, function(err, sets) {
          for(var col=0; col<sets.length; col++){
            var setdel = sets[col];
            setdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // 指名マスタ
        ChooseDb.find( { companyId: req.param('companyId'), tenpoId: req.param('tenpoId') }, function(err, sets) {
          for(var col=0; col<sets.length; col++){
            var setdel = sets[col];
            setdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // サービスマスタ
        ServiceDb.find( { companyId: req.param('companyId'), tenpoId: req.param('tenpoId') }, function(err, sets) {
          for(var col=0; col<sets.length; col++){
            var setdel = sets[col];
            setdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // ペナルティマスタ
        PenaltyDb.find( { companyId: req.param('companyId'), tenpoId: req.param('tenpoId') }, function(err, sets) {
          for(var col=0; col<sets.length; col++){
            var setdel = sets[col];
            setdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // 商品マスタ
        ProductDb.find( { companyId: req.param('companyId'), tenpoId: req.param('tenpoId') }, function(err, sets) {
          for(var col=0; col<sets.length; col++){
            var setdel = sets[col];
            setdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        // 商品種別マスタ
        ProductTypeDb.find( { companyId: req.param('companyId'), tenpoId: req.param('tenpoId') }, function(err, sets) {
          for(var col=0; col<sets.length; col++){
            var setdel = sets[col];
            setdel.destroy(function(err) {
              res.send(err);
            });
          }
        });
        
        res.send(err);
      });
    });
  },
   
  // 店舗詳細から更新
  tupdate: function (req, res) {
    MShop.findOne( {
      companyId: req.param('prm_companyId'),
      shopId: req.param('prm_tenpoId')
    }, function(err, tnpod) {

      tnpod.shopName      = req.param('prm_tenpoName'),
      tnpod.tenpoAddress  = req.param('prm_tenpoAddress'),
      tnpod.tenpoTel      = req.param('prm_tenpoTel'),
      tnpod.serviceOpening= req.param('prm_srvOpen'),
      tnpod.serviceClosing= req.param('prm_srvClose'),
      tnpod.tenpoTax1     = req.param('prm_tenpoTax'),
      tnpod.cardTax       = req.param('prm_tenpoCardfee'),
      tnpod.tenpoMon      = req.param('prm_tenpoWeekMon'),
      tnpod.tenpoTue      = req.param('prm_tenpoWeekTue'),
      tnpod.tenpoWed      = req.param('prm_tenpoWeekWed'),
      tnpod.tenpoThu      = req.param('prm_tenpoWeekThu'),
      tnpod.tenpoFri      = req.param('prm_tenpoWeekFri'),
      tnpod.tenpoSat      = req.param('prm_tenpoWeekSat'),
      tnpod.tenpoSun      = req.param('prm_tenpoWeekSun'),
      tnpod.tenpoTax2     = req.param('prm_tenpoTax2');
    
      tnpod.save(function(err) {
        res.send(err);
      });
    });

  },
  
  // 店舗を新規作成
  tcreate: function (req, res) {
    var query = MShop.find({ companyId: req.param('prm_companyId') }, {sort:{shopId: -1}});
    query.exec(function(err, sorteds) {
      
      var maxId;
      if(sorteds[0]) {
        maxId = sorteds[0].shopId;
        
      } else {
        maxId = "0";
      }
      
      var newId = Number(maxId) + 1;
      
      //TenpoDb.create({
      MShop.create({
        companyId     : req.param('prm_companyId'),
        shopId        : String(newId),
        shopName      : req.param('prm_tenpoName'),
        tenpoAddress  : req.param('prm_tenpoAddress'),
        tenpoTel      : req.param('prm_tenpoTel'),
        serviceOpening: req.param('prm_srvOpen'),
        serviceClosing: req.param('prm_srvClose'),
        tenpoTax1     : req.param('prm_tenpoTax'),
        cardTax       : req.param('prm_tenpoCardfee'),
        tenpoMon      : req.param('prm_tenpoWeekMon'),
        tenpoTue      : req.param('prm_tenpoWeekTue'),
        tenpoWed      : req.param('prm_tenpoWeekWed'),
        tenpoThu      : req.param('prm_tenpoWeekThu'),
        tenpoFri      : req.param('prm_tenpoWeekFri'),
        tenpoSat      : req.param('prm_tenpoWeekSat'),
        tenpoSun      : req.param('prm_tenpoWeekSun'),
        tenpoTax2     : req.param('prm_tenpoTax2')
      }, function(err, created) {
        res.send(err);
      });
      
    });
  },
  
  // 既存データ削除後、テンプレートからコピーして登録
  copyTemplatesToDb: function (req, res) {
    
    // 給与計算方法マスタ
    Master_Salary_Calc.find( { companyId: req.param('prm_companyId'), shopId: req.param('prm_tenpoId') }, function(err, calc) {
      for(var col=0; col<calc.length; col++){
        var calcdel = calc[col];
        calcdel.destroy(function(err) {
          res.send(err);
        });
      }
      
      Master_Salary_Calc.find( { companyId: req.param('prm_companyId'), shopId: req.param('prm_templateId') }, function(err, t_calc) {
        for(var col=0; col<t_calc.length; col++){
          var calccre = t_calc[col];
        
          Master_Salary_Calc.create({
            companyId     : req.param('prm_companyId'),
            shopId        : req.param('prm_tenpoId'),
            percentage	  : calccre.percentage,
            basePayHour	  : calccre.basePayHour,
            welfare	      : calccre.welfare,
            trans	        : calccre.trans
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // スライドマスタ
    Master_Slide.find( { companyId: req.param('prm_companyId'), shopId: req.param('prm_tenpoId') }, function(err, slide) {
      for(var col=0; col<slide.length; col++){
        var slidedel = slide[col];
        slidedel.destroy(function(err) {
          res.send(err);
        });
      }
      
      Master_Slide.find( { companyId: req.param('prm_companyId'), shopId: req.param('prm_templateId') }, function(err, t_slide) {
        for(var col=0; col<t_slide.length; col++){
          var slidecre = t_slide[col];
        
          Master_Slide.create({
            companyId     : req.param('prm_companyId'),
            shopId        : req.param('prm_tenpoId'),
            slideType     : slidecre.slideType,
            slideFrom	    : slidecre.slideFrom,
            slideTo       : slidecre.slideTo,
            slidePayHour	: slidecre.slidePayHour
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // セットマスタ
    SetDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_tenpoId') }, function(err, sets) {
      for(var col=0; col<sets.length; col++){
        var setdel = sets[col];
        setdel.destroy(function(err) {
          res.send(err);
        });
      }
      
      SetDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_templateId') }, function(err, t_sets) {
        for(var col=0; col<t_sets.length; col++){
          var setcre = t_sets[col];
        
          SetDb.create({
            companyId     : req.param('prm_companyId'),
            tenpoId       : req.param('prm_tenpoId'),
            setId         : setcre.setId,
            setName	      : setcre.setName,
            setPrice      : setcre.setPrice,
            setTime	      : setcre.setTime,
            setExtend     : setcre.setExtend,
            setNote	      : setcre.setNote
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // 座席マスタ
    MSeats.find( { companyId: req.param('prm_companyId'), shopId: req.param('prm_tenpoId') }, function(err, seats) {
      for(var col=0; col<seats.length; col++){
        var seatdel = seats[col];
        seatdel.destroy(function(err) {
          res.send(err);
        });
      }
      
      MSeats.find( { companyId: req.param('prm_companyId'), shopId: req.param('prm_templateId') }, function(err, t_seats) {
        for(var col=0; col<t_seats.length; col++){
          var seatcre = t_seats[col];
          
          MSeats.create({
            companyId     : req.param('prm_companyId'),
            shopId        : req.param('prm_tenpoId'),
            seatId        : seatcre.seatId,
            name	        : seatcre.name,
            max           : seatcre.max,
            isWait        : seatcre.isWait,
            hideFlag      : seatcre.hideFlag,
            tempFlag	    : seatcre.tempFlag,
            seatNote	    : seatcre.seatNote
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // 控除マスタ
    DeductionDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_tenpoId') }, function(err, deductions) {
      for(var col=0; col<deductions.length; col++){
        var deductiondel = deductions[col];
        deductiondel.destroy(function(err) {
          res.send(err);
        });
      }
      
      DeductionDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_templateId') }, function(err, t_deductions) {
        for(var col=0; col<t_deductions.length; col++){
          var deductioncre = t_deductions[col];
        
          DeductionDb.create({
            companyId     : req.param('prm_companyId'),
            tenpoId       : req.param('prm_tenpoId'),
            deductionId   : deductioncre.deductionId,
            deductionName	: deductioncre.deductionName,
            deduction     : deductioncre.deduction,
            deductionNote	: deductioncre.deductionNote
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // 指名マスタ
    ChooseDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_tenpoId') }, function(err, chooses) {
      for(var col=0; col<chooses.length; col++){
        var choosedel = chooses[col];
        choosedel.destroy(function(err) {
          res.send(err);
        });
      }
      
      ChooseDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_templateId') }, function(err, t_chooses) {
        for(var col=0; col<t_chooses.length; col++){
          var choosecre = t_chooses[col];
        
          ChooseDb.create({
            companyId     : req.param('prm_companyId'),
            tenpoId       : req.param('prm_tenpoId'),
            chooseId      : choosecre.chooseId,
            chooseName	  : choosecre.chooseName,
            castPoint     : choosecre.castPoint,
            cashBack    	: choosecre.cashBack,
            salesPrice	  : choosecre.salesPrice,
            chooseNote	  : choosecre.chooseNote
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // サービスマスタ
    ServiceDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_tenpoId') }, function(err, services) {
      for(var col=0; col<services.length; col++){
        var servicedel = services[col];
        servicedel.destroy(function(err) {
          res.send(err);
        });
      }
      
      ServiceDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_templateId') }, function(err, t_services) {
        for(var col=0; col<t_services.length; col++){
          var servicecre = t_services[col];
        
          ServiceDb.create({
            companyId     : req.param('prm_companyId'),
            tenpoId       : req.param('prm_tenpoId'),
            serviceId     : servicecre.serviceId,
            serviceName	  : servicecre.serviceName,
            castPoint     : servicecre.castPoint,
            cashBack    	: servicecre.cashBack,
            salesPrice	  : servicecre.salesPrice,
            serviceNote	  : servicecre.serviceNote
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // ペナルティマスタ
    PenaltyDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_tenpoId') }, function(err, penaltys) {
      for(var col=0; col<penaltys.length; col++){
        var penaltydel = penaltys[col];
        penaltydel.destroy(function(err) {
          res.send(err);
        });
      }
      
      PenaltyDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_templateId') }, function(err, t_penaltys) {
        for(var col=0; col<t_penaltys.length; col++){
          var penaltycre = t_penaltys[col];
        
          PenaltyDb.create({
            companyId     : req.param('prm_companyId'),
            tenpoId       : req.param('prm_tenpoId'),
            penaltyId     : penaltycre.penaltyId,
            penaltyName	  : penaltycre.penaltyName,
            balancePoint  : penaltycre.balancePoint,
            deduction     : penaltycre.deduction,
            penaltyNote	  : penaltycre.penaltyNote
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // 商品マスタ
    ProductDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_tenpoId') }, function(err, products) {
      for(var col=0; col<products.length; col++){
        var productdel = products[col];
        productdel.destroy(function(err) {
          res.send(err);
        });
      }
      
      ProductDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_templateId') }, function(err, t_products) {
        for(var col=0; col<t_products.length; col++){
          var productcre = t_products[col];
        
          ProductDb.create({
            companyId     : req.param('prm_companyId'),
            tenpoId       : req.param('prm_tenpoId'),
            productTypeId : productcre.productTypeId,
            productId     : productcre.productId,
            productName	  : productcre.productName,
            quickOrder    : productcre.quickOrder,
            castPoint     : productcre.castPoint,
            cashBack      : productcre.cashBack,
            salesPrice    : productcre.salesPrice,
            productNote	  : productcre.productNote
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
    // 商品種別マスタ
    ProductTypeDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_tenpoId') }, function(err, producttypes) {
      for(var col=0; col<producttypes.length; col++){
        var producttypedel = producttypes[col];
        producttypedel.destroy(function(err) {
          res.send(err);
        });
      }
      
      ProductTypeDb.find( { companyId: req.param('prm_companyId'), tenpoId: req.param('prm_templateId') }, function(err, t_producttypes) {
        for(var col=0; col<t_producttypes.length; col++){
          var producttypecre = t_producttypes[col];
        
          ProductTypeDb.create({
            companyId             : req.param('prm_companyId'),
            tenpoId               : req.param('prm_tenpoId'),
            productTypeId         : producttypecre.productTypeId,
            productTypeName       : producttypecre.productTypeName,
            immediatePaymentFlag  : producttypecre.immediatePaymentFlag
          }, function(err, created) {
            res.send(err);
          });
        }
      });
    });
    
  }
  
};