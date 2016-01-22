/**
* Nrecep.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId: {type: 'STRING',required: true},
    shopId: {type: 'STRING',required: true},
    serviceOpening	:'STRING',
    serviceClosing	:'STRING',
    smartOpening	  :'STRING',
    smartClosing	  :'STRING'
  }
};

