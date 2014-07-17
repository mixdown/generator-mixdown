module.exports = {
  path: "/",
  description: "Home Page",
  params: {},

  get: function(httpContext) {
    var app = httpContext.app;

    app.html.send({
      view: 'home',
      data: httpContext.url,
      httpContext: httpContext,
      headers: {
        foo: 'bar'
      }
    }, function(err, ctx) {
      ctx.statusCode = 500;
      ctx.response.end(err.stack);
    });

  }
};
