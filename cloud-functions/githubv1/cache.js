module.exports = {
  SetHook,
}
const dbname = 'gcache'

function SetHook(octokit, db) {
  octokit.hook.after('request', async (response, options) => {
    console.log('response: ', getKey(options), response.status)
    setCache(db, getKey(options), response)
  })

  octokit.hook.error('request', async (error, options) => {
    console.log('request got error: ', error)
    var r = await findInCache(db, getKey(options), error.headers.etag)
    if (error.status === 304) {
      console.log('304 error')
      return r
    }
    if (Object.keys(r).length != 0) {
      return r
    }
    throw error
  })
  octokit.hook.wrap('request', async (request, options) => {
    // add logic before, after, catch errors or replace the request altogether
    var m = await getMeta(db, getKey(options))
    if (m.lastmodified) {
      options.headers['If-Modified-Since'] = m.lastmodified
    } else if (m.etag) {
      options.headers['If-None-Match'] = m.etag
    }
    return request(options)
  })
}

async function setCache(db, key, response) {
  var etag = response.headers.etag
  var lastmodified = response.headers['last-modified']
  if (!etag && !lastmodified) {return}
  if (etag.startsWith('W/')) {
    etag = etag.slice(2, etag.length)
  }
  console.log('setCache:', key, etag)
  delete response.headers;
  await db.collection(dbname).add({
    data: { key, etag, response, lastmodified, time: new Date().toISOString()}
  }).then(res => { console.log(res) }).catch(console.error) 
}

async function getMeta(db, key) {
  var res = await db.collection(dbname).where({ key }).orderBy('time', 'desc').limit(1).get()
  if (res.data.length == 0) {
    return ''
  }
  return res.data[0]
}

async function findInCache(db, key, etag) {
  console.log('findInCache: ', key, etag)
  var res = await db.collection(dbname).where({key}).orderBy('time', 'desc').limit(1).get()
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