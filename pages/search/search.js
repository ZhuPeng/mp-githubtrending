const github = require('../../utils/github.js')
Page({
  data: {
    type: '',
    query: '',
    result: [],
  },

  onLoad: function (options) {
    console.log('search:', options)
    this.setData({type: options.type, query: options.query})
    var self = this
    github.Get('/search/' + options.type + '?q=' + options.query, function(r){
      console.log(r)
      self.setData({result: r})
    })
  },

  onShareAppMessage: function () {
  }
})