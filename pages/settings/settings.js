Page({
  data: {
    username: wx.getStorageSync("github-name") || '',
    token: wx.getStorageSync('github-token') || '',
  },

  onChange(event) {
    wx.setStorageSync("github-name", event.detail)
  },

  onTokenChange(event) {
    wx.setStorageSync("github-token", event.detail)
  },

  onShow: function () {
    this.setData({ 
      username: wx.getStorageSync("github-name") || '',
      token: wx.getStorageSync("github-token") || '',
    })
  },
  
  onShareAppMessage: function () {
  }
})