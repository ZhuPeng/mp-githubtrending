const util = require('./util.js')
module.exports = {
  RateLimit,
  GetVisitCount,
}
const MaxHourRateLimit = 400

function getDate() {
  var d = new Date()
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + '-' + d.getHours()
}

function GetKey() {
  return 'RateLimit' + getDate()
}

function GetVisitCount() {
  var cnt = wx.getStorageSync(GetKey())
  if (!cnt) {cnt = 0}
  return cnt
}

function SetVisitCount(cnt) {
  wx.setStorageSync(GetKey(), 1+cnt)
}

function RateLimit() {
  var cnt = GetVisitCount()
  if (cnt > MaxHourRateLimit) {
    util.Alert('访问过于频繁', 6000)
    return true
  }
  SetVisitCount(1+cnt)
  return false
}