/**
* MCast.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    k_id: 'STRING',
    t_id: 'STRING',
    gname: {type: 'STRING',required: 'true'},
    name: {type: 'STRING',required: 'true'},
    basehour: {type: 'INTEGER', defaultsTo: 0},
    trans: {type: 'INTEGER', defaultsTo: 0},
    startday: 'STRING',
    endday: 'STRING',
    birthday: 'STRING',
    address: 'STRING',
    tel: 'STRING',
    mail: 'STRING',
    mon: 'STRING',
    tue: 'STRING',
    wed: 'STRING',
    thu: 'STRING',
    fri: 'STRING',
    sat: 'STRING',
    sun: 'STRING',
    c_time_from: 'STRING',
    c_time_to: 'STRING'
  }
};

