const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var { formId, source } = event;

  var res = await db.collection('formid').add({
    data: {
      formId,
      openid: wxContext.OPENID,
      time: new Date(),
      status: "new",
      source,
    },
  })

  return res;
}