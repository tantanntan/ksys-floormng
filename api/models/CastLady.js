/**
 * CastLady
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  attributes: {
    companyId:'STRING',
    shopId:'STRING',
    e_id: 'STRING',
    castId: {type: 'STRING'},
    businessDate: {type: 'STRING'}, // 営業日
    name: {type: 'STRING',required: true},
    point: {type: 'INTEGER'},       // ポイント
    status:'STRING',
    startTime:'DATETIME',           // 現ステータス開始時間
    c_time_fr: 'STRING',
    c_time_to: 'STRING',
    cj_time_fr: 'STRING',
    cd_time: 'STRING',
    cj_time_to: 'STRING',
    seated: 'STRING',               // 座席ID
    guestFlg: 'STRING'              // ゲスト判定フラグ
  }
};