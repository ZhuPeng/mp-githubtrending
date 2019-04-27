const cloudclient = require('../../utils/cloudclient.js')
Page({
  data: {
    blogs: {data: []},
    jobname: '',
  },

  onLoad: function (options) {
    var self = this
    this.setData({jobname: options.jobname})
    cloudclient.callFunctionWithBlog({ jobname: options.jobname, currentSize: this.data.blogs.data.length }, function (c) {
      self.setData({ blogs: c })
    })
  },

  onReachBottom: function () {
    console.log("onReachBottom")
    this.onLoad({jobname: this.data.jobname})
  },

  onShareAppMessage: function () {

  }
})