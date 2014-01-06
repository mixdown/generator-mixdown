var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function(httpContext) {
  var res = httpContext.response;
  var entrypoint = path.join(process.cwd(), httpContext.url.pathname);  // map the url path to the file system.
  var headers = httpContext.app.config.plugins.static.options.headers;

  fs.exists(entrypoint, function(exists) {

    if (exists) {
      res.writeHead(200, _.extend({ 'Content-Type': 'application/javascript' }, headers)); 

      var b = browserify();
      b.add(entrypoint);

      var bundle = b.bundle();

      bundle.on('error', function(err) {
        res.write('\n\n###############################################################\n\n');
        res.write('\n\n#########              ERROR                        ###########\n\n');
        res.write('\n\n###############################################################\n\n');
        res.write(err.toString());
      });

      bundle.pipe(res);

    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }

  });

};