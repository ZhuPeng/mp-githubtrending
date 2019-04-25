const github = require('../../utils/github.js')
const util = require('../../utils/util.js')
Page({
  data: {
    type: '',
    query: '',
    result: [],
    spinning: true,
  },

  onLoad: function (options) {
    console.log('search:', options)
    this.setData({type: options.type, query: options.query})
    var self = this
    github.Get('/search/' + options.type + '?q=' + options.query, function(r){
      console.log(r)
      util.SetDataWithoutSpin(self, {result: r})
    })
  },

  onShareAppMessage: function () {
  }
})