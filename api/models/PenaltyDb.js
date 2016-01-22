/**
* PenaltyDb.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId	    :'STRING',
    tenpoId	      :'STRING',
    penaltyId	    :'INTEGER',
    penaltyName	  :'STRING',
    balancePoint	:'STRING',
    deduction	    :'STRING',
    penaltyNote	  :'STRING'
  }
};