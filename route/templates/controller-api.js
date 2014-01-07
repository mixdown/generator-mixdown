module.exports = function(httpContext) {
  var app = httpContext.app;
  var res = httpContext.response;
  var req = httpContext.request;

  // TODO: set the view model with the data for this api.
  var viewModel = {

  };

  app.plugins.json(viewModel, res);

};
