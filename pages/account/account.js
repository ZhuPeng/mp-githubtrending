const app = getApp()

Page({
  data: {
    list: [{
      "_id": 1,
      "_crawl_time": '2018-02-04 16:40:04.193149',
      "desc": 'Video editing with Python',
      "fork": '569',
      "lang": 'Python',
      "repo": 'Zulko / moviepy',
      "star": '3,868',
      "today": '576 stars today',
      "url": 'https://github.com/Zulko/moviepy',
    }],
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
    wx.cloud.callFunction({
      name: 'github',
      data: {type: 'history'},
      complete: res => {
        var d = res.result.content
        this.setData({
          list: d,
        })
      }
    })
  },

  onLoad: function () {
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