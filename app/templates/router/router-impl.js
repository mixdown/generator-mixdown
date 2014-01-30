var util = require('util');
var MixdownRouter = require('mixdown-router');
var _ = require('lodash');
var packageJSON = require('../package.json');

// Search router impl.
var Router = function() {
  if (!(this instanceof Router)) {
    return new Router();
  }

  MixdownRouter.apply(this, arguments);

  var _attach = this.attach;
  var cachebusterRoutes = ['js', 'css', 'asset'];
  var cachebusterVersion = packageJSON.version;
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
    };

    // implements router logging.  Leave this commented out unless debugging a route.
    // var _create = this.router.create;

    // this.router.create = function() {
    //   var r = _create.apply(this, arguments);

    //   r.on('evaluate', function(trace) {
    //     logger.debug({
    //       options: trace.options,
    //       matched: trace.matched,
    //       httpContext: _.omit(trace.httpContext, 'request', 'response')
    //     });
    //   });

    //   return r;
    // };

  };

  var _init = this.init;
  this.init = function(done) {

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
