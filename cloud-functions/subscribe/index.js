const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const table = 'subscribe'

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var { source, action } = event;
  if (!source) {source = 'blog'}
  if (!action) {action = 'Subscribe'}

  var res = await db.collection(table).where({ source, openid: wxContext.OPENID}).get()
  if (action == 'isSubscribe') {
    if (res.data.length == 0) {
      return {status: 'UnSubscribe', nextAction: 'Subscribe'}
    } else {
      return { status: 'Subscribe', nextAction: 'UnSubscribe'}
    }
  }

  if (action == 'Subscribe' && res.data.length == 0) {
    await db.collection(table).add({
      data: {
        openid: wxContext.OPENID,
        time: new Date(),
        source,
      },
    })
    return { status: 'Subscribe', nextAction: 'UnSubscribe' }
  } else if (action == 'UnSubscribe' && res.data.length == 1) {
    await db.collection(table).doc(res.data[0]._id).remove()
    return { status: 'UnSubscribe', nextAction: 'Subscribe' }
  }
  return {'status': '没有任何操作'};
}