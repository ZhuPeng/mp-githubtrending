const dbutil = require('../../utils/db.js')
const util = require('../../utils/util.js')
const cloudclient = require('../../utils/cloudclient.js')
const app = getApp()
const db = dbutil.getDB()
const _ = db.command

Page({
  data: {
    pageStyle: '',
    items: [],
    searchShow: false,
    interval: 5000,
    duration: 1000,
    searchValue: "",
    order: wx.getStorageSync('github-order') || '时间',
    previousMargin: 0,
    nextMargin: 0,
    list: [],
    tagColor: ['magenta', 'volcano', 'green'],
    langList: ['Go', 'Python', 'Java', 'C', 'JavaScript', 'R','Shell', 'PHP', 'CSS',
    'Ruby', 'Lua', 'Vue', 'Scala', 'Objective-C', 'C++', 'Kotlin', 'Rust', 'TypeScript', 'C#',
    'Swift', 'HTML', 'Jupyter Notebook', 'Dart', 'Makefile', 'TeX', 'DIGITAL Command Language',
    'Common Lisp', 'Cuda', 'Assembly', 'CoffeeScript', 'Julia', 'Verilog', 'Emacs Lisp'],
    selectLangList: wx.getStorageSync('github-lang-filter') || [],
    orderList: ['时间', 'Star', 'Fork'],
    orderMap: {'时间': '_crawl_time', 'Star': 'star', 'Fork': 'fork'},
    spinning: true
  },

  onFilterChange(e) {
    const { checkedItems, items } = e.detail
    console.log('onFilterChange:', checkedItems, items)
    checkedItems.forEach((n) => {
      if (!n.checked) {return}
      if (n.value == 'Search') {
        this.changeSearchStyle()
      } else if (n.value == 'news') {
        wx.navigateTo({url: '/pages/bloglist/bloglist?jobname=catalog'})
      } else if (n.value === 'Languages' && n.children[0].selected != undefined) {
        this.updateLangFilter(n.children[0].selected.split(','))
        util.SetDataWithSpin(this, { list: [] })
        this.loadData()
      }
    })
    items.forEach((i) => { i.checked = false })
    this.setData({ items })
  },

  changeSearchStyle() {
    if (this.data.searchShow == true) {
      this.clearSearch()
    }
    this.setData({ searchShow: !this.data.searchShow })  
    
  },  

  onOpen(e) {
    this.setData({
      pageStyle: 'height: 100%; overflow: hidden',
    })
  },

  onConfirm: function (e) {
    this.setData({searchValue: e.detail.value})
    this.loadData(false)
  },

  clearSearch() {
    this.setData({ searchValue: '' })
    this.loadData(false)
  },  

  onClear(e) {
    console.log('onClear', e)
    this.setData({ searchValue: '' })
  },

  onCancel(e) {
    console.log('OnCancel:', e)
    this.changeSearchStyle()
    this.clearSearch()
  },

  getOrder() {
    return this.data.orderMap[this.data.order]
  },

  onClose(e) {
    this.setData({pageStyle: ''})
  },

  getLastestBlog: function () {
    var self = this

    cloudclient.callFunctionWithBlog({type: 'lastest'}, function (c) {
      self.setData({ blogList: c })
    })
  },

  onChange(event) {
    console.log("onChange:", event.detail)
    this.updateLangFilter(event.detail)
  },

  updateLangFilter: function(list) {
    this.setData({ selectLangList: list})
    wx.setStorageSync("github-lang-filter", list)
  },

  getCollection() {
    var col = db.collection('github')
    var filter = []
    this.data.selectLangList.map(function(lang) {
      if (lang.trim() == "") {return}
      filter.push({ 'lang': lang.trim()})
    })
    if (filter.length > 0) {
      col = col.where(_.or(filter))
    }  
    return col
  },

  loadData: function(more) {
    if (!more) {
      util.SetDataWithSpin(this, {list: []})
    }
    if (this.data.searchValue) {
      this.search(this.data.searchValue)
    } else {
      this.getCollection().orderBy(this.getOrder(), 'desc').skip(this.data.list.length).get().then(res => {
        this.appendList(res.data)
      })
    }
  },

  onPullDownRefresh: function () {
    console.log("onPulldowRefresh")
    util.SetDataWithSpin(this, {list: []})
    setTimeout(() => {
      this.loadData(true)
      wx.stopPullDownRefresh()
    }, 3000)
  },

  onShow: function() {
    var labels = []
    var self = this
    this.data.langList.map(function (l) {
      var checked = util.ArrayContains(self.data.selectLangList, l)
      labels.push({ label: l, value: l, 'checked': checked })
    })
    var items = [{
      type: 'filter',
      label: 'Languages',
      value: 'Languages',
      children: [{
        type: 'checkbox',
        label: 'Favorite Languages',
        value: 'query',
        children: labels,
      }],
    }, {
      type: 'text',
      label: 'Search',
      value: 'Search',
    }, {
      type: 'text',
      label: 'Blog & News',
      value: 'news',
    }]
    this.setData({items: items})
  },

  onLoad: function () {
    this.getLastestBlog()
    this.loadData(false)
  },

  onReachBottom: function(e) {
    console.log("onReachBotton:", e)
    util.SetDataWithSpin(this, {})
    this.loadData(true)
  },

  appendList: function(newList) {
      console.log("newList:", newList)
      var curList = this.data.list
      curList.push(...newList)
      console.log("total count:", curList.length)
      util.SetDataWithoutSpin(this, { list: curList })
  },

  searchGithub(value) {
    util.SetDataWithSpin(this, { searchValue: value })
    var url = '/search/repositories?per_page=10&page=' + (this.data.list.length/10+1) + '&q=' + value
    var self = this
    cloudclient.callFunction({ type: 'get', path: url }, function (c) {
      if (self.data.list.length < c.total_count) {
        self.appendList(c.items)
      }
    })
  },

  search: function(val) {
    console.log("search:", val)
    if (!val || val == null) {util.Alert("Nothing Found"); return}
    this.searchGithub(val.trim())
  },

  onShareAppMessage: function () {
  }
})
