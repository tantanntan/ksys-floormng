/**
* TenpoDb.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId	      :'STRING',
    tenpoId	        :'STRING',
    tenpoName	      :{type: 'STRING',required: true},
    tenpoAddress	  :'STRING',
    tenpoTel	      :'STRING',
    serviceOpening	:'STRING',
    serviceClosing	:'STRING',
    tenpoWelfare    :'STRING',
    tenpoTax1	      :'STRING',
    tenpoTax2	      :'STRING',
    cardTax	        :'STRING',
    tenpoMon	      :'STRING',
    tenpoTue	      :'STRING',
    tenpoWed	      :'STRING',
    tenpoThu	      :'STRING',
    tenpoFri	      :'STRING',
    tenpoSat	      :'STRING',
    tenpoSun	      :'STRING'
  }
};