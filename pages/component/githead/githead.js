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
    url: {
      type: String,
      value: '',
      observer() {
        this.handleUrl();
      }
    },
  },

  data: {

  },

  methods: {
    handleUrl: function () {
      var [owner, repo, filepath] = util.parseGitHub(this.data.url)
      this.setData({ owner, repo })
    },
    copy: function (e) {
      util.copyText(e)
    },
  }
})
