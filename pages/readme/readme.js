// pages/readme/readme.js
const util = require('../../utils/util.js')
const dbutil = require('../../utils/db.js')
const cloudclient = require('../../utils/cloudclient.js')
import Toast from '../../third-party/vant-weapp/toast/toast';

Page({
  data: {
    readme: "",
    releases: [],
    commits: [],
    issues: [],
    meta: {},
    spinning: true,
  },

  onLoad: function (options) {
    wx.onPageNotFound(function callback(e) {
      console.log("onPageNotFound:", e)
    })

    console.log("options:", options)
    var repo = decodeURIComponent(options.repo)
    var self = this
    // TODO: get from git real time
    dbutil.getDocWithCondition("github", {repo}, function(doc){
      self.setData({meta: doc})
    })
    self.getGitHubData(repo, "readme", function preprocess(content) {
      return util.base64Decode(content)
    })
  },

  onMDClick(e) {
    var clickurl = e.detail.currentTarget.dataset.text
    console.log("onMDClick url:", clickurl)
    this.copyText(clickurl)
  },

  onClick(event) {
    if (event.detail.index == 1 && this.data.releases.length == 0) {
      this.setData({ spinning: true })
      this.getGitHubData(this.data.meta.repo, "releases")
    } else if (event.detail.index==2 && this.data.commits.length == 0) {
      this.setData({ spinning: true })
      this.getGitHubData(this.data.meta.repo, "commits")
    } else if (event.detail.index==3 && this.data.issues.length==0) {
      this.setData({ spinning: true })
      this.getGitHubData(this.data.meta.repo, "issues")
    }
  },

  copy: function (e) {
    console.log("copy:", e)
    this.copyText(e.currentTarget.dataset.text)
  },

  copyText(text) {
    wx.setClipboardData({
      data: text,
      success() {
        wx.hideToast()
        Toast('复制成功 ' + text)
      }
    })
  },

  getGitHubData: function(repo, type, callback) {
    var arr = repo.split("/")
    console.log("arr:", arr)
    var self = this
    cloudclient.callFunction({
        owner: arr[0].trim(),
        repo: arr[1].trim(),
        type: type
      }, function (d) {
        if (callback) {
          d = callback(d)
        }
        self.setData({
          // base64 encode
          [type]: d,
          spinning: false,
        })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
