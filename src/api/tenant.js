import request from '@/utils/request'

// 租户列表
export function getTenantList() {
  return request({
    url: '/wf/actTenants/getTenantList',
    method: 'get'
  })
}
