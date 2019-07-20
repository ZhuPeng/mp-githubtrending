module.exports = {
  SetHook,
}
const dbname = 'gcache'

function SetHook(octokit, db) {
  octokit.hook.after('request', async (response, options) => {
    console.log('response: ', getKey(options), response.status)
    await setCache(db, getKey(options), response)
  })

  octokit.hook.error('request', async (error, options) => {
    if (error.status === 304) {
      console.log('304 error')
      return await findInCache(db, getKey(options), error.headers.etag)
    }
    throw error
  })
  octokit.hook.wrap('request', async (request, options) => {
    // add logic before, after, catch errors or replace the request altogether
    // console.log('wrap options: ', options)
    var m = await getMeta(db, getKey(options))
    options.headers['If-None-Match'] = m.etag
    options.headers['If-Modified-Since'] = m.lastmodified
    return request(options)
  })
}

async function setCache(db, key, response) {
  var etag = response.headers.etag
  if (!etag) {return}
  if (etag.startsWith('W/')) {
    etag = etag.slice(2, etag.length)
  }
  console.log('setCache:', key, etag)
  var lastmodified = response.headers['last-modified']
  await db.collection(dbname).add({
    data: { key, etag, response, lastmodified, time: new Date()}
  }).then(res => { console.log(res) }).catch(console.error) 
}

async function getMeta(db, key) {
  var res = await db.collection(dbname).where({key}).get()
  if (res.data.length == 0) {
    return ''
  }
  return res.data[0]
}

async function findInCache(db, key, etag) {
  console.log('findInCache: ', key, etag)
  var res = await db.collection(dbname).where({ key, etag }).orderBy('time', 'desc').limit(1).get()
  if (res.data.length == 0) {
    return {}
  }
  return res.data[0].response
}

function getKey(options) {
  var key = `${options.method} ${options.url}`
  var arr = ['owner', 'repo', 'username']
  arr.map(a => {
    if (options[a]) {
      key = key.replace(':' + a, options[a])
    }
  })
  return key
}