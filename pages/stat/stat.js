const dbutil = require('../../utils/db.js')
var db = dbutil.getDB()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: ["ooqTr4hMz05xwBHOU8VgokLyyoU0"],
    log: '',
    total: '',
    devtotal: ''
  },

  stat: function () {
    var self = this;
    db.collection("history").count().then(res => {
      self.setData({total: "## 访问量统计\n* Total: " + res.total + '\n'})
    });

    this.data.users.map(u => {
      var d = {openid: u}
      var md = ''
      db.collection("history").where({openid: u}).count().then(res => {
        md += '* 开发 ' + u.substring(6, 20) + "：" + res.total + '\n'
        self.setData({ devtotal: md })
      }); 
    })

    db.collection('history').where({
      openid: _.neq(this.data.users[0])
    }).orderBy('requesttime', 'desc').get().then(res => {
      var log = ''
      log += '## 访问记录\nrequesttime | behavior | repo | user \n-- | -- | -- | -- \n'
      res.data.map(d => {
        log += d.requesttime.substring(0, 19) + ' | ' + d.type + ' | ' + d.owner+'/'+d.repo + ' | ' + d.openid.substring(6, 12) + '\n';
      })
      self.setData({log: log})
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