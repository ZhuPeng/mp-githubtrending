const cloudclient = require('../../utils/cloudclient.js')
const app = getApp()

Page({
  data: {
    owner: wx.getStorageSync("github-name") || '',
    list: [],
    repos: [],
    showHistory: false,
  },
  
  bindViewTap: function () {
    if (this.data.showHistory) {
      wx.navigateTo({url: '../settings/settings'})
    }
  },

  loadHistory: function() {
    var self = this
    cloudclient.callFunction({type: 'history'}, function(d) {
      self.setData({list: d})
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
      self.setData({ events: d })
    })
  },

  loadRepos() {
    var self = this;
    if (this.data.repos.length == 0) {
      cloudclient.callFunction({
        type: 'repos',
        owner: self.data.owner,
      }, function (d) {
        self.setData({ repos: d })
      })
    }
  },

  onClick(event) {
    var self = this;
    console.log(event)
    if (event.detail.title == 'Repos') {
      this.loadRepos()
    } else if (event.detail.title == 'History') {
      this.loadHistory()
    }
  },

  onLoad: function (options) {
    this.setData({ owner: options.owner || wx.getStorageSync("github-name") || ''})
    this.loadMeta() 
    this.loadRepos()
    if (options.history) {
      this.setData({showHistory: true})
    }  
  },

  onShow: function() {
    var sname = wx.getStorageSync("github-name")
    if (this.data.showHistory && sname != this.data.owner) {
      this.setData({owner: sname, repos: []})
      this.onLoad({owner: sname})
    }
  }
})