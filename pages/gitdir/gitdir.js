const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    apiurl: '',
    owner: '',
    repo: '',
    list: [],
    spinning: true,
  },

  onLoad: function (options) {
    console.log(options)
    var apiurl = decodeURIComponent(options.apiurl)
    this.setData({apiurl: apiurl, owner: options.owner, repo: options.repo})
    var self = this
    cloudclient.callFunction({ type: 'get', path: apiurl, repo: options.repo, owner: options.owner }, function (c) {
      util.SetDataWithoutSpin(self, { list: c })
    })
  },

  onShareAppMessage: function () {

  }
})
