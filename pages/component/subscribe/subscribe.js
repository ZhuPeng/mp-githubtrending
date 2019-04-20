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
      cloudclient.uploadFormID(e.detail.formId, 'Subscribe')
      cloudclient.callFunctionWithSubscribe({ action: this.data.status.nextAction }, function (r) {
        self.setData({ status: r })
      })
    }
  }
})
