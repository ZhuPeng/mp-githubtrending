// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var d = new Date()
  d.setDate(d.getDate() - 60);
  db.collection('history').where({
    requesttime: _.lt(d.toISOString()),
  }).remove()

  db.collection('gcache').where({
    time: _.lt(d.toISOString()),
  }).remove()
  return {'status': 'done'}
}