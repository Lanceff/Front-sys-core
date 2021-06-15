import request from '@/utils/request'
//登录校验接口
export function login(data) {
  return request({
    url: '/v1/authenticate',
    method: 'post',
    data
  })
}
//获取用户信息接口
export function getInfo(userId) {
  return request({
    url: '/v1/user/' + userId,
    method: 'get'
  })
}
//退出登录接口
export function logout() {
  return request({
    url: '/v1/logout',
    method: 'post'
  })
}
//根据用户身份获取菜单接口
export function getMenus(role) {
  return request({
    url: '/v1/menu/' + role,
    method: 'get'
  })
}
