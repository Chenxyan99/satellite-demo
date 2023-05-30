import request from '../utils/request'

export function fileRead(data) {
  return request({
    // url: '/CircularSat_LLA_Position.txt',
    url: '/Satellite 1-4_LLA.txt',
    method: 'post',
    baseURL: window.location.href,
    data
  })
}

