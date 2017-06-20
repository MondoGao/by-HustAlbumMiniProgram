import { getAlbumPictures, postPictureLikes, postPictureComments } from 'sources'

const splitNum = 12

Page({
  data: {
    isLoading: true,
    isLogin: getApp().data.isLogin,
    checkLoginTimer: null,
    appendListTimers: [],
    isShowCommentForm: false,
    swiperCurrent: 0,
    pictures: {},
    picIds: [],
    showingPicIds: [],
    commentValue: '',
    tmpValue: '',
    
    isShowShare: !!wx.showShareMenu,
    
    id: undefined,
    albumId: undefined
  },
  
  loadPicPage(index) {
    this.setData({
      isLoading: true
    })
    
    const picNum = this.data.picIds.length
    let start = index - ~~(splitNum / 2)
    let end = picNum
    let swiperCurrent = 0
  
    if (start < 0) {
      start = 0
    }
  
    swiperCurrent = start < 1 ? index : index - start
    end = start + splitNum
    
    this.setData({
      showingPicIds: this.data.picIds.slice(start, end),
      swiperCurrent,
      isLoading: false
    })
    
    wx.hideLoading()
  },
  getPicIndex(picId, picIds = this.data.picIds) {
    return picIds.indexOf(+picId)
  },
  getNowPicIndex(picIds = this.data.picIds) {
    return this.getPicIndex(+this.data.id, picIds)
  },
  refreshShowingPics() {
    let nowPicIndex = this.getNowPicIndex()

    ~nowPicIndex ? this.loadPicPage(nowPicIndex) : this.loadPicPage(0)
  },
  refreshData() {
    return getAlbumPictures(this.data.albumId)
      .then(data => {
        wx.hideLoading()
        const picId = this.data.id
        
        const picData = data.result.map(picId => {
          let pic = data.entities.pictures[picId]
          let takenTime = new Date(pic.takenTime)
          
          pic.takenTime = {
            year: takenTime.getFullYear(),
            month: takenTime.getMonth() + 1,
            day: takenTime.getDate()
          }
        })
        
        this.setData({
          id: picId ? picId : data.result[0],
          isLoading: false,
          picIds: data.result,
          pictures: data.entities.pictures
        })
        
        this.refreshShowingPics()
      })
  },
  
  onLoad(query) {
    const App = getApp()
    
    this.setData({
      id: query.id,
      albumId: query.albumId
    })
    
    if (!App.data.isLogin) {
      this.setData({
        checkLoginTimer: setInterval(() => {
          if (App.data.isLogin) {
            clearInterval(this.data.checkLoginTimer)
  
            this.refreshData()
  
            this.setData({
              isLogin: true,
              checkLoginTimer: null
            })
          }
        }, 500)
      })
    } else {
      this.setData({
        isLogin: true
      })
      
      this.refreshData()
    }
  },
  onShareAppMessage() {
    return {
      title: '华中大相册',
      path: `${this.route}?id=${this.data.id}&$albumId=${this.data.albumId}`
    }
  },
  onUnload() {
    clearInterval(this.data.checkLoginTimer)
    this.data.appendListTimers.forEach(el => clearInterval(el))
  },
  
  stopBubble() {},
  handleSwiperChange(e) {
    const picId = this.data.showingPicIds[e.detail.current]
  
    wx.updateShareMenu({
      path: `${this.route}?id=${picId}&$albumId=${this.data.albumId}`
    })
    
    this.setData({
      id: picId,
      swiperCurrent: e.detail.current
    })
    
    if (e.detail.current < 1) {
      wx.showLoading({
        title: '加载上一页中...',
        mask: true
      })
      
      this.refreshShowingPics()
      
    } else if (e.detail.current > splitNum - 2) {
      wx.showLoading({
        title: '加载下一页中...',
        mask: true
      })
  
      this.refreshShowingPics()
    }
  },
  handlePicTap(e) {
    wx.previewImage({
      urls: [e.target.dataset.src]
    })
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
    if (this.data.commentValue.length > 0) {
      wx.hideKeyboard()
      wx.showLoading({
        title: '评论中...',
        mask: true
      })
      postPictureComments(this.data.id, this.data.commentValue)
        .then(data => {
          let picture = this.data.pictures[this.data.id]
      
          picture.comments.push(data)
          picture.scrollIntoView = `comment-${data.id}`
          this.data.tmpValue = ''
          this.setData(this.data)
          this.setData(this.data) // 保证滚动
      
          this.data.pictures[this.data.id].scrollIntoView = ''
          this.setData(this.data)
      
          wx.hideLoading()
        })
    } else {
      wx.showToast({
        title: '请输入评论内容哦~',
        image: `/assets/send@2x.png`
      })
    }
  },
  handleLikeTap(e) {
    let picture = this.data.pictures[this.data.id]
    
    postPictureLikes(this.data.id, !picture.liked)
      .then(() => {
        picture.liked = !picture.liked
        picture.likeTimes += picture.liked ? 1 : -1
        
        this.setData(this.data)
      })
  }
})