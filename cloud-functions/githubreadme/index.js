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
  var {owner, repo} = event;
  var ref = 'master';
  var res = await octokit.repos.getReadme({ owner, repo, ref })
  return {
    content: res['data']['content']
  }
}