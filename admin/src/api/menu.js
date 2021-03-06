import request from '@/utils/request'

//获取所有菜单
export function getAllMenus() {
    return request({
        url: '/v1/menu/list_all',
        method: 'get'
    })
}

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

//修改菜单隐藏标识
export function updateMenuHidden(menuId, hidden) {
    return request({
        url: `/v1/menu/hidden/${menuId}?hidden=${hidden ? 1 : 0}`,
        method: 'PUT'
    })
}