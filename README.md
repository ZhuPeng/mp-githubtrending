# 微信小程序 GitHub Trending Hub

GitHub Trending 仓库集合，以 Feed 流形式展现，能够及时查看最近更新的热门仓库，同时提供搜索、查看仓库详情等功能。欢迎通过微信 WeChat 扫码体验。

![qrcode](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/qrcode.jpg?sign=d350a14b8d342714aa7c7246cd6a41fa&t=1548588526)

## 说明
小程序中数据通过 [trackupdates](https://github.com/ZhuPeng/trackupdates) 抓取获得，并通过如下代码 [sync2db.js](sync2db.js) 同步到小程序云开发数据库。
```javascript
// 初始化示例
const tcb = require('tcb-admin-node');
const sqlite3 = require('sqlite3').verbose();

// 初始化资源
// 云函数下不需要secretId和secretKey(从腾讯云后台可以生成), env如果不指定将使用默认环境(小程序开发工具可以查看 env)
const app = tcb.init({
  secretId: '',
  secretKey: '',
  env: ''
})

let sqldb = new sqlite3.Database('/path/to/trackupdates/github.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Success connected to the database.');
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

var maxid = 0
const db = app.database();
const _ = db.command

db.collection('github').orderBy('_id', 'desc').limit(1).get().then(res => {
    console.log("data:", res)
    maxid = res.data[0]._id
    console.log("maxid:", maxid)

    let sql = `SELECT * FROM python where id > ` + maxid;
    console.log("sql:", sql)

    sqldb.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            row['_id'] = row.id
            delete row["id"];
            console.log("row:", row);
            db.collection('github').add(row).then(res => {
                console.log(res)
            }).catch(console.error)
            sleep(1000)
        });
    });
})
```
