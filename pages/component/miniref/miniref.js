const multimp = require('../../../utils/multimp.js')
const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {
  },

  attached: function () { 
    var self = this;
    cloudclient.callFunctionWithName('miniref', {}, function(r) {
      console.log('minirefs:', r)
      self.setData({minirefs: r.data})
    })
  },

  data: {
    minirefs: [],
  },

  methods: {
    onClick: function(e) {
      console.log('tap: ', e)
      var url = e.currentTarget.dataset.set;

      for (var i=0; i<this.data.minirefs.length; i++) {
        var m = this.data.minirefs[i]
        if (m.url != url) {continue}
        if (m.appid && m.navi_page) {
          console.log('appid direct navi')
          wx.navigateToMiniProgram({
            appId: m.appid,
            path: m.navi_page,
            success(res) {
              console.log('Navi success:', res)
            },
            fail(res) {
              console.log('Navi fail:', res)
            }
          })
        } else {
          multimp.Navi(url)  
        }
        return
      }
    },
  }
})
