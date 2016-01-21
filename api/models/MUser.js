/**
 * MUser
 *
 * @module      :: Model
 * @description :: 店舗従業員を表す.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    companyId: 'STRING',
    userId: 'STRING',
    password:'STRING',
    email: 'EMAIL',
    phone: 'STRING',
    userName: 'STRING',
    authorities: 'STRING'
  }
};
