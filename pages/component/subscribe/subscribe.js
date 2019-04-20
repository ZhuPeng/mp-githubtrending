const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {

  },

  data: {
    status: {}
  },

  attached: function () { 
    var self = this;
    cloudclient.callFunctionWithSubscribe({action: 'isSubscribe'}, function(r) {
      self.setData({status: r})
    })
  },

  methods: {
    onButtonClick(e) {
      var self = this;
      console.log(e)
      cloudclient.uploadFormID(e.detail.formId, 'Subscribe')
      var text = e.detail.target.dataset.text || ''
      if (text.indexOf('like') >= 0) {
        wx.showToast({
          title: 'Like +1',
          duration: 1000,
          success: function () {}
        })
        return
      }
      cloudclient.callFunctionWithSubscribe({ action: this.data.status.nextAction }, function (r) {
        self.setData({ status: r })
      })
    }
  }
})
