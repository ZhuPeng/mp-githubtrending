const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    blogs: {data: []},
    jobname: '',
    spinning: true,
  },

  onLoad: function (options) {
    var self = this
    wx.setNavigationBarTitle({ title: 'Blog & News' })
    util.SetDataWithSpin(this, {jobname: options.jobname})
    cloudclient.callFunctionWithBlog({ jobname: options.jobname, currentSize: this.data.blogs.data.length }, function (c) {
      util.SetDataWithoutSpin(self, { blogs: c })
    })
  },

  onReachBottom: function () {
    console.log("onReachBottom")
    this.onLoad({jobname: this.data.jobname})
  },

  onShareAppMessage: function() {}
})