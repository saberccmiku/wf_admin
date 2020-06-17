import request from '@/utils/request'

// 角色列表
export function roleList(data) {
  return request({
    url: '/wf/actTenantRoles/roleList',
    method: 'get',
    params: data
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
