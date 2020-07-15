<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <el-aside width="250px">
          <div class="components-list">
            <template v-if="basicFields.length">
              <div class="widget-cate">{{ $t('fm.components.basic.title') }}</div>
              <draggable
                tag="ul"
                :list="basicComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="handleMove"
                @end="handleMoveEnd"
                @start="handleMoveStart"
              >
                <template v-for="(item, index) in basicComponents">
                  <li v-if="basicFields.indexOf(item.type)>=0" :key="index" class="form-edit-widget-label" :class="{'no-put': item.type == 'divider'}">
                    <a>
                      <i class="icon iconfont" :class="item.icon" />
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>
            <template v-if="advanceFields.length">
              <div class="widget-cate">{{ $t('fm.components.advance.title') }}</div>
              <draggable
                tag="ul"
                :list="advanceComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="handleMove"
                @end="handleMoveEnd"
                @start="handleMoveStart"
              >
                <template v-for="(item, index) in advanceComponents">
                  <li v-if="advanceFields.indexOf(item.type) >= 0" :key="index" class="form-edit-widget-label" :class="{'no-put': item.type == 'table'}">
                    <a>
                      <i class="icon iconfont" :class="item.icon" />
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>
            <template v-if="layoutFields.length">
              <div class="widget-cate">{{ $t('fm.components.layout.title') }}</div>
              <draggable
                tag="ul"
                :list="layoutComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="handleMove"
                @end="handleMoveEnd"
                @start="handleMoveStart"
              >
                <template v-for="(item, index) in layoutComponents">
                  <li v-if="layoutFields.indexOf(item.type) >=0" :key="index" class="form-edit-widget-label no-put">
                    <a>
                      <i class="icon iconfont" :class="item.icon" />
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

          </div>
        </el-aside>
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <slot name="action" />
            <el-button type="text" size="medium" icon="el-icon-collection" @click="handleSave">{{ $t('fm.actions.save') }}</el-button>
            <el-button v-if="upload" type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">{{ $t('fm.actions.import') }}</el-button>
            <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">{{ $t('fm.actions.clear') }}</el-button>
            <el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">{{ $t('fm.actions.preview') }}</el-button>
            <el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">{{ $t('fm.actions.json') }}</el-button>
            <el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">{{ $t('fm.actions.code') }}</el-button>
          </el-header>
          <el-main :class="{'widget-empty': widgetForm.list.length == 0}">

            <widget-form v-if="!resetJson" ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect" />
          </el-main>
        </el-container>

        <el-aside class="widget-config-container">
          <el-container>
            <el-header height="45px">
              <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">{{ $t('fm.config.widget.title') }}</div>
              <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">{{ $t('fm.config.form.title') }}</div>
            </el-header>
            <el-main class="config-content">
              <widget-config v-show="configTab=='widget'" :data="widgetFormSelect" />
              <form-config v-show="configTab=='form'" :data="widgetForm.config" />
            </el-main>
          </el-container>

        </el-aside>

        <cus-dialog
          ref="widgetPreview"
          :visible="previewVisible"
          width="1000px"
          form
          @on-close="previewVisible = false"
        >
          <generate-form v-if="previewVisible" ref="generateForm" insite="true" :data="widgetForm" :value="widgetModels" :remote="remoteFuncs" @on-change="handleDataChange">

            <template v-slot:blank="scope">
              Width <el-input v-model="scope.model.blank.width" style="width: 100px" />
              Height <el-input v-model="scope.model.blank.height" style="width: 100px" />
            </template>
          </generate-form>

          <template slot="action">
            <el-button type="primary" @click="handleTest">{{ $t('fm.actions.getData') }}</el-button>
            <el-button @click="handleReset">{{ $t('fm.actions.reset') }}</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          ref="saveJson"
          title="填写表单基本信息"
          :visible="saveVisible"
          form
          width="800px"
          @on-close="saveVisible = false"
          @on-submit="handleSaveJson"
        >
          <el-form ref="saveForm" :rules="saveFormRules" :model="saveForm" label-position="left" label-width="80px" style="width: 600px; margin-left:50px;">
            <el-form-item label="ID" prop="id" hidden>
              <el-input v-model="saveForm.id" />
            </el-form-item>
            <el-form-item label="租户ID" prop="tenantId">
              <el-input v-model="saveForm.tenantId" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="saveForm.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="分类" prop="category">
              <el-input v-model="saveForm.category" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="描述" prop="des">
              <el-input v-model="saveForm.des" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-form>
        </cus-dialog>

        <cus-dialog
          ref="uploadJson"
          :visible="uploadVisible"
          form
          width="800px"
          @on-close="uploadVisible = false"
          @on-submit="handleUploadJson"
        >
          <el-alert type="info" :title="$t('fm.description.uploadJsonInfo')" />
          <div id="uploadeditor" style="height: 400px;width: 100%;">{{ jsonEg }}</div>
        </cus-dialog>

        <cus-dialog
          ref="jsonPreview"
          :visible="jsonVisible"
          form
          width="800px"
          @on-close="jsonVisible = false"
        >

          <div id="jsoneditor" style="height: 400px;width: 100%;">{{ jsonTemplate }}</div>

          <template slot="action">
            <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">{{ $t('fm.actions.copyData') }}</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          ref="codePreview"
          :visible="codeVisible"
          width="800px"
          form
          :action="false"
          @on-close="codeVisible = false"
        >
          <!-- <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div> -->
          <el-tabs v-model="codeActiveName" type="border-card" style="box-shadow: none;">
            <el-tab-pane label="Vue Component" name="vue">
              <div id="vuecodeeditor" style="height: 500px; width: 100%;">{{ vueTemplate }}</div>
            </el-tab-pane>
            <el-tab-pane label="HTML" name="html">
              <div id="codeeditor" style="height: 500px; width: 100%;">{{ htmlTemplate }}</div>
            </el-tab-pane>
          </el-tabs>
        </cus-dialog>
      </el-container>
    </el-main>
    <el-footer height="30px" style="font-weight: 600;">Powered by <a target="_blank" href="#">天恒信息科技有限公司</a></el-footer>
  </el-container>

