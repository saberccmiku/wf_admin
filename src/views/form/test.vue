<template>
  <div>
    <fm-generate-form ref="generateForm" :data="jsonData" :remote="remoteFuncs" :value="editData" />
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>

<script>
import { getTenantList } from '@/api/tenant'
export default {
  data() {
    return {
      jsonData: {},
      // jsonData: {"list":[{"type":"input","icon":"icon-input","options":{"width":"100%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":false,"remoteFunc":"func_1594635958000_94573"},"name":"第一行","key":"1594635958000_94573","model":"input_1594635958000_94573","rules":[{"type":"string","message":"第一行格式不正确"}]},{"type":"input","icon":"icon-input","options":{"width":"100%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","show":true,"disabled":false,"remoteFunc":"func_1594635959000_51714"},"name":"第二行","key":"1594635959000_51714","model":"input_1594635959000_51714","rules":[{"type":"string","message":"第二行格式不正确"}]},{"type":"cascader","icon":"icon-jilianxuanze","options":{"defaultValue":[],"width":"","placeholder":"","disabled":false,"clearable":false,"remote":true,"remoteOptions":[],"props":{"value":"id","label":"name","children":"children"},"remoteFunc":"getRoles"},"name":"级联选择器","key":"1594796523000_99836","model":"cascader_1594796523000_99836","rules":[]}],"config":{"labelWidth":100,"labelPosition":"right","size":"small"}},
      editData: {},
      remoteFuncs: {
        getRoles(resolve) {
          // 级联选择器 cascader_1594796523000_99836
          // Call callback function once get the data from remote server
          getTenantList().then(res => {
            resolve(res.data)
          })
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.generateForm.getData().then(data => {
        // data check success
        // data - form data
      }).catch(e => {
        // data check failed
      })
    }
  }
}
</script>
