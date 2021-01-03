const util = require('../../utils/util.js')
const cloudclient = require('../../utils/cloudclient.js')
const qrcode = require('../../utils/qrcode.js')
Page({
  data: {
    type: '',
    query: '',
    result: [],
    spinning: false,
    blogs: {'data': []},
  },

  onLoad: function (options) {
    console.log('search:', options)
    this.setData({type: options.type, query: options.query})
  },

  onChange: function(e) {
  },

  onConfirm: function(e) {
    console.log('onConfirm', e)
    if (!e.detail.value) {return}
    this.setData({query: e.detail.value, blogs: {'data': []}})
    this.query(e.detail.value)
  },

  query: function(q) {
    var self = this
    util.SetDataWithSpin(self, {})
    qrcode.DialogShare()
    cloudclient.callFunctionWithBlog({type: 'search', query: q, currentSize: this.data.blogs.data.length, order: 'hot' }, function (c) {
      var tmp = self.data.blogs['data']
      c['data'].map(function(d) {
        tmp.push(d)
      })
      util.SetDataWithoutSpin(self, { blogs: {'data': tmp}})
    })
  },

  onReachBottom: function () {
    console.log("onReachBottom")
    this.query(this.data.query)
  },

  onShareAppMessage: function () {
  }
})