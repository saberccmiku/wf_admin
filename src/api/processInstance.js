import request from '@/utils/request'

// 实例列表分页
export function pageList(data) {
  return request({
    url: '/wf/processInstance/pageList',
    method: 'get',
    params: data
  })
}
// 高亮流程图
export function processDiagramPic(processInstanceId) {
  return request({
    url: '/wf/model/processDiagramPic/' + processInstanceId,
    method: 'get'
  })
}
// 节点活动信息
export function activityList(processInstanceId) {
  return request({
    url: '/wf/processInstance/activityList/' + processInstanceId,
    method: 'get'
  })
}

