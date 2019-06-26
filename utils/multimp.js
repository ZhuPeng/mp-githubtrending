module.exports = {
  Navi,
}

function Navi(url) {
  for (var i = 0; i < directTransform.length; i++) {
    var trans = directTransform[i]
    var urlPrefix = trans.urlPrefix
    if (!url.startsWith(urlPrefix)) {continue}
    var nickname = trans.nickname
    var to = trans.genMPUrl(trans, url)
    console.log('Navi url: ', url, ' to ', nickname, to)
    wx.navigateToMiniProgram({
      appId: trans.appid,
      path: to,
      success(res) {
        return true
      }
    })
  }
  return false
}

var directTransform = [{
    nickname: 'GitHub Trending Hub',
    appid: 'wx6204a7df95c7fb21',
    indexPage: 'pages/github/index',
    urlPrefix: 'https://github.com/',
    genMPUrl: DefaultGenMPUrl,
}, {
    nickname: 'Readhub',
    appid: 'wxd83c7f07a0b00f1b',
    urlPrefix: 'https://readhub.cn/topic',
    indexPage: 'pages/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1) { return meta.indexPage }
        // Topic URL: https://readhub.cn/topic/7NgjG2U66fX
        // Index Page: https://readhub.cn/topics
        var topicID = url.slice(meta.urlPrefix.length+idx+1, url.length)
        if (topicID == "" || topicID == "/") { return meta.indexPage }
        return 'pages/detail?id=' + topicID
    },
}, {
    nickname: '哔哩哔哩',
    appid: 'wx7564fd5313d24844',
    urlPrefix: 'https://www.bilibili.com/video/av',
    indexPage: 'pages/index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1) {return meta.indexPage }
        // pages/video/video?avid=54809781
        // https://www.bilibili.com/video/av54809781?spm_id_from=333.334.b_62696c695f67756f636875616e67.51
        var qmark = url.indexOf('?')
        var start = meta.urlPrefix.length+idx
        var id = url.slice(start, qmark!=-1&&qmark>start ? qmark : url.length)
        if (id == "" || id == "/") { return meta.indexPage }
        return 'pages/video/video?avid=' + id
    },
}, {
    nickname: '腾讯视频',
    appid: 'wxa75efa648b60994b',
    urlPrefix: 'https://v.qq.com/x/cover/',
    indexPage: 'pages/index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1) {return meta.indexPage }
        // pages/play/index.html?cid=jeds18ea11rrnbg&parentParams=
        // https://v.qq.com/x/cover/jeds18ea11rrnbg.html
        // https://v.qq.com/x/cover/5vgz1duinuar746/r00314e3n1i.html
        var arr = url.split('/')
        var id = arr[arr.length-1]
        if (id.indexOf('.html') != -1) {
            id = id.slice(0, id.indexOf('.html'))
        }
        if (id == "" || id == "/") { return meta.indexPage }
        return 'pages/play/index?parentParams=&cid=' + id
    },
}, {
    nickname: 'CSDN',
    appid: 'wx2115aba2ed1f96b9',
    urlPrefix: 'https://blog.csdn.net/',
    indexPage: 'pages/index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1 || url.indexOf('/article/details/') == -1) {return meta.indexPage }
        // pages/blog/article-detail?userName=qq_41753040&articleId=90633737&__key_=15599641012541
        // https://blog.csdn.net/qq_41753040/article/details/90633737
        var arr = url.slice(meta.urlPrefix.length, url.length).split('/')
        if (arr.length < 4) { return meta.indexPage }
        var username = arr[0]
        var id = arr[3]
        if (username == 0 || id == "" || id == "/") { return meta.indexPage }
        return 'pages/blog/article-detail?userName=' + username + '&articleId=' + id
    },
}, {
    nickname: '简书',
    appid: 'wx646159264d261dab',
    urlPrefix: 'https://www.jianshu.com/',
    indexPage: 'pages/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1 || url.indexOf('/p/') == -1) {return meta.indexPage }
        // pages/note?slug=24d22539d45a
        // https://www.jianshu.com/p/24d22539d45a
        var arr = url.slice(meta.urlPrefix.length+idx, url.length).split('/')
        if (arr.length < 2) { return meta.indexPage }
        var id = arr[1]
        if (id == "" || id == "/") { return meta.indexPage }
        return 'pages/note?slug=' + id
    },
}, {
    nickname: '知乎热榜',
    appid: 'wxeb39b10e39bf6b54',
    urlPrefix: 'https://www.zhihu.com',
    indexPage: 'pages/index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1 || url.indexOf('/question/') == -1) {return meta.indexPage }
        // https://www.zhihu.com/question/329765131
        var arr = url.split('/')
        if (arr.length < 5) { return meta.indexPage }
        var id = arr[4]
        if (id == "") { return meta.indexPage }
        return 'zhihu/question?id=' + id
    },
}, {
    nickname: '什么值得买',
    appid: 'wxeb5d1f826d7998df',
    urlPrefix: 'https://www.smzdm.com',
    indexPage: 'pages/index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1 || url.indexOf('/p/') == -1) {return meta.indexPage }
        // https://www.smzdm.com/p/14483467/
        // https://post.smzdm.com/p/ax08nrm2/ 不支持
        var arr = url.split('/')
        if (arr.length < 5) { return meta.indexPage }
        var id = arr[4]
        if (id == "") { return meta.indexPage }
        return 'pages/haojia_details/haojia_details?id=' + id
    },
}, {
    nickname: '百度网盘',
    appid: 'wxdcd3d073e47d1742',
    urlPrefix: 'https://pan.baidu.com',
    indexPage: 'pages/netdisk_index/index',
    genMPUrl: function(meta, url) {
        var idx = url.indexOf(meta.urlPrefix)
        if (idx == -1 || url.indexOf('/s/') == -1) {return meta.indexPage }
        // https://pan.baidu.com/s/10v3OUqXpkBnpurKFLI40jQ
        var arr = url.split('/')
        if (arr.length < 5) { return meta.indexPage }
        var id = arr[4]
        if (id == "") { return meta.indexPage }
        return 'pages/netdisk_share/share?scene=' + id
    },
}]

function DefaultGenMPUrl(meta, url) {
    if (url == meta.urlPrefix) {return meta.indexPage}
    return url
}