const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const table = 'subscribe'

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var { source, action } = event;
  if (!source) {source = 'blog'}
  if (!action) {action = 'subscribe'}

  var res = await db.collection(table).where({ source, openid: wxContext.OPENID}).get()

  if (action == 'subscribe' && res.data.length == 0) {
    return await db.collection(table).add({
      data: {
        openid: wxContext.OPENID,
        time: new Date(),
        source,
      },
    })
  } else if (action == 'unsubscribe' && res.data.length == 1) {
    return await db.collection(table).doc(res.data[0]._id).remove()
  }
  return {'status': '没有任何操作'};
}