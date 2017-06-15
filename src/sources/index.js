import { normalize } from 'normalizr'

import { pictures } from 'sources/schemas'

const sourceSettings = {
  publicPath: `http://pic.hustonline.net/api`
}

const getSesstion = () => wx.getStorageSync('session')

const wxRequestWrapper = settings => {
  return new Promise((resolve, reject) => {
    wx.request(Object.assign(settings, {
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    }))
  })
}

// users
export const putUsers = (vi, signature, encryptedData) => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/users`,
    method: `PUT`,
    header: {
      '3rd-session': getSesstion()
    },
    data: {
      vi,
      signature,
      encryptedData
    }
  })
}

export const postUsers = code => {
  return wxRequestWrapper({
    url: `${sourceSettings.publicPath}/users`,
    method: `POST`,
    data: {
      code
    }
  })
    .then(resp => {
      wx.setStorageSync('session', resp.data.session)
  
      if (resp.statusCode === '201') {
        return new Promise((resolve, reject) => {
          wx.getUserInfo({
            withCredentials: true,
            success(data) {
              resolve(putUsers(data.vi, data.signature, data.encryptedData))
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
    url: `${sourceSettings.publicPath}/albums`
  })
    .then(res => res.data)
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
    url: `${sourceSettings.publicPath}/pictures/${id}/comments`,
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
    url: `${sourceSettings.publicPath}/pictures/${id}/likes`,
    method: `POST`,
    header: {
      '3rd-session': getSesstion()
    }
  })
}