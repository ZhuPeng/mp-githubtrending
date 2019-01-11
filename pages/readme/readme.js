// pages/readme/readme.js
const util = require('../../utils/util.js')
const dbutil = require('../../utils/db.js')

Page({
  data: {
    readme: "",
    releases: [],
    item: {},
    spinning: true,
  },

  onLoad: function (options) {
    console.log("options:", options)
    var self = this
    dbutil.getDoc("github", options._id, function(doc){
      self.setData({item: doc})
      self.getGitHubData(doc.repo, "readme", function preprocess(content) {
        return util.base64Decode(content)
      })
    })
  },

  onClick(event) {
    if (event.detail.index == 1) {
      this.getGitHubData(this.data.item.repo, "releases")
    }
  },

  copy: function (e) {
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

  getGitHubData: function(repo, type, callback) {
    var arr = repo.split(" / ")
    console.log("arr:", arr)
    wx.cloud.callFunction({
      name: 'github',
      data: {
        owner: arr[0],
        repo: arr[1],
        type: type
      },
      complete: res => {
        var d = res.result.content
        if (callback) {
          d = callback(d)
        }
        this.setData({
          // base64 encode
          [type]: d,
          spinning: false,
        })
      },
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
