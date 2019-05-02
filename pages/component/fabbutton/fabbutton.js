const qrcode = require('../../../utils/qrcode.js')
const base = 'https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/icon/'
const share = base + "Paper-Plane.png"
const chat = base + "Chat.png"
const top = base + "up.png"
const setting = base + "Settings.png"
const buttons = [{
  label: "Top",
  icon: top,
}, {
  label: 'Share',
  icon: share,
}, {
  label: 'Contact',
  icon: chat,
}, {
  label: 'Account',
  icon: setting,
}]

Component({
  properties: {

  },

  data: {
    types: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
    typeIndex: 3,
    colors: ['light', 'stable', 'positive', 'calm', 'balanced', 'energized', 'assertive', 'royal', 'dark'],
    colorIndex: 0,
    dirs: ['horizontal', 'vertical', 'circle'],
    dirIndex: 0,
    sAngle: 0,
    eAngle: 360,
    spaceBetween: 10,
    buttons,
  },

  methods: {
    onFabClick(e) {
      console.log('onFabClick', e.detail)
      if (e.detail.index == 0) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      } else if (e.detail.index == 3) {
        wx.navigateTo({
          url: '/pages/account/account?history',
        })
      } else if (e.detail.index == 2) {
        wx.navigateTo({
          url: '/pages/gitfile/gitfile?owner=ZhuPeng&repo=mp-githubtrending&file=README.md',
        })
      } else if (e.detail.index == 1) {
        qrcode.HandleQrCode()
      }
    },
  }
})
