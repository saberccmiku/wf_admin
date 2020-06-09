import request from '@/utils/request'

// 流程模型
export function pageModels(data) {
  return request({
    url: '/wf/model/pageModels',
    method: 'get',
    params: data
  })
}

export function delModel(id) {
  return request({
    url: '/wf/model/del/' + id,
    method: 'delete'
  })
}

export function publish(id) {
  return request({
    url: '/wf/model/publish/' + id,
    method: 'put'
  })
}

// 流程定义
export function pageProcessDefinitions(data) {
  return request({
    url: '/wf/model/pageProcessDefinitions',
    method: 'get',
    params: data
  })
}

export function processPic(deploymentId) {
  return request({
    url: '/wf/model/processPic/' + deploymentId,
    method: 'get'
  })
}

