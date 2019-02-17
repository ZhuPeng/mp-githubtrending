const util = require('../../../utils/util.js')
import Toast from '../../../third-party/vant-weapp/toast/toast';
Component({
  properties: {
    md: {
      type: String,
      value: ''
    },
    owner: {
      type: String,
      value: ''
    },
    repo: {
      type: String,
      value: '' 
    }
  },

  data: {

  },

  methods: {
    onMDClick(e) {
      var clickurl = e.detail.currentTarget.dataset.text
      var text = e.detail._relatedInfo.anchorTargetText
      console.log("onMDClick url:", clickurl, text)
      var filepath = clickurl
      var owner = this.data.owner
      var repo = this.data.repo
      if (clickurl.startsWith('http') && !clickurl.startsWith('https://github.com')) {
        this.copyText(clickurl)
        return
      }

      if (clickurl.startsWith("https://github.com")) {
        var [tmpowner, tmprepo, tmpfilepath] = util.parseGitHub(clickurl)
        console.log("parseGitHub url:", tmpowner, tmprepo, tmpfilepath)
        if (tmpowner && tmprepo) {
          owner = tmpowner
          repo = tmprepo
          filepath = tmpfilepath
        }
        console.log("change owner repo:", owner, repo, filepath)
      }
      if (filepath == "") {
        wx.navigateTo({url: '/pages/readme/readme?repo='+owner+" / "+repo})
      }
      else if (filepath.endsWith('.md') || util.isCodeFile(filepath)) {
        wx.navigateTo({
          url: '/pages/gitfile/gitfile?file=' + filepath + '&owner=' + owner + '&repo=' + repo,
        })
      } else {
        this.copyText(clickurl)
      }
    },

    copyText(text) {
      wx.setClipboardData({
        data: text,
        success() {
          wx.hideToast()
          Toast('复制成功 ' + text)
        }
      })
    },
  }
})
