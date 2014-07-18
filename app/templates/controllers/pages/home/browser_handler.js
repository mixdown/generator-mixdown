module.exports = function(httpContext) {
  var app = httpContext.app;
  var vm = {
    user_agent: window.navigator.userAgent
  };

  document.getElementById('dynamic_content').innerHTML = app.html.render('user_agent', vm);
};
