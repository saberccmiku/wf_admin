<template>
  <div v-if="show">
    <el-form label-position="top">
      <el-form-item v-if="data.type!='grid'" :label="$t('fm.config.widget.model')">
        <el-input v-model="data.model" />
      </el-form-item>
      <el-form-item v-if="data.type!='grid'" :label="$t('fm.config.widget.name')">
        <el-input v-model="data.name" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('width')>=0" :label="$t('fm.config.widget.width')">
        <el-input v-model="data.options.width" />
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('height')>=0" :label="$t('fm.config.widget.height')">
        <el-input v-model="data.options.height" />
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('size')>=0" :label="$t('fm.config.widget.size')">
        {{ $t('fm.config.widget.width') }} <el-input v-model.number="data.options.size.width" style="width: 90px;" type="number" />
        {{ $t('fm.config.widget.height') }} <el-input v-model.number="data.options.size.height" style="width: 90px;" type="number" />
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('placeholder')>=0 && (data.type!='time' || data.type!='date')" :label="$t('fm.config.widget.placeholder')">
        <el-input v-model="data.options.placeholder" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('inline')>=0" :label="$t('fm.config.widget.layout')">
        <el-radio-group v-model="data.options.inline">
          <el-radio-button :label="false">{{ $t('fm.config.widget.block') }}</el-radio-button>
          <el-radio-button :label="true">{{ $t('fm.config.widget.inline') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showInput')>=0" :label="$t('fm.config.widget.showInput')">
        <el-switch v-model="data.options.showInput" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('min')>=0" :label="$t('fm.config.widget.min')">
        <el-input-number v-model="data.options.min" :min="0" :max="100" :step="1" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('max')>=0" :label="$t('fm.config.widget.max')">
        <el-input-number v-model="data.options.max" :min="0" :max="100" :step="1" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('step')>=0" :label="$t('fm.config.widget.step')">
        <el-input-number v-model="data.options.step" :min="0" :max="100" :step="1" />
      </el-form-item>
      <el-form-item v-if="data.type=='select' || data.type=='imgupload'" :label="$t('fm.config.widget.multiple')">
        <el-switch v-model="data.options.multiple" @change="handleSelectMuliple" />
      </el-form-item>
      <el-form-item v-if="data.type=='select'" :label="$t('fm.config.widget.filterable')">
        <el-switch v-model="data.options.filterable" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('allowHalf')>=0" label="$t('fm.config.widget.allowHalf')">
        <el-switch
          v-model="data.options.allowHalf"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showAlpha')>=0" :label="$t('fm.config.widget.showAlpha')">
        <el-switch
          v-model="data.options.showAlpha"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showLabel')>=0" :label="$t('fm.config.widget.showLabel')">
        <el-switch
          v-model="data.options.showLabel"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('options')>=0" :label="$t('fm.config.widget.option')">
        <el-radio-group v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
          <el-radio-button :label="false">{{ $t('fm.config.widget.staticData') }}</el-radio-button>
          <el-radio-button :label="true">{{ $t('fm.config.widget.remoteData') }}</el-radio-button>
        </el-radio-group>
        <template v-if="data.options.remote">
          <div>
            <el-input v-model="data.options.remoteFunc" size="mini" style="">
              <template slot="prepend">{{ $t('fm.config.widget.remoteFunc') }}</template>
            </el-input>
            <el-input v-model="data.options.props.value" size="mini" style="">
              <template slot="prepend">{{ $t('fm.config.widget.value') }}</template>
            </el-input>
            <el-input v-model="data.options.props.label" size="mini" style="">
              <template slot="prepend">{{ $t('fm.config.widget.label') }}</template>
            </el-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <el-radio-group v-model="data.options.defaultValue">
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-radio
                    :label="item.value"
                    style="margin-right: 5px;"
                  >
                    <el-input v-model="item.value" :style="{'width': data.options.showLabel? '90px': '180px' }" size="mini" />
                    <el-input v-if="data.options.showLabel" v-model="item.label" style="width:90px;" size="mini" />
                    <!-- <input v-model="item.value"/> -->
                  </el-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars" /></i>
                  <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />

                </li>
              </draggable>

            </el-radio-group>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <el-checkbox-group v-model="data.options.defaultValue">

              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-checkbox
                    :label="item.value"
                    style="margin-right: 5px;"
                  >
                    <el-input v-model="item.value" :style="{'width': data.options.showLabel? '90px': '180px' }" size="mini" />
                    <el-input v-if="data.options.showLabel" v-model="item.label" style="width:90px;" size="mini" />
                  </el-checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars" /></i>
                  <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />

                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption">{{ $t('fm.actions.addOption') }}</el-button>
          </div>
        </template>

      </el-form-item>

      <el-form-item v-if="data.type=='cascader'" :label="$t('fm.config.widget.remoteData')">
        <div>
          <el-input v-model="data.options.remoteFunc" size="mini" style="">
            <template slot="prepend">{{ $t('fm.config.widget.remoteFunc') }}</template>
          </el-input>
          <el-input v-model="data.options.props.value" size="mini" style="">
            <template slot="prepend">{{ $t('fm.config.widget.value') }}</template>
          </el-input>
          <el-input v-model="data.options.props.label" size="mini" style="">
            <template slot="prepend">{{ $t('fm.config.widget.label') }}</template>
          </el-input>
          <el-input v-model="data.options.props.children" size="mini" style="">
            <template slot="prepend">{{ $t('fm.config.widget.childrenOption') }}</template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'textarea' || data.type == 'input' || data.type=='rate' || data.type=='color' || data.type=='switch')" :label="$t('fm.config.widget.defaultValue')">
        <el-input v-if="data.type=='textarea'" v-model="data.options.defaultValue" type="textarea" :rows="5" />
        <el-input v-if="data.type=='input'" v-model="data.options.defaultValue" />
        <el-rate v-if="data.type == 'rate'" v-model="data.options.defaultValue" style="display:inline-block;vertical-align: middle;" :max="data.options.max" :allow-half="data.options.allowHalf" />
        <el-button v-if="data.type == 'rate'" type="text" style="display:inline-block;vertical-align: middle;margin-left: 10px;" @click="data.options.defaultValue=0">{{ $t('fm.actions.clear') }}</el-button>
        <el-color-picker
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        />
        <el-switch v-if="data.type=='switch'" v-model="data.options.defaultValue" />
      </el-form-item>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <el-form-item v-if="data.type == 'date'" :label="$t('fm.config.widget.showType')">
          <el-select v-model="data.options.type">
            <el-option value="year" />
            <el-option value="month" />
            <el-option value="date" />
            <el-option value="dates" />
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime" />
            <el-option value="datetimerange" />
            <el-option value="daterange" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.type == 'time'" :label="$t('fm.config.widget.isRange')">
          <el-switch
            v-model="data.options.isRange"
          />
        </el-form-item>
        <el-form-item v-if="data.type == 'date'" :label="$t('fm.config.widget.isTimestamp')">
          <el-switch
            v-model="data.options.timestamp"
          />
        </el-form-item>
        <el-form-item v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')" :label="$t('fm.config.widget.placeholder')">
          <el-input v-model="data.options.placeholder" />
        </el-form-item>
        <el-form-item v-if="(data.options.isRange) || data.options.type=='datetimerange' || data.options.type=='daterange'" :label="$t('fm.config.widget.startPlaceholder')">
          <el-input v-model="data.options.startPlaceholder" />
        </el-form-item>
        <el-form-item v-if="data.options.isRange || data.options.type=='datetimerange' || data.options.type=='daterange'" :label="$t('fm.config.widget.endPlaceholder')">
          <el-input v-model="data.options.endPlaceholder" />
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.format')">
          <el-input v-model="data.options.format" />
        </el-form-item>
        <el-form-item v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0" :label="$t('fm.config.widget.defaultValue')">
          <el-time-picker
            v-if="!data.options.isRange"
            key="1"
            v-model="data.options.defaultValue"
            style="width: 100%;"
            :arrow-control="data.options.arrowControl"
            :value-format="data.options.format"
          />
          <el-time-picker
            v-if="data.options.isRange"
            key="2"
            v-model="data.options.defaultValue"
            style="width: 100%;"
            is-range
            :arrow-control="data.options.arrowControl"
            :value-format="data.options.format"
          />
        </el-form-item>
      </template>

      <template v-if="data.type=='imgupload'">

        <el-form-item :label="$t('fm.config.widget.limit')">
          <el-input v-model.number="data.options.length" type="number" />
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.isQiniu')">
          <el-switch v-model="data.options.isQiniu" />
        </el-form-item>
        <template v-if="data.options.isQiniu">
          <el-form-item label="Domain" :required="true">
            <el-input v-model="data.options.domain" />
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.tokenFunc')" :required="true">
            <el-input v-model="data.options.tokenFunc" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item :label="$t('fm.config.widget.imageAction')" :required="true">
            <el-input v-model="data.options.action" />
          </el-form-item>
        </template>
      </template>

      <template v-if="data.type=='blank'">
        <el-form-item :label="$t('fm.config.widget.defaultType')">
          <el-select v-model="data.options.defaultType">
            <el-option value="String" :label="$t('fm.config.widget.string')" />
            <el-option value="Object" :label="$t('fm.config.widget.object')" />
            <el-option value="Array" :label="$t('fm.config.widget.array')" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'grid'">
        <el-form-item :label="$t('fm.config.widget.gutter')">
          <el-input v-model.number="data.options.gutter" type="number" />
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.columnOption')">
          <draggable
            tag="ul"
            :list="data.columns"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.columns" :key="index">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars" /></i>
              <el-input v-model.number="item.span" :placeholder="$t('fm.config.widget.span')" size="mini" style="width: 100px;" type="number" />

              <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />

            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddColumn">{{ $t('fm.actions.addColumn') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.justify')">
          <el-select v-model="data.options.justify">
            <el-option value="start" :label="$t('fm.config.widget.justifyStart')" />
            <el-option value="end" :label="$t('fm.config.widget.justifyEnd')" />
            <el-option value="center" :label="$t('fm.config.widget.justifyCenter')" />
            <el-option value="space-around" :label="$t('fm.config.widget.justifySpaceAround')" />
            <el-option value="space-between" :label="$t('fm.config.widget.justifySpaceBetween')" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.align')">
          <el-select v-model="data.options.align">
            <el-option value="top" :label="$t('fm.config.widget.alignTop')" />
            <el-option value="middle" :label="$t('fm.config.widget.alignMiddle')" />
            <el-option value="bottom" :label="$t('fm.config.widget.alignBottom')" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type != 'grid'">
        <el-form-item :label="$t('fm.config.widget.attribute')">
          <el-checkbox v-if="Object.keys(data.options).indexOf('readonly')>=0" v-model="data.options.readonly">{{ $t('fm.config.widget.readonly') }}</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('disabled')>=0" v-model="data.options.disabled">{{ $t('fm.config.widget.disabled') }}	</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('editable')>=0" v-model="data.options.editable">{{ $t('fm.config.widget.editable') }}</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('clearable')>=0" v-model="data.options.clearable">{{ $t('fm.config.widget.clearable') }} </el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('arrowControl')>=0" v-model="data.options.arrowControl">{{ $t('fm.config.widget.arrowControl') }}</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('isDelete')>=0" v-model="data.options.isDelete">{{ $t('fm.config.widget.isDelete') }}</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('isEdit')>=0" v-model="data.options.isEdit">{{ $t('fm.config.widget.isEdit') }}</el-checkbox>

        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.validate')">
          <div v-if="Object.keys(data.options).indexOf('required')>=0">
            <el-checkbox v-model="data.options.required">{{ $t('fm.config.widget.required') }}</el-checkbox>
          </div>
          <el-select v-if="Object.keys(data.options).indexOf('dataType')>=0" v-model="data.options.dataType" size="mini">
            <el-option value="string" :label="$t('fm.config.widget.string')" />
            <el-option value="number" :label="$t('fm.config.widget.number')" />
            <el-option value="boolean" :label="$t('fm.config.widget.boolean')" />
            <el-option value="integer" :label="$t('fm.config.widget.integer')" />
            <el-option value="float" :label="$t('fm.config.widget.float')" />
            <el-option value="url" :label="$t('fm.config.widget.url')" />
            <el-option value="email" :label="$t('fm.config.widget.email')" />
            <el-option value="hex" :label="$t('fm.config.widget.hex')" />
          </el-select>

          <div v-if="Object.keys(data.options).indexOf('pattern')>=0">
            <el-input v-model.lazy="data.options.pattern" size="mini" style=" width: 240px;" :placeholder="$t('fm.config.widget.patternPlaceholder')" />
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  props: { data: { type: Object, default: null }},
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    }
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  watch: {
    'data.options.isRange': function(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue') >= 0) { this.data.options.defaultValue = '' }
        }
      }
    },
    'data.options.required': function(val) {
      this.validateRequired(val)
    },
    'data.options.dataType': function(val) {
      this.validateDataType(val)
    },
    'data.options.pattern': function(val) {
      this.valiatePattern(val)
    },
    'data.name': function(val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.valiatePattern(this.data.options.pattern)
      }
    }
  },
  methods: {
    handleOptionsRemove(index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else {
        this.data.options.options.splice(index, 1)
      }
    },
    handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: this.$t('fm.config.widget.newOption'),
          label: this.$t('fm.config.widget.newOption')
        })
      } else {
        this.data.options.options.push({
          value: this.$t('fm.config.widget.newOption')
        })
      }
    },
    handleAddColumn() {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    generateRule() {
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }
      }
    },

    validateRequired(val) {
      if (val) {
        this.validator.required = { required: true, message: `${this.data.name}${this.$t('fm.config.widget.validatorRequired')}` }
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },

    validateDataType(val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.type = { type: val, message: this.data.name + this.$t('fm.config.widget.validatorType') }
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    valiatePattern(val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = { pattern: val, message: this.data.name + this.$t('fm.config.widget.validatorPattern') }
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    }
  }
}
</script>
