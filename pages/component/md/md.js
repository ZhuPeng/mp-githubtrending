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
  },

  methods: {
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
