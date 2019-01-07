//index.js
//获取应用实例
const app = getApp()
wx.cloud.init({
  env: 'test-3c9b5e'
})
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    searchValue: "",
    order: '_crawl_time',
    userInfo: {},
    hasUserInfo: false,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 3000,
    duration: 1000,
    previousMargin: 0,
    nextMargin: 0,
    list: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    db.collection('github').orderBy(this.data.order, 'desc').get().then(res => {
      console.log("data: ", res.data)
      this.setData({list: res.data})
    })
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onSearch: function(e) {
    console.log("search: ", e.detail)
    db.collection('github').where(_.or([
      {
        repo: db.RegExp({
          regexp: e.detail,
          options: 'i',
        })
      },
      {
        desc: db.RegExp({
          regexp: e.detail,
          options: 'i',
        })
      }
    ])).orderBy(this.data.order, 'desc').get().then(res => {
      console.log(res.data)
      this.setData({ 
        list: res.data,
        searchValue: e.detail
      })
    })
  }
})
