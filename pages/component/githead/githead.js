const util = require('../../../utils/util.js')
Component({
  properties: {
    owner: {
      type: String,
      value: ''
    },
    repo: {
      type: String,
      value: ''
    },
    tail: {
      type: String,
      value: ''
    },
  },

  data: {

  },

  methods: {
    copy: function (e) {
      util.copyText(e)
    },
  }
})
