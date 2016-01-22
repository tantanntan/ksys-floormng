/**
* Visitor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId: {type:'STRING', required: true},
    shopId: {type:'STRING', required: true},
    e_id: 'STRING',
    businessDate: 'STRING',
    //visitorId: {type:'STRING', required: true},
    status: {type:'STRING'},
    number: {type:'INTEGER', required: true},
    name: {type:'STRING', required: true},
    contact: {type:'STRING'},
    seatId: {type:'STRING'},
    //tableName:{type:'STRING'},
    startTime: {type: 'DATETIME'},
    endTime: {type: 'DATETIME'},
    setTime: {type: 'INTEGER'},
    serviceZeroFlg: {type:'STRING'},
    taxZeroFlg: {type:'STRING'},
    cardZeroFlg: {type:'STRING'},
    pay: {type: 'INTEGER', defaultsTo: 0},
    payType: {type:'STRING'}
  }

};

