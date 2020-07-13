<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-select v-model="listQuery.tenantId" placeholder="租户" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in tenants" :key="item.id" :label="item.name" :value="item.tenantId" />
      </el-select>
      <el-select v-model="listQuery.category" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in modelStatusArr" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <router-link :to="'/formManager/desigin/zh-CN'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">
          新建
        </el-button>
      </router-link>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.project }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" width="80px">
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
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="Background W" size="mini" @click="handleUpdate(row)">
            预览
          </el-button>
          <el-button size="mini" type="success" @click="handlePublish(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { pageForm, deleteForm, publish } from '@/api/form'
import { getTenantList } from '@/api/tenant'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'warning',
        0: 'info',
        2: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20
      },
      categories: [],
      tenants: [],
      modelStatusArr: { 0: '草稿', 1: '已发布', 2: '运行中' },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      downloadLoading: false
    }
  },
  created() {
    this.getTenantList()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      pageForm(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getTenantList() {
      getTenantList().then(response => {
        this.tenants = response.data
      })
    },
    handlePublish(row) {
      this.$confirm('此操作将新增流程版本,改变原来的业务需求, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.listLoading = true
        publish(row.id).then(response => {
          this.$notify({
            title: 'Success',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    handleUpdate(row) {
      window.location.href = process.env.VUE_APP_BASE_API + '/workflow/modeler.html?modelId=' + row.id
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '模型KEY', '名称', '更新日期', '描述', '版本', '类型', '租户', '状态']
        const filterVal = ['id', 'modelKey', 'name', 'createTime', 'metaInfo', 'version', 'category', 'tenantId', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    parseTime(date) {
      return parseTime(date)
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleDelete(row) {
      // if (row.status === 2) {
      //   this.$message({
      //     message: '警告，该模型有正在运行的任务，不能删除',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteForm(row.id).then(response => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    }
  }
}
</script>

<style>
  .el-dialog__body{height: 50vh;overflow: auto;}
</style>

