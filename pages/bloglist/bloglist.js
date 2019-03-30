const cloudclient = require('../../utils/cloudclient.js')
Page({
  data: {
    blogs: {}
  },

  onLoad: function (options) {
    var self = this
    cloudclient.callFunctionWithBlog({ jobname: options.jobname }, function (c) {
      self.setData({ blogs: c })
    })
  },

  onShareAppMessage: function () {

  }
})