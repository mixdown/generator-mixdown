var Router = require('./router.js');
var App = require('mixdown-app').App;
var app = new App();

app.use(new Router(), 'router');

// app.router.on('no-browser-handler', function(data) {
//   console.log(data);
// });

app.router.on('invalid-route', function(data) {
  console.log(data, data.err.stack);
});

module.exports = app;
