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
var data = {"status": "online", "_crawl_time": "", "__tablename__": "github"}

// 需要填写的内容
data["title"] = ""
data["article-image_url"] = ""
data["url"] = ""

db.collection('blog').orderBy('_crawl_time', 'desc').limit(1).get().then(res => { 
    var last = res.data[0]
    var d = new Date(Date.parse(last._crawl_time))
    console.log(d.toISOString())
    d.setDate(d.getDate() + 1);
    data["_crawl_time"] = d

    console.log('add blog:', data)
    db.collection('blog').add(data).then(res => { console.log(res) }).catch(console.error) 
}).catch(console.error) 
