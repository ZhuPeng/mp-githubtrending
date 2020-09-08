// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var d = new Date()
  d.setDate(d.getDate() - 180);
  db.collection('history').where({
    requesttime: _.lt(d.toISOString()),
  }).remove()

  await db.collection('gcache').where({
    time: _.lt(d.toISOString()),
  }).remove()

  var d = new Date()
  d.setDate(d.getDate() - 10.5);
  await db.collection('dbcache').where({
    time: _.lt(d.toISOString()),
  }).remove()

  await db.collection('formid').where({
    time: _.lt(d),
  }).remove()
  return {'status': 'done'}
}
