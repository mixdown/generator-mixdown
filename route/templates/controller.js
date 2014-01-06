module.exports = function(httpContext) {
  var app = httpContext.app;
  var res = httpContext.response;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('hello from app ' + app.id);
};
