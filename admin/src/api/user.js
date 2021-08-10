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
    url: '/v1/user/info',
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

export function getMenu(roles) {
  return request({
    url: '/v1/menu/list',
    method: 'get',
    params: { roles },
  })
}

export function getAllUser(query) {
  return request({
    url: '/v1/user',
    method: 'get',
    params: query
  })
}

export function forbidUser(id, status) {
  return request({
    url: `/v1/user/${id}/status/${status}`,
    method: 'put',
  })
}