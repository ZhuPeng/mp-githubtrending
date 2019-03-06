const cloudclient = require('../../utils/cloudclient.js')
Page({
  data: {
    commit: {}
  },

  onLoad: function (options) {
    console.log("commit url: ", options.url)
    var self = this
    cloudclient.callFunction({ type: 'get', path: options.url }, function (c) {
      self.setData({ commit: c })
    })
  },

  onShareAppMessage: function () {

  }
})