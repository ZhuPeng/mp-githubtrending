const util = require('../../../utils/util.js')
const multimp = require('../../../utils/multimp.js')
const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {
    md: {
      type: String,
      value: '',
      observer() {
        this.handleMd();
      }
    },
    owner: {
      type: String,
      value: ''
    },
    repo: {
      type: String,
      value: '' 
    },
    file: {
      type: String,
      value: '',
      observer() {
        this.handleCurrentDir();
      }
    },
  },

  attached: function () { 
    var self = this;
    cloudclient.GetConfig(function(r) {
      console.log('config:', r)
      if (r['github_raw_cdn']) {
        self.setData({cdn: r['github_raw_cdn']})
      }
    })
  },

  data: {
    currentDir: "",
    realMd: '',
    realMd2: '',
    cdn: 'https://raw.githubusercontent.com/',
  },

  methods: {
    faceLink(f) {
      return '![](https://www.webfx.com/tools/emoji-cheat-sheet/graphics/emojis/' + f + '.png)'
    },   
    handleMd() {
      var tmp = this.data.md
      var d = { '’': "'", "<br>": '\n\n', '<br/>': '\n\n', '<br />': '\n\n', '<em>': '', '</em>': '', '<strong>': '', '</strong>': '', '<li>': '\n    - ', '</li>': '\n', '<ul>': '\n*    ', '</ul>': '\n', '<code>': '`', '</code>': '`', '&nbsp;': ' ', "&quot;": '"', "&ldquo;": '"', "&rdquo;": '"', '&gt;': '>', '&lt;': '<'}
      for (var k in d) {
        var reg = new RegExp(k, "g")
        tmp = tmp.replace(reg, d[k])
      }

      var tipsExp = /\[.+?\]\[(.+?)\]/g;
      while (match = tipsExp.exec(tmp)) {
        console.log('tipsExp match:', match)
        var tip = match[1]
        if (tip.indexOf('[') > -1 || tip.indexOf(']') > -1) {continue}
        var imageExp = new RegExp("\\[" + match[1].replace('-', '\\-') + "\\]:\\t(.+?)\\n", "g");
        console.log('imageExp:', imageExp)
        var m
        if (m = imageExp.exec(tmp)) {
          console.log('tips match:', m)
          tmp = tmp.replace(']['+tip+']', ']('+m[1]+')')
        }
      }

      var faceRegExp = [/:([a-z_]{1,30}?):/g, /[+*-] (\[[xX ]\])/g];
      faceRegExp.map(f => {
        var tmpreg = tmp
        while (match = f.exec(tmpreg)) {
          if (match[1].startsWith('[')) {
            match[0] = match[1]
            if (match[1].toLowerCase().indexOf('x') > 0) {
              match[1] = 'white_check_mark'
            } else {
              match[1] = 'white_medium_square'
            }
          }
          tmp = tmp.replace(match[0], this.faceLink(match[1]))
        }
      })
      
      var linkRegExp = /((^|[ \n:\uff1a\uff0c]+)(https?:\/\/[/0-9a-zA-Z.&=#_?-]+)([ \t\r\n]+|$))/g;
      var matchCnt = 3
      var match;
      var newHtml = tmp
      while (match = linkRegExp.exec(newHtml)) {
        if (match[1] && match[matchCnt]) {
          var t = match[1]
          var url = match[matchCnt]
          var r = t.replace(url, util.mdLink(url, url))
          tmp = tmp.replace(match[1], r)
        }
      }

      var rstRegExp = /```eval_rst\n+?.. toctree\:\:\n([\s\S]*?)```/g
      while (match = rstRegExp.exec(tmp)) {
        var n = match[1]
        var rowExp = /\n\s+([^\[\]]+?)\n/g
        var m;
        while (m = rowExp.exec(n)) {
          if (m[1].indexOf('[') > 0) {break}
          n = n.replace(m[1], '['+m[1]+']('+m[1]+'.md)')
        }
        tmp = tmp.replace(match[0], n)
      }
      var mdMaxLen = 90000
      if (tmp.length > mdMaxLen) {
          util.Alert("文件大小超过限制，加载缓慢请耐心等待。")
          console.log("md length: ", tmp.length)
          this.setData({realMd: tmp.slice(0,mdMaxLen), realMd2: tmp.slice(mdMaxLen,tmp.length)})
      } else {
          this.setData({realMd: tmp})
      }
    },
    handleCurrentDir() {
      var arr = this.data.file.split('/')
      if (arr.length <= 1) {return}
      var cd = arr.slice(0, arr.length - 1).join('/')
      console.log('current dir:', cd, this.data.file)
      this.setData({currentDir: cd})
    },
    
    onMDClick(e) {
      var clickurl = e.detail.currentTarget.dataset.text
      var text = 'No anchorTargetText found'
      if (e.detail._relatedInfo) {
        text = e.detail._relatedInfo.anchorTargetText
      } 
      console.log("onMDClick url:", clickurl, text)
      var owner = this.data.owner
      var repo = this.data.repo
      if (clickurl.startsWith('http') && !util.isGitHubPage(clickurl)) {
        if (util.isImageFile(clickurl)) {
          wx.navigateTo({url: '/pages/gitfile/gitfile?file=' + clickurl})
        } else if (multimp.Navi(clickurl) == false) { 
          util.copyOnlyText(clickurl)
        } 
        return
      }

      var cdir = this.data.currentDir
      if (cdir != '' && !util.isGitHubPage(clickurl)) {
        if (clickurl.startsWith('./') || clickurl.startsWith('/')) {
          clickurl = clickurl.slice(clickurl.indexOf('/') + 1, clickurl.length)
        }
        if (clickurl.startsWith('../')) {
          if (cdir.length > 0 && cdir.indexOf('/') == -1) {
            clickurl = clickurl.slice(clickurl.indexOf('/') + 1, clickurl.length)
          }
        } else if (!clickurl.startsWith(cdir)) {
          clickurl = cdir + '/' + clickurl
        }
        console.log('update file path to:', clickurl)
      }
      if (clickurl.indexOf('[') > 0) {
        return
      }
      if (!util.isGitHubPage(clickurl)) {
        clickurl = 'https://github.com/' + owner + '/' + repo + '/' + clickurl
      }
     
      util.GitHubNavi(clickurl)
    },
  }
})
