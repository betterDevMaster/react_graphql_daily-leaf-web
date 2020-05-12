import request from 'superagent'
import server from './server'
// const token = window.localStorage.getItem('DailyLeaf::AdminToken')

export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    let upload = request.post(`${server.url}/upload`)
      .field('image', file)
    upload.end((err, response) => {
      if (err) {
        return reject(err)
      }
      if (response.body.versions.length > 0) {
        resolve(response.body.versions[0].url)
      } else {
        resolve('')
      }
    })
  })
}
