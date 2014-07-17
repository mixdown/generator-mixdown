module.exports = {
  path: null,
  description: "",
  params: {},

  get: function(httpContext) {
    var app = httpContext.app;
    var res = httpContext.response;
    var req = httpContext.request;

    // TODO: set the view model with the data for this api.
    var vm = {
      params: httpContext.params
    };

    app.html.send({
      view: 'home',
      data: vm,
      httpContext: httpContext,
      headers: {}
    }, app.error.fail);

  },


  delete: function(httpContext) {
    httpContext.app.error.fail(new Error('Not implemented'), httpContext);
  },

  post: function(httpContext) {
    httpContext.app.error.fail(new Error('Not implemented'), httpContext);
  },

  put: function(httpContext) {
    httpContext.app.error.fail(new Error('Not implemented'), httpContext);
  }
};
