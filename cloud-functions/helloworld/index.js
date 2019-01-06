exports.main = (event, context) => {
  const { userInfo, a, b } = event
  const sum = a + b

  return {
    sum
  }
}