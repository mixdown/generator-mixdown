module.exports = {
  path: "/img/?:img_src",
  description: "Serves images",
  params: {
    img_src: {
      kind: "rest",
      regex: "(.*)",
      default: ""
    }
  },
  get: require('../asset/route.js').get
};
