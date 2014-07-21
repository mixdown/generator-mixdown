var fs = require('fs');
var path = require('path');
var mime = require('mime');
var _ = require('lodash');

module.exports = {
  path: "/asset",
  description: "Serves any file-based asset.  Put the path on the querystring.",
  params: {
    asset_src: {
      regex: "(.*)",
      kind: "query"
    }
  },
  get: function(httpContext) {
    var app = httpContext.app;
    var res = httpContext.response;

    var filepath =
      httpContext.route.name === 'asset' ? path.join(process.cwd(), 'public', httpContext.url.query.asset_src) : path.join(process.cwd(), 'public', httpContext.url.pathname); // map the url path to the file system.

    // This adds cache control headers for non-dev resources.
    var headers = process.env.MIXDOWN_ENV ? {
      "Cache-Control": "max-age=29030400, public"
    } : {};

    fs.exists(filepath, function(exists) {

      if (exists) {
        res.writeHead(200, _.extend({
          'Content-Type': mime.lookup(filepath)
        }, headers));
        fs.createReadStream(filepath).pipe(res);
      } else {
        app.error.notFound(new Error('File does not exist: ' + filepath), res);
      }

    });
  }
};
