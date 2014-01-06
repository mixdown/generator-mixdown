# generator-mixdown [![Build Status](https://secure.travis-ci.org/mixdown/generator-mixdown.png?branch=master)](https://travis-ci.org/mixdown/generator-mixdown)

A generator for [Yeoman](http://yeoman.io).


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](https://github-camo.global.ssl.fastly.net/f8dc3e07d956f1f8dbdea5f895800fe53772a50d/687474703a2f2f692e696d6775722e636f6d2f326771696966742e6a7067)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-mixdown from npm, run:

```
$ npm install -g generator-mixdown
```

Finally, initiate the generator:

```
$ yo mixdown
```

## Mixdown Sub-Generator for create new http routes and controllers.

Try this to expose a new http route to send the route table back to the user.  Then point your browser at

[http://localhost:8081/manifest](http://localhost:8081/manifest)

```
Tommys-MacBook-Pro:000 tommy$ yo mixdown:route

     _-----_
    |       |
    |--(o)--|   .--------------------------.
   `---------´  |    Welcome to Yeoman,    |
    ( _´U`_ )   |   ladies and gentlemen!  |
    /___A___\   '__________________________'
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

[?] What would you like to name this route? manifest
[?] What does this route do in plain language? Gets the route table for the app
[?] What http verb would you like to use for this route? GET
[?] Please type the path for the route. /manifest
   create sites/route-manifest.json
 conflict router/router.js
[?] Overwrite router/router.js? overwrite
    force router/router.js
 conflict router/controllers/manifest.js
[?] Overwrite router/controllers/manifest.js? do not overwrite
     skip router/controllers/manifest.js


Tommys-MacBook-Pro:000 tommy$ npm start

> 000@0.0.0 start /junk/000
> node server.js

17:31:34 000.info: External Config initialized: { options: { app: { plugins: undefined }, paths: [ './sites' ] } }
17:31:34 000.info: Server started successfully. { address: '0.0.0.0', family: 'IPv4', port: 8081 } [ { vhosts: [ 'localhost' ], id: 'asdfdsagdas' } ]
17:31:34 000.info: 000 version: 0.0.0


```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
