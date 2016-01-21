/**
* Master_Salary_Calc.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId: {type:'STRING', required: true},
    shopId: {type:'STRING', required: true},
    percentage: {type: 'INTEGER', defaultsTo: 0},
    basePayHour: {type: 'INTEGER', defaultsTo: 0},
    welfare: {type: 'INTEGER', defaultsTo: 0},
    trans: {type: 'INTEGER', defaultsTo: 0}
  }
};

