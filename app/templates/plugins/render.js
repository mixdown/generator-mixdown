var HandlebarsPlugin = require('mixdown-handlebars');
var _ = require('lodash');

var urlCapable = function(app) {
  return app.router && app.router.format;
};

module.exports = HandlebarsPlugin.extend({
  init: function(options) {
    this._super(options);

    var app = this._options.app;
    this.handlebars.registerHelper('url', function(route, options) {

      var router = app.router;
      var url = 'Mixdown Router plugin not defined.  Are you using mixdown-router?';

      if (urlCapable(app)) {

        var params = {};

        _.each(options.hash, function(options, paramName) {
          var segment = '';

          if (_.isObject(options)) {

            _.each(options, function(val, kat) {
              segment += kat + "-" + val + "/";
            });
          } else {
            segment = options;
          }

          params[paramName] = segment;
        });

        url = router.format(route, params);
      }

      return url;
    });
  }
});
