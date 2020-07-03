import request from '@/utils/request'

export function selectPanelGroup() {
  return request({
    url: '/wf/dashboard/selectPanelGroup',
    method: 'get'
  })
}
