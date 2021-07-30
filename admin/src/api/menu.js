import request from '@/utils/request'

//新增菜单
export function createMenu(data) {
    return request({
        url: '/v1/menu',
        method: 'post',
        data
    })
}

//修改菜单
export function updateMenu(data) {
    return request({
        url: '/v1/menu',
        method: 'PUT',
        data
    })
}
//级联删除菜单
export function deleteMenu(id) {
    return request({
        url: '/v1/menu/' + id,
        method: 'delete',
    })
}