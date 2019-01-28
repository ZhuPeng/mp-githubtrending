Page({
  data: {
    username: wx.getStorageSync("github-name") || '',
  },

  onChange(event) {
    wx.setStorageSync("github-name", event.detail)
  },

  onLoad: function (options) {
  },

  onReady: function () {
  },

  onShow: function () {
    this.setData({ username: wx.getStorageSync("github-name") || '',})
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