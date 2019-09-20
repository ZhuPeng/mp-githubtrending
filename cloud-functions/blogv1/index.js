const cloud = require('wx-server-sdk')
const utils = require('common.js')
var rp = require('request-promise');
cloud.init()
const db = cloud.database()
const _ = db.command
const baseUrl = 'https://7465-test-3c9b5e-1258459492.tcb.qcloud.la'
const DeltaSize = 10

const NodeCache = require( "node-cache" );
const CACHE = new NodeCache({ stdTTL: 21600, checkperiod: 1800 });

const BlogMap = {
  'github': {
    'title': 'GitHub 推荐',
    'article-image_url': [baseUrl + '/mp-githubtrending/blog/github-rec.jpg']
  },
  'topic': {
    'title': 'GitHub 话题',
    'article-image_url': [baseUrl + '/common/github_topic.jpg']
  },
  // 'hackernews': {
  //   'title': 'Hacker News',
  //   'extra_params': '&fromsite=github.com',
  //   'article-image_url': [baseUrl + '/mp-githubtrending/blog/hackernews.jpg']
  // },
  'githubblog': {
    'title': 'GitHub Blog',
    'article-image_url': [
      baseUrl + '/mp-githubtrending/blog/github-bug.jpg',
      baseUrl + '/mp-githubtrending/blog/github-blog.jpg',
      baseUrl + '/mp-githubtrending/blog/githubblog-desk.jpg',
      'https://github.blog/wp-content/uploads/2019/05/satellite-blog-2.png?w=800',
      baseUrl + '/mp-githubtrending/blog/githubblog-glod.jpg',
      'https://github.blog/wp-content/uploads/2019/05/mona-heart-featured.png?w=800',
      'https://github.blog/wp-content/uploads/2019/03/1200x630-education.png?w=800',
      'https://github.blog/wp-content/uploads/2019/03/company-twitter.png?w=800',
      'https://github.blog/wp-content/uploads/2018/07/42895346-9f853c16-8a87-11e8-99eb-e83767ef3007.png?w=800',
      'https://github.blog/wp-content/uploads/2019/03/BlogHeaders_Aligned_POLICY_1008x602_x2.png?w=800',
    ]
  },
  'cncfblog': {
      'title': 'CNCF Blog',
      'article-image_url': [baseUrl + '/common/cncf.png']
  },
  'blogkubernetes': {
    'title': 'Kubernetes Blog',
    'article-image_url': [baseUrl + '/common/k8s.jpeg']
  },
  // 'blogcoreos': {
  //   'title': 'CoreOS Blog',
  //   'article-image_url': [baseUrl + '/mp-githubtrending/blog/coreos-blog.jpg']
  // },
}

async function getItems(jobname, id, num) {
  var key = jobname + id + num
  var cache = CACHE.get(key);
  if (cache != undefined) {
    return cache
  }

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
      // console.log('response:', response)
      return response;
    }).catch(function (err) {
      console.log('request error:', err)
    });
  var data = JSON.parse(raw)
  return data
}

async function getLastestJueJin(size) {
  var page = 0
  if (size >= 100) {
    page = Math.floor((size-1) / 100)
    size = 100
  }
  var url = 'https://short-msg-ms.juejin.im/v1/pinList/topic?uid=&device_id=&token=&src=web&topicId=5c09ea2b092dcb42c740fe73&page=' + page +'&sortType=rank&pageSize=' + size
  var data = (await get(url)).d.list
  var res = []
  data.map(function (d) {
    res.push({
      type: 'card',
      id: d.objectId,
      uid: d.uid,
      content: d.content,
      username: d.user.username,
      userAvatar: d.user.avatarLarge,
      url: d.url || utils.FindGitHubUrl(d.content),
      '_crawl_time': d.updatedAt,
      'title': d.user.company,
      'source': 'juejin',
      commentCount: d.commentCount,
      likedCount: d.likedCount,
    })
  })
  return res
}

async function getLastestTopic(owner, repo, num) {
  var d = {}
  if (owner && repo) {
    var url = 'https://github.com/' + owner + '/' + repo
    d['url'] = url
    console.log('search url:', url)
  }
  var res = await db.collection('topic').where(d).orderBy('_crawl_time', 'desc').limit(num).get()
  return res.data
}

async function existsTopic(data) {
  var res = await db.collection('topic').where(data).get()
  if (res.data.length > 0) { return true }
  return false
}

async function getIssues(owner, repo) {
  var r = await cloud.callFunction({
    name: 'githubv1',
    data: {owner, repo, ref: 'master', type: 'issues', currentSize: 0},
  })
  var res = []
  r.result.content.map(function (d) {
    var c = '**' + d.title + '**\n\n' + d.body
    res.push({
      type: 'card',
      id: d.id,
      uid: d.user.id,
      content: c,
      username: d.user.login,
      userAvatar: d.user.avatar_url,
      url: d.html_url,
      '_crawl_time': d.created_at,
      'title': d.title,
      'source': 'issue',
      commentCount: '',
      likedCount: '',
    })
  })
  return res
}

async function sync() {
  syncTopic(await getLastestJueJin(10))
  syncTopic(await getLastestV2ex(10, 'create'))
  syncTopic(await getLastestV2ex(10, 'github'))
  syncTopic(await getLastestV2ex(10, 'opensource'))
  syncTopic(await getIssues('ruanyf', 'weekly'))
  await syncTopic(await getIssues('521xueweihan', 'HelloGitHub'))
}

async function syncTopic(j) {
  for (var i=0; i<j.length; i++) {
    if (await existsTopic({ source: j[i].source, id: j[i].id })) {continue}
    var res = await db.collection('topic').add({
      data: j[i],
    })
    console.log('add topic:', j[i].source, res)
  }
}

async function getLastestV2ex(size, node) {
  if (!node) {node = 'github'}
  var url = 'https://v2ex.com/api/topics/show.json?node_name=' + node
  var data = (await get(url))
  var res = []
  data.map(function (d) {
    var c = '**' + d.title + '**\n\n' + d.content
    res.push({
      type: 'card',
      id: d.id,
      uid: d.member.id,
      content: c,
      username: d.member.username,
      userAvatar: 'https:' + d.member.avatar_large,
      url: d.url,
      // '_crawl_time': d.last_modified*1000,
      '_crawl_time': new Date().toISOString(),
      'title': d.title,
      'source': 'v2ex',
      commentCount: d.replies,
      likedCount: '',
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
  var { type, jobname, id, currentSize, options } = event;
  const wxContext = cloud.getWXContext()
  var num = (currentSize || 0) + DeltaSize
  if (event.Type != undefined && event.Type == 'Timer') {
    console.log('execute timer')
    await sync()
    return
  }
  if (type == 'lastest') {
    return await getLastest()
  } else if (type == 'addTopic') {
    event.data['uid'] = wxContext.OPENID
    if (await existsTopic({source: 'wechat', content: event.data['content'], uid: event.data['uid']})) {
      return {'status': 'error', 'errorMsg': '请不要重复提交'}
    }
    return await db.collection('topic').add({data: event.data})
  } else if (jobname == 'github') {
    return {'data': await getLastestGitHubBlog(num)}
  } else if (jobname == 'juejin') {
    return {'data': await getLastestJueJin(num)}
  } else if (jobname == 'topic') {
    return { 'data': await getLastestTopic(options.owner, options.repo, num) }
  }else if (jobname == 'v2ex') {
    return { 'data': await getLastestV2ex(num) }
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
