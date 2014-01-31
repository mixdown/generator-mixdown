module.exports = function(httpContext) {
  var app = httpContext.app;
  var res = httpContext.response;
  var req = httpContext.request;

  // TODO: set the name of the template to be rendered.
  var templateName = 'index';

  // TODO: set the view model with the data for this page.
  var viewModel = {

  };

  app.plugins.render(templateName, viewModel, function(err, html) {

    if (err) {
      app.plugins.error.notFound(err, res);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);

  });

};
