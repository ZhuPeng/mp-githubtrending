// pages/gitfile/gitfile.js
const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: '',
    repo: '',
    owner: '',
    content: '',
    spinning: false,
    openid: '',
    dange: {
      typeId: '1',
      appId: 'wx6204a7df95c7fb21',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('app: ', app)
    wx.setNavigationBarTitle({title: options.file})
    this.setData({file: options.file, spinning: true, owner: options.owner, repo: options.repo})
    var self = this;
    cloudclient.callFunctionWithRawResponse({repo: options.repo, owner: options.owner, path: options.file, type: 'file'}, function(d) {
      self.setData({ content: util.base64Decode(d.content), spinning: false, openid: d.openid})
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