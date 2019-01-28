const util = require('../../utils/util.js')
const dbutil = require('../../utils/db.js')
const cloudclient = require('../../utils/cloudclient.js')
import Toast from '../../third-party/vant-weapp/toast/toast';

Page({
  data: {
    readme: "",
    releases: [],
    commits: [],
    issues: [],
    meta: {},
    query: {},
    spinning: true,
  },

  onLoad: function (options) {
    wx.onPageNotFound(function callback(e) {
      console.log("onPageNotFound:", e)
    })

    console.log("options:", options)
    var repo = decodeURIComponent(options.repo)
    var arr = repo.split("/")
    var dbrepo = arr[0].trim() + " / " + arr[1].trim()
    this.setData({query: {owner: arr[0].trim(), repo: arr[1].trim()}})
    var self = this
    // TODO: get from git real time
    dbutil.getDocWithCondition("github", {repo: dbrepo}, function(doc){
      self.setData({meta: doc || ''})
    })
    self.getGitHubData("readme", function preprocess(content) {
      return util.base64Decode(content)
    })
  },

  onClick(event) {
    if (event.detail.index == 1 && this.data.releases.length == 0) {
      this.setData({ spinning: true })
      this.getGitHubData("releases")
    } else if (event.detail.index==2 && this.data.commits.length == 0) {
      this.setData({ spinning: true })
      this.getGitHubData("commits")
    } else if (event.detail.index==3 && this.data.issues.length==0) {
      this.setData({ spinning: true })
      this.getGitHubData("issues")
    }
  },

  copy: function (e) {
    console.log("copy:", e)
    this.copyText(e.currentTarget.dataset.text)
  },

  copyText(text) {
    wx.setClipboardData({
      data: text,
      success() {
        wx.hideToast()
        Toast('复制成功 ' + text)
      }
    })
  },

  getGitHubData: function(type, callback) {
    var self = this
    cloudclient.callFunction({
        owner: this.data.query.owner,
        repo: this.data.query.repo,
        type: type
      }, function (d) {
        if (callback) {
          d = callback(d)
        }
        self.setData({
          // base64 encode
          [type]: d || 'No Data Found.',
          spinning: false,
        })
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})
