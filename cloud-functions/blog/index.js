const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()
const db = cloud.database()
const _ = db.command
const baseUrl = 'https://7465-test-3c9b5e-1258459492.tcb.qcloud.la'
const DeltaSize = 5

const BlogMap = {
  'github': {
    'title': 'GitHub 推荐',
    'article-image_url': [baseUrl + '/mp-githubtrending/blog/github-rec.jpg']
  },
  'hackernews': {
    'title': 'Hacker News',
    'extra_params': '&fromsite=github.com',
    'article-image_url': [baseUrl + '/mp-githubtrending/blog/hackernews.jpg']
  },
  'blogcoreos': {
    'title': 'CoreOS Blog',
    'article-image_url': [baseUrl + '/mp-githubtrending/blog/coreos-blog.jpg']
  },
  'githubblog': {
    'title': 'GitHub Blog',
    'article-image_url': [
      baseUrl + '/mp-githubtrending/blog/github-blog.jpg',
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
  if (jobname in BlogMap && BlogMap[jobname].extra_params) {
    url += BlogMap[jobname].extra_params
  }
  url += '&num=' + (num || DeltaSize)
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

async function getLastestGitHubBlog(size) {
  var now = new Date()
  var list = await db.collection('blog').where({ status: 'online', '_crawl_time': _.lt(now)}).orderBy('_crawl_time', 'desc').limit(size).get()
  return list.data
}

async function getLastest() {
  var all = []
  for (var k in BlogMap) {
    if (k == 'hackernews') {continue}
    try {
      var d = await getItems(k, undefined, 2)
      all.push(...d.data)
    } catch (err) {
      console.log('getItems error:', err)
    }
  }
  all.push(...await getLastestGitHubBlog(6))
  all.sort(function (a, b) { return new Date(b['_crawl_time']) - new Date(a['_crawl_time']) });
  return {'data': all.slice(0, 6)}
}

// 云函数入口函数
exports.main = async (event, context) => {
  var { type, jobname, id, currentSize } = event;
  var num = (currentSize || 0) + DeltaSize
  if (type == 'lastest') {
    return await getLastest()
  } else if (jobname == 'github') {
    return {'data': await getLastestGitHubBlog(num)}
  } else if (jobname == 'catalog') {
    var catalog = [];
    for (var b in BlogMap) {
      var val = BlogMap[b]
      var tmp = {}
      tmp['__tablename__'] = 'catalog'
      tmp['url'] = '/pages/bloglist/bloglist?jobname=' + b
      tmp['article-image_url'] = val['article-image_url'][0]
      catalog.push(tmp);
    }
    return {'data': catalog}
  }

  return await getItems(jobname, id, num)
}
