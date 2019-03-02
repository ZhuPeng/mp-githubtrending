Page({
  data: {
    username: wx.getStorageSync("github-name") || '',
  },

  onChange(event) {
    wx.setStorageSync("github-name", event.detail)
  },

  onShow: function () {
    this.setData({ username: wx.getStorageSync("github-name") || '',})
  },
  
  onShareAppMessage: function () {
  }
})