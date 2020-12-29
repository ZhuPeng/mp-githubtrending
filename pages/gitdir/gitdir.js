const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
const g = require('../../utils/github.js')
Page({
  data: {
    apiurl: '',
    owner: '',
    repo: '',
    list: [],
    readme: '',
    spinning: true,
  },

  onLoad: function (options) {
    console.log(options)
    if (options.auto) {
      util.Alert("已为你自动跳转到下一目录，请稍等", 2000)
    }
    var apiurl = decodeURIComponent(options.apiurl)
    this.setData({apiurl: apiurl, owner: options.owner, repo: options.repo})
    var self = this
    cloudclient.callFunction({ type: 'get', path: options.apiurl, repo: options.repo, owner: options.owner }, function (c) {
      util.SetDataWithoutSpin(self, { list: c })
      if (c.length == 1 && c[0].type == 'dir') {
        wx.navigateTo({
          url: '/pages/gitdir/gitdir?auto=true&owner=' + self.data.owner + '&repo=' + self.data.repo + '&apiurl=' + c[0].url,
        })
      }

      for(var i=0; i<c.length; i++) {
        if(c[i].name == 'README.md') {
          self.loadReadme(c[i].path)
        }
      }
    })
  },

  loadReadme: function(file) {
    var apiurl = g.GetAPIURL(this.data.owner, this.data.repo, file)
    var self = this;
    cloudclient.callFunction({ type: 'get', path: apiurl, repo: this.data.repo, owner: this.data.owner, disableCache: false}, function(d) {
      var content = d.content
      if (d.encoding && d.encoding == 'base64') {
        content = util.base64Decode(d.content || 'No data found, may be network broken.')
      }
      self.setData({readme: content})
    })
  },

  onShareAppMessage: function () {

  }
})
