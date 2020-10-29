const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
const gutil = require('../../utils/github.js')
Page({
  data: {
    question_url: '',
    answer_url: '',
    qcontent: '',
  },

  onLoad: function (options) {
    var qurl = 'https://github.com/yooubei/leetcode_answer/blob/master/problem/206.反转链表.md'
    this.setData({
      question_url: qurl,
      answer_url: 'https://github.com/yooubei/leetcode_answer/blob/master/problem/557.%E5%8F%8D%E8%BD%AC%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%AD%E7%9A%84%E5%8D%95%E8%AF%8D%20III.md',
    })

    var [owner, repo, file] = util.parseGitHub(qurl)
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
      
      self.setData({qcontent: content})
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