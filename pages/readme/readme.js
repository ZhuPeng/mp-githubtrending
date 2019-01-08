// pages/readme/readme.js
const util = require('../../utils/util.js')
const dbutil = require('../../utils/db.js')

Page({
  data: {
    readme: "",
    item: {},
  },

  onLoad: function (options) {
    console.log("options:", options)
    var self = this
    dbutil.getDoc("github", options._id, function(doc){
      self.setData({item: doc})
    })
    this.getReadMe(options._id)
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

  getReadMe: function(id) {
    wx.cloud.callFunction({
      name: 'githubreadme',
      data: {
        id: id
      },
      complete: res => {
        var md = util.base64Decode(res.result.content)
        this.setData({
          // base64 encode
          readme: md
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