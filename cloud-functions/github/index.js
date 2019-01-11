// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const octokit = require('@octokit/rest')()
const db = cloud.database()
db.collection("admin").where({website: "github", type: "token"}).get().then(res => {
  octokit.authenticate({
    type: 'oauth',
    token: res[0].value
  })
})

// 云函数入口函数
exports.main = async (event, context) => {
  var {owner, repo, type} = event;
  var ref = 'master';
  var res;
  if (!type || type == "readme") {
    res = await octokit.repos.getReadme({ owner, repo, ref })
    return {
      content: res['data']['content'],
      name: res['data']['name'],
    }
  } else if (type == "releases") {
    res = await octokit.repos.listReleases({ owner, repo, per_page: 5, page: 1 })
    return {
      content: res['data']
    }
  }
  
  return {
    error: "Not Support Type",
    type: type
  }
}