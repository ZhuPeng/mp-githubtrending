const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  console.log('trigger:', event, context)
  if (!OPENID) {
    await pubcontent()
  }
  var content = await pubSimpleContent()
  var res = await db.collection('subscribe').get()
  var publist = res.data

  for (var i = 0; i < publist.length; i++) {
    var f = await getFormId(publist[i].openapi)
    if (!f) {
      console.log('没有找到可用的 formid:', publist[i])
      continue
    }
    await pub(publist[i].openid, f.formId, content, f._id)
  } 
  return {status: '操作完成'}
}

async function getFormId(openid) {
  var formid = await db.collection('formid').where({openid, status: 'new'}).limit(1).get()
  // console.log(formid)
  if (formid.data.length == 0) {
    console.log('没有找到可用的 formid:', openid)
    return undefined
  }
  return formid.data[0]
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
    await deleteFormId(id)
    return result
  } catch (err) {
    console.log('pub error:', err)
    if (err.errMsg.indexOf('form id used count reach limit') >= 0) {
      await deleteFormId(id)
    }
    return err
  }
}

async function deleteFormId(id) {
  console.log('delete formid:', id)
  await db.collection('formid').doc(id).update({
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
    res.result.data.map(function (d) {
      desp += '\n* ' + d.title
    })
  }).catch(console.error)
  console.log('pubcontent:', desp)
  return desp
}

async function pubcontent() {
  var url = 'https://sc.ftqq.com/SCU43274T1f4fca572d60ebb8647a48a691098da35c4b118531088.send'
  var title = '每日早报'
  var desp = '#### 博客更新'

  await cloud.callFunction({
    name: 'blog',
    data: { type: 'lastest'},
  }).then(res => {
    res.result.data.map(function(d) {
      desp += '\n* [' + d.title + '](' + d.url + ')'
    })
  }).catch(console.error)

  var target = url + '?text=' + encodeURIComponent(title) + '&desp=' + encodeURIComponent(desp)
  var raw = await rp(target).then(function (response) {
    console.log('response:', response)
    return response;
  }).catch(function (err) {
    console.log('request error:', err)
  });
  return {'status': 'success'}
}