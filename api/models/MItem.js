/**
 * MItem
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    companyId:{ type: 'string',required: true },
    shopId:{type: 'STRING',defaultsTo: null},
  	category: { type: 'string', required: true },
    categoryCd: { type: 'string', required: true },
    isExtra:{ type:'boolean', defaultsTo:false }, //延長専用商品か？
  	name: { type: 'string',required: true },
  	price: {type: 'integer'},
  	point: {type: 'integer'},
  	minutes: {type: 'integer',defaultsTo: 0},
    delFlag:{ type:'boolean',defaultsTo:false },
    description:{ type:'STRING' }
  }
};