const cloudclient = require('../../../utils/cloudclient.js')
const util = require('../../../utils/util.js')
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
      this.buttonClick(e)
      util.ShowAd()
    },

    buttonClick(e) {
      var self = this;
      console.log(e)
      
      var text = e.detail.target.dataset.text || ''
      if (text.indexOf('like') >= 0) {
        cloudclient.uploadFormID(e.detail.formId, 'Like')
        util.Alert('Like +1', 1000)
        return
      }
      cloudclient.uploadFormID(e.detail.formId, 'Subscribe')
      cloudclient.callFunctionWithSubscribe({ action: this.data.status.nextAction }, function (r) {
        self.setData({ status: r })
      })
    }
  }
})
