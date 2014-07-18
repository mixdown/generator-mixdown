module.exports = function(grunt) {
  grunt.initConfig({
    'mixdown-router': {
      options: {
        dest: './public/js',
        paths: [{
          path: './controllers/api',
          url_prefix: '/api/v1'
        }, {
          path: './controllers/pages',
          url_prefix: '',
          add_namespace: false
        }, {
          path: './controllers/util',
          url_prefix: '',
          add_namespace: false
        }]
      }
    },
    'mixdown-handlebars': {
      options: {
        dest: './public/js',
        views: {
          base: [
            "./views"
          ],
          ext: "html"
        }
      }
    }
  });

  grunt.loadNpmTasks('mixdown-router');
  grunt.loadNpmTasks('mixdown-handlebars');

  grunt.registerTask('default', ['mixdown-router', 'mixdown-handlebars']);
};
