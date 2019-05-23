const cloudclient = require('../../utils/cloudclient.js')
const github = require('../../utils/github.js')
const util = require('../../utils/util.js')

Page({
  data: {
    owner: wx.getStorageSync("github-name") || '',
    list: [],
    repos: [],
    issues: [],
    stars: [],
    showHistory: false,
    spinning: true,
    tabKey: 'Repos',
  },
  
  bindViewTap: function () {
    if (this.data.showHistory) {
      wx.navigateTo({url: '../settings/settings'})
    }
  },

  loadHistory: function() {
    var self = this
    util.SetDataWithSpin(this, {})
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

  loadStars() {
    var self = this
    if (this.data.owner == "") { return }
    util.SetDataWithSpin(self, {})
    cloudclient.callFunction({ type: 'get', path: '/users/' + this.data.owner + '/starred', 'currentSize': this.data.stars.length }, function (d) {
      console.log('stars: ', d)
      var tmp = self.data.stars
      tmp.push(...d)
      util.SetDataWithoutSpin(self, { stars: tmp })
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
    var currentSize = this.data.repos.length
    if (currentSize > 0 && currentSize == self.data.meta.public_repos) {
      return
    }
    util.SetDataWithSpin(this, {})
    cloudclient.callFunction({
      type: 'repos',
      owner: self.data.owner,
      currentSize,
    }, function (d) {
      var tmp = self.data.repos
      tmp.push(...d)
      util.SetDataWithoutSpin(self, { repos: tmp })
    })
  },

  onClick(event) {
    var self = this;
    console.log(event)
    this.setData({tabKey: event.detail.key})
    this.loadData(event.detail.key)
  },

  loadData(key) {
    if (key == 'Repos') {
      this.loadRepos()
    } else if (key == 'History') {
      this.loadHistory()
    } else if (key == 'Stars') {
      this.loadStars()
    }
  },

  onLoad: function (options) {
    var self = this;
    var owner = options.owner || wx.getStorageSync("github-name") || ''
    this.setData({ owner})
    if (options.history) {
      this.setData({ showHistory: true })
    }  
    if (!owner) {util.SetDataWithoutSpin(this, {}); return}
    this.loadMeta() 
    this.loadRepos()
    github.Get('/search/issues?q=' + encodeURIComponent('commenter:' + owner), function(d) {
      self.setData({issues: d})
      github.Get('/search/issues?q=' + encodeURIComponent('author:' + owner + ' -commenter:' + owner), function(d) {
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

  onReachBottom: function () {
    console.log("onReachBottom")
    this.loadData(this.data.tabKey)
  },

  onShareAppMessage: function () {
  }
})