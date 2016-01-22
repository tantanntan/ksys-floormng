/**
* Noption.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId: {type: 'STRING',required: true},
    shopId: {type: 'STRING',required: true},
    otitle: {type: 'STRING',required: true},
    oetitle: {type: 'STRING',required: true},
    oname1: {type: 'STRING'},
    oename1: {type: 'STRING'},
    omark1: {type: 'STRING'},
    oname2: {type: 'STRING'},
    oename2: {type: 'STRING'},
    omark2: {type: 'STRING'},
    oname3: {type: 'STRING'},
    oename3: {type: 'STRING'},
    omark3: {type: 'STRING'}
  }
};

