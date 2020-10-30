const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
const gutil = require('../../utils/github.js')
Page({
  data: {
    qcontent: '',
    acontent: '',
    qdata: {},
  },

  onLoad: function (options) {
    var self = this
    cloudclient.callFunctionWithName('question', {type: 'random'}, function(d) {
      console.log('random: ', d)
      self.setData({qdata: d})
      self.getContent('qcontent', d['question_url'])
    })
  },

  onClick: function(e) {
    this.getContent('acontent', this.data.qdata['answer_url'])
  },

  getContent: function(key, url) {
    var [owner, repo, file] = util.parseGitHub(url)
    file = gutil.GetRealFile(file)
    var self = this
    cloudclient.callFunction({ type: 'get', path: gutil.GetAPIURL(owner, repo, file), repo: repo, owner: owner, disableCache: false}, function(d) {
      var content = d.content
      if (d.encoding && d.encoding == 'base64') {
        content = util.base64Decode(d.content || 'No data found, may be network broken.')
      }
      
      var code = util.isCodeFile(file)
      if (file.endsWith('ipynb')) {
        content = gutil.convertIpynb(content)
      } else if (code) {
        content = gutil.convert2code(code, content)
      }
      var data = {}
      data[key] = content
      self.setData(data)
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})
