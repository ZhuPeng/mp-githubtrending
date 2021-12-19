const util = require('../../utils/util.js')
Page({
  data: {
    url: '',
    buttons: [{
      type: 'balanced',
      block: true,
      text: '返回首页',
    }],
  },

  onLoad: function (options) {
    // console.log(options)
    this.setData({url: options.url})
    util.copyTextWithCallback(options.url, function (){})
  },

  onClick(e) {
    wx.navigateTo({
      url: '/pages/bloglist/bloglist',
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