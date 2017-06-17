import { postUsers } from 'sources'

App({
  data: {
    isLogin: false
  },
  
  onLaunch(options) {
    wx.login({
      success: this.handleLoginSuccess
    })
  },
  onShow(options) {
  
  },
  onHide() {
  
  },
  onError(msg) {
  
  },
  
  handleLoginSuccess(res) {
    postUsers(res.code)
      .then(data => {
        console.log('登陆成功')
        
        this.data.isLogin = true
      })
  }
})