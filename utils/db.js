const rate = require('./ratelimit.js')
module.exports = {
  getDB,
  getDoc,
  getDocWithCondition, 
}

wx.cloud.init({
  env: 'test-3c9b5e-books',
  // env: 'prod-3c9b5e',
})
const db = wx.cloud.database()

function getDB() {
  if (rate.RateLimit()) {
    return
  }
  return db
}

function getDoc(table, id, callBack) {
  getDocWithCondition(table, {_id: parseInt(id, 10)}, callBack)
}

function getDocWithCondition(table, conditions, callBack) {
  getDB().collection(table).where(conditions).get().then(res => {
    console.log("getDoc:", table, conditions, res.data[0])
    callBack(res.data[0])
  })
}
