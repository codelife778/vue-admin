import request from '@/utils/request'

/* 获取管理用户列表 */
function findUsersByfindAllRolesPage() {
    return request({
        url: '/admin/sysAuth/role/findAllRoles'

    })
}

/* 删除角色 */
function removeUser(id) {
    return request({
        url: `/admin/sysAuth/role/removeRole/${id}`,
        method: 'delete'

    })
}

/* 新增角色 */
function saveUserRoles(data) {
    return request({
        url: '/admin/sysAuth/user/saveUserRoles',
        method: 'post',
        data
    })
}

/* 修改角色和权限 */
function updateUserRoles(data) {
    return request({
        url: '/admin/sysAuth/role/updateRolePermissions',
        method: 'put',
        data
    })
}

/* 获取角色明细 */
function findRolePermissions(id) {
    return request({
        url: `/admin/sysAuth/role/findRolePermissions/${id}`
    })
}

/* 查询所有菜单权限 */
function findAllPermissions() {
    return request({
        url: '/admin/sysAuth/permission/findAllPermissions'
    })
}

export default {
    findUsersByfindAllRolesPage,
    removeUser,
    saveUserRoles,
    updateUserRoles,
    findRolePermissions,
    findAllPermissions
}
