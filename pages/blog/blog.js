Page({
  data: {
    blog: {},
    blogmd: '> From: [GitHub](https://github.com)\n'
  },

  onLoad: function (options) {
    var self = this
    wx.request({
      url: 'http://39.106.218.104:5000/api/items?jobname=' + options.name + '&id=' + options.id,
      success(res) {
        self.setData({blog: res.data})
        self.genMd(res.data)
      }
    })
  },

  genMd: function(blog) {
    if (blog.data.length != 1) { return }
    var meta = blog.data[0]
    var yaml = blog.yaml
    var base_url = yaml.parser_config.base_url + '/'
    var blogmd = '> From: [' + yaml.view + '](' + meta.url + ') ' + ' \n\n'
    
    if (meta['article-image_url'] == base_url) {
      meta['article-image_url'] = 'https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/trackupdates/coreos.png'
    }
    blogmd += '![](' + meta['article-image_url'] + ')\n'
    blogmd += '## ' + meta.title + '\n\n' 
    blogmd += meta['article-date'] + ' ' + meta['article-author'] + '\n\n'
    if (!meta['article-body']) {
      meta['article-body'] = 'No Contents'
    }
    blogmd += meta['article-body'] + '\n'
    this.setData({blogmd})
  },

  onShareAppMessage: function () {

  }
})