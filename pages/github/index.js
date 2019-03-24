const dbutil = require('../../utils/db.js')
const cloudclient = require('../../utils/cloudclient.js')
const app = getApp()
const db = dbutil.getDB()
const _ = db.command

Page({
  data: {
    interval: 5000,
    duration: 1000,
    searchValue: "",
    sheetShow: false,
    order: wx.getStorageSync('github-order') || '时间',
    previousMargin: 0,
    nextMargin: 0,
    list: [],
    tagColor: ['magenta', 'volcano', 'green'],
    langList: ['Go', 'Python', 'Java', 'C', 'JavaScript', 'R','Shell', 'PHP', 'CSS',
    'Ruby', 'Lua', 'Vue', 'Objective-C', 'C++', 'Kotlin', 'Rust', 'TypeScript', 'C#',
    'Swift', 'HTML', 'Jupyter Notebook', 'Dart', 'Makefile', 'TeX', 'DIGITAL Command Language',
    'Common Lisp', 'Cuda', 'Assembly', 'CoffeeScript', 'Julia', 'Verilog', 'Emacs Lisp'],
    selectLangList: wx.getStorageSync('github-lang-filter') || [],
    orderList: ['时间', 'Star', 'Fork'],
    orderMap: {'时间': '_crawl_time', 'Star': 'star', 'Fork': 'fork'},
    spinning: true
  },

  getLastestBlog: function () {
    var self = this

    cloudclient.callFunctionWithBlog({type: 'lastest'}, function (c) {
      self.setData({ blogList: c })
    })
  },

  onSheetClose() {
    console.log("onSheetClose")
    this.setData({list: [], sheetShow: false})
    this.loadData()
  },

  onChange(event) {
    console.log("onChange:", event.detail)
    this.updateLangFilter(event.detail)
  },

  updateLangFilter: function(list) {
    this.setData({ selectLangList: list})
    wx.setStorageSync("github-lang-filter", list)
  },

  toggle(event) {
    const { name } = event.currentTarget.dataset;
    console.log("toggle:", name)
    const checkbox = this.selectComponent(`.checkboxes-${name}`);
    checkbox.toggle();
  },

  noop() {},
  selectAll() {
    this.updateLangFilter([])
  },

  getCollection() {
    var col = db.collection('github')
    var filter = []
    this.data.selectLangList.map(function(lang) {
      filter.push({ 'lang': lang.trim()})
    })
    if (filter.length > 0) {
      col = col.where(_.or(filter))
    }  
    return col
  },

  loadData: function(more) {
    if (!more) {
      this.setData({list: []})
    }
    if (this.data.searchValue) {
      this.search(this.data.searchValue)
    } else {
      this.getCollection().orderBy(this.getOrder(), 'desc').skip(this.data.list.length).get().then(res => {
        this.appendList(res.data)
      })
    }
    this.setData({spinning: false})
  },

  onPullDownRefresh: function () {
    console.log("onPulldowRefresh")
    this.setData({list: [], spinning: true})
    setTimeout(() => {
      this.loadData(true)
      wx.stopPullDownRefresh()
    }, 3000)
  },

  onLoad: function () {
    this.getLastestBlog()
    this.loadData(false)
  },

  actionSheetTapOrder() {
    this.actionSheepTap("order")
  },

  actionSheetTapLang() {
    this.setData({sheetShow: true})
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
    this.loadData(true)
  },

  appendList: function(newList) {
      console.log("newList:", newList)
      var curList = this.data.list
      curList.push(...newList)
      console.log("total count:", curList.length)
      this.setData({ list: curList })
  },

  searchGithub(value) {
    var url = '/search/repositories?per_page=10&page=' + (this.data.list.length/10+1) + '&q=' + value
    var self = this
    cloudclient.callFunction({ type: 'get', path: url }, function (c) {
      if (self.data.list.length < c.total_count) {
        self.appendList(c.items)
      }
    })
  },

  onSearch: function(e) {
      this.setData({
        searchValue: e.detail,
        spinning: true,
        list: []
      })
      console.log("searchValue:", this.data.searchValue)
      this.search(e.detail, false)
  },

  getOrder() {
    return this.data.orderMap[this.data.order]
  },

  search: function(val) {
    console.log("search:", val)
    if (val) {
      val = val.trim()
    }
    this.searchGithub(val)
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
    ])).orderBy(this.getOrder(), 'desc').skip(this.data.list.length).get().then(res => {
      this.appendList(res.data)
    })
    this.setData({ spinning: false })
  },

  onShareAppMessage: function () {
  }
})
