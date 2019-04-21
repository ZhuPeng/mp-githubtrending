const cloudclient = require('./cloudclient.js')
module.exports = {
  Get,
}

function Get(url, callback, page_number, prev_data) {
  if (!page_number) {page_number = 1}
  if (!prev_data) {prev_data = []}
  var page = (page_number ? page_number : 1),
      data = (prev_data ? prev_data : []);
  url += '&page=' + page_number + '&per_page=50';
  console.log('url: ', url)
  cloudclient.callFunction({ type: 'get', path: url }, function (c) {
    if (c.items) {
      data = data.concat(c.items)
    } else {
      data = data.concat(c)
    }
    if (c.length == 50) {
      Get(url, callback, page + 1, data);
    } else {
      callback(data)
    }
  })
}