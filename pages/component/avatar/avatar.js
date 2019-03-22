const util = require('../../../utils/util.js')
Component({
  properties: {
    url: {
      type: String,
      value: ''
    },
    login: {
      type: String,
      value: ''
    },
    action: {
      type: String,
      value: ''
    },
    tag: {
      type: String,
      value: ''
    },
    created_at: {
      type: String,
      value: '',
      observer() {
        this.handleTimeago();
      }
    },
  },

  data: {
    timeago: ''
  },

  methods: {
    onImgTap(e) {
      wx.previewImage({
        current: e.target.dataset.text,
        urls: [e.target.dataset.text]
      })
    },
    
    handleTimeago: function () {
      this.setData({ timeago: util.timeAgo(this.data.created_at)})
    },
  }
})