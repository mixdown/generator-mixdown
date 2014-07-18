var App = require('mixdown-app').App;
var app = new App();
var Router = require('./router.js');
var Handlebars = require('mixdown-handlebars/browser.js');
var templates = require('./templates.js');

app.use(new Router({
  app: app
}), 'router');

app.use(new Handlebars({
  precompiled: templates
}), 'html');

// app.router.on('no-browser-handler', function(data) {
//   console.log(data);
// });

app.router.on('invalid-route', function(data) {
  console.log(data, data.err.stack);
});

module.exports = app;
