import request from '@/utils/request'

// 流程模型
export function pageModels(data) {
  return request({
    url: '/wf/model/pageModels',
    method: 'post',
    data
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

export function delProcessDefinition(deploymentId) {
  return request({
    url: '/wf/model/delProcessDefinition/deploymentId/' + deploymentId,
    method: 'delete'
  })
}

// 获取模型xml
export function exportProcessXmlByModelId(modelId) {
  return request({
    url: '/wf/model/exportProcessXmlByModelId/' + modelId,
    method: 'get'
  })
}

// 获取模型xml
export function exportProcessXmlByProcessDefinitionId(modelId) {
  return request({
    url: '/wf/model/exportProcessXmlByProcessDefinitionId/' + modelId,
    method: 'get'
  })
}

// 保存模型
export function saveModel(data) {
  return request({
    url: '/wf/model/saveModel',
    method: 'post',
    data
  })
}

// 获取联级选择器的角色信息
export function roleListForCascadeSelector() {
  return request({
    url: '/wf/actTenantRoles/roleListForCascadeSelector',
    method: 'get'
  })
}

