const util = require('../../utils/util.js')
const cloudclient = require('../../utils/cloudclient.js')
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
    this.query('蜕变')
  },

  query: function(q) {
    var self = this
    util.SetDataWithSpin(self, {})
    cloudclient.callFunctionWithBlog({type: 'search', query: q, currentSize: this.data.blogs.data.length, order: 'hot' }, function (c) {
      var tmp = self.data.blogs['data']
      c['data'].map(function(d) {
        tmp.push(d)
      })
      util.SetDataWithoutSpin(self, { blogs: {'data': tmp}})
    })
  },

  onShareAppMessage: function () {
  }
})