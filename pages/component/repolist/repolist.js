const util = require('../../../utils/util.js')
Component({
  properties: {
    list: {
      type: Array,
      value: [],
    },
    timeKey: {
      type: String,
      value: '_crawl_time'
    }
  },

  data: {
  },

  methods: {
    toTimeAgo: function (d) {
      var a = util.timeAgo(d)
      console.log('to: ', a)
      return a;
    }
  }
})
