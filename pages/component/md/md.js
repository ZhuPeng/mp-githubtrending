const util = require('../../../utils/util.js')
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
    handleMd() {
      var tmp = this.data.md
      tmp = tmp.replace('’', "'")
      var linkRegExp = /((^|[ \n:\uff1a\uff0c]+)(https?:\/\/[^\s^'^"^#]+)([ \t\r\n]+|$))/g;
      var matchCnt = 3
      var match;
      while (match = linkRegExp.exec(tmp)) {
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
      this.setData({currentDir: arr.slice(0, arr.length-1).join('/')})
    },
    
    onMDClick(e) {
      console.log(e)
      var clickurl = e.detail.currentTarget.dataset.text
      var text = 'No anchorTargetText found'
      if (e.detail._relatedInfo) {
        text = e.detail._relatedInfo.anchorTargetText
      } 
      console.log("onMDClick url:", clickurl, text)
      var filepath = clickurl
      var owner = this.data.owner
      var repo = this.data.repo
      if (clickurl.startsWith('http') && !util.isGitHubPage(clickurl)) {
        util.copyOnlyText(clickurl)
        return
      }

      if (!util.isGitHubPage(clickurl)) {
        clickurl = 'https://github.com/' + owner + '/' + repo + '/' + clickurl
      }

      util.GitHubNavi(clickurl)
    },
  }
})
