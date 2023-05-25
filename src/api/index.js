import request from '../utils/request'

export function test(data) {
  return request({
    url: '/CircularSat_LLA_Position.txt',
    method: 'post',
    baseURL: window.location.href,
    data
  })
}

