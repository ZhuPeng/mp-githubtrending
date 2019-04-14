const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var { scene, page, width, type } = event;
  console.log('event:', event)
  if (scene) {
    scene += '&a=1'
  }
  try {
    var result;
    if (type == 'unlimited') {
      result = await cloud.openapi.wxacode.getUnlimited({
        scene: scene || 'a=1',
        page: page || '',
        width: width || 430
      })
    } else {
      result = await cloud.openapi.wxacode.createQRCode({
        path: page + '?' + scene,
        width: width || 430
      })
    }
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}