</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
import Clipboard from 'clipboard'
import { basicComponents, layoutComponents, advanceComponents } from './componentsConfig.js'
import generateCode from './generateCode.js'
import { saveForm, detailForm } from '@/api/form'
import { request } from './util/request.js'

export default {
  name: 'FmMakingForm',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    save: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    basicFields: {
      type: Array,
      default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text']
    },
    advanceFields: {
      type: Array,
      default: () => ['blank', 'imgupload', 'editor', 'cascader']
    },
    layoutFields: {
      type: Array,
      default: () => ['grid']
    }
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      resetJson: false,
      saveForm: {
        id: '',
        name: '',
        category: '',
        tenantId: '',
        des: '',
        json: '',
        createTime: ''
      },
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        }
      },
      saveFormRules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        category: [{ required: true, message: 'category is required', trigger: 'change' }],
        tenantId: [{ required: true, message: 'tenantId is required', trigger: 'blur' }],
        des: [{ required: true, message: 'des is required', trigger: 'blur' }]
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      saveVisible: false,
      remoteFuncs: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: '1', name: '1111' },
              { id: '2', name: '2222' },
              { id: '3', name: '3333' }
            ]

            resolve(options)
          }, 2000)
        },
        funcGetToken(resolve) {
          request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
            resolve(res.uptoken)
          })
        },
        upload_callback(response, file, fileList) {
          console.log('callback', response, file, fileList)
        }
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      vueTemplate: '',
      jsonTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
  "list": [],
  "config": {
    "labelWidth": 100,
    "labelPosition": "top",
    "size": "small"
  }
}`,
      codeActiveName: 'vue'
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function(val) {
        console.log(this.$refs.widgetForm)
      }
    },
    '$lang': function(val) {
      this._loadComponents()
    }
  },
  created() {
    if (this.$route.params.id !== null || this.$route.params.id !== '') {
      this.detailForm(this.$route.params.id)
    }
  },
  mounted() {
    this._loadComponents()
  },
  methods: {
    detailForm(id) {
      detailForm(id).then(res => {
        if (res.data != null) {
          this.saveForm = res.data
          this.widgetForm = JSON.parse(this.saveForm.json)
        }
      })
    },
    _loadComponents() {
      this.basicComponents = this.basicComponents.map(item => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`)
        }
      })
      this.advanceComponents = this.advanceComponents.map(item => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`)
        }
      })
      this.layoutComponents = this.layoutComponents.map(item => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`)
        }
      })
    },
    handleGoGithub() {
      window.location.href = 'https://github.com/GavinZhuLei/vue-form-making'
    },
    handleConfigSelect(value) {
      this.configTab = value
    },
    handleMoveEnd(evt) {
      console.log('end', evt)
    },
    handleMoveStart({ oldIndex }) {
      console.log('start', oldIndex, this.basicComponents)
    },
    handleMove() {
      return true
    },
    handlePreview() {
      console.log(this.widgetForm)
      this.previewVisible = true
    },
    handleTest() {
      this.$refs.generateForm.getData().then(data => {
        this.$alert(data, '').catch(e => {})
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    handleReset() {
      this.$refs.generateForm.reset()
    },
    handleGenerateJson() {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      // console.log(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        const editor = ace.edit('jsoneditor')
        editor.session.setMode('ace/mode/json')
        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard('.json-btn')
          this.jsonClipboard.on('success', (e) => {
            this.$message.success(this.$t('fm.message.copySuccess'))
          })
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    handleGenerateCode() {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html')
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue')
      this.$nextTick(() => {
        const editor = ace.edit('codeeditor')
        editor.session.setMode('ace/mode/html')

        const vueeditor = ace.edit('vuecodeeditor')
        vueeditor.session.setMode('ace/mode/html')
      })
    },
    handleSave() {
      this.saveVisible = true
    },
    handleSaveJson() {
      this.$refs['saveForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveVisible = true
          this.saveForm.json = JSON.stringify(this.widgetForm)
          this.saveForm.createTime = new Date()
          saveForm(this.saveForm).then(response => {
            this.loading = false
            this.saveVisible = false
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleUpload() {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.uploadEditor = ace.edit('uploadeditor')
        this.uploadEditor.session.setMode('ace/mode/json')
      })
    },
    handleUploadJson() {
      try {
        this.setJSON(JSON.parse(this.uploadEditor.getValue()))
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },
    handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: ''
        }
      }
      this.widgetFormSelect = {}
    },
    getJSON() {
      return this.widgetForm
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON(json) {
      this.widgetForm = json

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0]
      }
    },
    handleInput(val) {
      console.log(val)
      this.blank = val
    },
    handleDataChange(field, value, data) {
      console.log(field, value, data)
    }
  }
}
</script>

<style lang="scss">
.widget-empty{
  background-position: 50%;
}

</style>
