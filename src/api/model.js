import request from '@/utils/request'

export function pageModels(data) {
  return request({
    url: '/wf/model/pageModels',
    method: 'get',
    params: data
  })
}

export function delModel(id) {
  return request({
    url: '/wf/model//del/' + id,
    method: 'delete'
  })
}
