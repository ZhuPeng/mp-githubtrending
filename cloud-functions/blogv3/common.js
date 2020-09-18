module.exports = {
  parseGitHub: parseGitHub,
  isCodeFile,
  mdLink,
  isGitHubPage,
  GetPercent,
  ArrayContains,
  FindGitHubUrl,
}

function FindGitHubUrl(c) {
  var urls = FindUrls(c)
  if (urls.length == 0) {return ''}
  for (var j = 0; j < urls.length; j++) {
    if (isGitHubPage(urls[j])) {
      return urls[j]
    }
  }
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

function ArrayContains(arr, val) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === val) {
      return true;
    }
  }
  return false;
}

function GetPercent(num, total) {
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
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
