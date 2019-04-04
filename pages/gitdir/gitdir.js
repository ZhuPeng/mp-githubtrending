const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    apiurl: '',
    owner: '',
    repo: '',
    list: [],
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({apiurl: options.apiurl, owner: options.owner, repo: options.repo})
    var self = this
    cloudclient.callFunction({ type: 'get', path: options.apiurl, repo: options.repo, owner: options.owner }, function (c) {
      self.setData({ list: c })
    })
  },

  onShareAppMessage: function () {

  }
})