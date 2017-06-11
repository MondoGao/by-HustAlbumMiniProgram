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
      .then(data => {
        this.data.isLoading = false
        this.setData(Object.assign({}, this.data, data))
      })
  },
  
  onLoad(query) {
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