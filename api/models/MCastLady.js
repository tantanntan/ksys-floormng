/**
* MCastLady.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    castId: {type: 'STRING',unique: 'true'},
    name: {type: 'STRING',required: 'true'},
    realName: {type: 'STRING',required: 'false'},
    birthday: {type: 'DATE',required: 'false' },
    startdate: {type: 'DATE',required: 'true' },
    phone: {type: 'STRING', required: 'true'}
    //and others
  }
};