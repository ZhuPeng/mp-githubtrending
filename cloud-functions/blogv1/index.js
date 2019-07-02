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
  'juejin': {
    'title': '掘金推荐',
    'article-image_url': [baseUrl + '/mp-githubtrending/blog/github-rec.jpg']
  },
  'hackernews': {
    'title': 'Hacker News',
    'extra_params': '&fromsite=github.com',
    'article-image_url': [baseUrl + '/mp-githubtrending/blog/hackernews.jpg']
  },
  'githubblog': {
    'title': 'GitHub Blog',
    'article-image_url': [
      baseUrl + '/mp-githubtrending/blog/github-blog.jpg',
      baseUrl + '/mp-githubtrending/blog/githubblog-desk.jpg',
      'https://github.blog/wp-content/uploads/2019/05/satellite-blog-2.png?w=800',
      baseUrl + '/mp-githubtrending/blog/githubblog-glod.jpg',
      baseUrl + '/mp-githubtrending/blog/github-bug.jpg',
      'https://github.blog/wp-content/uploads/2019/05/mona-heart-featured.png?w=800',
      'https://github.blog/wp-content/uploads/2019/03/1200x630-education.png?w=800',
      'https://github.blog/wp-content/uploads/2019/03/company-twitter.png?w=800',
      'https://github.blog/wp-content/uploads/2018/07/42895346-9f853c16-8a87-11e8-99eb-e83767ef3007.png?w=800',
      'https://github.blog/wp-content/uploads/2019/03/BlogHeaders_Aligned_POLICY_1008x602_x2.png?w=800',
    ]
  },
  'blogcoreos': {
    'title': 'CoreOS Blog',
    'article-image_url': [baseUrl + '/mp-githubtrending/blog/coreos-blog.jpg']
  },
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
  var data = await get(url)
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

async function get(url) {
  console.log('request url:', url)
  var raw = await rp(url).then(function (response) {
      console.log('response:', response)
      return response;
    }).catch(function (err) {
      console.log('request error:', err)
    });
  var data = JSON.parse(raw)
  return data
}

async function getLastestJueJin(size) {
  var url = 'https://short-msg-ms.juejin.im/v1/pinList/topic?uid=&device_id=&token=&src=web&topicId=5c09ea2b092dcb42c740fe73&page=0&&sortType=rank&pageSize=' + size
  var data = (await get(url)).d.list
  var res = []
  data.map(function (d) {
    res.push({
      type: 'card',
      content: d.content,
      username: d.user.username,
      userAvatar: d.user.avatarLarge,
      url: d.url,
    })
  })
  return res
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
  var result = all.slice(0, 6)
  result.push({
    url: "/pages/bloglist/bloglist?jobname=catalog",
    title: "Read More 查看更多",      
    'article-image_url': baseUrl + "/mp-githubtrending/blog/start_up.svg"
  })
  return {'data': result}
}

// 云函数入口函数
exports.main = async (event, context) => {
  var { type, jobname, id, currentSize } = event;
  var num = (currentSize || 0) + DeltaSize
  if (type == 'lastest') {
    return await getLastest()
  } else if (jobname == 'github') {
    return {'data': await getLastestGitHubBlog(num)}
  } else if (jobname == 'juejin') {
    return {'data': await getLastestJueJin(num)}
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
