module.exports = {
  callFunction,
  callFunctionWithRawResponse
}

function callFunction(data, completeFunc) {
  wx.cloud.callFunction({
    name: 'githubv1',
    data: data,
    complete: res => {
      completeFunc(res.result.content)
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