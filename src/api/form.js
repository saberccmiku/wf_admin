import request from '@/utils/request'

// 保存表单JSON
export function saveForm(data) {
  return request({
    url: '/wf/actTenantForms/saveForm',
    method: 'post',
    data
  })
}

// 保存表单JSON
export function pageForm(data) {
  return request({
    url: '/wf/actTenantForms/pageForm',
    method: 'get',
    params: data
  })
}

// 删除表单JSON
export function deleteForm(id) {
  return request({
    url: '/wf/actTenantForms/' + id,
    method: 'delete'
  })
}

// 表单详情
export function detailForm(id) {
  return request({
    url: '/wf/actTenantForms/' + id,
    method: 'get'
  })
}
