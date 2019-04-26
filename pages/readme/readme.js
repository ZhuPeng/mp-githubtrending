const util = require('../../utils/util.js')
const dbutil = require('../../utils/db.js')
const cloudclient = require('../../utils/cloudclient.js')
const qrcode = require('../../utils/qrcode.js')
import Toast from '../../third-party/vant-weapp/toast/toast';

Page({
  data: {
    readme: "",
    releases: [],
    commits: [],
    issues: [],
    stats: [],
    statsMd: '',
    meta: {desc: 'loadding...'},
    query: {},
    spinning: true,
    tabKey: '',
  },

  onButtonClick: function (e) {
    wx.navigateTo({
      url: '/pages/newissue/newissue?url=' + this.data.meta.url,
    })
  },

  onWikiClick: function (e) {
    var { owner, repo } = this.data.query
    wx.navigateTo({
      url: '/pages/gitfile/gitfile?owner=' + owner + '&repo=' + repo + '&file=wiki',
    })
  },

  onCodeClick: function (e) {
    var {owner, repo} = this.data.query
    var apiurl = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents'
    wx.navigateTo({
      url: '/pages/gitdir/gitdir?owner=' + owner + '&repo=' + repo + '&apiurl=' + apiurl,
    })
  },

  getMeta: function () {
    var self = this;
    cloudclient.callFunction({ type: 'get', path: '/repos/' + self.data.query.owner + '/' + self.data.query.repo}, function (c) {
      console.log('meta: ', c)
      var meta = { 'fork': c.forks_count, 'star': c.stargazers_count, 'lang': c.language, url: c.html_url, 'desc': c.description, 'issue_count': c.open_issues_count, 'created_at': c.created_at, 'has_wiki': c.has_wiki, default_branch: c.default_branch}
        self.setData({ meta })

        if (c.default_branch != 'master') {
          self.getGitHubData("readme", function preprocess(content) {
            return util.base64Decode(content)
          })
        }
        // preload
        self.getGitHubData("commits")
        self.getGitHubData("issues")
        self.genStatsMd(true)
    })
  },

  onLoad: function (options) {
    console.log("options:", options)
    var repo = decodeURIComponent(options.repo)
    var arr = repo.split("/")
    if (arr.length < 2) {return}
    var dbrepo = arr[0].trim() + " / " + arr[1].trim()
    this.setData({query: {owner: arr[0].trim(), repo: arr[1].trim()}})
    var self = this
    self.getGitHubData("readme", function preprocess(content) {
      return util.base64Decode(content)
    })
    self.getMeta()
  },

  onClick(event) {
    console.log(event)
    this.setData({tabKey: event.detail.title})
    this.loadData(event.detail.title.toLowerCase())
  },

  loadData(key, more) {
    if (key == 'readme') {return}
    if (key == 'stats' && this.data.statsMd == '') {
      this.setData({ spinning: true })
      this.genStatsMd(true)
    } else if (this.data[key] && (more || this.data[key].length == 0)) {
      if (key == 'issues' && this.data[key].length && this.data[key].length == this.data.meta.issue_count) { return }
      this.setData({ spinning: true })
      this.getGitHubData(key)
    }
  },

  genStatsMd: function(retry) {
    var self = this
    var repo = this.data.query.owner + '/' + this.data.query.repo
    var starHistory = 'https://starcharts.herokuapp.com/' + repo
    var statsMd = '## Stargazers over time\n\n[![Stargazers over time](' + starHistory + '.svg)](' + starHistory + ')\n'

    statsMd += '## Summary\n\n'
    statsMd += 'Repo Age: ' + util.timeAgo(self.data.meta.created_at || '') + '\n\n'
    this.setData({statsMd})

    cloudclient.callFunction({
      type: 'get', path: '/repos/' + repo + '/stats/contributors'
    }, function (c) {
      if ((!c || c.length == 0) && retry) { 
        self.setData({ spinning: false, stats: c, statsMd })
        self.genStatsMd(false)
        return
      }
      var total = 0;
      c.map(function (s) {
        total += s.total
      })
      statsMd += 'Commits: ' + total + '\n'
      
      statsMd += '## Authors\n\n'
      statsMd += 'Commit Count | Author | Percentage \n-- | -- | -- \n'
      c.reverse().map(function (s) {
        statsMd += s.total + ' | ' + util.mdLink(s.author.login, s.author.html_url) + ' | ' + util.GetPercent(s.total, total) + '\n'
      })
      self.setData({ spinning: false, stats: c, statsMd })
    })
  },

  copy: function (e) {
    util.copyText(e)
  },

  getGitHubData: function(type, callback) {
    var self = this
    cloudclient.callFunction({
        owner: this.data.query.owner,
        repo: this.data.query.repo,
        ref: this.data.meta.default_branch || 'master',
        type: type,
        currentSize: this.data[type].length,
      }, function (d) {
        if (callback) {
          d = callback(d)
        }
        var tmp = self.data[type]
        if (Array.isArray(d) && Array.isArray(tmp)) {
          tmp.push(...d)
        } else { tmp = d}
        self.setData({
          // base64 encode
          [type]: tmp,
          spinning: false,
        })
    })
  },

  onReachBottom: function () {
    console.log("onReachBottom")
    this.loadData(this.data.tabKey.toLowerCase(), true)
  },
  
  onShareAppMessage: function () {
  },

  onCreateQrCode(e) {
    qrcode.HandleQrCode()
  },
})
