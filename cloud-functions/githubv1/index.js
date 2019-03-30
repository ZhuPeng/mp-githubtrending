// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const octokit = require('@octokit/rest')()
const db = cloud.database()
const _ = db.command
const NodeCache = require( "node-cache" );
const CACHE = new NodeCache({ stdTTL: 1800, checkperiod: 200 });

async function getToken() {
  var res = await db.collection("admin").where({website: "github", type: "token"}).get()
  var index = Math.floor(Math.random() * res.data.length);
  return res.data[index].value;
}

const per_page = 30;
const page = 1;

function dateFtt(fmt, date) { //author: meizz   
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "H+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
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
      requesttime: dateFtt("yyyy-MM-dd HH:mm:ss.S", new Date()),
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
  octokit.authenticate({
    type: 'oauth',
    token: token,
  })

  var { owner, repo, type, path, ref } = event;
  const { OPENID, APPID } = cloud.getWXContext()
  res = await executeWithCache(owner, repo, type, path, OPENID, ref, event)
  // await trace(OPENID, owner, repo, type, path, res['_from_cache'])
  return res;
}

const grayCache = {'readme': true, 'get': true, 'file': true}
async function executeWithCache(owner, repo, type, path, openid, ref, data) { 
  var key = owner + repo + type + path + ref
  var res = CACHE.get(key);
  if (res == undefined) {
    res = await execute(owner, repo, type, path, openid, ref, data)
    if (type in grayCache) {
        CACHE.set(key, res)
    }
  } else {
    res['_from_cache'] = '1'
  }
  return res;
}

async function execute(owner, repo, type, path, openid, ref, data) { 
  if (!ref) { ref = 'master'; }
  var res;
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
    res = await octokit.repos.listCommits({ owner, repo, per_page })
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
  } else if (type == 'get') {
    var d = await octokit.request('GET ' + path)
    if (d['status'] == 202) {
      d = await octokit.request('GET ' + path)
    }
    return {content: d['data']}
  } else if (type == 'post') {
    var d = await octokit.request('POST ' + path, {data: data})
    return { content: d['data'] }
  }
  
  return {
    error: "Not Support Type",
    type: type
  }
}
