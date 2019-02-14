const share = "../../../image/Paper-Plane.png"
const chat = "../../../image/Chat.png"
const top = "../../../image/up.png"
const setting = "../../../image/Settings.png"
const buttons = [{
  label: "Top",
  icon: top,
}, {
  openType: 'share',
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
      }
    },
  }
})
