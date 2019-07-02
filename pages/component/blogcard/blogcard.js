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
      value: ''
    },
  },

  data: {

  },

  methods: {
    onClick(e) {
      if (this.data.url && util.isGitHubPage(this.data.url)) {
        util.GitHubNavi(this.data.url, undefined, true)
      } else if (this.data.url && this.data.url.startsWith('/pages/')) {
        wx.navigateTo({ url: this.data.url })
      } else if (this.data.url && this.data.url.startsWith('http')) {
        multimp.Navi(this.data.url)
      } else {
        wx.navigateTo({
          url: '/pages/blog/blog?id=' + this.data.blogid + '&jobname=' + this.data.jobname,
        })
      }
    }
  }
})
