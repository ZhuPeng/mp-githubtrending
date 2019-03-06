const cloudclient = require('../../utils/cloudclient.js')
Page({
  data: {
    issue: {},
    comments: [],
  },

  onLoad: function (options) {
    var self = this
    console.log("issue: ", options.issue)
    cloudclient.callFunction({ type: 'get', path: options.issue }, function (c) {
      self.setData({issue: c})
      if (c.comments > 0) {
        self.loadComments(c.comments_url)
      }
    })
  },

  loadComments: function (url) {
    var self = this
    cloudclient.callFunction({ type: 'get', path: url }, function (c) {
      self.setData({ comments: c })
    })
  },

  onShareAppMessage: function () {

  }
})