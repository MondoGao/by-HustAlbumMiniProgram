import { getAlbumPictures } from 'sources'

Page({
  data: {
    isLogin: getApp().data.isLogin,
    checkLoginTimer: null,
    isShowCommentForm: false,
    swiperCurrent: 0,
    pictures: {},
    picIds: [],
    query: {}
  },
  
  refreshData() {
    return getAlbumPictures(this.data.query.albumId)
      .then(data => {
        wx.hideToast()
  
        this.setData({
          swiperCurrent: data.result.indexOf(this.data.query.id),
          picIds: data.result,
          pictures: data.entities.pictures
        })
      })
  },
  
  onLoad(query) {
    const App = getApp()
    
    wx.showLoading({
      title: '加载图片中...',
      mask: true
    })
    
    this.setData({
      query
    })
    
    if (!this.data.isLogin) {
      this.setData({
        checkLoginTimer: setInterval(() => {
          if (App.data.isLogin) {
            clearInterval(this.data.checkLoginTimer)
            
            this.setData({
              isLogin: true,
              checkLoginTimer: null
            })
          }
        }, 500)
      })
    }
  },
  onShow() {
    this.refreshData()
  },
  onShareAppMessage() {
    return {
      title: '华中大相册',
      path: `${this.route}?id=${this.data.query.id}&$albumId=${this.data.query.albumId}`
    }
  },
  
  stopBubble() {
  
  },
  handleSwiperChange(e) {
    wx.updateShareMenu({
      path: `${this.route}?id=${this.data.pictures[this.data.picIds[e.detail.current]].id}&$albumId=${this.data.query.albumId}`
    })
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  handlePicTap(e) {
    // wx.previewImage({
    //   current: e.target.dataset.src,
    //   urls: this.data.pictures.map(pic => pic.src)
    // })
  },
  handleShareTap(e) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  handleSendCommentTap(e) {
  
  },
  handleLikeTap(e) {
  
  }
})