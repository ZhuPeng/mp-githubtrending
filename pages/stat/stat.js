const dbutil = require('../../utils/db.js')
var db = dbutil.getDB()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    users: ["ooqTr4hMz05xwBHOU8VgokLyyoU0"],
    count: [],
  },

  stat: function () {
    db.collection("history").count().then(res => {
      this.setData({total: res.total})
    });
    var count = [];
    this.data.users.map(u => {
      var d = {openid: u}
      db.collection("history").where({openid: u}).count().then(res => {
        d['total'] = res.total;
        count.push(d)
        this.setData({ count: count })
      });    
    })

    db.collection('history').where({
      openid: _.neq(this.data.users[0])
    }).orderBy('requesttime', 'desc').get().then(res => {
      res.data.map(d => {
        console.log(d.type, d.openid, d.requesttime)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.stat()
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