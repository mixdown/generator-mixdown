module.exports = {
  path: "/css/:css_src",
  description: "CSS resources",
  params: {
    css_src: {
      kind: "rest",
      regex: "(.*\\.css)",
      default: ""
    }
  },
  get: require('../asset/route.js').get
};
