/**
* Master_Slide.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId: {type:'STRING', required: true},
    shopId: {type:'STRING', required: true},
    slideType: {type:'STRING', required: true},
    slideFrom: {type: 'INTEGER', defaultsTo: 0},
    slideTo: {type: 'INTEGER', defaultsTo: 0},
    slidePayHour: {type: 'INTEGER', defaultsTo: 0}
  }
};

