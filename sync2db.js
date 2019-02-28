// 初始化示例
const tcb = require('tcb-admin-node');
const sqlite3 = require('sqlite3').verbose();

// 初始化资源
// 云函数下不需要secretId和secretKey, 其他从腾讯云后台可以生成
// env如果不指定将使用默认环境(小程序开发工具可以查看 env)
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
var d = new Date();
console.log('Today is: ' + d.toLocaleString());
d.setDate(d.getDate() - 30);
console.log('30 days ago was: ' + d.toLocaleString());
db.collection('github').orderBy('_crawl_time', 'asc').limit(100).get().then(res => {
    // console.log("data:", res)
    res.data.forEach((row) => {
        var crawl = new Date(row._crawl_time);
        if (crawl < d) {
            console.log('delete: ' + row.repo + " => " + row._crawl_time)
            db.collection('github').where({
                _id: row._id
            }).remove().then(console.log).catch(console.error)
            sleep(1000)
        }
    })
})

db.collection('github').orderBy('_crawl_time', 'desc').limit(1).get().then(res => {
    console.log("data:", res)
    current = res.data[0]._crawl_time
    console.log("_crawl_time:", current)

    let sql = `SELECT * FROM python where _crawl_time > ` + "'" + current + "'";
    console.log("sql:", sql)

    sqldb.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            // row['_id'] = row.id
            delete row["id"]; 
            console.log("row:", row);
            db.collection('github').add(row).then(res => {
                console.log(res)
            }).catch(console.error)
            sleep(1000)
        });
    });
})

sqldb.each("SELECT * FROM python order by _crawl_time asc limit 3", function(err, row) {
    console.log("local: " + row.id + " " + row.repo + " " + row._crawl_time);
    var crawl = new Date(row._crawl_time);
    if (crawl < d) {
        console.log("delete local: " + row.id + " " + row.repo + " " + row._crawl_time);
        sqldb.run("delete FROM python where id='" + row.id + "'")
    }
});
