import { getAlbumPictures, postPictureLikes, postPictureComments } from 'sources'

Page({
  data: {
    isLoading: true,
    isLogin: getApp().data.isLogin,
    checkLoginTimer: null,
    isShowCommentForm: false,
    swiperCurrent: 0,
    pictures: {},
    picIds: [],
    commentValue: '',
    
    id: undefined,
    albumId: undefined
  },
  
  refreshData() {
    return getAlbumPictures(this.data.albumId)
      .then(data => {
        wx.hideToast()
  
        this.setData({
          isLoading: false,
          swiperCurrent: data.result.indexOf(this.data.id),
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
      id: query.id,
      albumId: query.albumId
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
      path: `${this.route}?id=${this.data.id}&$albumId=${this.data.albumId}`
    }
  },
  
  stopBubble() {
  
  },
  handleSwiperChange(e) {
    const picId = this.data.pictures[this.data.picIds[e.detail.current]].id
    
    wx.updateShareMenu({
      path: `${this.route}?id=${picId}&$albumId=${this.data.albumId}`
    })
    this.setData({
      id: picId,
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
  handleCommentInput(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  handleSendCommentTap(e) {
    wx.hideKeyboard()
    wx.showLoading({
      title: '评论中...',
      mask: true
    })
    postPictureComments(this.data.id, wx.getStorageSync('session'), this.data.commentValue)
      .then(data => {
        let picture = this.data.pictures[this.data.id]
        picture.comments.push(data)
        picture.scrollIntoView = `comment-${data.id}`
        this.setData(this.data)
  
        wx.hideLoading()
      })
  },
  handleLikeTap(e) {
    postPictureLikes(this.data.id, wx.getStorageSync('session'))
      .then(() => {
        this.data.pictures[this.data.id].isLiked = !this.data.pictures[this.data.id].isLiked
        this.setData(this.data)
      })
  }
})