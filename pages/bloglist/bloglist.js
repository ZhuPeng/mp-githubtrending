const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    currentTab: 'hot',
    blogs: {data: []},
    jobname: '',
    spinning: true,
    options: {},
    content: '',
    auth: false,
  },

  onLoad: function (options) {
    var self = this
    wx.getSetting({
      success(res) {
        self.setData({ auth: res.authSetting['scope.userInfo']})
      }
    })
    // wx.setNavigationBarTitle({ title: 'Blog & News' })
    var jobname = options.jobname || 'github'
    util.SetDataWithSpin(this, {jobname: jobname, options})
    cloudclient.callFunctionWithBlog({ jobname: jobname, currentSize: this.data.blogs.data.length, 'options': options, order: this.data.currentTab }, function (c) {
      util.SetDataWithoutSpin(self, { blogs: c })
    })
  },

  onTabChange: function (e) {
    console.log('onChange', e)
    this.setData({currentTab: e.detail.key, blogs: {data: []}})
    this.onLoad(this.data.options)
  },

  onContentChange: function (e) {
    this.setData({ content: e.detail.value })
  },

  onGotUserInfo: function (e) {
    console.log('onGotUserInfo:', e)
    if (e.detail.errMsg.indexOf('ok') >= 0) {
      this.setData({ auth: true })
    }
  },

  onButtonClick: function () {
    var self = this;
    if (this.data.content == '') {
      util.Alert('Content was empty!', 4000)
      return
    }
    console.log('input: ', this.data.content, this.data.options)
    var data = {
      type: 'card',
      id: '',
      content: this.data.content,
      url: 'https://github.com/'+this.data.options.owner+'/'+this.data.options.repo,
      '_crawl_time': new Date(),
      'title': '',
      'source': 'wechat',
      commentCount: 0,
      likedCount: 0,
    }
    wx.getSetting({
      success(res) {
        console.log('authSetting:', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('userinfo: ', res.userInfo)
              var userInfo = res.userInfo
              data['userAvatar'] = userInfo.avatarUrl
              data['username'] = userInfo.nickName
              cloudclient.callFunctionWithBlog({
                type: 'addTopic', data: data
              }, function (c) {
                console.log(c)
                if('errorMsg' in c) {
                  util.Alert(c['errorMsg'], 3000)
                  return
                }
                util.Alert('Create Success!', 3000)
                wx.navigateTo({
                  url: '/pages/bloglist/bloglist?jobname=topic&owner='+self.data.options.owner + '&repo=' +self.data.options.repo,
                })
              })
            }
          })
        }
      }
    })
  },

  onPullDownRefresh: function () {
      console.log("onPulldowRefresh")
      util.SetDataWithSpin(this, {blogs: {data: []}})
      setTimeout(() => {
          this.onLoad(this.data.options)
          wx.stopPullDownRefresh()
      }, 5000)
  },

  onReachBottom: function () {
    console.log("onReachBottom")
    this.onLoad(this.data.options)
  },

  onShareAppMessage: function() {}
})
