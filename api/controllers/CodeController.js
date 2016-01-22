/**
 * CodeController
 *
 * @description :: Server-side logic for managing Codes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req,res){
	    console.log('ksyscode',req.param('ksyscode'));
	    var _param = req.param('ksyscode');
	    var _code = KsysCodeService.attributes[req.param('ksyscode')];
	    if(!_param || _param == null || _param.length === 0){
	        res.send(400,'invalid parameter for Code.');
	    }else if(_param == 'ALLCODE'){
	        console.log(KsysCodeService.attributes);
	        res.json(KsysCodeService.attributes);
	    }else{
	        res.json(_code);
	    }
	}
};

