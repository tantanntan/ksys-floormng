/**
* MSet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    companyId:{ type: 'string',required: true },
    shopId:{type: 'STRING',defaultsTo: null},
  	category:{ type: 'string', required: true },
    isExtra:{ type:'boolean', defaultsTo:false },
  	name: { type: 'string',required: true },
  	price: {type: 'integer'},
  	minutes: {type: 'integer',defaultsTo: 0},
    delFlag:{ type:'boolean',defaultsTo:false },
    description:{ type:'STRING' }
  }
};