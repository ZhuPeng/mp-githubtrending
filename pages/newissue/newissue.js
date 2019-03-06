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
    var suffix = '\n\n> From WeChat Mini Programe [GitHub Trending Hub](https://github.com/ZhuPeng/mp-githubtrending)'
    cloudclient.callFunction({ type: 'createissue', owner: 'ZhuPeng', repo: 'mp-githubtrending', title: this.data.title, body: this.data.content + suffix}, function (c) {
      console.log(c)
    })
  },

  onShareAppMessage: function () {

  }
})