import request from '@/utils/request'

export function getAllMenus() {
  return request({
    url: '/v1/menu/list_all',
    method: 'get'
  })
}
