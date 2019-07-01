const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const {type, openid} = event;
  console.log('trigger:', event, context)
  // 方糖推送
  await pubcontent()

  if (type == 'all' && OPENID != 'ooqTr4hMz05xwBHOU8VgokLyyoU0') {
    console.log("非法的全局推送 openid: ", OPENID)
    return 
  }
  var publist = []
  var content = await pubSimpleContent()
  var trending = await trendingContent() 
  if (!OPENID || type == 'all') {
    var res = await db.collection('subscribe').get()
    publist = res.data
    console.log("总订阅用户：", publist.length)
  } else {
    publist = [{ openid: OPENID }]
  }
  
  var res = []
  for (var i = 0; i < publist.length; i++) {
    var f = await getFormId(publist[i].openid)
    if (!f) {
      var err = '没有找到可用的 formid:' + publist[i]
      console.log(err)
      res.push(err)
      continue
    }
    var r = await pub(publist[i].openid, f.formId, content, trending, f._id)
    res.push(r)
  } 
  console.log('push result: ', res)
  return {status: '操作完成', detail: res}
}

async function getFormId(openid) {
  var validDate = new Date()
  validDate.setDate(validDate.getDate() - 7);
  var formid = await db.collection('formid').where({ openid, status: 'new', time: _.gt(validDate) }).orderBy('time', 'asc').limit(1).get()
  // console.log(formid)
  if (formid.data.length == 0) {
    console.log('没有找到可用的 formid:', openid)
    return undefined
  }
  return formid.data[0]
}

async function trendingContent() {
  var now = new Date()
  var start = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate()
  var res = []
  for (var i = 0; i<10; i++ ) {
    var tmp = await db.collection('github').orderBy('_crawl_time', 'desc').skip(res.length).get()
    res.push(...tmp.data)
  }
  
  var count = {}
  res.map(function(g) {
    if (!(g.lang in count)) {count[g.lang] = 0} 
    count[g.lang] += 1
  })

  var sorted = []
  for (var k in count) {
    sorted.push({ lang: k, cnt: count[k] });
  }
  function sortByCount(a, b) {
    return b.cnt - a.cnt;
  };

  sorted.sort(sortByCount);
  var content = 'Trending 最近更新项目语言 TOP5'
  sorted.map(function(s, i) {
    if (i >= 5) {return}
    content += '\n* ' + s.lang + ': ' + s.cnt
  })
  return content
}

async function pub(openid, formId, content, trending, id) {
  console.log('pub:', openid, formId)
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: openid,
      page: 'pages/github/index',
      data: {
        keyword1: {
          value: trending,
        },
        keyword2: {
          value: content
        }
      },
      templateId: 'lRgcyAmzj1LTg_bYJuiCOeBgT8jx6HOqzC3EtAXh-_8',
      formId: formId,
    })
    console.log(result)
    await deleteFormId(id)
    return result
  } catch (err) {
    console.log('pub error:', err)
    if (err.errMsg && err.errMsg.indexOf('form id used count reach limit') >= 0) {
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
    name: 'blogv1',
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
    name: 'blogv1',
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