<template>
  <div class="containerBox">
    <div id="container" />
    <el-drawer title="userTask" :visible.sync="drawer" :with-header="false">
      <el-form ref="form" :model="form" label-width="80px" style="margin:20px">
        <el-form-item label="节点名称">
          {{ form.name }}
        </el-form-item>
        <el-form-item label="节点主键">
          {{ form.id }}
        </el-form-item>
        <el-form-item label="执行角色">
          <el-popover placement="top-start" width="200" trigger="hover" :content="defaultRoleLable">
            <el-cascader slot="reference" v-model="defaultRole" :options="options" :props="{ expandTrigger: 'hover' }" :disabled="true" @change="handleChange" />
          </el-popover>
        </el-form-item>
        <el-form-item label="周期限制">
          <el-radio-group v-model="form.resource" :disabled="true">
            <el-radio label="当天" />
            <el-radio label="两天" />
            <el-radio label="三天" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input v-model="form.desc" type="textarea" :disabled="true" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import camundaExtension from '../../resources/stencilset.json'
import { exportProcessXmlByProcessDefinitionId, roleListForCascadeSelector } from '@/api/model'
import customTranslate from '../../resources/customTranslate/customTranslate'
// import {tempDetail, saveCanvas} from '@api/processConfig';
export default {
  name: 'Index',
  data() {
    return {
      containerEl: null,
      bpmnModeler: null,
      currentElement: {},
      // chart变量流程图xml文件数据，由于行数过多，附在了附件中，使用时，将附件整个赋值给chart即可
      chart: '',
      drawer: false,
      defaultRole: [],
      defaultRoleLable: '',
      options: [],
      form: {},
      reqModel: {}
    }
  },
  mounted() {
    var customTranslateModule = {
      translate: ['value', customTranslate]
    }
    this.containerEl = document.getElementById('container')
    this.bpmnModeler = new BpmnModeler({
      container: this.containerEl,
      additionalModules: [customTranslateModule],
      moddleExtensions: { camunda: camundaExtension }
    })
  },
  created() {
    this.exportProcessXmlByProcessDefinitionId()
    this.roleListForCascadeSelector()
  },
  methods: {
    inputChange(val) {
      const modeling = this.bpmnModeler.get('modeling')
      if (JSON.stringify(this.currentElement) === '{}') {
        this.$message.info('请保证要更改的节点处于选中状态!')
        return false
      } else {
        modeling.updateLabel(this.currentElement, val)
      }
    },
    // 流程图回显
    showChart() {
      this.bpmnModeler.importXML(this.chart, (err) => {
        if (!err) {
          this.addEventBusListener()
          this.getNodeInfoList()
        }
      })
    },
    // 获取流程图中所有节点信息
    getNodeInfoList() {
      // const elementRegistry = this.bpmnModeler.get('elementRegistry')
      // const userTaskList = elementRegistry.filter(
      //   (item) => item.type === 'bpmn:UserTask'
      // )
      // // 此时得到的userTaskList 便是流程图中所有的用户节点的集合
      // console.log('这里此时得到的userTaskList')
      // console.log(userTaskList)
    },
    addEventBusListener() {
      const eventBus = this.bpmnModeler.get('eventBus')
      // 注册节点事件，eventTypes中可以写多个事件
      const eventTypes = ['element.click', 'element.hover']
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          const { element } = e
          if (!element.parent) return
          if (!e || element.type === 'bpmn:Process') {
            return false
          } else {
            if (eventType === 'element.click') {
              // 节点点击后想要做的处理
              // 此时想要点击节点后，拿到节点实例，通过外部输入更新节点名称
              this.currentElement = element
              this.drawer = true
              this.splitBusiness2Json(element.businessObject)
              // 处理联级选择器初选值
              this.defaultRole = []
              this.defaultRoleLable = ''
              var roleId = this.form['candidateGroups']
              for (var i = 0; i < this.options.length; i++) {
                var childrens = this.options[i].children
                for (var j = 0; j < childrens.length; j++) {
                  if (roleId === childrens[j].value) {
                    this.defaultRole = [this.options[i].value, roleId]
                    this.defaultRoleLable = this.options[i].label + '/' + childrens[j].label
                  }
                }
              }
            }
            // else if (eventType === 'element.hover') {
            //   // 鼠标滑过节点后想要做的处理
            //   console.log('鼠标经过节点啦~')
            // }
          }
        })
      })
    },
    splitBusiness2Json(businessObject) {
      const baseArrs = Object.entries(businessObject)
      for (let i = 0; i < baseArrs.length; i++) {
        this.form[baseArrs[i][0]] = baseArrs[i][1]
      }
      this.form['candidateGroups'] = businessObject.$attrs['activiti:candidateGroups']
      this.form['modelId'] = this.$route.params.id
      this.reqModel = {
        modelId: this.$route.params.id,
        name: this.form.name,
        jsonXml: JSON.stringify(this.form),
        svgXml: this.chart,
        description: '测试'
      }
    },
    exportProcessXmlByProcessDefinitionId() {
      exportProcessXmlByProcessDefinitionId(this.$route.params.id).then(response => {
        this.chart = response.data
        this.showChart()
      })
    },
    roleListForCascadeSelector() {
      roleListForCascadeSelector().then(response => {
        this.options = response.data
      })
    },
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>
<style lang="scss">
    .containerBox {
        height: calc(100vh - 220px);
        position: relative;

        #container {
            height: calc(100% - 50px);
        }
    }
</style>
