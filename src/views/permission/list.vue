<template>
  <div class="container">
    <el-container>
      <el-aside class="left-aside">
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="tenants"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          :highlight-current="true"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main>
        <el-table :data="tableData">
          <el-table-column
            type="index"
            width="50"
          />
          <el-table-column
            prop="id"
            label="角色id"
            width="140"
          />
          <el-table-column
            prop="name"
            label="角色名称"
            width="120"
          />
          <el-table-column
            prop="procdefKey"
            label="流程定义key"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleUsers(scope.$index, scope.row)"
              >人员</el-button>
              <el-button
                type="success"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="listQuery.total>0"
          :total="listQuery.total"
          :page.sync="listQuery.current"
          :limit.sync="listQuery.size"
          @pagination="getRoles"
        />
      </el-main>

    </el-container>

    <el-dialog
      :visible.sync="dialogUsersVisible"
    >
      <template>
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix" style="height:25px">
            <div style="float:left">
              <span class="titel_font">角色操作</span>
            </div>
          </div>
          <div style="margin-left:20%;margin-top:20px;">
            <el-transfer
              v-model="selectedUsers"
              :data="users"
              filterable
              :filter-method="filterUser"
              filter-placeholder="请输入姓名"
              :titles="['待选用户', '已有用户']"
              :button-texts="['移除', '添加']"
              :props="defaultUserProps"
            />

            <el-button type="success" style="margin-left:20%;margin-top:40px;" @click="saveUsers()">保存</el-button>
            <el-button type="warning" style="margin-left:200px;margin-top:40px;" @click="resetUsers()">重置</el-button>
          </div>
        </el-card>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getTenantList } from '@/api/tenant'
import { getRoles, getAllUsers, getOtherAllUsers, saveRoleUsers } from '@/api/role'
export default {
  components: { Pagination },
  data() {
    return {
      isShowLoadding: false,
      dialogUsersVisible: false,
      listQuery: {
        total: 10,
        current: 1,
        size: 10,
        data: {
          tenantId: null,
          procdefKey: null
        }
      },
      userQuery: {
        tenantId: null,
        roleId: null
      },
      tableData: [],
      tenants: [],
      users: [],
      selectedUsers: [],
      defaultProps: {
        children: 'procdefs',
        label: 'name'
      },
      defaultUserProps: {
        key: 'phone',
        label: 'name'
      }
    }
  },
  created() {
    this.getTenantList()
    this.getOtherAllUsers()
  },
  methods: {
    getRoles() {
      getRoles(this.listQuery).then(res => {
        // console.log('res.data', res)
        this.tableData = res.data.records
        this.listQuery.total = res.data.total
        this.listQuery.current = res.data.current
        this.listQuery.size = res.data.size
      })
    },
    getTenantList() {
      getTenantList().then(res => {
        if (res.data) {
          // console.log('res.data', res.data)

          this.tenants = res.data
          // 默认加载第一个
          if (this.tenants.length > 0) {
            const tenant = res.data[0]
            if (tenant.procdefs.length > 0) {
              const procdef = tenant.procdefs[0]
              this.listQuery.data.procdefKey = procdef.id
              this.listQuery.data.tenantId = tenant.tenantId
              this.getRoles()
            }
          }
        }
        // console.log('res.data', res.data)
      })
    },
    getAllUsers() {
      getAllUsers(this.userQuery).then(res => {
        res.data.map((it, index) => {
          this.selectedUsers.splice(0, this.selectedUsers.length)
          this.selectedUsers.push(it.userId)
        })
      })
    },
    getOtherAllUsers() {
      getOtherAllUsers().then(res => {
        this.users = res.data
        this.users.push({ id: '110', phone: '110', name: '企业用户' })
      })
    },
    saveRoleUsers(actTenantUsers) {
      this.$confirm('此操作将新增流程版本,改变原来的业务需求, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.listLoading = true
        saveRoleUsers(actTenantUsers).then(res => {
          this.$notify({
            title: 'Success',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.listQuery.data.procdefKey = data.id
      this.listQuery.data.tenantId = data.tenantId
      this.getRoles()
    },
    handleEdit(index, row) {
      // console.log(index, row)
    },
    handleDelete(index, row) {
      // console.log(index, row)
    },
    handleUsers(index, row) {
      this.dialogUsersVisible = true
      this.userQuery.tenantId = row.tenantId
      this.userQuery.roleId = row.id
      this.getAllUsers()
      // console.log(index, row)
    },
    filterUser(query, item) {
      return item.name.indexOf(query) > -1
    },
    saveUsers() {
      const actTenantUsers = []
      this.users.map((item, index) => {
        this.selectedUsers.map((it, position) => {
          if (item.phone === it) {
            actTenantUsers.push({ userId: item.phone, tenantId: this.userQuery.tenantId, roleId: this.userQuery.roleId, name: item.name })
          }
        })
      })
      // this.saveRoleUsers(actTenantUsers)
      // this.dialogUsersVisible = false
      // console.log('actTenantUsers', actTenantUsers)
    }
  }
}
</script>

<style>
.left-aside {
  height: 850px;
  margin-top: 60px;
}
.container {
  height: 850px;
}
 /* 设置穿梭框的 宽高 */
 .el-transfer-panel__list {
 margin: 0;
 padding: 6px 0;
 list-style: none;
 overflow: auto;
 -webkit-box-sizing: border-box;
 box-sizing: border-box;
 }
 .el-transfer__buttons {
 display: inline-block;
 vertical-align: middle;
 padding: 0 30px;
 }
</style>

