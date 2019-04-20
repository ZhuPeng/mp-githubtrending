const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  var content = await pubSimpleContent()
  var res = await db.collection('subscribe').where({openid: OPENID}).get()
  if (res.data.length == 0) {return}
  
  var formid = await db.collection('formid').where({openid: OPENID, status: 'new'}).limit(1).get()
  // console.log(formid)
  if (formid.data.length == 0) {
    console.log('没有找到可用的 formid:', OPENID)
    return { 'status': '没有找到可用的 formid'}
  }

  return await pub(OPENID, formid.data[0].formId, content, formid.data[0]._id)
}

async function pub(openid, formId, content, id) {
  console.log('pub:', openid, formId)
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: openid,
      page: 'pages/github/index',
      data: {
        keyword1: {
          value: 'GitHub Trending 更新 666 个项目' 
        },
        keyword2: {
          value: content
        }
      },
      templateId: 'FVPAbr_D4W3Mk9um2BE8ouHuabSi-CiDSVtNXTcC1PA',
      formId: formId,
    })
    console.log(result)
    deleteFormId(id)
    return result
  } catch (err) {
    console.log(err)
    if (err.errMsg.indexOf('form id used count reach limit') >= 0) {
      deleteFormId(id)
    }
    return err
  }
}

function deleteFormId(id) {
  console.log('delete formid:', id)
  db.collection('formid').doc(id).update({
    data: { status: 'deleted'}
  }).then(console.log)
    .catch(console.error)
}

async function pubSimpleContent() {
  var desp = '博客更新'
  await cloud.callFunction({
    name: 'blog',
    data: { type: 'lastest' },
  }).then(res => {
    console.log(res.result)
    res.result.data.map(function (d) {
      desp += '\n* ' + d.title
    })
  }).catch(console.error)
  console.log('pubcontent:', desp)
  return desp
}

async function pubcontent() {
  // var url = 'https://sc.ftqq.com/SCU43274T1f4fca572d60ebb8647a48a691098da35c4b118531088.send'
  var title = '每日早报'
  var desp = '#### 博客更新'

  await cloud.callFunction({
    name: 'blog',
    data: { type: 'lastest'},
  }).then(res => {
    console.log(res.result) 
    res.result.data.map(function(d) {
      desp += '\n* [' + d.title + '](' + d.url + ')'
    })
  }).catch(console.error)
  console.log('pubcontent:', desp)
  return desp

  // var target = url + '?text=' + encodeURIComponent(title) + '&desp=' + encodeURIComponent(desp)
  // var raw = await rp(target).then(function (response) {
  //  console.log('response:', response)
  //  return response;
  // }).catch(function (err) {
  //   console.log('request error:', err)
  // });
  // return {'status': 'success'}
}