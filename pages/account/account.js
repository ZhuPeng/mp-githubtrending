const cloudclient = require('../../utils/cloudclient.js')
const app = getApp()

Page({
  data: {
    meta: {},
    list: [],
    repos: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  loadHistory: function() {
    var self = this
    cloudclient.callFunction({type: 'history'}, function(d) {
      self.setData({list: d})
    })
  },

  loadMeta: function() {
    var self = this
    cloudclient.callFunction({ type: 'get', path: '/users/ZhuPeng'}, function(d){
      self.setData({meta: d})
    })
  },

  onClick(event) {
    var self = this;
    if (event.detail.index == 1 && this.data.repos.length == 0) {
      cloudclient.callFunction({
        type: 'repos',
        owner: self.data.meta.name,
      }, function (d) {
        self.setData({repos: d})
      })
    }
  },

  onLoad: function () {
    this.loadMeta()
    this.loadHistory()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})