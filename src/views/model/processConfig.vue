<template>
  <div class="containerBox">
    <div id="container" />
    <el-drawer title="userTask" :visible.sync="drawer" :with-header="false">
      <el-form ref="modelNode" :model="modelNode" label-width="auto" style="margin:20px" class="formElInput">
        <el-form-item label="节点名称">
          {{ modelNode.name }}
        </el-form-item>
        <el-form-item label="节点主键">
          {{ modelNode.id }}
        </el-form-item>
        <el-form-item label="执行角色">
          <el-popover placement="top-start" trigger="hover" :content="defaultRoleLable">
            <el-cascader slot="reference" v-model="defaultRole" class="formEl" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange" />
          </el-popover>
        </el-form-item>
        <el-form-item label="执行表单">
          <el-input
            v-model="selectedForm.name"
            class="formEl"
            placeholder="请输入内容"
            :disabled="true"
            @click.native="handleForm"
          />
          <svg-icon icon-class="excel" @click="handleFeild" />
        </el-form-item>
        <el-form-item label="周期限制">
          <el-radio-group v-model="modelNode.resource">
            <el-radio label="当天" />
            <el-radio label="两天" />
            <el-radio label="三天" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input v-model="modelNode.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveModel">保存</el-button>
          <el-button @click="drawer=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 这是表单选择的dialog -->
    <el-dialog
      :visible.sync="formVisible"
      width="50%"
      center
    >
      <h1 slot="title">
        <el-tag type="success">双击对应区域选择表单</el-tag>
      </h1>
      <el-table
        v-loading="listLoading"
        :data="formList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @row-click="handleSelect"
      >
        <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.project }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="80px">
          <template slot-scope="{row}">
            {{ row.category }}
          </template>
        </el-table-column>
        <el-table-column label="更新日期" width="230px" align="center">
          <template slot-scope="{row}">
            <span>{{ parseTime(new Date(row.createTime)) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="90px">
          <template slot-scope="{row}">
            <span>{{ row.des }}</span>
          </template>
        </el-table-column>
        <el-table-column label="租户" align="center" width="95">
          <template slot-scope="{row}">
            {{ row.tenantId }}
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleForm" />
    </el-dialog>
    <!-- 这是字段管理的dialog -->
    <el-dialog
      :visible.sync="formFieldVisible"
      width="40%"
      center
    >
      <!-- <span slot="title">
        <el-tag type="success">字段管理器</el-tag>
      </span> -->
      <el-table
        :data="selectedForm.formProperties"
        style="width: 100%"
      >
        <el-table-column
          label="字段标识"
          width="180"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="字段名称"
          width="180"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="显示/隐藏">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.readable"
              active-text="显示"
              inactive-text="隐藏"
            />
          </template>
        </el-table-column>
        <el-table-column label="只读/编辑">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.writeable"
              active-text="只读"
              inactive-text="编辑"
            />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formFieldVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormProperties">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import camundaExtension from '@/resources/stencilset.json'
import { exportProcessXmlByModelId, roleListForCascadeSelector, saveModel } from '@/api/model'
import customTranslate from '@/resources/customTranslate/customTranslate'
import { pageForm } from '@/api/form'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import {tempDetail, saveCanvas} from '@api/processConfig';
export default {
  name: 'Index',
  components: {
    Pagination
  },
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
      modelNode: {
        formKey: '',
        candidateGroups: '',
        modelId: '',
        processDefinitionKey: '',
        formProperties: ''
      },
      processConfig: {},
      fields: [],
      formFieldVisible: false,
      formVisible: false,
      formList: null,
      selectedForm: {},
      olderSelectedForm: {},
      listLoading: true,
      listQuery: {
        total: 0,
        limit: 10,
        current: 1,
        size: 10
      }
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
    this.exportProcessXmlByModelId()
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
              // 初始化阶段选择的表单
              this.selectedForm = {}
              const currentForm = this.processConfig.formMap[element.businessObject.id]
              if (currentForm) {
                this.selectedForm = this.processConfig.formMap[element.businessObject.id]
                console.log(this.processConfig.formMap)
                this.olderSelectedForm = this.selectedForm
                console.log(this.selectedForm)
              }
              this.splitBusiness2Json(element.businessObject)
              // 处理联级选择器初选值
              this.defaultRole.splice(0, this.defaultRole.length)
              this.defaultRoleLable = ''
              var roleId = this.modelNode['candidateGroups']
              for (var i = 0; i < this.options.length; i++) {
                var childrens = this.options[i].children
                for (var j = 0; j < childrens.length; j++) {
                  if (roleId === childrens[j].value) {
                    this.defaultRole = [this.options[i].value, roleId]
                    this.defaultRoleLable = this.options[i].label + '/' + childrens[j].label
                  }
                }
              }
              // 处理节点表单字段
              // const selectedFormFields = element.businessObject.extensionElements.values
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
        this.modelNode[baseArrs[i][0]] = baseArrs[i][1]
      }
      const attrs = businessObject.$attrs
      for (const key in attrs) {
        // 因为xml节点会自动在节点前缀 activiti: 和后台数据不匹配
        this.modelNode[key.replace('activiti:', '')] = attrs[key]
      }
      this.modelNode['modelId'] = this.$route.params.id
    },
    exportProcessXmlByModelId() {
      exportProcessXmlByModelId(this.$route.params.id).then(response => {
        this.processConfig = response.data
        this.chart = response.data.processXml
        this.showChart()
      })
    },
    roleListForCascadeSelector() {
      roleListForCascadeSelector().then(response => {
        this.options = response.data
      })
    },
    saveModel() {
      this.modelNode.candidateGroups = this.defaultRole[1]
      saveModel(this.modelNode).then(response => {
        this.exportProcessXmlByModelId()
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    handleChange(value) {
      console.log(value)
    },
    handleForm() {
      this.formVisible = true
      this.listLoading = true
      pageForm(this.listQuery).then(response => {
        this.formList = response.data.records
        this.listQuery.total = response.data.total
        this.listLoading = false
      })
    },
    handleSelect(row, event, column) {
      this.olderSelectedForm = this.selectedForm
      this.selectedForm = row
      this.modelNode.formKey = this.selectedForm.id
      this.formVisible = false
    },
    handleFeild() {
      // 当第表单变化时要重新加载字段信息
      if (this.olderSelectedForm.id !== this.selectedForm.id) {
        this.$confirm('表单已变更,继续操作将会覆盖表单字段的配置信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.modelNode.candidateGroups = this.defaultRole[1]
          saveModel(this.modelNode).then(response => {
            exportProcessXmlByModelId(this.$route.params.id).then(response => {
              this.processConfig = response.data
              this.chart = response.data.processXml
              this.showChart()
              this.selectedForm = response.data.formMap[this.modelNode.id]
              this.formFieldVisible = true
            })
          })
        })
      } else {
        // 当第一次选择表单未配置字段时 要去加载字段并预存
        if (this.selectedForm.formProperties === null || this.selectedForm.formProperties === '') {
          this.modelNode.candidateGroups = this.defaultRole[1]
          saveModel(this.modelNode).then(response => {
            exportProcessXmlByModelId(this.$route.params.id).then(response => {
              this.processConfig = response.data
              this.chart = response.data.processXml
              this.showChart()
              this.selectedForm = response.data.formMap[this.modelNode.id]
              this.formFieldVisible = true
            })
          })
        } else {
          this.formFieldVisible = true
        }
      }
    },
    handleFormProperties() {
      this.formFieldVisible = false
      this.modelNode.formProperties = JSON.stringify(this.selectedForm.formProperties)
      console.log(this.modelNode.formProperties)
    },
    parseTime(date) {
      return parseTime(date)
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
.formEl {
   width: 70%;
}
</style>
