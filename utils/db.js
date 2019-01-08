module.exports = {
  getDB: getDB,
  getDoc: getDoc
}

wx.cloud.init({
  env: 'test-3c9b5e'
})
const db = wx.cloud.database()

function getDB() {
  return db
}

function getDoc(table, id, callBack) {
  getDB().collection(table).where({ _id: parseInt(id, 10)}).get().then(res => {
    console.log("getDoc:", table, id, res.data[0])
    callBack(res.data[0])
  })
}