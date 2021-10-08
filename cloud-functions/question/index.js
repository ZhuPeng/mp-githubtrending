const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    const {OPENID} = cloud.getWXContext()
    console.log('event:', event)
    var { type } = event;
    if (type == '' || type == 'random') {
       return await getRandom()
    } else if (type == 'taglist') {
        return await getList()
    } else if (type == 'tagsetting') {
        return await tagSetting(event)
    }
    return {'data': 'Not Support'}
}

async function tagSetting(event) {
    var {tag, setvalue} = event;
    if (setvalue == false) {
        await db.collection('tagsetting').add({
            data: { tag, setvalue}
          }).then(res => { console.log(res) }).catch(console.error) 
    } else {
        await db.collection('tagsetting').where({tag}).remove()
    }
    return {status: 'success'}
}

var _total = {
    'algo': {'cnt': 8, 'name': '算法'},
    'cplusplus': {'cnt': 1, 'name': 'C++'},
    'db': {'cnt': 6, 'name': '数据库'},
    'go': {'cnt': 23, 'name': 'Go'},
    'java': {'cnt': 1, 'name': 'Java'},
    'os': {'cnt': 14, 'name': '操作系统'},
    'js': {'cnt': 419, 'name': 'JavaScript'},
}

function getTotal() {
    return JSON.parse(JSON.stringify(_total))
}

async function getList() {
    var total = getTotal()
    for (k in total) {
        total[k]['enable'] = true
    }
    var res = await db.collection('tagsetting').where({}).get()
    res.data.map(function(d) {
        total[d['tag']]['enable'] = false
    })
    return total
}

async function getRandom() {
    var total_cnt = 0
    var res = await db.collection('tagsetting').where({}).get()
    var total = getTotal();
    if (res.data.length>0) {
        res.data.map(function(d) {
            delete total[d['tag']];
        })
    }
    console.log('total:', total)
    for (k in total) {
        total_cnt += total[k]['cnt']
    }
    console.log('total question cnt:', total_cnt)

    var base_url = 'https://github.com/ZhuPeng/iDayDayUP/blob/main/'
    var r = Math.floor(Math.random() * (total_cnt || 0)) + 1
    for (k in total) {
        if (r > total[k]['cnt']) {
            r -= total[k]['cnt']
            continue
        } 
        if (r < 10) { r = '0' + r}
        return {
          'answer_url': base_url + k + '/a' + r + '.md',
          'question_url': base_url + k + '/q' + r + '.md',
          'meta': total[k],
        }
    }
}
