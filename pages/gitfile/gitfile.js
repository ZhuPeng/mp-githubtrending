const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    file: '',
    repo: '',
    owner: '',
    content: '',
    spinning: false,
  },

  onLoad: function (options) {
    var file = options.file
    if (!options.repo && !options.owner) {
      var [owner, repo, filepath] = util.parseGitHub(file)
      file = filepath
      options.repo = repo
      options.owner = owner
    }
    wx.setNavigationBarTitle({ title: file })
    var ref = 'master'
    if (file.startsWith('./')) {file = file.slice(2)}
    if (file.startsWith('blob/') || file.startsWith('tree/')) {
      var arr = file.split('/')
      if (arr.length > 2) {
        ref = arr[1]
        file = file.slice((arr[0] + '/' + arr[1] + '/').length)
      }
    }
    this.setData({file: file, spinning: true, owner: options.owner, repo: options.repo})
    var self = this;
    cloudclient.callFunctionWithRawResponse({repo: options.repo, owner: options.owner, path: file, type: 'file', ref: ref}, function(d) {
      var content = util.base64Decode(d.content || 'No data found, may be network broken.')
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