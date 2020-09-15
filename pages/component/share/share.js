const util = require('../../../utils/util.js')
const qrcode = require('../../../utils/qrcode.js')
Component({
  properties: {
    share_link: {
      type: String,
      value: ''
    },
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
  }
})
