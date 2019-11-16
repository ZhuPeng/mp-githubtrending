const util = require('../../../utils/util.js')
const multimp = require('../../../utils/multimp.js')
const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {
    blogid: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ''
    },
    jobname: {
      type: String,
      value: ''
    },
    image_url: {
      type: String,
      value: ''
    },
    imgstyle: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: ''
    },
    username: {
      type: String,
      value: ''
    },
    userAvatar: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: '',
      observer() {
        this.handleUrl();
      }
    },
    updateAt: {
      type: String,
      value: '',
      observer() {
        this.timeAgo();
      }
    }
  },

  data: {
    parsedUrl: '',
    timeago: '',
    parsedContent: '',
  },

  methods: {
    timeAgo() {
      this.setData({timeago: util.timeAgo(this.data.updateAt)})
    },
    handleUrl() {
      var p = this.data.url;
      if (!util.isGitHubPage(p)) {
        var parsed = util.FindGitHubUrl(this.data.content)
        if (util.isGitHubPage(parsed) || p == "") {p = parsed}
      }
      var parsedContent = this.data.content
      var maxLen = 600
      if (parsedContent.length > maxLen) {
          parsedContent = parsedContent.slice(0, maxLen) + '\n\n**点击查看更多**\n\n'
      }
      var self = this;
      cloudclient.isMsgNotSec({content: parsedContent}, function(r) {
          if (r == true) {
              parsedContent = "**内容不符合微信安全规范，暂不显示**"
          }
          self.setData({parsedUrl: p, parsedContent})
      })
    },
    onClick(e) {
      console.log('card onClick: ', e)
      var url = this.data.parsedUrl || this.data.url;
      if (url && util.isGitHubPage(url)) {
        util.GitHubNavi(url, undefined, true)
        return
      } 
      if (url && url.startsWith('/pages/')) {
        wx.navigateTo({ url: url })
        return
      } 
      if (url && url.startsWith('http')) {
        if (multimp.Navi(url) != false) {return} 
      }
      if (this.data.type != 'card') {this.defaultNavi()}
      else {util.copyOnlyText(url)}
    },
    defaultNavi() {
      wx.navigateTo({
        url: '/pages/blog/blog?id=' + this.data.blogid + '&jobname=' + this.data.jobname,
      })
    },
  }
})
