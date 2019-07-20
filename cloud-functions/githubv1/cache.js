module.exports = {
  SetHook,
}

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
    var etag = await getEtag(db, getKey(options))
    options.headers['If-None-Match'] = etag
    return request(options)
  })
}

async function setCache(db, key, response) {
  var etag = response.headers.etag
  console.log('setCache:', key, etag)
  if (!etag) {return}
  await db.collection('cache').add({
    data: {key, etag, response, time: new Date()}
  }).then(res => { console.log(res) }).catch(console.error) 
}

async function getEtag(db, key) {
  var res = await db.collection("cache").where({key}).get()
  if (res.data.length == 0) {
    return ''
  }
  return res.data[0].etag
}

async function findInCache(db, key, etag) {
  etag = 'W/' + etag
  console.log('findInCache: ', key, etag)
  var res = await db.collection("cache").where({ key, etag }).orderBy('time', 'desc').limit(1).get()
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