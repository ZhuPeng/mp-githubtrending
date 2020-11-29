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
        'algo': 8,
        'cplusplus': 1,
        'db': 6,
        'go': 23,
        'java': 1,
        'os': 14,
    }
    var total_cnt = 0
    for (k in total) {
        total_cnt += total[k]
    }
    console.log('total question cnt:', total_cnt)

    var base_url = 'https://github.com/ZhuPeng/iDayDayUP/blob/main/'
    var r = Math.floor(Math.random() * (total_cnt || 0)) + 1
    for (k in total) {
        if (r > total[k]) {
            r -= total[k]
            continue
        } 
        if (r < 10) { r = '0' + r}
        return {
          'answer_url': base_url + k + '/a' + r + '.md',
          'question_url': base_url + k + '/q' + r + '.md',
        }
    }
}
