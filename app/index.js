'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var MixdownGenerator = module.exports = function MixdownGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MixdownGenerator, yeoman.generators.Base);

MixdownGenerator.prototype.howdy = function () {
  console.log(this.yeoman);
};

MixdownGenerator.prototype.app = function app() {
  var callback = this.async();

  this.remote('mixdown', 'boilerplate', 'v1', function (err, remote) {
    remote.directory('./', './');
    callback();
  });
};
