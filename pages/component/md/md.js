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
