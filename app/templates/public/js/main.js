var app = window.mixdown = require('./app.js');

app.setup(function(err) {
  app.router.listen();
});
