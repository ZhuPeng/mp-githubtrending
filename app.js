const util = require('./utils/util.js')
App({
  onLaunch: function (options) {
  },
  onShow: function (options) {
    var path = options.path
    console.log('onShow path: ', path)
    if (!util.isGitHubPage(path)) {
      return
    }
    var [owner, repo, filepath] = util.parseGitHub(path)
    console.log("parseGitHub url:", owner, repo, filepath)
    if (owner == "") { return }
    if (filepath == "" && repo == "") {
      wx.redirectTo({ url: '/pages/account/account?owner=' + owner })
    } else if (filepath == "") {
      wx.redirectTo({ url: '/pages/readme/readme?repo=' + owner + " / " + repo })
    } else {
      wx.redirectTo({
        url: '/pages/gitfile/gitfile?file=' + filepath + '&owner=' + owner + '&repo=' + repo,
      })
    }
  },
  globalData: {
  }
})