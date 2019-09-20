const cloudclient = require('../../utils/cloudclient.js')
Page({
  data: {
    blog: {},
    blogmd: '> From: [GitHub](https://github.com)\n'
  },

  onLoad: function (options) {
    var self = this

    cloudclient.callFunctionWithBlog({ jobname: options.jobname, id: options.id }, function (c) {
      self.setData({ blog: c })
      self.genMd(c)
    })
  },

  genMd: function(blog) {
    if (blog.data.length != 1) { return }
    var meta = blog.data[0]
    var yaml = blog.yaml
    var base_url = yaml.parser_config.base_url + '/'
    var bloglist = '/pages/bloglist/bloglist?jobname=' + yaml.name
    var blogmd = '> From: [' + yaml.view + '](' + bloglist + ') ' + ' \n\n'
    
    blogmd += '![](' + meta['article-image_url'] + ')\n'
    blogmd += '## ' + meta.title + '\n\n' 
    blogmd += meta['article-date'] + ' ' + meta['article-author'] + '\n\n'
    if (!meta['article-body']) {
      meta['article-body'] = 'No Contents'
    }
    blogmd += meta['article-body'] + '\n\n'
    blogmd += '> Link: [' + meta.url + ']('+ meta.url + ')\n\n'
    this.setData({blogmd})
  },

  onShareAppMessage: function() {}
})