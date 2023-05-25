import request from '../utils/request'

export function fileRead(data) {
  return request({
    url: '/CircularSat_LLA_Position.txt',
    method: 'post',
    baseURL: window.location.href,
    data
  })
}

