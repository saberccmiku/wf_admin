<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="活动实例" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.id }}
      </template>
    </el-table-column>
    <el-table-column label="业务ID" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.businessKey }}
      </template>
    </el-table-column>
    <el-table-column label="启动节点" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.startActivityId }}
      </template>
    </el-table-column>
    <el-table-column label="创建时间" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.startTime }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { pageList } from '@/api/processInstance'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        current: 1,
        size: 10,
        tenantId: 110
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      pageList(this.listQuery).then(response => {
        this.list = response.data.records
      })
    }
  }
}
</script>
