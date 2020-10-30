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
    var cnt = await db.collection('question').count()
    var r = Math.floor(Math.random() * (cnt['total'] || 1))
    var list = await db.collection('question').orderBy('time', 'desc').limit(1).skip(r).get()
    return list.data[0]
}
