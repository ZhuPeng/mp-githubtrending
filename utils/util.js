var base64 = require('base64.js').Base64;
var common = require('common.js')
import { $wuxToast } from '../third-party/wux-weapp/index'
const timeago = require('../third-party/wux-weapp/timeago/core/index.js')
import locales from '../third-party/wux-weapp/timeago/locales/index'

module.exports = {
  base64Decode: base64_decode,
  parseGitHub: common.parseGitHub,
  isCodeFile: common.isCodeFile,
  isImageFile: common.isImageFile,
  mdLink: common.mdLink,
  copyOnlyText,
  copyTextWithCallback,
  copyText,
  isGitHubPage: common.isGitHubPage,
  GitHubNavi,
  GetPercent: common.GetPercent,
  timeAgo,
  Alert,
  SetDataWithoutSpin,
  SetDataWithSpin,
  ArrayContains: common.ArrayContains,
  ShowToastText,
  GetLastestPage,
  ShowAd,
  GetYesterday,
  FindGitHubUrl: common.FindGitHubUrl,
  previewImage: previewImage,
}

function previewImage(url) {
  wx.previewImage({
    current: url,
    urls: [url]
  })
}

function ShowAd() {
  // 在页面中定义插屏广告
  let interstitialAd = null

  // 在页面onLoad回调事件中创建插屏广告实例
  if (wx.createInterstitialAd) {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: 'adunit-de549a845f4128bb'
    })
    interstitialAd.onLoad(() => { })
    interstitialAd.onError((err) => { })
    interstitialAd.onClose(() => { })
  }

  // 在适合的场景显示插屏广告
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      console.error(err)
    })
  }
}

function GetLastestPage() {
  var pages = getCurrentPages()
  var page = pages[pages.length - 1]
  var param = ''
  for (var k in page.options) {
    if (param) {
      param += '&'
    }
    var val = page.options[k]
    if (val.startsWith('https://api.github.com/') && val.indexOf('/contents/') > 0) {
      val = val.slice(val.indexOf('/contents/') + '/contents/'.length, val.length)
    }
    param += k + '=' + val
  }
  console.log('lastest visit path:', page.route, ' param:', param)
  return [page.route, param]
}

function ShowToastText(text) {
  $wuxToast().show({
    type: 'text',
    duration: 1500,
    color: '#fff',
    text: text,
    success: () => console.log
  })
}

function Alert(text, duration, callback) {
  if (!duration) {duration = 2000}
  wx.showToast({
    title: text,
    icon: 'none',
    duration: duration,
    success: function () { if(callback) {callback()} }
  })
}

function SetDataWithSpin(cls, d) {
  d['spinning'] = true
  cls.setData(d)
}

function SetDataWithoutSpin(cls, d) {
  d['spinning'] = false
  cls.setData(d)
}

function GitHubNavi(path, naviFunc, withSubscribe) {
  if (!common.isGitHubPage(path)) {
    return
  }
  if (naviFunc == undefined) {
    naviFunc = wx.navigateTo
  }
  var [owner, repo, filepath] = common.parseGitHub(path)
  console.log("parseGitHub url:", owner, repo, filepath)
  if (owner == "") { naviFunc({url: 'pages/github/index'}); return }
  else if (owner == 'settings') {
    naviFunc({ url: '/pages/settings/settings' })
    return
  }
  if (filepath == "" && repo == "") {
    naviFunc({ url: '/pages/account/account?owner=' + owner })
  } else if (filepath == "") {
    naviFunc({ url: '/pages/readme/readme?repo=' + owner + " / " + repo })
  } else if (filepath == 'issues/new') {
    naviFunc({ url: '/pages/newissue/newissue?url=' + path })
  } else if (filepath.startsWith('issues/') || filepath.startsWith('pull/')) {
    var issue = 'https://api.github.com/repos/' + owner + '/' + repo + '/' + filepath.replace('pull/', 'issues/')
    naviFunc({url: '/pages/issue/issue?issue='+issue})
  } else if (filepath.startsWith('pulls?q=')) {
    naviFunc({ url: '/pages/search/search?type=issues&query=' + filepath.slice('pulls?q='.length) + encodeURIComponent(' repo:' + owner+'/'+repo)})
  } else {
    naviFunc({
      url: '/pages/gitfile/gitfile?file=' + filepath + '&owner=' + owner + '&repo=' + repo + (withSubscribe ? '&withsubscribe=true': ''),
    })
  }
}

function strInt(i) {
  if (i>=0 && i<10) {
    return '0' + i
  }
  return i
}

function GetYesterday() {
  var d = new Date()
  var y = d.getFullYear()
  var m = d.getMonth() + 1
  var dd = d.getDate() - 1
  var h = d.getHours()
  if (dd <= 0) {
    dd = 28
    m = m - 1
  }
  if (m <= 0) {
    m = 12
    y = y - 1
  }
  return y + '-' + strInt(m) + '-' + strInt(dd) + 'T' + strInt(h) + ':00:00'
}

function timeAgo(d) {
  var a = timeago.format(timeago.diff(d, new Date()), locales['en'])
  return a;
}

function copyText (e) {
  console.log("copy:", e)
  var text = e.currentTarget.dataset.text
  copyOnlyText(text)
}

function copyOnlyText(text) {
  wx.setClipboardData({
    data: text,
    success() {
      wx.hideToast()
      ShowToastText('复制成功 ' + text)
    }
  })
}

function copyTextWithCallback(text, call) {
  wx.setClipboardData({
    data: text,
    success() {
      wx.hideToast()
      call()
    }
  })
}

function base64_decode(input) { 
  return base64.decode(input);
}