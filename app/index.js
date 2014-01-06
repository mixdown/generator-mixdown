'use strict';
var util = require('util');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var rimraf = require('rimraf');

var MixdownGenerator = module.exports = function MixdownGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  if(options) {
    this.packageName = options.packageName || false;
    this.packageDescription = options.desc || false;
    this.siteNames = options.sites || false;
    this.localPort = options.localport || false;
    this.alphaPort = options.alphaport || false;
    this.betaPort = options.betaport || false;
    this.productionPort = options.prodport || false;
    this.supressPrompts = options.noprompt || false;
    this.workingDirectory = options.wd;
  }

  //this is down here because I need this to be set in the tests
  //where the options are defaulted
  this.workingDirectory = this.workingDirectory || process.cwd();

  //somethings up with the prototype, so I had to put this here
  this.forceWrite = function(filepath,content) {
    try {
      fs.unlinkSync(filepath);
    }
    catch(err) {
      //I don't care about this error,
      //it's either ENOENT or something else
      //if it's ENOENT I don't care,
      //if it's something else the next call should fail
      //correctly
    }

    this.write(filepath,content);
  };

  this.forceCopy = function(source,dest){
    try {
      fs.unlinkSync(dest)
    }
    catch(err) {
      //I don't care about this error
    }

    this.copy(source,dest);
  }

  this.destinationRoot(this.workingDirectory);
}

util.inherits(MixdownGenerator, yeoman.generators.Base);

MixdownGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var getExistingConfig = function(name) {
    try{
      return require(name);
    }
    catch(e){
      return false;
    }
  };

  // detect if there is an existing app in this folder.
  // If yes, then show upgrade questions instead of new site questions.
  this.existingPackageJSON = fs.existsSync(path.join(this.workingDirectory, 'package.json'));
  this.existingRouter = fs.existsSync(path.join(this.workingDirectory, 'router'));
  this.existingSites = fs.existsSync(path.join(this.workingDirectory, 'sites'));

  //detect if they have allready specified ports
  this.existingLocal =  getExistingConfig(path.join(this.workingDirectory, 'mixdown.json'));
  this.existingAlpha =  getExistingConfig(path.join(this.workingDirectory, 'mixdown-alpha.json'));
  this.existingBeta =  getExistingConfig(path.join(this.workingDirectory, 'mixdown-beta.json'));
  this.existingProd =  getExistingConfig(path.join(this.workingDirectory, 'mixdown-prod.json'));

  //command line options override existing ports!
  if(this.existingLocal) {
    this.localPort = this.localPort || this.existingLocal.main.options.listen.port;
  }

  if(this.existingAlpha) {
    this.alphaPort = this.alphaPort || this.existingAlpha.main.options.listen.port;
  }

  if(this.existingBeta) {
    this.betaPort = this.betaPort || this.existingBeta.main.options.listen.port;
  }

  if(this.existingProd) {
    this.productionPort = this.productionPort || this.existingProd.main.options.listen.port;
  }

  //prompt for undetected values unless the supress prompts flag is on,
  //in that case throw an exception to fail the generator, and therefore fail the build
  var prompts = [];
  var supress = this.supressPrompts;
  var pushPrompt = function(prompt){
    if(supress){
      throw new Error('prompt supressed, missing value: ' + prompt.name);
    }
    else {
      prompts.push(prompt);
    }
  }

  if (!this.existingPackageJSON) {

    if(!this.packageName) {
      pushPrompt({
        name: 'packageName',
        message: 'What would you like to name this app?',
        default: _.last(this.workingDirectory.split(path.sep))
      });
    }

    if(!this.packageDescription) {
      prompts.push({
        name: 'packageDescription',
        message: 'Description [optional]',
        default: "Application generated from yo mixdown"
      });
    }
  }
  else {
    console.log('Existing site found.  Yo will upgrayedd the existing foundation.');
    this.oldPackageName = require(path.join(this.workingDirectory, 'package.json'));
  }

  if (!this.existingSites && !this.siteNames) {
    pushPrompt({
      name: 'siteNames',
      message: 'Sites (comma separated).  Ex: website1, website2',
      default: 'website1'
    });
  }

  if (!this.localPort) {
    pushPrompt({
      name: 'localPort',
      message: 'port on local machine',
      default: 8081
    });
  }

  if (!this.alphaPort) {
    pushPrompt({
      name: 'alphaPort',
      message: 'port on alpha',
      default: 8081
    });
  }

  if (!this.betaPort) {
    pushPrompt({
      name: 'betaPort',
      message: 'port on beta',
      default: 8081
    });
  }

  if (!this.productionPort) {
    pushPrompt({
      name: 'productionPort',
      message: 'port on production',
      default: 8081
    });
  }

  if(prompts.length !== 0) {
    this.prompt(prompts, function (props) {
      this.packageName = props.packageName ? props.packageName.replace(/\s/g, '-') : null;
      this.packageDescription = props.packageDescription;
      this.siteNames = props.siteNames;
      this.localPort = props.localPort;
      this.alphaPort = props.alphaPort;
      this.betaPort = props.betaPort;
      this.productionPort = props.productionPort;

      cb();
    }.bind(this));
  }
  else {
    cb();
  }
};

