var Router = require('./router-impl.js');
module.exports = Router;

Router.prototype.home = require('./controllers/home.js');

Router.prototype.css = require('./controllers/css.js');

Router.prototype.js = require('./controllers/js.js');

Router.prototype.asset = require('./controllers/asset.js');
