var Router = require('./router-impl.js');

Router.prototype.js = require('./controllers/js.js');
Router.prototype.css = require('./controllers/asset.js');
Router.prototype.asset = require('./controllers/asset.js');

Router.prototype.manifest = require('./controllers/manifest.js');

module.exports = Router;
