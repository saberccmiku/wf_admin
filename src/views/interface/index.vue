<template>
  <div class="tab-container">
    <el-tag>工作流平台常用接口</el-tag>
    <el-tag type="success">业务系统对接</el-tag>
    <el-tag type="warning">第三方框架植入</el-tag>
    <div>
      <el-button class="filter-item" style="margin-left: 10px;margin-top: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
    </div>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-loading="loading" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="请求类型" prop="requestType">
          <el-select v-model="temp.requestType" class="filter-item" placeholder="请选择">
            <el-option v-for="item in requestTypeOptions" :key="item.key" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新时间" prop="updateTime">
          <el-date-picker v-model="temp.updateTime" type="datetime" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="请求路径" prop="url">
          <el-input v-model="temp.url" placeholder="请输入内容">
            <template slot="prepend">{{ baseApi }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="服务类型" prop="serviceType">
          <el-input v-model="temp.serviceType" />
        </el-form-item>
        <el-form-item label="处理类型" prop="handleType">
          <el-select v-model="temp.handleType" class="filter-item" placeholder="请选择">
            <el-option v-for="item in handleTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="参数JSON" prop="args">
          <el-input v-model="temp.args" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="响应JSON" prop="response">
          <el-input v-model="temp.response" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input v-model="temp.des" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import { add } from '@/api/interface'

export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '全部', key: 'ALL' },
        { label: '模型', key: 'MODEL' },
        { label: '任务', key: 'TASK' },
        { label: '活动节点', key: 'ACTIVE' }
      ],
      loading: false,
      baseApi: process.env.VUE_APP_BASE_API,
      activeName: 'ALL',
      createdTimes: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      requestTypeOptions: ['POST', 'GET', 'DELETE', 'PUT'],
      handleTypeOptions: ['查询', '修改', '新增', '删除'],
      temp: {
        requestType: '',
        updateTime: new Date(),
        url: '',
        serviceType: '',
        handleType: '',
        args: '',
        response: '',
        des: ''
      },
      pvData: [],
      textMap: {
        update: '编辑接口',
        create: '新增接口'
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        updateTime: [{ type: 'date', required: true, message: 'updateTime is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    resetTemp() {
      this.temp = {
        requestType: '',
        updateTime: new Date(),
        url: '',
        serviceType: '',
        handleType: '',
        args: '',
        response: '',
        des: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.loading = true
      add(this.temp).then(response => {
        this.loading = false
        this.dialogFormVisible = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
