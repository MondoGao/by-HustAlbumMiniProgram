import { getAlbum } from 'sources'

Page({
  data: {
    isLoading: true,
    lastAppendTimeStamp: 0,
    hideToastTimer: null,
    scrollIntoView: '',
  
    id: undefined,
    name: undefined,
    pictures: undefined,
    picIds: [],
    
    splitNum: 20,
    end: 20,
    showingPicIds: []
  },
  refreshData() {
    getAlbum(this.data.id)
      .then(resData => {
        this.setData(Object.assign({}, this.data, resData))
        wx.setNavigationBarTitle({
          title: resData.name
        })
        
        this.appendShowingPicIds()
      })
  },
  appendShowingPicIds() {
    this.setData({
      isLoading: false,
      showingPicIds: this.data.picIds.slice(0, this.data.end)
    })
    
    if (!this.data.hideToastTimer) {
      wx.hideToast()
      wx.hideLoading()
    }
  },
  syncPicStatus(picId) {
    console.log(picId)
    const index = this.data.picIds.indexOf(picId)
    
    if (index >= this.data.end) {
      this.setData({
        end: (index + 1) % this.data.splitNum + this.data.splitNum
      })
      
      this.appendShowingPicIds()
    }
    
    this.setData({
      scrollIntoView: `pic-${picId}`
    })
  },
  
  onLoad(query) {
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
    })
    
    this.setData({
      id: query.id
    })
  
    this.refreshData()
  },
  onUnload() {
    clearTimeout(this.data.hideToastTimer)
  },
  onShareAppMessage() {
    return {
      title: this.data.name,
      path: `${this.route}?id=${this.data.id}`
    }
  },
  
  handleScrollToLower(e) {
    if (this.data.end < this.data.picIds.length && e.timeStamp - this.data.lastAppendTimeStamp > 200) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading'
      })
      
      this.setData({
        end: this.data.end + this.data.splitNum,
        lastAppendTimeStamp: e.timeStamp,
        hideToastTimer: setTimeout(() => {
          clearTimeout(this.data.hideToastTimer)
          
          wx.hideToast()
          wx.hideLoading()
        }, 300)
      })
  
      this.appendShowingPicIds()
    }
  }
})