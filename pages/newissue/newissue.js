const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    repourl: '',
    title: '',
    content: '',
  },

  onLoad: function (options) {
    this.setData({repourl: decodeURIComponent(options.url)})
  },

  onTitleChange: function(e) {
    this.setData({title: e.detail.value})
  },

  onContentChange: function (e) {
    this.setData({ content: e.detail.value })
  },

  onButtonClick: function () {
    if (this.data.title == '' || this.data.content == '') {
      util.Alert('Title or Content was empty!', 4000)
    }
    var [owner, repo, filepath] = util.parseGitHub(this.data.repourl)
    cloudclient.callFunction({ type: 'post', path: '/repos/' + owner + '/' + repo + '/issues', title: this.data.title, body: this.data.content, owner, repo}, function (c) {
      console.log(c)
      util.Alert('Create Success', 4000)
      wx.navigateTo({
        url: '/pages/issue/issue?issue=' + c.url,
      })
    })
  },

  onShareAppMessage: function () {

  }
})
