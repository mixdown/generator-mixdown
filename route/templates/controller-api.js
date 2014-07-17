module.exports = {
  path: '/api/demo',
  description: 'Demo api route..',
  params: {},

  get: function(httpContext) {
    var app = httpContext.app;
    var res = httpContext.response;
    var req = httpContext.request;

    // TODO: set the view model with the data for this api.
    var vm = {
      hello: 'world',
      model: httpContext.params
    };

    app.json.send(vm, res);
  },

  delete: function(httpContext) {
    httpContext.app.json.send({
      error: 'Not Implemented'
    }, httpContext.response);
  },

  post: function(httpContext) {
    httpContext.app.json.send({
      error: 'Not Implemented'
    }, httpContext.response);
  },

  put: function(httpContext) {
    httpContext.app.json.send({
      error: 'Not Implemented'
    }, httpContext.response);
  }

};
