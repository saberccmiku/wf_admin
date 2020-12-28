import request from '@/utils/request'

// 角色列表
export function roleList(data) {
  return request({
    url: '/wf/actTenantRoles/roleList',
    method: 'get',
    params: data
  })
}

// 角色列表
export function getRoles(data) {
  return request({
    url: '/wf/actTenantRoles/getRoles',
    method: 'post',
    data
  })
}

// 角色新增
export function insertRole(data) {
  return request({
    url: '/wf/actTenantRoles/insert',
    method: 'post',
    data
  })
}
// 租户新增
export function insertTenant(data) {
  return request({
    url: '/wf/actTenants/insert',
    method: 'post',
    data
  })
}

// 流程配置的用户列表
export function getAllUsers(data) {
  return request({
    url: '/wf/actTenantUsers/getAllUsers',
    method: 'post',
    data
  })
}

// 其他系统用户列表
export function getOtherAllUsers(data) {
  return request({
    url: '/wf/actTenantUsers/getOtherAllUsers',
    method: 'post',
    data
  })
}

