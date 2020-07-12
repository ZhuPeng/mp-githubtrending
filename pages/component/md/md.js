const util = require('../../../utils/util.js')
const multimp = require('../../../utils/multimp.js')
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

  data: {
    currentDir: "",
    realMd: '',
  },

  methods: {
    faceLink(f) {
      return '![](https://www.webfx.com/tools/emoji-cheat-sheet/graphics/emojis/' + f + '.png)'
    },   
    handleMd() {
      var tmp = this.data.md
      var d = { '’': "'", "<br>": '\n\n', '<br/>': '\n\n', '<br />': '\n\n', '<em>': '', '</em>': '', '<strong>': '', '</strong>': '', '<li>': '* ', '</li>': '\n', '<ul>': '\n', '</ul>': '\n', '<code>': '`', '</code>': '`', '&nbsp;': ' ', "&quot;": '"', "&ldquo;": '"', "&rdquo;": '"', '&gt;': '>', '&lt;': '<'}
      for (var k in d) {
        var reg = new RegExp(k, "g")
        tmp = tmp.replace(reg, d[k])
      }

      var faceRegExp = [/:([a-z_]{1,30}?):/g, /[+*-] (\[[x ]\])/g];
      faceRegExp.map(f => {
        var tmpreg = tmp
        while (match = f.exec(tmpreg)) {
          if (match[1].startsWith('[')) {
            match[0] = match[1]
            if (match[1].indexOf('x') > 0) {
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
      this.setData({realMd: tmp})
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

      if (this.data.currentDir != '' && !util.isGitHubPage(clickurl)) {
        if (clickurl.startsWith('./') || clickurl.startsWith('/')) {
          clickurl = clickurl.slice(clickurl.indexOf('/') + 1, clickurl.length)
        }
        if (!clickurl.startsWith(this.data.currentDir)) {
          clickurl = this.data.currentDir + '/' + clickurl
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
