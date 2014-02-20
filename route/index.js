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

  var getExistingConfig = function(name) {
    try{
      return require(name);
    }
    catch(e){
      return false;
    }
  };

  this.existingRouter = this.readFileAsString(path.join(process.cwd(), 'router/router.js'));

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
    name: 'routeVerb',
    message: 'What http verb would you like to use for this route?',
    default: 'GET'
  });

  prompts.push({
    name: 'routePath',
    message: 'Please type the path for the route.',
    default: '/foo/:bar/:baz'
  });

  prompts.push({
    type: "select",
    name: "routeControllerType",
    message: 'What type of content will be sent with this route (html, api, default) ?',
    choices: [
      {
        name: "html",
        value: "html"
      },
      {
        name: "api",
        value: "api"
      },
      {
        name: "default",
        value: "default"
      }
    ],
    default: "default"
  });

  this.prompt(prompts, function (props) {
    this._.extend(this, props);
    this.routeName = this._.dasherize(this.routeName);
    cb();
  }.bind(this));

};

RouteGenerator.prototype.files = function files() {

  // write the new route table entry
  var route = require(path.join(this.sourceRoot(), 'route.json'));
  var restTemplate = require(path.join(this.sourceRoot(), 'rest.json'));
  var self = this;

  route.path = this.routePath;
  route.method = this.routeVerb;
  route.description = this.routeDescription;
  route.name = route.handler = this._.underscored(this.routeName);

  // map params
  this._.each(this.routePath.split('/'), function(restParam) {
    if (restParam[0] === ':') {
      route.params[restParam.substring(1)] = self._.clone(restTemplate);
    }
  });


  var overlay = require(path.join(this.sourceRoot(), 'overlay.json'));
  overlay.plugins.router.options.routes[this._.underscored(this.routeName)] = route;

  this.write('sites/route-' + this.routeName + '.json', JSON.stringify(overlay, null, 2));

  // generate the new method on the router for the handler.
  var newRouter = [

    this.existingRouter,
    '\nRouter.prototype.',
    this._.underscored(this.routeName),
    ' = require(\'./controllers/',
    this.routeName,
    '.js\');\n'

  ].join('');

  // write the new route handler source code.
  this.write('router/router.js', newRouter);

  // copy the new controller.
  this.copy('controller-' + this.routeControllerType + '.js', 'router/controllers/' + this.routeName + '.js');

};
