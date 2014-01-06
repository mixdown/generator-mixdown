var fs = require('fs');
var path = require('path');
var mime = require('mime');
var _ = require('lodash');

module.exports = function(httpContext) {
  var res = httpContext.response;
  var filepath = path.join(process.cwd(), httpContext.url.pathname);  // map the url path to the file system.
  var headers = {};

  fs.exists(filepath, function(exists) {

    if (exists) {
      res.writeHead(200, _.extend({ 'Content-Type': mime.lookup(filepath) }, headers));
      fs.createReadStream(filepath, res);
    }
    else {
      res.writeHead(404, _.extend({ 'Content-Type': 'text/plain' }, headers));
      res.end('404 Not Found');
    }

  });
};
