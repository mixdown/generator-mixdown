var HandlebarsPlugin = require('broadway-handlebars');
var _ = require('lodash');

var RenderPlugin = function() {};

var urlCapable = function(app) {
  return app.plugins.router && app.plugins.router.format;
};

RenderPlugin.prototype.attach = function(options) {
  var app = options.app;

  // inject your helpers here.  
  // Below, there is a url helper attached which uses mixdown-router if available.
  options.helpers = {
    url: function(route, options) {
        
      var router = app.plugins.router;
      var url = 'Mixdown Router plugin not defined.  Are you using mixdown-router?';
      
      if(urlCapable(app)) {
      
        var params = {};
        
        _.each(options.hash, function (options, paramName) {
          var segment = '';
          
          if(_.isObject(options)) {
              
            _.each(options, function(val, kat){
              segment += kat + "-" + val + "/";
            });
          }
          else{
            segment = options;
          }
          
          params[paramName] = segment;
        });
        
        url = router.format(route, params);
      }
      
      return url;
    }
  };

  this.use(new HandlebarsPlugin(), options);
};

module.exports = RenderPlugin;