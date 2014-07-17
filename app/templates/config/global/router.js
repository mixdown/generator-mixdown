module.exports = {
  overlay: true,
  plugins: {
    router: {
      module: "mixdown-router",
      options: {
        timeout: 8000,
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
    }
  }
};
