import { normalize } from 'normalizr'

import { pictures } from 'sources/schemas'

const sourceSettings = {
  publicPath: `https://hustpic.hustonline.net/api`
}

const mapping = {
  '毕业日历相册': '毕业特辑',
  '华中大人物': '人物',
  '华中大一景': '风景',
  '故事': '故事',
  'huster看天下': '天下',
  '多年以前的岁月': '记忆',
  '物件': '物件',
  '青春huster': '青春',
}

const getSesstion = () => wx.getStorageSync('session')

const wxRequestWrapper = settings => {
  return new Promise((resolve, reject) => {
    wx.request(Object.assign(settings, {
      success(res) {
        if (res.statusCode >= 400 || res.statusCode < 200) {
          reject(res)
        }
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    }))
  })
}

// users
export const putUsers = (iv, signature, encryptedData) => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/users/`,
    method: `PUT`,
    header: {
      '3rd-session': getSesstion()
    },
    data: {
      iv,
      signature,
      encryptedData
    }
  })
}

export const postUsers = code => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/users/`,
    method: `POST`,
    data: {
      code
    }
  })
    .then(resp => {
      wx.setStorageSync('session', resp.data.session)
      
      if (resp.statusCode == '201') {
  
        return new Promise((resolve, reject) => {
          wx.getUserInfo({
            withCredentials: true,
            success(data) {
              resolve(putUsers(data.iv, data.signature, data.encryptedData))
            },
            fail(err) {
              reject(err)
            }
          })
        })
      }
    })
}

// albums
export const getAlbums = () => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/albums/`
  })
    .then(res => res.data)
    .then(data => data.map(album => Object.assign(album, {
        title: mapping[album.name]
      }))
    )
}

export const getAlbum = id => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/albums/${id}`
  })
    .then(res => res.data)
}

export const getAlbumPictures = id => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/albums/${id}/pictures`
  })
    .then(res => normalize(res.data, pictures))
}

// pictures
export const postPictureComments = (id, content) => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/pictures/${id}/comments/`,
    method: `POST`,
    header: {
      '3rd-session': getSesstion()
    },
    data: {
      content
    }
  })
    .then(res => res.data)
}

export const postPictureLikes = id => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/pictures/${id}/likes/`,
    method: `POST`,
    header: {
      '3rd-session': getSesstion()
    }
  })
}