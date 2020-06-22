<template>
  <div class="containerBox">
    <div id="container" />
    <el-drawer title="userTask" :visible.sync="drawer" :with-header="false">
      <el-form ref="form" :model="businessObject" label-width="80px">
        <el-form-item label="节点名称">
          <el-input v-model="businessObject.name" />
        </el-form-item>
        <el-form-item label="节点id">
          {{ businessObject.id }}
        </el-form-item>
        <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker v-model="businessObject.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker v-model="businessObject.date2" placeholder="选择时间" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="businessObject.delivery" />
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="businessObject.type">
            <el-checkbox label="美食/餐厅线上活动" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="businessObject.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input v-model="businessObject.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import camundaExtension from '../../resources/stencilset.json'
import { exportModelXml } from '@/api/model'
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
      businessObject: {}
    }
  },
  mounted() {
    this.containerEl = document.getElementById('container')
    this.bpmnModeler = new BpmnModeler({
      container: this.containerEl,
      moddleExtensions: { camunda: camundaExtension }
    })
  },
  created() {
    this.getXml()
  },
  methods: {
    getShapeById() {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      console.log(elementRegistry.get('Activity_0ozmm5p'))
    },
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
          this.getShapeById()
        }
      })
    },
    // 获取流程图中所有节点信息
    getNodeInfoList() {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      const userTaskList = elementRegistry.filter(
        (item) => item.type === 'bpmn:UserTask'
      )
      // 此时得到的userTaskList 便是流程图中所有的用户节点的集合
      console.log('这里此时得到的userTaskList')
      console.log(userTaskList)
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
              this.businessObject = this.currentElement.businessObject
              console.log(JSON.stringify(this.currentElement.businessObject))
            }
            // else if (eventType === 'element.hover') {
            //   // 鼠标滑过节点后想要做的处理
            //   console.log('鼠标经过节点啦~')
            // }
          }
        })
      })
    },
    getXml() {
      exportModelXml(this.$route.params.id).then(response => {
        this.chart = response.data
        this.showChart()
      })
    },
    onSubmit() {
      console.log('submit!')
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
