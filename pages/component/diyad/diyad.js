const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {
    unit_id: {
      type: String,
      value: ''
    },
    num: {
      type: String,
      value: '',
      observer() {
        this.reload_blog();
      }
    },
  },

  data: {
    adrendererror: "",
    item: {}
  },

  methods: {
    reload_blog() {
      if (this.data.num == '') {return}
      var self = this
      cloudclient.callFunctionWithBlog({type: 'random'}, function (c){
        console.log('random blog:', c)
        self.setData({item: c['data'] || {}, adrendererror: 'true'})
      })
    },  
    binderror(e) {
      console.log("ad render error:", e)
      this.reload_blog()
    }
  }
})
