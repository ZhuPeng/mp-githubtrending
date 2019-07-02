var base64 = require('base64.js').Base64;
import { $wuxToast } from '../third-party/wux-weapp/index'
const timeago = require('../third-party/wux-weapp/timeago/core/index.js')
import locales from '../third-party/wux-weapp/timeago/locales/index'

module.exports = {
  base64Decode: base64_decode,
  parseGitHub: parseGitHub,
  isCodeFile,
  mdLink,
  copyOnlyText,
  copyText,
  isGitHubPage,
  GitHubNavi,
  GetPercent,
  timeAgo,
  Alert,
  SetDataWithoutSpin,
  SetDataWithSpin,
  ArrayContains,
  ShowToastText,
  GetLastestPage,
  ShowAd,
  FindGitHubUrl,
}

function FindGitHubUrl(c) {
  var urls = FindUrls(c)
  if (urls.length == 0) {return ''}
  urls.map(function(u){
    if (isGitHubPage(u)) {
      return u
    }
  })
  return urls[0]
}

function FindUrls(c) {
  var linkRegExp = /https?:\/\/[/0-9a-zA-Z.&=#_?-]+/g;
  var urls = []
  var match
  while (match = linkRegExp.exec(c)) {
    urls.push(match[0])
  }
  return urls
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

function ArrayContains(arr, val) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === val) {
      return true;
    }
  }
  return false;
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
  if (!isGitHubPage(path)) {
    return
  }
  if (naviFunc == undefined) {
    naviFunc = wx.navigateTo
  }
  var [owner, repo, filepath] = parseGitHub(path)
  console.log("parseGitHub url:", owner, repo, filepath)
  if (owner == "") { return }
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

function timeAgo(d) {
  var a = timeago.format(timeago.diff(d, new Date()), locales['en'])
  return a;
}

function GetPercent(num, total) {
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
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

const CodeFileExtentsions = {
  "java": "java",
  "kt": "java",
  "scala": "java",
  "py": "python",
  "go": "go",
  "sh": "markup",
  "js": "javascript",
  "jsx": "javascript",
  "php": "php",
  'c': 'c',
  'json': 'json',
  'cpp': 'go',
  'html': 'markup',
  'yml': 'markup',
  'yaml': 'markup',
  'R': 'R',
  'css': 'css',
  'scss': 'css',
  'wxss': 'css',
  'swift': 'swift',
  'xml': 'markup',
  'wxml': 'markup',
  'ipynb': 'python'
}

function isCodeFile(file) {
  for (var key in CodeFileExtentsions) {
    if (file.endsWith('.' + key)) {
      return CodeFileExtentsions[key];
    }
  }
  return false;
}

function mdLink(text, link) {
  return '[' + text + '](' + link + ')'
}

function isGitHubPage(url) {
  return url.startsWith("https://github.com/") || url.startsWith("http://github.com/")
}

function parseGitHub(url) {
  if (!isGitHubPage(url)) {
    return ["", "", ""]
  }
  var arr = url.split('/')
  if (arr.length == 4){
    return [arr[3], "", ""]
  }
  else if (arr.length == 5) {
    var repo = arr[4]
    if (repo.indexOf('#')) {
      repo = arr[4].split('#')[0]
    }
    return [arr[3], repo, ""]
  } else if (arr.length > 5) {
    var file = url.slice(("https://github.com/" + arr[3] + "/" + arr[4] + "/").length)
    return [arr[3], arr[4], file]
  }
  return ["", "", ""]
}

function base64_decode(input) { 
  return base64.decode(input);
}