const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    commit: {},
    spinning: true,
  },

  onLoad: function (options) {
    var url = decodeURIComponent(options.url)
    console.log("commit url: ", url)
    var self = this
    cloudclient.callFunction({ type: 'get', path: url }, function (c) {
      if (c && c.files) {
        c.files.map(function (f) {
          f.extension = util.isCodeFile(f.filename)
        })
      }
      util.SetDataWithoutSpin(self, { commit: c })
    })
  },

  onShareAppMessage: function () {

  }
})
