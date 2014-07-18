'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');

var RouteGenerator = module.exports = function RouteGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.Base.apply(this, arguments);

  // this.on('end', function () {
  //   this.installDependencies({ skipInstall: true });
  // });
};

util.inherits(RouteGenerator, yeoman.generators.Base);

RouteGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  //prompt for undetected values unless the supress prompts flag is on,
  //in that case throw an exception to fail the generator, and therefore fail the build
  var prompts = [];

  prompts.push({
    name: 'routeName',
    message: 'What would you like to name this route?'
  });

  prompts.push({
    name: 'routeDescription',
    message: 'What does this route do in plain language?',
    default: 'Gets data for the foo entities in this application.'
  });

  prompts.push({
    type: 'confirm',
    name: 'routeGet',
    message: 'Does this route suppot http GET?',
    default: true
  });

  prompts.push({
    type: 'confirm',
    name: 'routePost',
    message: 'Does this route suppot http POST?',
    default: false
  });

  prompts.push({
    type: 'confirm',
    name: 'routePut',
    message: 'Does this route suppot http PUT?',
    default: false
  });

  prompts.push({
    type: 'confirm',
    name: 'routeDelete',
    message: 'Does this route suppot http DELETE?',
    default: false
  });

  prompts.push({
    name: 'routePath',
    message: 'Please type the path for the route.',
    default: '/foo/:bar/:baz'
  });

  prompts.push({
    name: 'routeQuery',
    message: 'Please list (comma separated) optional (query params) for the route. (ex: page_number, page_size would generate querystring scaffold for paging)',
    default: ''
  });

  prompts.push({
    type: 'confirm',
    name: 'routeBrowser',
    message: 'Will this route run in the browser in single page app mode?',
    default: false
  });

  prompts.push({
    type: "select",
    name: "routeControllerType",
    message: 'What type of content will be sent with this route (html, api) ?',
    choices: [{
      name: "html",
      value: "html"
    }, {
      name: "api",
      value: "api"
    }],
    default: "html"
  });

  var self = this;

  this.prompt(prompts, function(props) {
    this._.extend(this, props);
    this.routeName = this._.dasherize(this.routeName);

    self.prompt([{
      name: 'routeFilePath',
      message: 'Where should this controller be written to your project?',
      default: this.routeControllerType === 'api' ? 'controllers/api' : 'controllers/pages'
    }], function(fp_props) {
      self._.extend(self, fp_props);
      cb();
    });

  }.bind(this));

};

RouteGenerator.prototype.files = function files() {

  // load correct template
  var new_route = require(path.join(this.sourceRoot(), 'controller-' + this.routeControllerType + '.js'));

  // set name/description
  new_route.path = this.routePath;
  new_route.description = this.routeDescription;

  // remove un-supported http verbs
  if (!this.routeGet) {
    delete new_route.get;
  }

  if (!this.routePut) {
    delete new_route.put;
  }

  if (!this.routeDelete) {
    delete new_route.delete;
  }

  if (!this.routePost) {
    delete new_route.post;
  }

  var self = this;
  var route_name = this._.underscored(this.routeName).trim();
  var param_template = require(path.join(this.sourceRoot(), 'param.json'));
  var rx_param_test = /^\??:/;

  // add query params to list
  this._.each(this.routeQuery.split(','), function(queryParam) {
    queryParam = queryParam.trim();
    if (queryParam) {
      var new_param = self._.clone(param_template);
      new_param.kind = 'query';
      new_route.params[queryParam] = new_param;
    }
  });

  // add rest params to list
  this._.each(this.routePath.split('/'), function(restParam) {

    if (rx_param_test.test(restParam)) {

      var new_param = self._.clone(param_template);
      new_param.kind = 'rest';
      new_route.params[restParam.replace(rx_param_test, '')] = new_param;
    }
  });

  // write new_route to file system
  var dir_path = path.join(this.routeFilePath, route_name);
  var route_path = path.join(dir_path, 'route.js');
  var browser_path = path.join(dir_path, 'browser_handler.js');
  var str_buf = [];

  this._.each(new_route, function(prop, name) {
    if (typeof(prop) === 'function') {
      str_buf.push(name + ': ' + prop.toString());
    } else if (typeof(prop) === 'object') {
      str_buf.push(name + ': ' + JSON.stringify(prop, null, 2));
    } else if (typeof(prop) === 'string') {
      str_buf.push(name + ': "' + prop.toString() + '"');
    } else {
      str_buf.push(name + ': ' + prop.toString());
    }
  });

  var src = 'module.exports = {\n  ' + str_buf.join(',\n  ') + '\n};';

  // write the new route and handler source
  this.write(route_path, src);

  // if this supports browser execution, then write the browser_handler.
  if (this.routeBrowser) {
    this.copy('browser_handler.js', browser_path);
  }

};
