// 初始化示例
const tcb = require('tcb-admin-node');
var url = require('url')

// 初始化资源
// 云函数下不需要secretId和secretKey。
// env如果不指定将使用默认环境
const app = tcb.init({
  secretId: '',
  secretKey: '',
  env: ''
})
const db = app.database();
// jdb.collection('gcache').get().then(res => {
// j    res.data.map(m => {
// j        db.collection('gcache').where({_id: m._id}).remove().then(res => console.log(res))
// j    })
// j})

var http = require('http');

http.createServer(function (request, response) {
    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    var requestUrl = url.parse(request.url)
    var path = requestUrl.pathname
    var query = requestUrl.query
    console.log('request url:', request.url, path, query)
    response.writeHead(200, {'Content-Type': 'application/json'});
    var condition = {}
    if (query != undefined) {
        query.split('&').map(q => {
            var arr = q.split('=')
            condition[arr[0]] = arr[1]
        })
    }
    db.collection(path.slice(1)).where(condition).orderBy('_crawl_time', 'desc').limit(10).get().then(res => {
        // 发送响应数据 "Hello World"
        response.end(JSON.stringify(res));
    }) 
}).listen(8888);
        
// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
