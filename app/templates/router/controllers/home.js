module.exports = function(httpContext) {
  var app = httpContext.app;
  var res = httpContext.response;

  app.plugins.render('home', httpContext.url, function(err, html) {

    if (err) {
      app.plugins.error.notFound(err, res);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);

  });

};
