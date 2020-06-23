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

export function processPicByProcessDefinitionId(processDefinitionId) {
  return request({
    url: '/wf/model/processPicByProcessDefinitionId/' + processDefinitionId,
    method: 'get'
  })
}

// 获取模型xml
export function exportModelXml(modelId) {
  return request({
    url: '/wf/model//exportModelXml/' + modelId,
    method: 'get'
  })
}

// 获取联级选择器的角色信息
export function roleListForCascadeSelector() {
  return request({
    url: '/wf/actTenantRoles/roleListForCascadeSelector',
    method: 'get'
  })
}

