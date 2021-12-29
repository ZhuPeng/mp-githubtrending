const util = require('../../../utils/util.js')
const multimp = require('../../../utils/multimp.js')
const cloudclient = require('../../../utils/cloudclient.js')
Component({
  properties: {
    blogid: {
      type: String,
      value: ''
    },
    uniqid: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ''
    },
    jobname: {
      type: String,
      value: ''
    },
    image_url: {
      type: String,
      value: ''
    },
    imgstyle: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: ''
    },
    username: {
      type: String,
      value: ''
    },
    userAvatar: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: '',
      observer() {
        this.handleUrl();
      }
    },
    pvcnt: {
      type: String,
      value: '0'
    },
    starcnt: {
      type: String,
      value: '0'
    },
    license: {
      type: String,
      value: ''
    },
    isperm: {
      type: String,
      value: ''
    },
    ad_image: {
      type: String,
      value: ''
    },
    updateAt: {
      type: String,
      value: '',
      observer() {
        this.timeAgo();
      }
    }
  },

  data: {
    parsedUrl: '',
    timeago: '',
    parsedContent: '',
  },

  methods: {
    timeAgo() {
      this.setData({timeago: util.timeAgo(this.data.updateAt)})
    },
    handleUrl() {
      var p = this.data.url;
      if (!util.isGitHubPage(p)) {
        var parsed = util.FindGitHubUrl(this.data.content)
        if (util.isGitHubPage(parsed) || p == "") {p = parsed}
      }
      var parsedContent = this.data.content
      var maxLen = 600
      if (parsedContent.length > maxLen) {
          parsedContent = parsedContent.slice(0, maxLen) + '\n\n**点击查看更多**\n\n'
      }
      var self = this;
      self.setData({parsedUrl: p, parsedContent})
      
      // cloudclient.isMsgNotSec({content: parsedContent}, function(r) {
      //     if (r == true) {
      //         parsedContent = "**内容不符合微信安全规范，暂不显示**"
      //     }
      //     self.setData({parsedUrl: p, parsedContent})
      // })
    },
    onClick(e) {
      console.log('card onClick: ', e)
      
      cloudclient.callFunctionWithBlog({type: 'addpv', id: this.data.uniqid}, function (c){
        console.log('addpv res:', c)
      })
      if(this.data.isperm.length > 0) {
        util.copyTextWithCallback(this.data.url, function () {
          util.Alert('未获得作者授权或者其他原因不能在小程序中展示，已为您复制链接，可通过浏览器访问', 5000)
        })
        return
      }
      if(this.data.ad_image.length > 0) {
        wx.previewImage({
          current: this.data.ad_image, 
          urls: [this.data.ad_image], 
          complete: function(e) {console.log('complete:', e)},
          fail: function(e) {console.log('previewImage fail:', e)},
        })
        return
      }
      var url = this.data.parsedUrl || this.data.url;
      if (url && util.isGitHubPage(url)) {
        util.GitHubNavi(url, undefined, true)
        return
      } 
      if (url && url.startsWith('/pages/')) {
        wx.navigateTo({ url: url })
        return
      } 
      if (url && url.startsWith('http')) {
        if (multimp.Navi(url) != false) {return} 
      }
      util.copyTextWithCallback(url, function () {
        util.Alert('链接不能打开，已为您复制链接，可通过浏览器访问', 5000)
      })
    },

    defaultNavi() {
      wx.navigateTo({
        url: '/pages/blog/blog?id=' + this.data.blogid + '&jobname=' + this.data.jobname,
      })
    },
  }
})
