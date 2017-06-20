import { getAlbum } from 'sources'

Page({
  data: {
    isLoading: true,
    
    id: undefined,
    name: undefined,
    pictures: undefined
  },
  refreshData() {
    getAlbum(this.data.id)
      .then(resData => {
        this.data.isLoading = false
        this.setData(Object.assign({}, this.data, resData))
        wx.setNavigationBarTitle({
          title: resData.name
        })
  
        wx.hideToast()
        wx.hideLoading()
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
  },
  onShow() {
    this.refreshData()
  },
  onShareAppMessage() {
    return {
      title: this.data.name,
      path: `${this.route}?id=${this.data.id}`
    }
  }
})