/**
* MShop.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId: {type: 'STRING',required: true},
  	shopId: {type: 'STRING',required: true},
  	shopName: {type: 'STRING',required: true},
  	tenpoAddress	  :'STRING',
    tenpoTel	      :'STRING',
    serviceOpening	:'STRING',
    serviceClosing	:'STRING',
    tenpoWelfare    :{type: 'INTEGER',defaultsTo: 0},
    tenpoTax1	      :{type: 'INTEGER',defaultsTo: 0},
    tenpoTax2	      :{type: 'INTEGER',defaultsTo: 0},
    cardTax	        :{type: 'INTEGER',defaultsTo: 0},
    tenpoMon	      :'STRING',
    tenpoTue	      :'STRING',
    tenpoWed	      :'STRING',
    tenpoThu	      :'STRING',
    tenpoFri	      :'STRING',
    tenpoSat	      :'STRING',
    tenpoSun	      :'STRING'
  }
};

