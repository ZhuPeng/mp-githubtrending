const util = require('../../../utils/util.js')
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
  },

  data: {

  },

  methods: {
    onClick(e) {
      if (this.data.jobname == 'github') {
        util.GitHubNavi(this.data.url, undefined, true)
      } else {
        wx.navigateTo({
          url: '/pages/blog/blog?id=' + this.data.blogid + '&jobname=' + this.data.jobname,
        })
      }
    }
  }
})
