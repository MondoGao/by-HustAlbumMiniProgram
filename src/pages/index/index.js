import { getAlbums } from 'sources'

Page({
  data: {
    isLoading: true,
    swiperCurrent: 0,
    nowDate: {
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
    countDown: 1,
  
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
              day: album.lunar ? new Date().getDate() : date.getDate(),
              year: album.lunar ? new Date().getFullYear() : date.getFullYear(),
            }
          })
        })
        
        this.setData({
          isLoading: false,
          albums: newData
        })
      })
  },
  
  onLoad() {
    const now = new Date()
    const baseDate  = `06-20`
    let year = now.getFullYear()
    
    if (new Date(`${year}-${baseDate}`) - now < 0) {
      year++
    }
    
    this.setData({
      countDown: Math.ceil(((new Date(`${year}-${baseDate}`) - now)/1000/60/60/24))
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