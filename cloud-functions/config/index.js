// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var miniref = {
    'book': {
      url: 'https://github.com',
      avatar_url: 'https://7465-test-3c9b5e-books-1301492295.tcb.qcloud.la/images/compress_books.logo.jpeg',
      name: '开源技术栈',
    },
    'question': {
      url: 'https://idaydayup.com',
      avatar_url: 'https://7465-test-3c9b5e-books-1301492295.tcb.qcloud.la/images/compress_up.logo.png',
      name: '全栈问答',
    },
    'topic': {
      url: 'https://opensourcetopic.com',
      avatar_url: 'https://7465-test-3c9b5e-books-1301492295.tcb.qcloud.la/images/compress_topic.logo.jpeg',
      name: '开源话题',
    },
    'test': {
      url: 'test',
      avatar_url: 'https://7465-test-3c9b5e-books-1301492295.tcb.qcloud.la/images/compress_topic.logo.jpeg',
      name: '最酷',
      appid: 'wxec6480f732fa43f1',
      navi_page: 'pages/rd/rd',
    },
  }
  return {'minirefs': [miniref['question'], miniref['topic']]}   
}