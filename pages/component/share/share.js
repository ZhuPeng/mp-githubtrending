const util = require('../../../utils/util.js')
const qrcode = require('../../../utils/qrcode.js')
Component({
  properties: {
    share_link: {
      type: String,
      value: ''
    },
    insert_minip: {
      type: Boolean,
      value: true
    }
  },

  data: {
    size: 28,
  },

  methods: {
    copy: function (e) {
      util.copyText(e)
    },
    qrcode: function(e) {
      qrcode.HandleQrCode()
    },
    chat: function(e) {
    },
    minip: function(e) {
      util.GitHubNavi("https://github.com/ZhuPeng/mp-transform-public")
    },
    thumbsup: function(e) {
      qrcode.PreviewZanshang()
    },
  }
})
