const util = require('./utils/util.js')
App({
  onLaunch: function (options) {
  },

  onError(error) {
    util.Alert(error)
  },

  onShow: function (options) {
    var path = options.path
    console.log('onShow path: ', path)
    util.GitHubNavi(path, wx.redirectTo)
  },
  
  globalData: {
  }
})