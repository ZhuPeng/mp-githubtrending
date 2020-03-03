const rate = require('./ratelimit.js')
const util = require('./util.js')
module.exports = {
  callFunction,
  callFunctionWithBlog,
  callFunctionWithQrCode,
  uploadFormID,
  callFunctionWithSubscribe,
  callFunctionWithName,
  isMsgNotSec,
  callFunctionWithRawResponse
}
const version = 'githubv1'

function callFunction(data, completeFunc) {
  callFunctionWithName(version, data, function(r) {
    var c = ''
    if (r && r.content) { c = r.content}
    completeFunc(c)
  })
}

function callFunctionWithRawResponse(data, completeFunc) {
  callFunctionWithName(version, data, completeFunc)
}

function callFunctionWithName(apiname, data, completeFunc, retry) {
  if (retry == undefined) {retry = 3}
  if (retry <= 0 || rate.RateLimit()) {
    return
  }
  var token = wx.getStorageSync('github-token')
  if (token) {
    data['token'] = token
  } else if (data.ignoreWithoutAuth) {
    return
  } else if (data.type == 'post' || data.forceAuth) {
    util.Alert('未设置 Token', 6000, function () {
      wx.navigateTo({ url: '/pages/settings/settings' })
    })
    return
  }
  wx.cloud.callFunction({
    name: apiname,
    data: data,
    complete: res => {
      if ("errMsg" in res && res['errMsg'].indexOf('ECONNREFUSED') > 0) {
        callFunctionWithName(apiname, data, completeFunc, retry-1)
        return
      }
      completeFunc(res.result)
    },
  })
}

function callFunctionWithBlog(data, completeFunc) {
  callFunctionWithName('blogv1', data, completeFunc)
}

function callFunctionWithQrCode(data, completeFunc) {
  callFunctionWithName('qrcode', data, completeFunc)
}

function callFunctionWithSubscribe(data, completeFunc) {
  callFunctionWithName('subscribe', data, completeFunc)
}

function uploadFormID(id, source) {
  if (id.indexOf('mock') >= 0) {return}
  callFunctionWithName('collectformid', {formId: id, source}, function(r) {console.log(r)})
}

function isMsgNotSec(data, callback) {
    callFunctionWithName('seccheck', data, function(r) {
        console.log('seccheck: ', r)
        if(r.errCode == '87014') {callback(true)}
        else {callback(false)}
    })
}
