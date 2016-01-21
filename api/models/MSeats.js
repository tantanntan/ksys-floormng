/**
 * MSeats
 *
 * @module      :: Model
 * @description :: 店内の卓を表すエンティティ
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    companyId: {type:'STRING',required: true},
    shopId: {type:'STRING',required: true},
    seatId	    :'STRING',
  	name: {type:'STRING',required: true},
  	max: {type:'INTEGER',required: true},
  	isWait: {type:'BOOLEAN'},
    hideFlag	  :'STRING',
    tempFlag	  :'STRING',
    seatNote	  :'STRING'
  }

};
