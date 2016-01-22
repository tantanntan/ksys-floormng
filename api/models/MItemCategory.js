/**
 * MItemCategory
 *
 * @module      :: Model
 * @description :: 商品カテゴリを表すエンティティ
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    companyId: {type: 'STRING',required: true },
    shopId: {type: 'STRING',required: false },
    code: {type: 'STRING', required: true, unique: true },
    name: {type: 'STRING',required: true },
    hasInterval:{ type:'BOOLEAN',required: true,defaultsTo: false },
    parent:{type:'STRING',defaultsTo: null},
    description:{type: 'STRING'}
  }
};