const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    issue: {},
    comments: [],
    prDiff: '',
    content: '',
    owner: '',
    repo: '',
  },

  onContentChange: function (e) {
    this.setData({ content: e.detail })
  },

  onButtonClick: function () {
    if (this.data.content == '') {
      wx.showToast({
        icon: 'none',
        title: 'Content was empty!',
        duration: 4000
      })
    }
    var {owner, repo} = this.data
    var suffix = '\n\n\n> From WeChat Mini Programe: [GitHub Trending Hub](https://github.com/ZhuPeng/mp-githubtrending)'
    cloudclient.callFunction({ type: 'post', path: '/repos/' + owner + '/' + repo + '/issues/' + this.data.issue.number + '/comments', body: this.data.content + suffix, owner, repo }, function (c) {
      console.log(c)
      wx.showToast({
        icon: 'none',
        title: 'Create Success',
        duration: 4000
      })
      wx.navigateTo({
        url: '/pages/issue/issue?issue=' + c.issue_url,
      })
    })
  },

  onLoad: function (options) {
    var self = this
    console.log("issue: ", options.issue)
    cloudclient.callFunction({ type: 'get', path: options.issue }, function (c) {
      var [owner, repo, filepath] = util.parseGitHub(c.html_url)
      self.setData({issue: c, owner, repo})
      if (c.pull_request) { self.loadDiff() }
      self.loadComments(c.comments_url)
    })
  },

  loadDiff() {
    var self = this
    var { owner, repo } = this.data
    cloudclient.callFunction({ type: 'pr', owner, repo, path: self.data.issue.number }, function (c) {
      var code = 'python'
      self.setData({ prDiff: "```" + code + "\n" + c.data + "\n```" })
    })
  },

  loadComments: function (url) {
    var self = this
    cloudclient.callFunction({ type: 'get', path: url }, function (c) {
      self.setData({ comments: c })
    })
  },

  onShareAppMessage: function () {

  }
})