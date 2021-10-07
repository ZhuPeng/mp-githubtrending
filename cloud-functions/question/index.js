const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var { type } = event;
    if (type == '' || type == 'random') {
       return await getRandom()
    }
    return {'data': 'Not Support'}
}

async function getRandom() {
    var total = {
        'algo': {'cnt': 8, 'name': '算法'},
        'cplusplus': {'cnt': 1, 'name': 'C++'},
        'db': {'cnt': 6, 'name': '数据库'},
        'go': {'cnt': 23, 'name': 'Go'},
        'java': {'cnt': 1, 'name': 'Java'},
        'os': {'cnt': 14, 'name': '操作系统'},
        'js': {'cnt': 419, 'name': 'JavaScript'},
    }
    var total_cnt = 0
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
