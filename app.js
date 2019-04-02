const util = require('./utils/util.js')
App({
  onLaunch: function (options) {
  },

  onError(error) {
    wx.showToast({
      icon: 'none',
      title: error,
      duration: 2000
    })
  },

  onShow: function (options) {
    var path = options.path
    console.log('onShow path: ', path)
    util.GitHubNavi(path, wx.redirectTo)
  },
  
  globalData: {
  }
})