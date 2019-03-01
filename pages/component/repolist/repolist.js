const util = require('../../../utils/util.js')
Component({
  properties: {
    list: {
      type: Array,
      value: [],
      observer() {
        this.handleList();
      }
    },
    timeKey: {
      type: String,
      value: '_crawl_time'
    }
  },

  data: {
    parsedList: []
  },

  methods: {
    handleList: function() {
      console.log('lhandle ist:', this.data.list)
      var parsedList = []
      this.data.list.map(d => {
        d.timeago = util.timeAgo(d[this.data.timeKey])
        parsedList.push(d)
      })
      this.setData({parsedList})
    }
  }
})
