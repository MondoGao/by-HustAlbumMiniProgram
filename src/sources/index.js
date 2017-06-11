import { normalize } from 'normalizr'

import { commonFetchGet } from 'sources/utils'
import { pictures, albums } from 'sources/schemas'

// users
export const putUsers = (session, encryptedData) => {
  return Promise.resolve()
}

export const postUsers = code => {
  return Promise.resolve({
    data: {
      session: 'this is a fake session'
    },
    statusCode: '201'
  })
    .then(resp => {
      wx.setStorageSync('session', resp.data.session)
  
      if (resp.statusCode === '201') {
        return new Promise((resolve, reject) => {
          wx.getUserInfo({
            withCredentials: true,
            success(data) {
              resolve(putUsers(resp.data.session, data.encryptedData))
            }
          })
        })
      }
      
      
    })
}

// albums
export const getAlbums = () => {
  return Promise.resolve([
    {
      "id": "string",
      "name": "string",
      "desc": "string",
      "coverSrc": "/assets/cover@2x.png",
      "latelyUpdateTime": "string"
    },
    {
      "id": "string",
      "name": "string",
      "desc": "string",
      "coverSrc": "/assets/cover@2x.png",
      "latelyUpdateTime": "string"
    }
  ])
    .then(data => normalize(data, albums))
}

export const getAlbum = id => {
  return Promise.resolve({
    "id": "string",
    "name": "string",
    "desc": "string",
    "coverSrc": "/statics/images/9j20-kdj9.png",
    "latelyUpdateTime": "string"
  })
}

export const getAlbumPictures = id => {
  return Promise.resolve([
    {
      id: '1',
      src: '/assets/cover@2x.png',
      desc: '我拍的照片和我本人一样苦苦的嘿嘿我拍的照片和我本人一样苦苦的嘿嘿我拍的照片和我本人一样苦苦的嘿嘿我拍的照片和我本人一样苦苦的嘿嘿',
      uploadDate: '2014-05-20',
      isLiked: false,
      likeTimes: 0,
      user: {
        id: 1,
        nickname: 'SHINAN'
      },
      comments: [
        {
          id: '11',
          commenter: {
            id: 2,
            nickname: '麦冬',
          },
          content: '还是本人比较帅',
          date: '2014-05-06'
        },
        {
          id: '12',
          commenter: {
            id: 2,
            nickname: '麦冬',
          },
          content: '还是本人比较帅',
          date: '2014-05-06'
        },
        {
          id: '13',
          commenter: {
            id: 2,
            nickname: '麦冬',
          },
          content: '还是本人比较帅',
          date: '2014-05-06'
        },
        {
          id: '17',
          commenter: {
            id: 2,
            nickname: '麦冬',
          },
          content: '还是本人比较帅',
          date: '2014-05-06'
        },
        {
          id: '14',
          commenter: {
            id: 2,
            nickname: '麦冬',
          },
          content: '还是本人比较帅',
          date: '2014-05-06'
        }
      ]
    },
      {
        id: '2',
        src: '/assets/cover@2x.png',
        desc: '我拍的照片和我本人一样苦苦的嘿嘿我拍的照片和我本人一样苦苦的嘿嘿我拍的照片和我本人一样苦苦的嘿嘿我拍的照片和我本人一样苦苦的嘿嘿',
        uploadDate: '2014-05-20',
        isLiked: false,
        likeTimes: 0,
        user: {
          id: 1,
          nickname: 'SHINAN'
        },
        comments: [
          {
            id: '1',
            commenter: {
              id: 2,
              nickname: '麦冬',
            },
            content: '还是本人比较帅',
            date: '2014-05-06'
          },
          {
            id: '2',
            commenter: {
              id: 2,
              nickname: '麦冬',
            },
            content: '还是本人比较帅',
            date: '2014-05-06'
          },
          {
            id: '3',
            commenter: {
              id: 2,
              nickname: '麦冬',
            },
            content: '还是本人比较帅',
            date: '2014-05-06'
          },
          {
            id: '4',
            commenter: {
              id: 2,
              nickname: '麦冬',
            },
            content: '还是本人比较帅',
            date: '2014-05-06'
          },
          {
            id: '5',
            commenter: {
              id: 2,
              nickname: '麦冬',
            },
            content: '还是本人比较帅',
            date: '2014-05-06'
          },
          {
            id: '6',
            commenter: {
              id: 2,
              nickname: '麦冬',
            },
            content: '还是本人比较帅',
            date: '2014-05-06'
          },
          {
            id: '7',
            commenter: {
              id: 2,
              nickname: '麦冬',
            },
            content: '还是本人比较帅',
            date: '2014-05-06'
          }
        ]
      }
  ])
    .then(data => normalize(data, pictures))
}

// pictures
export const postPictureComments = (id, session, content) => {
  return Promise.resolve({
    id: '111',
    commenter: {
      id: '111',
      nickname: '麦冬'
    },
    content,
    date: '2017-01-12'
  })
}

export const postPictureLikes = (id, session) => {
  return Promise.resolve()
}