module.exports = {
  callFunction,
  callFunctionWithRawResponse
}
const version = 'githubv1'

function callFunction(data, completeFunc) {
  var token = wx.getStorageSync('github-token')
  if (data.type == 'post' && (token == undefined || token == '')) {
    wx.showToast({
      title: '未设置 Token',
      icon: 'error',
      duration: 6000
    })
    return
  }
  if (token) {
    data['token'] = token
  }
  wx.cloud.callFunction({
    name: version,
    data: data,
    complete: res => {
      var content = ''
      if (res.result) {
        content = res.result.content || ''
      }
      completeFunc(content)
    },
  })
}

function callFunctionWithRawResponse(data, completeFunc) {
  wx.cloud.callFunction({
    name: version,
    data: data,
    complete: res => {
      completeFunc(res.result)
    },
  })
}