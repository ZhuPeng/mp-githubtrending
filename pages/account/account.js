const cloudclient = require('../../utils/cloudclient.js')
const github = require('../../utils/github.js')
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    owner: wx.getStorageSync("github-name") || '',
    list: [],
    repos: [],
    issues: [],
    showHistory: false,
    spinning: true,
  },
  
  bindViewTap: function () {
    if (this.data.showHistory) {
      wx.navigateTo({url: '../settings/settings'})
    }
  },

  loadHistory: function() {
    var self = this
    cloudclient.callFunction({type: 'history'}, function(d) {
      util.SetDataWithoutSpin(self, {list: d})
    })
  },

  loadMeta: function() {
    var self = this
    if (this.data.owner == "") {return}
    cloudclient.callFunction({ type: 'get', path: '/users/' + this.data.owner}, function(d){
      self.setData({meta: d})
    })
  },

  loadEvents() {
    var self = this
    if (this.data.owner == "") { return }
    cloudclient.callFunction({ type: 'get', path: '/users/' + this.data.owner + '/events' }, function (d) {
      console.log('events: ', d)
      util.SetDataWithoutSpin(self, { events: d })
    })
  },

  loadRepos() {
    var self = this;
    cloudclient.callFunction({
      type: 'repos',
      owner: self.data.owner,
    }, function (d) {
      util.SetDataWithoutSpin(self, { repos: d })
    })
  },

  onClick(event) {
    var self = this;
    console.log(event)
    if (event.detail.title == 'Repos') {
      util.SetDataWithSpin(this, {})
      this.loadRepos()
    } else if (event.detail.title == 'History') {
      util.SetDataWithSpin(this, {})
      this.loadHistory()
    }
  },

  onLoad: function (options) {
    var self = this;
    this.setData({ owner: options.owner || wx.getStorageSync("github-name") || ''})
    this.loadMeta() 
    this.loadRepos()
    if (options.history) {
      this.setData({showHistory: true})
    }  

    github.Get('/search/issues?q=' + encodeURIComponent('commenter:' + self.data.owner), function(d) {
      self.setData({issues: d})
      github.Get('/search/issues?q=' + encodeURIComponent('author:' + self.data.owner + ' -commenter:' + self.data.owner), function(d) {
        self.setData({ issues: d })
      }, 1, d)
    })
  },

  onShow: function() {
    var sname = wx.getStorageSync("github-name")
    if (this.data.showHistory && sname != this.data.owner) {
      this.setData({owner: sname, repos: []})
      this.onLoad({owner: sname})
    }
  },

  onShareAppMessage: function () {
  }
})