var util = require('util');
var MixdownRouter = require('mixdown-router');

// Search router impl.
var Router = function() {
  if (!(this instanceof Router)) {
    return new Router();
  }

  MixdownRouter.apply(this, arguments);

  var _attach = this.attach;
  var cachebusterRoutes = ['js', 'css', 'asset'];
  var cachebusterVersion = 'cachebuster-not-set';
  var app;

  // Added server version as a cachebuster.
  this.attach = function (options) {
    app = options.app;

    _attach.apply(this, arguments);

    var _url = this.router.url;

    this.router.url = function(route, params) {
      var u = _url.call(this, route, params);


      if (cachebusterRoutes.indexOf(route) >= 0) {
        u.query = u.query || {};
        u.query.v = cachebusterVersion;
      }

      return u;
    }

  };

  var _init = this.init;
  this.init = function(done) {

    if (app.plugins.cachebuster && app.plugins.cachebuster.routes && app.plugins.cachebuster.routes.length) {
      cachebusterRoutes = cachebusterRoutes.concat(app.plugins.cachebuster.routes);
    }

    if (app.plugins.cachebuster) {
      cachebusterVersion = app.plugins.cachebuster.version;
    }


    if (typeof(_init) === 'function') {
      _init.call(this, done);
    }
    else {
      done();
    }
  };

};

util.inherits(Router, MixdownRouter);

module.exports = Router;
