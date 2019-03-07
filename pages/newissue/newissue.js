const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    repourl: '',
    title: '',
    content: '',
  },

  onLoad: function (options) {
    this.setData({repourl: options.url})
  },

  onTitleChange: function(e) {
    this.setData({title: e.detail})
  },

  onContentChange: function (e) {
    this.setData({ content: e.detail })
  },

  onButtonClick: function () {
    if (this.data.title == '' || this.data.content == '') {
      wx.showToast({
        icon: 'none',
        title: 'Title or Content was empty!',
        duration: 4000
      })
    }
    var [owner, repo, filepath] = util.parseGitHub(this.data.repourl)
    var suffix = '\n\n\n> From WeChat Mini Programe: [GitHub Trending Hub](https://github.com/ZhuPeng/mp-githubtrending)'
    cloudclient.callFunction({ type: 'post', path: '/repos/' + owner + '/' + repo + '/issues', title: this.data.title, body: this.data.content + suffix, owner, repo}, function (c) {
      console.log(c)
      wx.showToast({
        icon: 'none',
        title: 'Create Success',
        duration: 4000
      })
      wx.navigateTo({
        url: '/pages/issue/issue?issue=' + c.url,
      })
    })
  },

  onShareAppMessage: function () {

  }
})