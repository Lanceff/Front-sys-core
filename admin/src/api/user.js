import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/authenticate',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/v1/logout',
    method: 'post'
  })
}
