const multimp = require('../../../utils/multimp.js')
Component({
  properties: {
    book: {
      type: Boolean,
      value: true
    },
    question: {
      type: Boolean,
      value: true
    },
    topic: {
      type: Boolean,
      value: true
    },
  },

  data: {
  },

  methods: {
    onClick: function(e) {
      console.log('tap: ', e)
      var url = e.currentTarget.dataset.set;
      multimp.Navi(url)  
    },
  }
})
