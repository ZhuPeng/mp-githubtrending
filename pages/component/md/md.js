// pages/component/md/md.js
import Toast from '../../../third-party/vant-weapp/toast/toast';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    md: {
      type: String,
      value: ''
    },
    owner: {
      type: String,
      value: ''
    },
    repo: {
      type: String,
      value: '' 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onMDClick(e) {
      var clickurl = e.detail.currentTarget.dataset.text
      console.log("onMDClick url:", clickurl)
      if (clickurl.endsWith('.md')) {
        wx.navigateTo({
          url: '/pages/gitfile/gitfile?file=' + clickurl + '&owner=' + this.data.owner + '&repo=' + this.data.repo,
        })
      } else {
        this.copyText(clickurl)
      }
    },

    copyText(text) {
      wx.setClipboardData({
        data: text,
        success() {
          wx.hideToast()
          Toast('复制成功 ' + text)
        }
      })
    },
  }
})
