import request from '@/utils/request'

// 流程模型
export function getTenantList() {
  return request({
    url: '/wf/actTenants/getTenantList',
    method: 'get'
  })
}
