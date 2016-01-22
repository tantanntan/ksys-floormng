/**
* Nshop.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');
module.exports = {

  attributes: {
    // Userデータを取得(toJson)する際に password 項目を削除
    toJSON: function() {
      console.log("toJson");
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },
    companyId: {type: 'STRING',required: true},
  	shopId: {type: 'STRING',required: true},
  	shopName: {type: 'STRING',required: true},
  	number          :'STRING',
  	tenpoAddress	  :'STRING',
    tenpoTel	      :'STRING',
    fax             :'STRING',
    url             :'STRING',
    gurl            :'STRING',
    serviceOpening	:'STRING',
    serviceClosing	:'STRING',
    tenpoMon	      :'STRING',
    tenpoTue	      :'STRING',
    tenpoWed	      :'STRING',
    tenpoThu	      :'STRING',
    tenpoFri	      :'STRING',
    tenpoSat	      :'STRING',
    tenpoSun	      :'STRING',
  	waitT: {type: 'INTEGER',required: true},
  	m_id: {type: 'STRING',required: true,unique: true},
  	password: {type: 'STRING',required: true},
  	tempFlg         :'STRING',
  	stopFlg         :'STRING'
  },
  
  // beforeCreate にて、登録時 password 項目をSalt化
  // ソルト：ハッシュ値を計算する前にパスワードの前後に付け加える短い文字列
  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        }else{
          user.password = hash;
          cb(null, user);
        }
      });
    });
  },
  
  beforeUpdate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      if(user.password == undefined){
        cb(null, user);
      } else {
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) {
            console.log(err);
            cb(err);
          }else{
            user.password = hash;
            cb(null, user);
          }
        });
      }
    });
  }
};

