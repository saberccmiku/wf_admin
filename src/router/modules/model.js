/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const modelRouter = {
  path: '/model',
  component: Layout,
  redirect: '/model/model-list',
  name: 'Table',
  meta: {
    title: '模型管理',
    icon: 'table'
  },
  children: [
    {
      path: 'model-list',
      component: () => import('@/views/model/model-list'),
      name: 'ModelList',
      meta: { title: '模型列表' }
    },
    {
      path: 'process-def',
      component: () => import('@/views/model/procdef-list'),
      name: 'ProcdefList',
      meta: { title: '流程定义' }
    }
  ]
}
export default modelRouter
