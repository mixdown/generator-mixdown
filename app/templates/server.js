var Mixdown = require('mixdown');
var config = require( './mixdown.json');
var packageJSON = require('./package.json');
var util = require('util');
var fs = require('fs');
var path = require('path');

var mixdown = new Mixdown(config);

if (process.env.MIXDOWN_ENV) {
  var env;

  // foundation env overrides
  try {
    env = require('../mixdown-' + process.env.MIXDOWN_ENV + '.json');
    mixdown.env(env);
  }
  catch(e) {
    console.error(e);
    process.exit();
  }
}

mixdown.start(function(err) {

  logger.info(packageJSON.name + ' version: ' + packageJSON.version);

  if (err) {
    if (logger) {
      logger.error('Server did not start. ' + err.stack);
    }
    console.log('Server did not start. ' + err.stack);

    process.exit();
  }

  mixdown.on('configuration-change', function() {
    logger.info('Configuration changed. ');
  });

  mixdown.on('error', function(err) {
    logger.info(util.inspect(err));
  });

  mixdown.on('reload', function() {
    logger.info('Hot reload.');
  });
});
