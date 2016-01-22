/**
* Master_Member.js
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
  	k_id: 'STRING',
  	shopId:'STRING',
  	m_id: {type: 'STRING',required: true,unique: true},
    password: {type: 'STRING',required: true},
    name: {type: 'STRING',required: true,unique: true},
    accesslv: 'INTEGER',
    tel: 'STRING',
    mail: 'STRING'
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