MixdownGenerator.prototype.app = function app() {

  var packageJSONTemplate = require(path.join(__dirname, '../app/templates/_package.json'));
  var packageJSON = this.existingPackageJSON ? require(path.join(this.workingDirectory, 'package.json')) : packageJSONTemplate;
  this.packageName = this.packageName || packageJSON.name;
  this.packageChanged = !(this.oldPackageName === this.packageName);

  if (!this.existingPackageJSON) {
    packageJSON.name = this.packageName;
    packageJSON.description = this.packageDescription;
  }
  else {
    //use this merge function, as it will not clobber local changes, but will provide warnings that dependencies are
    //conflicting
    var logger = this.log;
    var importantDependencies = ['mixdown', 'mixdown-server', 'mixdown-router', 'mixdown-plugins'];

    var defaultWithWarnings = function(dst,src) {
      _.each(src,function(v,k){
        if (importantDependencies.indexOf(k) >= 0) {
          dst[k] = v;
        }
        else if(typeof(dst[k]) !== 'undefined' && dst[k] !== v){
          logger.conflict(' dependency: %s conflicts with generated package, our version: %s, your version: %s',k,v,dst[k]);
        }
        else {
          dst[k] = v;
        }
      });
    }

    // merge packageJSON
    defaultWithWarnings(packageJSON.dependencies, packageJSONTemplate.dependencies);
    defaultWithWarnings(packageJSON.devDependencies, packageJSONTemplate.devDependencies);
  }

  // write package.json
  this.forceWrite('package.json', JSON.stringify(packageJSON, null, 2));

  // if the sites have never been generated, then generate them
  if (!this.existingSites) {
    this.mkdir('./sites');

    var sites = this.siteNames ? this.siteNames.split(',') : [];
    var siteJsonTemplate = require(path.join(__dirname, '../app/templates/' + './sites/' + 'site.json'));
    var that = this;

    sites.forEach(function(site) {
      var siteJson = _.cloneDeep(siteJsonTemplate);

      site = site.trim().replace(/[.\s]/g, '-');

      siteJson.vhosts.push(site + '.fe-alpha.vast.com');
      siteJson.vhosts.push(site + '.fe-beta.vast.com');
      siteJson.vhosts.push(site + '.fe-prod.vast.com');

      that.write('./sites/' + site + '.json', JSON.stringify(siteJson, null, 2));
    });
  }

  // Always force copy the overlays b/c these are not managed by the user.
  this.forceCopy('sites/common.json', 'sites/common.json');
  this.forceCopy('sites/router.json', 'sites/router.json');

  // if the location router has not been generated, then generate a boilerplate.
  if (!this.existingRouter) {
    this.mkdir('router');
    this.directory('local-router', 'router');
  }

  // always overwrite the scaffold b/c it does some core things
  rimraf.sync('scaffold');
  this.mkdir('scaffold');
  this.directory('scaffold', 'scaffold');

  // always overwrrite the root config files, use forcewrite to supress prompts
  // we do this to ensure that the app name/ports and sites views are up to date

  var mixdown = this.existingLocal || require(__dirname + "/templates/mixdown.json");
  mixdown.main.options.listen.port = parseInt(this.localPort);
  mixdown.logger.name = this.packageName;
  this.forceWrite('mixdown.json',JSON.stringify(mixdown,null,2));

  var mixdownAlpha = this.existingAlpha || require(__dirname + "/templates/mixdown-alpha.json");
  mixdownAlpha.main.options.listen.port = parseInt(this.alphaPort);
  mixdownAlpha.logger.name = this.packageName;
  mixdownAlpha.services.options.view = 'sites/' + this.packageName;
  this.forceWrite('mixdown-alpha.json',JSON.stringify(mixdownAlpha,null,2));

  var mixdownBeta = this.existingBeta || require(__dirname + "/templates/mixdown-beta.json");
  mixdownBeta.main.options.listen.port = parseInt(this.betaPort);
  mixdownBeta.logger.name = this.packageName;
  mixdownBeta.services.options.view = 'sites/' + this.packageName;
  this.forceWrite('mixdown-beta.json', JSON.stringify(mixdownBeta,null,2));

  var mixdownProd = this.existingProd || require(__dirname + "/templates/mixdown-prod.json");
  mixdownProd.main.options.listen.port = parseInt(this.productionPort);
  mixdownProd.logger.name = this.packageName;
  mixdownProd.services.options.view = 'sites/' + this.packageName;
  this.forceWrite('mixdown-prod.json', JSON.stringify(mixdownProd,null,2));

  // copy gitignore if it doesn't exisit
  var gitignoreExists = fs.existsSync(path.join(process.cwd(),'/.gitignore'));
  if(!gitignoreExists) {
    this.forceCopy('_gitignore', '.gitignore');
  }
};

MixdownGenerator.prototype.projectfiles = function projectfiles() {
  this.forceCopy('editorconfig', '.editorconfig');
  this.forceCopy('jshintrc', '.jshintrc');
};
