module.exports = function(httpContext) {
  var app = httpContext.app;
  var headers = app.config.plugins.static.options.headers;

  app.plugins.json(app.plugins.router.routes, httpContext.response);
};
