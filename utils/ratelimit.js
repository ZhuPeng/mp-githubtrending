module.exports = {
  RateLimit,
}
const MaxHourRateLimit = 200

function getDate() {
  var d = new Date()
  return d.getFullYear() + d.getMonth() + d.getDate() + d.getHours()
}

function RateLimit() {
  var rkey = 'RateLimit' + getDate()
  var cnt = wx.getStorageSync(rkey)
  if (!cnt) {cnt = 0}
  if (cnt > MaxHourRateLimit) {
    wx.showToast({
      title: '访问过于频繁',
      icon: 'error',
      duration: 6000,
      success: function () {
      }
    })
    return true
  }
  wx.setStorageSync(rkey, 1+cnt)
  return false
}