// 云函数入口文件
const cloud = require('wx-server-sdk')
const octokit = require('@octokit/rest')()
octokit.authenticate({
  type: 'oauth',
  token: '9290eed67c5f824c32ead2b35b1b5d4e72899231'
})

// 云函数入口函数
exports.main = async (event, context) => {
  var owner = 'octokit';
  var repo = 'rest.js';
  var ref = 'master';
  var res = await octokit.repos.getReadme({ owner, repo, ref })
  return {
    content: res['data']['content']
  }
}