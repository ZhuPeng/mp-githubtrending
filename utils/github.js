const cloudclient = require('./cloudclient.js')
module.exports = {
  Get,
  GetRealFile,
  GetAPIURL,
  convert2code,
  convertIpynb,
  GetContentURL,
}

function convert2code(code, content) {
  return "```" + code + "\n" + content + "\n```";
}

function convertIpynb(content) {
  var json = JSON.parse(content)
  if (!json.cells) {return content}
  var md = '';
  json.cells.map(function(cell) {
    // console.log(cell)
    var c = ""
    cell.source.map(function(s) {
      c += s
    })
    if (cell.cell_type == 'code') { 
      c = convert2code('python', c)
    }
    md += c + '\n'
  })
  return md;
}

function GetContentURL(owner, repo, file) {
  var c = cloudclient.GetConfig()
  var cdn = 'https://raw.githubusercontent.com/'
  if (c && c['github_raw_cdn']) {cdn = c['github_raw_cdn']}
  return cdn + owner + '/' + repo + '/master/' + encodeURIComponent(file)
}


function GetAPIURL(owner, repo, file) {
  return 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + encodeURIComponent(file)
}

function GetRealFile(file) {
  var ref = 'master'
  if (!file) { util.Alert('file parameter was empty')}
  if (file.indexOf('#') > 0) {file = file.slice(0, file.indexOf('#'))}
  if (file.startsWith('./')) {file = file.slice(2)}
  if (file.startsWith('blob/') || file.startsWith('tree/') || file.startsWith('raw/')) {
    var arr = file.split('/')
    if (arr.length > 2) {
      ref = arr[1]
      file = file.slice((arr[0] + '/' + arr[1] + '/').length)
    }
  }
  return file
}

function Get(url, callback, page_number, prev_data) {
  if (!page_number) {page_number = 1}
  if (!prev_data) {prev_data = []}
  var page = (page_number ? page_number : 1),
      data = (prev_data ? prev_data : []);
  url += '&page=' + page_number + '&per_page=50';
  console.log('url: ', url)
  cloudclient.callFunction({ type: 'get', path: url }, function (c) {
    if (c.items) {
      data = data.concat(c.items)
    } else {
      data = data.concat(c)
    }
    if (c.length == 50) {
      Get(url, callback, page + 1, data);
    } else {
      callback(data)
    }
  })
}