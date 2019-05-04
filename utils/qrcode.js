const cloudclient = require('./cloudclient.js')
const util = require('./util.js')
module.exports = {
  HandleQrCode,
}

function HandleQrCode() {
  var pages = getCurrentPages()
  var page = pages[pages.length - 1]
  var param = ''
  for (var k in page.options) {
    if (param) {
      param += '&'
    }
    param += k + '=' + page.options[k]
  }
  cloudclient.callFunctionWithQrCode({ page: page.route, scene: param }, function (d) {
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