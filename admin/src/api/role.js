import request from '@/utils/request'

export function getAllRole(){
    return request({
        url: '/v1/role',
        method: 'get',
    })
}

//新增菜单
export function createRole(data) {
    return request({
        url: '/v1/role',
        method: 'post',
        data
    })
}

//修改菜单
export function updateRole(data) {
    return request({
        url: '/v1/role',
        method: 'PUT',
        data
    })
}
//级联删除菜单
export function deleteRole(id) {
    return request({
        url: '/v1/role/' + id,
        method: 'delete',
    })
}

export function getRoleMenuId(roleId) {
    return request({
        url: '/v1/roleMenu/' + roleId,
        method: 'get',
    })
}