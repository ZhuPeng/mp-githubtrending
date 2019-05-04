const util = require('./utils/util.js')
const lastestPageKey = 'lastest-page'
App({
  onLaunch: function (options) {
  },

  onError(error) {
    util.Alert(error)
  },

  onShow: function (options) {
    var path = options.path
    console.log('onShow path: ', path)
    if (!path.startsWith('pages/')) {
      util.GitHubNavi(path, wx.redirectTo)
      return
    }
    if (path != 'pages/github/index') {
      return
    }
    var lastest = wx.getStorageSync(lastestPageKey)
    if (lastest && lastest.path!=undefined && lastest.param!=undefined && path != lastest.path) {
      console.log('invoke page recover:', lastest.path, lastest.param)
      wx.navigateTo({url: lastest.path + '?' + lastest.param})
    }
  },

  onHide() {
    var [path, param] = util.GetLastestPage()
    console.log('onHide:', path, param)
    wx.setStorageSync(lastestPageKey, {path, param, time: new Date()})
  },
  
  globalData: {
  }
})