const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    file: '',
    repo: '',
    owner: '',
    content: '',
    spinning: false,
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({title: options.file})
    this.setData({file: options.file, spinning: true, owner: options.owner, repo: options.repo})
    var self = this;
    cloudclient.callFunctionWithRawResponse({repo: options.repo, owner: options.owner, path: options.file, type: 'file'}, function(d) {
      self.setData({ content: util.base64Decode(d.content), spinning: false})
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})