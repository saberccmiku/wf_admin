<template>
  <div class="app-container">
    <el-button class="filter-item" style="margin-left: 10px;margin-top: 10px;" type="primary" icon="el-icon-s-custom" @click="handleCreateRole">
      新增角色
    </el-button>
    <el-dialog v-loading="loading" :title="textMap[dialogStatus]" :visible.sync="roleFormVisible" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form ref="roleForm" :rules="roleRules" :model="roleTemp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色ID" prop="roleId">
          <el-input v-model="roleTemp.roleId" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleTemp.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="租户ID" prop="tenantId">
          <el-input v-model="roleTemp.tenantId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input v-model="roleTemp.des" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createRole():updateRole()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-button class="filter-item" style="margin-left: 10px;margin-top: 10px;" type="success" icon="el-icon-s-platform" @click="handleCreateTenant">
      新增租户
    </el-button>
    <el-dialog v-loading="loading" :title="textMap[dialogStatus]" :visible.sync="tenantFormVisible" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form ref="tenantForm" :rules="tenantRules" :model="tenantTemp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="租户ID" prop="tenantId">
          <el-input v-model="tenantTemp.tenantId" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="tenantTemp.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input v-model="tenantTemp.des" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tenantFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createTenant():updateTenant()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.actTenantRoles" style="width: 100%">
            <el-table-column label="ID" width="100">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="角色ID" width="300">
              <template slot-scope="scope">
                {{ scope.row.roleId }}
              </template>
            </el-table-column>
            <el-table-column label="角色名称">
              <template slot-scope="scope">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="用户信息">
              <template slot-scope="scope">
                <p>{{ scope.row.userNameList }}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="租户id" prop="actTenant.id" />
      <el-table-column label="租户名称" prop="actTenant.name" />
      <el-table-column label="描述" prop="actTenant.des" />
    </el-table>
  </div>
</template>

<style scope>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
import { roleList, insertRole, insertTenant } from '@/api/role'

export default {
  data() {
    return {
      tableData: [],
      dialogStatus: 'create',
      roleFormVisible: false,
      tenantFormVisible: false,
      loading: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      roleRules: {
        roleId: [{ required: true, message: 'id is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        des: [{ required: true, message: 'des is required', trigger: 'blur' }],
        tenantId: [{ required: true, message: 'tenantId is required', trigger: 'blur' }]
      },
      tenantRules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        des: [{ required: true, message: 'des is required', trigger: 'blur' }],
        tenantId: [{ required: true, message: 'tenantId is required', trigger: 'blur' }]
      },
      roleTemp: {
        roleId: '',
        name: '',
        tenantId: '',
        des: ''
      },
      tenantTemp: {
        name: '',
        tenantId: '',
        des: ''
      },
      resetTemp() {
        this.temp = {
          name: '',
          tenantId: '',
          roleId: '',
          des: ''
        }
      },
      resetTenantTemp() {
        this.tenantTemp = {
          name: '',
          tenantId: '',
          des: ''
        }
      }
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      roleList().then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    handleCreateRole() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.roleFormVisible = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    createRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          insertRole(this.roleTemp).then(response => {
            this.loading = false
            this.roleFormVisible = false
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleCreateTenant() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.tenantFormVisible = true
      this.$nextTick(() => {
        this.$refs['tenantForm'].clearValidate()
      })
    },
    createTenant() {
      this.$refs['tenantForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          insertTenant(this.tenantTemp).then(response => {
            this.loading = false
            this.tenantFormVisible = false
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
