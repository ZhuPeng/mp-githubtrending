const util = require('./util.js')
module.exports = {
  RateLimit,
}
const MaxHourRateLimit = 400

function getDate() {
  var d = new Date()
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + '-' + d.getHours()
}

function RateLimit() {
  var rkey = 'RateLimit' + getDate()
  var cnt = wx.getStorageSync(rkey)
  if (!cnt) {cnt = 0}
  if (cnt > MaxHourRateLimit) {
    util.Alert('访问过于频繁', 6000)
    return true
  }
  wx.setStorageSync(rkey, 1+cnt)
  return false
}