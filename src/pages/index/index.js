import { getAlbums } from 'sources'

Page({
  data: {
    isLoading: true,
    swiperCurrent: 0,
    date: {
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
  
    albums: undefined
  },
  refreshData() {
    getAlbums()
      .then(data => {
        this.setData({
          isLoading: false,
          albums: data
        })
      })
  },
  
  onShow() {
    this.refreshData()
  },
  
  handleSwiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  }
})