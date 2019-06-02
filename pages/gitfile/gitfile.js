const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    file: '',
    repo: '',
    owner: '',
    content: '',
    spinning: false,
    withSubscribe: false,
  },

  onLoad: function (options) {
    var file = decodeURIComponent(options.file)
    console.log('file:', file)
    wx.setNavigationBarTitle({ title: file })
    var ref = 'master'
    if (!file) { util.Alert('file parameter was empty')}
    if (file.startsWith('./')) {file = file.slice(2)}
    if (file.startsWith('blob/') || file.startsWith('tree/')) {
      var arr = file.split('/')
      if (arr.length > 2) {
        ref = arr[1]
        file = file.slice((arr[0] + '/' + arr[1] + '/').length)
      }
    }
    this.setData({file: file, spinning: true, owner: options.owner, repo: options.repo, withSubscribe: options.withsubscribe || false})
    var self = this;

    var apiurl = 'https://api.github.com/repos/' + options.owner + '/' + options.repo + '/contents/' + encodeURIComponent(file)
    if (file.startsWith('http')) {
      apiurl = file
    }
    cloudclient.callFunction({ type: 'get', path: apiurl, repo: options.repo, owner: options.owner}, function(d) {
      if (Array.isArray(d)) {
        wx.redirectTo({
          url: '/pages/gitdir/gitdir?&owner=' + options.owner + '&repo=' + options.repo + '&apiurl='+apiurl,
        })
      }
      
      var content = d.content
      if (d.encoding && d.encoding == 'base64') {
        content = util.base64Decode(d.content || 'No data found, may be network broken.')
      }
      
      var code = util.isCodeFile(file)
      if (file.endsWith('ipynb')) {
        content = self.convertIpynb(content)
      } else if (code) {
        content = "```" + code + "\n" + content + "\n```";
      }
      
      self.setData({ content: content, spinning: false})
    })
  },

  convertIpynb: function (content) {
    var json = JSON.parse(content)
    if (!json.cells) {return content}
    var md = '';
    json.cells.map(function(cell) {
      // console.log(cell)
      var c = ""
      cell.source.map(function(s) {
        c += s
      })
      if (cell.cell_type == 'code') { 
        c = "```" + 'python' + "\n" + c + "\n```";
      }
      md += c + '\n'
    })
    return md;
  },

  onShareAppMessage: function () {
  }
})
