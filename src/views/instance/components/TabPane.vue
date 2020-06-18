<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="租户" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
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
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务ID" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.businessKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持续时间" width="140px" align="center">
        <template slot-scope="{row}">
          <span class="link">{{ row.durationInMillis }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定义key" width="140px" align="center">
        <template slot-scope="{row}">
          {{ row.processDefinitionKey }}
        </template>
      </el-table-column>
      <el-table-column label="租户ID" align="center" width="95">
        <template slot-scope="{row}">
          {{ row.tenantId }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tag v-if="row.endTime===null||row.endTime===''" type="success">
            运行中
          </el-tag>
          <el-tag v-if="row.endTime!=null&&row.endTime!=''" type="info">
            已结束
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleActivity(row)">
            活动
          </el-button>
          <el-button size="mini" type="success" @click="handleForm(row)">
            表单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="活动实例" :visible.sync="activityFormVisible">
      <el-image v-for="url in urls" :key="url" :src="url" lazy>
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" />
        </div>
      </el-image>
      <div class="block">
        <el-timeline>
          <el-timeline-item v-for="activity in activityList" :key="activity" :timestamp="activity.endTime" placement="top">
            <el-card>
              <h4>{{ activity.activityName }}审批</h4>
              <p>{{ activity.assignee==null||''?"无名氏": activity.assignee }} 提交于 2018/4/12 20:46</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageList, processDiagramPic, activityList } from '@/api/processInstance'
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
        '已发布': 'warning',
        '草稿': 'info',
        '运行中': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      activityList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20,
        tenantId: 110,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      urls: [],
      calendarTypeOptions: [{ key: 1, display_name: '请假' }, { key: 2, display_name: '用车' }, { key: 3, display_name: '政务' }],
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      activityFormVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      pageList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handlePublish(row) {
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleForm() {
      this.$message({
        message: '抱歉，表单功能还未开启',
        type: 'warning'
      })
    },
    handleActivity(row) {
      processDiagramPic(row.id).then(response => {
        this.urls.splice(0, this.urls.length)
        this.urls.push('data:image/png;base64,' + response.data)
        this.dialogStatus = 'create'
        this.activityFormVisible = true
        activityList(row.id).then(response => {
          this.activityList = response.data
        })
      })
    }
  }
}
</script>
