/**
 * CastLadyController
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
  /** add point to a castlady */
  addPoint: function(req, res) {
    DetailRecord.subscribe(req.socket);
    var _pt = 0;
    var _cst = 0;
    console.log("castId:", req.param('castId'));
    CastLady.findOne({
      id: req.param('castId')
    }).done(function(err, castlady) {
      if (err) return res.send(err, 500);
      if (!castlady) return res.send(err, 404);
      //      console.log("::", castlady);

      if (castlady.seated && castlady.seated !== '') {
        console.log("She's already seated. name :", castlady.name);
        //TODO　客間移動処理
        //              res.json(castlady);
      }
      else {
        console.log("Now,Add point to her .name :", castlady.name);
        castlady.seated = req.param('visitorId');
        switch (req.param('kind')) {
        case 'HONSHIMEI':
          _pt = 10;
          _cst = 2000;
          break;
        case 'JONAISHIMEI':
          _pt = 2;
          _cst = 1000;
          break;
        default:
          _pt = 1;
          _cst = 0;
        };
      }
      //ポイント加算
      //        castlady.point += _pt;
      DetailRecord.insertRecordWithParams(castlady,_pt,_cst);
        castlady.save(function(err, cast) {
          if (err) {
            console.log('CASTLADY is DEAD...' + castlady);
            return res.send(err, 500)
          };
          console.log('CASTLADY is SAVED.' + cast );

          CastLady.publishUpdate(castlady.id, {
            id: castlady.id,
//            point: castlady.point,
//            pointToday: castlady.pointToday(),
            seated: castlady.seated,
            name: castlady.name
          });
        });
      });
  },
  //out
  leave: function(req, res) {
    CastLady.findOne({
      id: req.param('castId')
    }).done(function(err, castlady) {
      if (err) return res.send(err, 500);
      if (!castlady) return res.send("no castlady found.", 404);
      //reset status
      castlady.seated = '';
      castlady.save(function(err) {
        if (err) {
          console('CASTLADY is DEAD...' + castlady.name);
          return res.send(err, 500)
        };
        res.json(castlady);
      });
    });
  },

  //reset seated
  reset: function(req, res) {
    CastLady.subscribe(req.socket);
    CastLady.update({}, {
      seated: ''
    }).exec(function(err, casts) {
      console.log(casts);
      // do something
      //          res.json(casts);
      for (var i = 0; i < casts.length; i++) {
        var cast = casts[i];
        //            console.log(cast);
        CastLady.publishUpdate(cast.id, {
          name: cast.name,
          id: cast.id,
          point: 0,
          seated: ''
        });
      }
    });

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CastLadyController)
   */
  _config: {}


};
