const util = require('../../../utils/util.js')
const multimp = require('../../../utils/multimp.js')
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
  },

  methods: {
    timeAgo() {
      this.setData({timeago: util.timeAgo(this.data.updateAt)})
    },
    handleUrl() {
      if (this.data.url) {return}
      this.setData({parsedUrl: util.FindGitHubUrl(this.data.content)})
    },
    onClick(e) {
      var url = this.data.url || this.data.parsedUrl;
      if (url && util.isGitHubPage(url)) {
        util.GitHubNavi(url, undefined, true)
      } else if (url && url.startsWith('/pages/')) {
        wx.navigateTo({ url: url })
      } else if (url && url.startsWith('http')) {
        multimp.Navi(url)
      } else {
        wx.navigateTo({
          url: '/pages/blog/blog?id=' + this.data.blogid + '&jobname=' + this.data.jobname,
        })
      }
    }
  }
})
