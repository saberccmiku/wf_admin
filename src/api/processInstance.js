import request from '@/utils/request'

// 实例列表分页
export function pageList(data) {
  return request({
    url: '/wf/processInstance/pageList',
    method: 'get',
    params: data
  })
}
