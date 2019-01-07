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
    previousMargin: 0,
    nextMargin: 0,
    list: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  loadData: function() {
    db.collection('github').orderBy(this.data.order, 'desc').skip(this.data.list.length).get().then(res => {
        this.appendList(res.data)
    })
  },

  onLoad: function () {
    this.loadData()
    
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

  copy: function(e) {
    console.log("copy:", e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success() {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  onReachBottom: function(e) {
    console.log("onReachBotton:", e)
    if (this.data.searchValue) {
      this.search(this.data.searchValue, true)
    }else {
      this.loadData()
    }
  },

  appendList: function(newList) {
      console.log("newList:", newList)
      var curList = this.data.list 
      curList.push(...newList)
      console.log("total count:", curList.length)
      this.setData({ list: curList })
  },

  onSearch: function(e) { 
      this.setData({
        searchValue: e.detail
      })
      console.log("searchValue:", this.data.searchValue)
      this.search(e.detail, false)
  },

  search: function(val, more) {
    console.log("search:", val)
    db.collection('github').where(_.or([
      {
        repo: db.RegExp({
          regexp: val,
          options: 'i',
        })
      },
      {
        desc: db.RegExp({
          regexp: val,
          options: 'i',
        })
      }
    ])).orderBy(this.data.order, 'desc').skip(more ? this.data.list.length : 0).get().then(res => {
      if (more) {
        this.appendList(res.data)
      }else {
        this.setData({list: res.data})
      }
    })
  }
})
