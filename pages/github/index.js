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
    order: wx.getStorageSync('github-order') || '时间',
    lang: wx.getStorageSync('github-lang') || 'All',
    userInfo: {},
    hasUserInfo: false,
    previousMargin: 0,
    nextMargin: 0,
    list: [],
    langList: ['All', 'Go', 'Python', 'Java', 'C', 'JavaScript'],
    orderList: ['时间', 'Star', 'Fork'],
    orderMap: {'时间': '_crawl_time', 'Star': 'star', 'Fork': 'fork'},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  getCollection() {
    var col = db.collection('github')
    if (this.data.lang != 'All') {
      col = col.where({ 'lang': this.data.lang })
    }
    return col
  },

  loadData: function() {
    if (this.data.searchValue) {
      this.search(this.data.searchValue, true)
    } else {
      this.getCollection().orderBy(this.getOrder(), 'desc').skip(this.data.list.length).get().then(res => {
        this.appendList(res.data)
      })
    }
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

  actionSheetTapOrder() {
    this.actionSheepTap("order")
  },

  actionSheetTapLang() {
    this.actionSheepTap("lang")
  },

  actionSheepTap(type) {
    var self = this;
    var key = "github-" + type;
    var list = self.data.orderList;
    var target = self.data.order;
    if (type == 'lang'){
      list = self.data.langList
      target = self.data.lang
    }

    wx.showActionSheet({
      itemList: list,
      success(e) {
        var changeval = list[e.tapIndex]
        console.log("change:", type, changeval);
        if (changeval != target) {
          var data = {list: []}
          data[type] = changeval
          self.setData(data)
          wx.setStorageSync(key, changeval)
          self.loadData()
        }
      }
    })
  },

  onReachBottom: function(e) {
    console.log("onReachBotton:", e)
    this.loadData()
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

  getOrder() {
    return this.data.orderMap[this.data.order]
  },

  search: function(val, more) {
    console.log("search:", val)
    this.getCollection().where(_.or([
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
    ])).orderBy(this.getOrder(), 'desc').skip(more ? this.data.list.length : 0).get().then(res => {
      if (more) {
        this.appendList(res.data)
      }else {
        this.setData({list: res.data})
      }
    })
  }
})
