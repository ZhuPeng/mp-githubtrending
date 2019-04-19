const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()
const baseUrl = 'https://7465-test-3c9b5e-1258459492.tcb.qcloud.la'

const BlogMap = {
  'blogcoreos': {
      'article-image_url': [baseUrl + '/trackupdates/coreos.png']
  },
  'githubblog': {
    'article-image_url': [
      'https://github.blog/wp-content/uploads/2019/01/Community@2x.png',
      'https://github.blog/wp-content/uploads/2019/01/Company@2x-2.png',
      'https://github.blog/wp-content/uploads/2019/01/Engineering@2x.png',
      'https://github.blog/wp-content/uploads/2019/01/Enterprise@2x-2.png',
      'https://github.blog/wp-content/uploads/2019/01/Product@2x.png',
    ]
  }
}

async function getItems(jobname, id, num) {
  var url = 'http://39.106.218.104:5000/api/items?jobname=' + jobname
  if (id) {
    url += '&id=' + id
  }
  var defaultnum = num || 5;
  url += '&num=' + defaultnum
  console.log('request url:', url)
  var raw = await rp(url).then(function (response) {
      console.log('response:', response)
      return response;
    }).catch(function (err) {
      console.log('request error:', err)
    });
  var data = JSON.parse(raw)
  console.log('data:', data)
  var base_url = data.yaml.parser_config.base_url + '/'
  if (data.data && jobname in BlogMap) {
    data.data.map(function (d) {
      if (!d['article-image_url'] || d['article-image_url'] == base_url) {
        var images = BlogMap[jobname]['article-image_url']
        d['article-image_url'] = images[d.id % images.length]
      }
    })
  }
  return data || {}
}

async function getLastestGitHubBlog() {
  return [{
    'id': 1,
    '__tablename__': 'github',
    'title': '微信公众号文章链接 GitHub 仓库指南',
    'url': 'https://github.com/ZhuPeng/mp-githubtrending/blob/master/doc/api.md',
    '_crawl_time': '2019-04-10', 
    'article-image_url': baseUrl + '/mp-githubtrending/WechatGithub.jpeg',
    }, {
      'id': 2,
      '__tablename__': 'github',
      'title': '小程序 GitHub Trending Hub 的由来',
      'url': 'https://github.com/ZhuPeng/mp-githubtrending/blob/master/doc/why.md',
      '_crawl_time': '2019-04-17',
      'article-image_url': baseUrl + '/qrcode.jpg',
    }, {
      'id': 3,
      '__tablename__': 'github',
      'title': 'HelloGitHub 分享第 36 期',
      'url': 'https://github.com/521xueweihan/HelloGitHub/blob/master/content/36/HelloGitHub36.md',
      '_crawl_time': '2019-04-18',
      'article-image_url': baseUrl + '/mp-githubtrending/blog/hello-github.jpg',
    }, {
      'id': 4,
      '__tablename__': 'github',
      'title': 'GitHub 开源项目发布雷达',
      'url': 'https://github.com/ZhuPeng/zhupeng.github.io/blob/master/_posts/github_release_radar_201903.md',
      '_crawl_time': '2019-04-19',
      'article-image_url': baseUrl + '/GitHub%E7%B2%BE%E9%80%89/radar/radar-march2019.png',
    }, {
      'id': 5,
      '__tablename__': 'github',
      'title': '阮一峰技术分享周刊第 52 期',
      'url': 'https://github.com/ruanyf/weekly/blob/master/docs/issue-52.md',
      '_crawl_time': '2019-04-21',
      'article-image_url': 'https://camo.githubusercontent.com/aab243a902a257907b613ad07c4ec3bb8d2f974f/68747470733a2f2f7777772e77616e67626173652e636f6d2f626c6f67696d672f61737365742f3230313930342f6267323031393034313930312e6a7067',
    }]
}

async function getLastest() {
  var all = []
  for (var k in BlogMap) {
    try {
      var d = await getItems(k, undefined, 2)
      all.push(...d.data)
    } catch (err) {
      console.log('getItems error:', err)
    }
  }
  all.push(...await getLastestGitHubBlog())
  all.sort(function (a, b) { return new Date(a['_crawl_time']) < new Date(b['_crawl_time']) }); 
  return {'data': all.slice(0, 6)}
}

// 云函数入口函数
exports.main = async (event, context) => {
  var { type, jobname, id } = event;
  if (type == 'lastest') {
    return await getLastest()
  }

  return await getItems(jobname, id)
}
