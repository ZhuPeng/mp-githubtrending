const util = require('./utils/util.js')
App({
  onLaunch: function (options) {
    var path = options.path
    console.log('onLaunch path: ', path)
    if (!util.isGitHubPage(path)) {
      return
    }
    var [owner, repo, filepath] = util.parseGitHub(path)
    console.log("parseGitHub url:", owner, repo, filepath)
    if (owner == "") {return}
    if (filepath == "" && repo == "") {
      wx.navigateTo({ url: '/pages/account/account?owner=' + owner })
    } else if (filepath == "") {
      wx.navigateTo({ url: '/pages/readme/readme?repo=' + owner + " / " + repo })
    } else if (filepath.endsWith('.md') || util.isCodeFile(filepath)) {
      wx.navigateTo({
        url: '/pages/gitfile/gitfile?file=' + filepath + '&owner=' + owner + '&repo=' + repo,
      })
    }
  },
  globalData: {
  }
})