module.exports = {
  callFunction,
  callFunctionWithRawResponse
}

function callFunction(data, completeFunc) {
  wx.cloud.callFunction({
    name: 'githubv1',
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
    name: 'githubv1',
    data: data,
    complete: res => {
      completeFunc(res.result)
    },
  })
}