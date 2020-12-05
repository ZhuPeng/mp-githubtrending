const cloudclient = require('./cloudclient.js')
const util = require('./util.js')
var common = require('common.js')
import { $wuxDialog } from '../third-party/wux-weapp/index'
module.exports = {
  HandleQrCode,
  DialogShare,
}

function HandleQrCode() {
  var [path, param] = util.GetLastestPage()
  util.Alert("加载中...")
  cloudclient.callFunctionWithQrCode({ page: path, scene: param }, function (d) {
    console.log('qrcode: ', d)
    if (!d.buffer) {
      util.Alert(d.errMsg)
      return
    }
    var qr = "data:image/png;base64," + wx.arrayBufferToBase64(d.buffer)
    util.previewImage(qr)
  })
}

function DialogShare() {
  var k = 'PV-'
  var cnt = common.GetDateCount(k)
  common.SetDateCount(k, cnt)
  if (cnt == 6) {
    share()
    return
  }
  if (cnt%10==0 && cnt>=10) {
    insertScreenAd()
    return
  }
}

function insertScreenAd() {
  var interstitialAd = null
  if (wx.createInterstitialAd) {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: 'adunit-ddca5a05ce71f1cf'
    })
    interstitialAd.onLoad(() => {})
    interstitialAd.onError((err) => {console.error(err)})
    interstitialAd.onClose(() => {})
  }
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      console.error(err)
    })
  }
}

function share() {
  $wuxDialog().open({
    resetOnClose: true,
    title: '',
    content: '你可以通过以下方式分享小程序给小伙伴们，你的分享是我们持续优化的动力',
    verticalButtons: !0,
    buttons: [{
            text: '群聊分享',
            bold: !0,
            openType: 'share',
        }, {
            text: '二维码分享',
            bold: !0,
            onTap(e) {
              HandleQrCode()
            },
        }, {
            text: '赞赏一下',
            bold: !0,
            onTap(e) {
              var url = 'https://7465-test-3c9b5e-books-1301492295.tcb.qcloud.la/images/compress_zansang.png'
              util.previewImage(url)
            },
        }, {
            text: '残忍拒绝',
        },
    ],
  })
}