/**
* TenpoDb.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId	    :'STRING',
    tenpoId	      :'STRING',
    productTypeId	:'INTEGER',
    productId	    :'INTEGER',
    productName   :'STRING',
    quickOrder	  :'STRING',
    castPoint	    :'STRING',
    cashBack	    :'STRING',
    salesPrice	  :'STRING',
    productNote	  :'STRING'
  }
};