/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const modelRouter = {
  path: '/model',
  component: Layout,
  redirect: '/model/model-list',
  name: 'Table',
  meta: {
    title: '模型管理',
    icon: 'tree'
  },
  children: [
    {
      path: 'model-list',
      component: () => import('@/views/model/model-list'),
      name: 'ModelList',
      meta: { title: '模型列表', icon: 'list' }
    },
    {
      path: 'process-def',
      component: () => import('@/views/model/procdef-list'),
      name: 'ProcdefList',
      meta: { title: '流程定义', icon: 'tree-table' }
    },
    {
      path: 'processDesign/:id(\\d+)',
      component: () => import('@/views/model/processDesign'),
      name: 'processDesign',
      meta: { title: '流程设计', icon: 'tree-table' }
    },
    {
      path: 'processConfig/:id(\\d+)',
      component: () => import('@/views/model/processConfig'),
      name: 'processConfig',
      meta: { title: '流程配置', icon: 'tree-table', hidden: true }
    }
  ]
}
export default modelRouter
