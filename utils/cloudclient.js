module.exports = {
  callFunction,
  callFunctionWithRawResponse
}
const version = 'githubv1'

function callFunction(data, completeFunc) {
  if (data.type == 'post' && wx.getStorageSync('github-token') == '') {
    wx.showToast({
      title: '未设置 Token',
      icon: 'error',
      duration: 6000
    })
    return
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