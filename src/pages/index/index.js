import { getAlbums } from 'sources'

Page({
  data: {
    isLoading: true,
    swiperCurrent: 0,
    nowDate: {
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
  
    albums: undefined
  },
  refreshData() {
    getAlbums()
      .then(data => {
        let newData = Object.keys(data).map(id => {
          const album = data[id]
          const date = new Date(album.latestUpdateTime)
          
          return Object.assign({}, album, {
            date: {
              month: album.lunar ? new Date().getMonth() + 1 : date.getMonth() + 1,
              day: album.lunar ? new Date().getDate() : date.getDate()
            }
          })
        })
        
        this.setData({
          isLoading: false,
          albums: newData
        })
      })
  },
  
  onShow() {
    this.refreshData()
  },
  onShareAppMessage() {
    return {
      title: '华中大相册',
      path: `${this.route}`
    }
  },
  
  handleSwiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  }
})