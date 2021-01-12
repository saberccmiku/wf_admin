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
      // jsonData: {},
      jsonData: { 'list': [{ 'type': 'grid', 'icon': 'icon-grid-', 'columns': [{ 'span': 12, 'list': [{ 'type': 'input', 'icon': 'icon-input', 'options': { 'width': '100%', 'defaultValue': '', 'required': false, 'dataType': 'string', 'pattern': '', 'placeholder': '', 'disabled': true, 'show': true, 'remoteFunc': 'func_1594802034000_47298' }, 'name': '主键', 'key': '1594802034000_47298', 'model': 'id', 'rules': [{ 'type': 'string', 'message': '主键格式不正确' }] }] }, { 'span': 12, 'list': [{ 'type': 'input', 'icon': 'icon-input', 'options': { 'width': '100%', 'defaultValue': '', 'required': false, 'dataType': 'string', 'pattern': '', 'placeholder': '', 'disabled': false, 'show': true, 'remoteFunc': 'func_1594802044000_29918' }, 'name': '标题', 'key': '1594802044000_29918', 'model': 'title', 'rules': [{ 'type': 'string', 'message': '标题格式不正确' }] }] }, { 'span': 12, 'list': [{ 'type': 'date', 'icon': 'icon-date', 'options': { 'defaultValue': '', 'readonly': false, 'disabled': false, 'show': true, 'editable': true, 'clearable': true, 'placeholder': '', 'startPlaceholder': '', 'endPlaceholder': '', 'type': 'date', 'format': 'yyyy-MM-dd', 'timestamp': false, 'required': false, 'width': '', 'remoteFunc': 'func_1594802300000_53861' }, 'name': '开始时间', 'key': '1594802300000_53861', 'model': 'startTime', 'rules': [] }] }], 'options': { 'gutter': 0, 'justify': 'start', 'align': 'top', 'remoteFunc': 'func_1594802032000_38005' }, 'name': '栅格布局', 'key': '1594802032000_38005', 'model': 'grid_1594802032000_38005', 'rules': [] }, { 'type': 'radio', 'icon': 'icon-radio-active', 'options': { 'inline': true, 'defaultValue': '', 'showLabel': false, 'options': [{ 'value': '病假', 'label': 'Option 1' }, { 'value': '事假', 'label': 'Option 2' }, { 'value': '调休', 'label': 'Option 3' }, { 'value': '年休' }, { 'value': '其他' }], 'required': true, 'width': '', 'remote': false, 'remoteOptions': [], 'props': { 'value': 'value', 'label': 'label' }, 'remoteFunc': 'func_1594802178000_49340', 'disabled': false, 'show': true }, 'name': '假期类型', 'key': '1594802178000_49340', 'model': 'leaveType', 'rules': [{ 'required': true, 'message': '假期类型必须填写' }] }, { 'type': 'textarea', 'icon': 'icon-diy-com-textarea', 'options': { 'width': '100%', 'defaultValue': '', 'required': false, 'disabled': false, 'show': true, 'pattern': '', 'placeholder': '', 'remoteFunc': 'func_1594802341000_5801' }, 'name': '备注', 'key': '1594802341000_5801', 'model': 'remark', 'rules': [] }, { 'type': 'imgupload', 'icon': 'icon-tupian', 'options': { 'defaultValue': [], 'size': { 'width': 100, 'height': 100 }, 'width': '', 'tokenFunc': 'funcGetToken', 'token': '', 'domain': 'http://pfp81ptt6.bkt.clouddn.com/', 'disabled': false, 'show': false, 'length': 8, 'multiple': false, 'isQiniu': false, 'isDelete': false, 'min': 0, 'isEdit': false, 'action': 'https://jsonplaceholder.typicode.com/photos/', 'remoteFunc': 'func_1594802354000_12815' }, 'name': '附件', 'key': '1594802354000_12815', 'model': 'img', 'rules': [] }], 'config': { 'labelWidth': 100, 'labelPosition': 'right', 'size': 'small' }},
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
