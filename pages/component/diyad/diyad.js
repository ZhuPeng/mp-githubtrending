const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {
    unit_id: {
      type: String,
      value: ''
    },
  },

  data: {
    adrendererror: "",
    item: {}
  },

  methods: {
    binderror(e) {
      console.log("ad render error:", e)
      var self = this
      cloudclient.callFunctionWithBlog({type: 'random'}, function (c){
        console.log('random blog:', c)
        self.setData({item: c['data'] || {}, adrendererror: 'true'})
      })
    }
  }
})
