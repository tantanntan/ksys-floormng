/**
 * DetailRecord
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
/* TODO: (全般)relationを使うか悩み中 */
module.exports = {
  attributes: {
    companyId:{type: 'STRING',required: true},
    shopId:{type: 'STRING',required: true},
    shopName:{type: 'STRING',required: true},//見た目でわかる
    businessDate:{type: 'STRING',required: true},
    orderDate:{type: 'STRING',required: true},
    businessDateLabel:{type: 'STRING',required: true}, //見た目でわかる
    //userId:'STRING', //操作者
    castId: 'STRING',
    castName: 'STRING',//見た目でわかる
    visitorId: 'STRING',
    orderTime: 'STRING',  // オーダー時間
    seatId: 'STRING',
    seatName: 'STRING',//見た目でわかる
    itemCategoryCd: 'STRING', //IDではない
    itemId: 'STRING',
    itemName: {type: 'STRING',required: true},//見た目でわかる
    setTime: {type: 'INTEGER',defaultsTo: 0},
    //customer: 'STRING',
    //deliveredTime: {type: 'DATETIME',defaultsTo: null}, //届けられたorTimerStart
    //endTime: {type: 'DATETIME',defaultsTo: null}, //届けられたorTimerStart
    //paidTime: {type: 'DATETIME',defaultsTo: null}, //支払われた
    point: {type: 'INTEGER',defaultsTo: 0},
    cashBack: {type: 'INTEGER',defaultsTo: 0},
    status: {type: 'STRING',defaultsTo: ''},
    amount:{type: 'INTEGER',defaultsTo: 1},
    price: {type: 'INTEGER',defaultsTo: 0},
    totalPrice: 'INTEGER' //税抜き
    //delFlag:  {type: 'BOOLEAN',defaultsTo: false},
    //taxPercentage:{type: 'INTEGER',defaultsTo: 0},
    //taxPrice:{type: 'INTEGER',defaultsTo: 0},
    //servicePercentage:{type: 'INTEGER',defaultsTo: 0},
    //servicePrice:{type: 'INTEGER',defaultsTo: 0},
    //fixedTo: {type: 'STRING',defaultsTo: null},
    //fixedFrom: {type: 'STRING',defaultsTo: null}
  }
};
