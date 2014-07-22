var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var browserify = require('browserify');
var uglifyify = require('uglifyify');

module.exports = {
  path: "/js/:js_src",
  description: "JS resources",
  params: {
    js_src: {
      kind: "rest",
      regex: "(.*\\.js)"
    }
  },

  get: function(httpContext) {
    var app = httpContext.app;
    var res = httpContext.response;
    var entrypoint = path.join(process.cwd(), 'public', httpContext.url.pathname); // map the url path to the file system.
    var headers = {};

    fs.exists(entrypoint, function(exists) {

      if (exists) {

        logger.debug('Bundling javascript - ' + entrypoint);

        var b = browserify();
        b.add(entrypoint);

        // minify if we are in any environment other than dev.
        if (process.env.MIXDOWN_ENV) {
          b.transform({
            global: true
          }, uglifyify);
        }

        var bundle = b.bundle();
        var buf = [];
        var bundleError = null;

        bundle.on('error', function(err) {
          bundleError = err;
          res.writeHead(500, _.extend({
            'Content-Type': 'application/javascript'
          }, {}));
          res.write('\n\n###############################################################\n\n');
          res.write('\n\n#########              ERROR                        ###########\n\n');
          res.write('\n\n###############################################################\n\n');
          res.end(err.toString());
        });

        bundle.on('data', function(chunk) {
          buf.push(chunk);
        });

        bundle.on('end', function(src) {
          if (!bundleError) {
            res.writeHead(200, _.extend({
              'Content-Type': 'application/javascript'
            }, headers));
            res.end(buf.join(''));
          }
        });

      } else {
        app.error.notFound('404 Not Found - ' + entrypoint, httpContext);
      }

    });
  }
};
