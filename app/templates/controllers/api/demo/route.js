module.exports = {
  path: '/api/demo',
  description: 'Demo api route..',
  params: {},

  get: function(httpContext) {
    var app = httpContext.app;
    app.json.send({
      hello: 'world'
    }, httpContext.response);
  }
}
