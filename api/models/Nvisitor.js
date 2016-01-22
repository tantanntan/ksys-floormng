/**
* Nvisitor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId: {type: 'STRING',required: true},
  	shopId: {type: 'STRING',required: true},
  	no: {type: 'INTEGER',required: true},
  	name: {type: 'STRING',required: true},
  	member: {type: 'INTEGER',required: true},
  	option1: {type: 'STRING'},
  	option2: {type: 'STRING'},
  	option3: {type: 'STRING'},
  	option4: {type: 'STRING'},
  	origin: {type: 'STRING'},
  	call: {type: 'STRING'},
  	noFlg: {type: 'STRING'},
  }
};

