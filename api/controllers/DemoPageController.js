/**
 * DemoPageController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  
  /**
   * Action blueprints:
   *    `/demopage/demo`
   */
   demo: function (req, res) {
    
    // Send a JSON response
//    return res.json({
//      hello: 'world'
//    });
    return res.view();
  },
  demo2: function(req,res){
    return res.view();
  },

  demo3: function(req,res){
    return res.view();
  },

  demoD: function(req,res){
    //TODO init calendar etc.
    return res.view();
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DemoPageController)
   */
  _config: {}

  
};
