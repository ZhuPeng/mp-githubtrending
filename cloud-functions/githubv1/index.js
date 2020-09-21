// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const Octokit = require('@octokit/rest')
const gcache = require('cache.js')
const dbcache = require('dbcache.js')
var octokit;
const db = cloud.database()
const _ = db.command
const NodeCache = require( "node-cache" );
const CACHE = new NodeCache({ stdTTL: 121600, checkperiod: 1800 });

async function getToken() {
  var key = 'github-token'
  var cache = CACHE.get(key);
  if (cache != undefined) {
    return cache
  }

  var res = await db.collection("admin").where({website: "github", type: "token", status: 'online'}).get()
  var index = Math.floor(Math.random() * res.data.length);
  CACHE.set(key, res.data[index].value)
  return res.data[index].value;
}

async function trace(OPENID, owner, repo, type, path, fromcache) {
  db.collection('history').add({
    data: {
      openid: OPENID,
      owner,
      repo,
      type,
      path: path || '',
      fromcache: fromcache || '0',
      requesttime: new Date().toISOString(),
    }
  }).then(res => { console.log(res) }).catch(console.error)
}

async function getHistory(openid) {
  var historys = await db.collection('history').where({openid, type:'readme'}).orderBy('requesttime', 'desc').get()
  var col = db.collection('github')
  var filter = []
  var historyDict = {}
  var historyNoDup = []
  historys.data.map(function(d) {
    var key = d.owner + ' / ' + d.repo
    filter.push({
      repo: key,
    })
    if (!(key in historyDict)) {
      historyDict[key] = true
      historyNoDup.push(d)
    }
  })
  if (filter.length == 0) {
    return []
    
  }
  var result = await col.where(_.or(filter)).get()
  var resultDict = {}
  result.data.map(function(d) {
    resultDict[d.repo] = d
  })
  var historyList = []
  historyNoDup.map(function(d){
    var key = d.owner + ' / ' + d.repo
    if (key in resultDict) {
      var r = resultDict[key]
      r["requesttime"] = d.requesttime
      historyList.push(r)
    }
  })
  return historyList
}

// 云函数入口函数
exports.main = async (event, context) => {
  var { owner, repo, type, path, ref, token } = event;
  if (token == undefined || token == "") {
    token = await getToken()
  }
  octokit = new Octokit({
    auth: 'token ' + token,
    request: {retries: 0}
  })
  gcache.SetHook(octokit, db)

  var { owner, repo, type, path, ref } = event;
  // console.log("context: ", cloud.getWXContext())
  const { OPENID, APPID } = cloud.getWXContext()
  res = await executeWithCache(owner, repo, type, path, OPENID, ref, event)
  // trace(OPENID, owner, repo, type, path, res['_from_cache'])
  return res;
}

const grayCache = { 'readme': true, 'get': true, 'file': true, 'pr': true, 'repos': true, 'releases': true, 'commits': true, 'issues': true }
async function executeWithCache(owner, repo, type, path, openid, ref, data) {
  var key = owner + repo + type + path + ref + data.currentSize
  var res = await dbcache.Get(db, key);
  if (res == undefined) {
    res = await execute(owner, repo, type, path, openid, ref, data)
    if (type in grayCache) {
      await dbcache.Set(db, key, res)
    }
  } else {
    res['_from_cache'] = '1'
  }
  return res;
}


async function execute(owner, repo, type, path, openid, ref, data) { 
  if (!ref) { ref = 'master'; }
  var res;
  var per_page = 30;
  var page = 1;
  if (data.currentSize) {
    page = 1 + data.currentSize / per_page 
  }
  if (!type || type == "readme") {
    res = await octokit.repos.getReadme({ owner, repo, ref })
    return {
      content: res['data']['content'],
      name: res['data']['name'],
    }
  } else if (type == "releases") {
    res = await octokit.repos.listReleases({ owner, repo, per_page, page })
    return { content: res['data']}
  } else if (type == "commits") {
    res = await octokit.repos.listCommits({ owner, repo, per_page, page })
    return {content: res['data']}
  } else if (type == "issues") {
    res = await octokit.issues.listForRepo({ owner, repo, sort: "updated", per_page, page })   
    return {content: res['data']}
  } else if (type == 'history') {
    return {content: await getHistory(openid)}
  } else if (type == 'file') {
    var d = await octokit.repos.getContents({ owner, repo, path, ref })
    return {content: d['data']['content'], name: d['data']['name'], openid: openid}
  } else if (type == 'repos') {
    var d = await octokit.repos.listForUser({ username: owner, sort: 'updated', per_page, page })
    return {content: d['data'], 'owner': owner}
  } else if (type == 'pr') {
    var d = await octokit.pulls.get({ owner, repo, number: path, mediaType: { format: 'diff' }})
    return {content: d['data']}
  } else if (type == 'get') {
    var wikitag = "/contents/wiki"
    if (path.indexOf(wikitag) != -1) {
      var npath = 'http://39.106.218.104:8080/repos/' + owner + '__' + repo + '.wiki/contents' 
      var sufix = path.slice(path.indexOf(wikitag) + wikitag.length)
      if (sufix.length == 0) {sufix += '/Home'}
      else if (sufix.length == 1) {sufix += 'Home'}
      path = npath + sufix + '.md'
    }
    if (path.indexOf('&') == -1 && path.indexOf('?') == -1) { path += '?'} 
    else { path += '&'}
    path += 'page=' + page + '&per_page=' + per_page
    var d = await octokit.request('GET ' + path)
    if (d['status'] == 202) {
      d = await octokit.request('GET ' + path)
    }
    return {content: d['data']}
  } else if (type) {
    if (data.body && data.body.indexOf('From WeChat Mini Programe') < 0) {
      data.body += '\n\n\n> From WeChat Mini Programe: [GitHub Trending Hub](https://github.com/ZhuPeng/mp-githubtrending?openid=' + openid + ')'
    }
    var d = await octokit.request(type.toUpperCase() + ' ' + path, {data: data})
    return { content: d['data'] }
  }
  
  return {
    error: "Not Support Type",
    type: type
  }
}
