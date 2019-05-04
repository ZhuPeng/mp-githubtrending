const cloudclient = require('./cloudclient.js')
const util = require('./util.js')
module.exports = {
  HandleQrCode,
}

function HandleQrCode() {
  var [path, param] = util.GetLastestPage()
  cloudclient.callFunctionWithQrCode({ page: path, scene: param }, function (d) {
    console.log('qrcode: ', d)
    if (!d.buffer) {
      util.Alert(d.errMsg)
      return
    }
    var qr = "data:image/png;base64," + wx.arrayBufferToBase64(d.buffer)
    wx.previewImage({
      current: qr,
      urls: [qr]
    })
  })
}