module.exports = {
  Get,
  Set,
}
const dbname = 'dbcache'

async function Get(db, key) {
  var res = await db.collection(dbname).where({ key }).orderBy('time', 'desc').limit(1).get()
  if (res.data.length == 0) {
    console.log('not findDBCache: ', key)
    return undefined
  }
  return res.data[0].value
}

async function Set(db, key, value) {
   await db.collection(dbname).add({
     data: { key, value, time: new Date().toISOString() }
   }).then(res => { console.log(res) }).catch(console.error)
}