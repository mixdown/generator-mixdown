module.exports = {
  path: '/manifest',
  description: 'Returns list of routes for the site.',
  params: {},

  get: function(httpContext) {
    var app = httpContext.app;
    app.json.send(app.router.manifest(), httpContext.response);
  }
}
