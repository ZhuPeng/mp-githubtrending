var base64 = require('base64.js').Base64;
import Toast from '../third-party/vant-weapp/toast/toast';

module.exports = {
  formatTime: formatTime,
  base64Decode: base64_decode,
  parseGitHub: parseGitHub,
  isCodeFile,
  mdLink,
  copyOnlyText,
  copyText,
  isGitHubPage,
  GetPercent
}

function GetPercent(num, total) {
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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
      Toast('复制成功 ' + text)
    }
  })
}

const CodeFileExtentsions = {
  "java": "java",
  "py": "python",
  "go": "go",
  "sh": "shell",
  "js": "javascript",
  "php": "php",
  'c': 'c',
  'json': 'json',
  'cpp': 'C++',
  'html': 'html',
  'yml': 'yaml',
  'yaml': 'yaml',
  'R': 'R',
  'swift': 'swift',
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
  return url.startsWith("https://github.com") || url.startsWith("http://github.com")
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
    return [arr[3], arr[4], ""]
  } else if (arr.length > 5) {
    return [arr[3], arr[4], url.slice(("https://github.com/"+arr[3]+"/"+arr[4]+"/").length)]
  }
  return ["", "", ""]
}

function base64_decode(input) { 
  return base64.decode(input);
}