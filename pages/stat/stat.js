const dbutil = require('../../utils/db.js')
const util = require('../../utils/util.js')
var db = dbutil.getDB()
const _ = db.command
Page({
  data: {
    users: ["ooqTr4hMz05xwBHOU8VgokLyyoU0"],
    log: '',
    total: '',
    devtotal: '',
    cacheMiss: 0,
    cachePercent: 0,
    history: []
  },

  onLoad: function() {
    this.stat()
  },

  stat: function () {
    var self = this;
    db.collection("history").where({ fromcache: '0' }).count().then(res => {
      var miss = res.total
      db.collection("history").where({ fromcache: '1' }).count().then(res => {
        var md = '* 缓存命中率 ' + util.GetPercent(res.total, res.total + miss)
        self.setData({ cachePercent: md })
      });
    });
    db.collection("history").count().then(res => {
      self.setData({total: "## 访问量统计\n* Total: " + res.total + '\n'})
    });


    this.data.users.map(u => {
      var d = {openid: u}
      var md = ''
      db.collection("history").where({openid: u}).count().then(res => {
        md += '* 开发 ' + u.substring(6, 20) + "：" + res.total + '\n'
        self.setData({ devtotal: md })
      }); 
    })
    self.loadHistory(0)
  },

  genHistoryTable: function (history) {
    var log = ''
    log += '## 访问记录\ntime | type | repo | path | cache \n-- | -- | -- | -- | -- \n'
    history.map(d => {
      if (d.openid == this.data.users[0]) { return }
      log += d.requesttime.substring(0, 19) + ' | ' + d.type + ' | ' + d.owner + '/' + d.repo + ' | ' + d.path +  '|' + d.fromcache + '\n';
    })
    this.setData({ log: log })
  },

  loadHistory: function (skip) {
    var self = this
    var history = this.data.history
    db.collection('history').orderBy('requesttime', 'desc').skip(skip).get().then(res => {
      res.data.map(d => {
        if (d.openid != self.data.users[0]) {
          history.push(d)
        }
      })
      self.setData({history})
      if (history.length > 50) {
        self.genHistoryTable(history)
        return
      }
      self.loadHistory(skip + 20)
    })
  }
})