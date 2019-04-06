const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var { path, width } = event;
  try {
    const result = await cloud.openapi.wxacode.createQRCode({
      path: path || '',
      width: width || 430
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}