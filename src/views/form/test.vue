<template>
  <div>
    <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
      
    </fm-generate-form>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        jsonData: {"list":[{"type":"grid","icon":"icon-grid-","columns":[{"span":12,"list":[{"type":"input","icon":"icon-input","options":{"width":"100%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":false,"remoteFunc":"func_1594621992000_96391"},"name":"主键","key":"1594621992000_96391","model":"input_1594621992000_96391","rules":[{"type":"string","message":"主键格式不正确"}]}]},{"span":12,"list":[{"type":"time","icon":"icon-time","options":{"defaultValue":"","readonly":false,"disabled":false,"editable":true,"clearable":true,"placeholder":"","startPlaceholder":"","endPlaceholder":"","isRange":false,"arrowControl":true,"format":"HH:mm:ss","required":false,"width":"","remoteFunc":"func_1594622034000_63938"},"name":"日期","key":"1594622034000_63938","model":"time_1594622034000_63938","rules":[]}]},{"span":12,"list":[{"type":"input","icon":"icon-input","options":{"width":"100%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":false,"remoteFunc":"func_1594621996000_55568"},"name":"标题","key":"1594621996000_55568","model":"input_1594621996000_55568","rules":[{"type":"string","message":"标题格式不正确"}]}]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1594621978000_1899"},"name":"栅格布局","key":"1594621978000_1899","model":"grid_1594621978000_1899","rules":[]}],"config":{"labelWidth":100,"labelPosition":"right","size":"small"}},
        editData: {},
        remoteFuncs: {
          
        }
      }
    },
    methods: {
      handleSubmit () {
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
