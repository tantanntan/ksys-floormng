/**
 * BusinessDate
 *
 * @module      :: Model
 * @description :: 店舗の営業日を表すエンティティ
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    companyId:'STRING',
    shopId:'STRING',
    e_id: 'STRING',
    date: 'STRING',
    // date: 'DATE',
    dateLabel: 'STRING',  // 11/25 曜日として使用
    openTime: 'STRING',
    closeTime: 'STRING',
    // openTime: 'DATETIME',
    // closeTime: 'DATETIME',
    status: 'STRING'
  }
};
