'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');

var MixdownGenerator = module.exports = function MixdownGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    this.installDependencies({
      skipInstall: options['skip-install']
    });
  });
};

util.inherits(MixdownGenerator, yeoman.generators.Base);

MixdownGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [];

  prompts.push({
    name: 'packageName',
    message: 'What would you like to name this app?',
    default: this._.last(process.cwd().split(path.sep))
  });

  prompts.push({
    name: 'siteNames',
    message: 'Sites (comma separated).  Ex: website1, website2',
    default: 'website1'
  });

  prompts.push({
    name: 'localPort',
    message: 'port on local machine',
    default: 8081
  });


  if (prompts.length !== 0) {
    this.prompt(prompts, function(props) {
      this.packageName = props.packageName ? props.packageName.replace(/\s/g, '-') : null;
      this.packageDescription = props.packageDescription;
      this.siteNames = props.siteNames;
      this.localPort = props.localPort;

      cb();
    }.bind(this));
  } else {
    cb();
  }
};

MixdownGenerator.prototype.app = function app() {

  var packageJSON = require(path.join(__dirname, '../app/templates/_package.json'));
  var oldPackageJSON = fs.existsSync(path.join(process.cwd(), '/package.json')) ? require(path.join(process.cwd(), '/package.json')) : {};

  packageJSON.name = this.packageName;
  packageJSON.description = this.packageDescription;

  this._.defaults(packageJSON.dependencies, oldPackageJSON.dependencies);
  this._.defaults(packageJSON.devDependencies, oldPackageJSON.devDependencies);
  this._.defaults(packageJSON.scripts, oldPackageJSON.scripts);

  // write package.json
  this.write('package.json', JSON.stringify(packageJSON, null, 2));

  this.mkdir('./config/sites');

  var sites = this.siteNames ? this.siteNames.split(',') : [];
  var siteJsonTemplate = require(path.join(__dirname, '../app/templates/' + './config/sites/' + 'site.json'));
  var self = this;

  sites.forEach(function(site) {
    var siteJson = self._.cloneDeep(siteJsonTemplate);
    site = self._.dasherize(site);
    siteJson.id = site;

    self.write('./config/sites/' + site + '.json', JSON.stringify(siteJson, null, 2));
  });

  this.mkdir('config/global');
  this.directory('config/global', 'config/global');

  this.copy('server.js', 'server.js');
  this.copy('Gruntfile.js', 'Gruntfile.js');

  // if the location router has not been generated, then generate a boilerplate.
  this.mkdir('controllers');
  this.directory('controllers', 'controllers');

  this.mkdir('plugins');
  this.directory('plugins', 'plugins');

  this.mkdir('views');
  this.directory('views', 'views');

  this.mkdir('public');
  this.directory('public', 'public');

  var mixdown = require(__dirname + "/templates/mixdown.json");
  mixdown.main.options.listen.port = parseInt(this.localPort);
  mixdown.logger.name = this.packageName;
  this.write('mixdown.json', JSON.stringify(mixdown, null, 2));

  // copy gitignore if it doesn't exisit
  var pathGitIgnore = path.join(process.cwd(), '/.gitignore');
  var gitignore = fs.existsSync(pathGitIgnore) ? fs.readFileSync(pathGitIgnore) : '';
  gitignore += '\n' + fs.readFileSync(path.join(__dirname, '../app/templates/_gitignore'));
  this.write('.gitignore', gitignore);

};

MixdownGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
