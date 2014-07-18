module.exports = {
  path: "/",
  description: "Home Page",
  params: {
    "id": {
      "kind": "query",
      "regex": /\w+/
    }
  },

  get: function(httpContext) {
    var app = httpContext.app;

    app.html.send({
      view: 'home',
      data: httpContext,
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
