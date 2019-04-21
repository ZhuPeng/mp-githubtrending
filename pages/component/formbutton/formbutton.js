const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {
    text: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: ''
    },
  },

  data: {

  },

  methods: {
    onSubmit(e) {
      console.log('button onSubmit:', e)
      cloudclient.uploadFormID(e.detail.formId, this.data.text)
      this.triggerEvent('click', e)   
    }
  }
})
