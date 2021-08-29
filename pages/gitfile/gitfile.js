const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
const g = require('../../utils/github.js')
const qrcode = require('../../utils/qrcode.js')
Page({
  data: {
    options: {},
    file: '',
    url: '',
    repo: '',
    owner: '',
    content: '',
    spinning: false,
    withSubscribe: false,
  },

  onLoad: function (options) {
    var file = decodeURIComponent(options.file)
    wx.setNavigationBarTitle({ title: file })
    file = g.GetRealFile(file)
    this.setData({url: 'https://github.com/' + options.owner + '/' + options.repo, file: file, spinning: true, owner: options.owner, repo: options.repo, withSubscribe: options.withsubscribe || false, options})

    if (util.isImageFile(file)) {
      console.log('image:')
      this.setData({ content: '![](' + file + ')', spinning: false })
      return 
    }
    var self = this;

    if (util.IsDocFileType(file)) {
      var url = file
      if (!url.startsWith('http')) {
        url = g.GetContentURL(options.owner, options.repo, file)
      }
      console.log('download url:', url)
      wx.downloadFile({
        url: url,
        success: function (res) {
          console.log('dowload success:', res)
          var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
          wx.openDocument({
            filePath: Path,
            success: function (res) {console.log('打开成功'); util.SetDataWithoutSpin(self, {})}
          })
        },
        fail: function (res) {console.log('download fail:', res)}
      })  
      return
    }

    var apiurl = g.GetAPIURL(options.owner, options.repo, file)
    if (file.startsWith('http')) {
      apiurl = file
    }
    cloudclient.callFunction({ type: 'get', path: apiurl, repo: options.repo, owner: options.owner, disableCache: options.disableCache || false}, function(d) {
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
        content = g.convertIpynb(content)
      } else if (code) {
        content = g.convert2code(code, content)
      }
      
      self.setData({ content: content, spinning: false, url: d.html_url || self.data.url})
      setTimeout(self.scrollHitoryTop, 700)
      qrcode.DialogShare()
    })
  },

  getScrollKey: function() {return this.data.owner+this.data.repo+this.data.file; },
  scrollHitoryTop: function() {
    wx.getStorage({key: this.getScrollKey(), success: function (res) {
      wx.pageScrollTo({scrollTop: res.data[0], duration: 300})
    }})
  },
  onPageScroll: function(e){
    wx.setStorage({key: this.getScrollKey(), data: [e.scrollTop]})
  },

  onPullDownRefresh: function () {
    console.log("onPulldowRefresh")
    var options = this.data.options
    options['disableCache'] = true
    this.onLoad(options)
  },

  onShareAppMessage: function () {
  }
})
