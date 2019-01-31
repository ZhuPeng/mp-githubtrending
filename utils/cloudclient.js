module.exports = {
  callFunction,
  callFunctionWithRawResponse
}
const version = 'githubv1'

function callFunction(data, completeFunc) {
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