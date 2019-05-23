const util = require('../../../utils/util.js')
const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {
    owner: {
      type: String,
      value: ''
    },
    repo: {
      type: String,
      value: '',
      observer() {
        this.handleRepo();
      }
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
    iconsize: 18,
    isStar: false,
  },

  methods: {
    handleUrl: function () {
      var [owner, repo, filepath] = util.parseGitHub(this.data.url)
      this.setData({ owner, repo })
    },
    handleRepo: function() {
      var self = this
      if (!this.data.repo) { return }
      cloudclient.callFunctionWithRawResponse({ type: 'get', path: '/user/starred/' + this.data.owner + '/' + this.data.repo, ignoreWithoutAuth: true }, function (d) {
        if (d != undefined) {
          self.setData({isStar: true})
        }
      })
    },
    star: function(e) {
      var type = 'PUT'
      var action = 'Star'
      if (this.data.isStar) {
        type = 'DELETE'
        action = 'UnStar'
      }
      var self = this
      cloudclient.callFunctionWithRawResponse({ type, path: '/user/starred/' + this.data.owner + '/' + this.data.repo, forceAuth: true}, function (d) {
        var status = 'ERROR '
        if (d != undefined) {
          self.setData({ isStar: !self.data.isStar })
          status = 'Success '
        }
        util.Alert(status + action)
      })
    },  
    copy: function (e) {
      util.copyText(e)
    },
  }
})
