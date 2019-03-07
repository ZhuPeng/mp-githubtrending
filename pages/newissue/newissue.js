const cloudclient = require('../../utils/cloudclient.js')
Page({
  data: {
    title: '',
    content: '',
  },

  onLoad: function (options) {
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
        duration: 2000
      })
    }
    var owner = 'ZhuPeng'
    var repo = 'mp-githubtrending'
    var suffix = '\n\n\n> From WeChat Mini Programe: [GitHub Trending Hub](https://github.com/ZhuPeng/mp-githubtrending)'
    cloudclient.callFunction({ type: 'post', path: '/repos/' + owner + '/' + repo + '/issues', title: this.data.title, body: this.data.content + suffix}, function (c) {
      console.log(c)
      wx.showToast({
        icon: 'none',
        title: 'Success',
        duration: 2000
      })
      wx.navigateTo({
        url: '/pages/issue/issue?issue=' + c.url,
      })
    })
  },

  onShareAppMessage: function () {

  }
})