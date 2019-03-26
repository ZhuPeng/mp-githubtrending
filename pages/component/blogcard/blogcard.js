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
        wx.navigateTo({
          url: '/pages/gitfile/gitfile?file=' + this.data.url,
        })
      } else {
        wx.navigateTo({
          url: '/pages/blog/blog?id=' + this.data.blogid + '&jobname=' + this.data.jobname,
        })
      }
    }
  }
})
