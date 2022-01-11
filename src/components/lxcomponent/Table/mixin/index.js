
export default {
  props: {
    // 获取行中数据的时候，有时候数据可能会在 对象里放着，
    // 这时候把对象的 key 传过来
    scopeKey: {
      type: String,
      default: ''
    },
    // 禁用的 key 一般不用
    rowDisableKey: {
      type: String,
      default: 'rowDisabled'
    },
    // 表格数据
    data: {
      type: Array,
      require: true,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      require: true,
      default: () => {
        return []
      }
    },
    // 表格为空时展示的提示
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: false
    },
    // 分页信息
    pagination: {
      type: Object,
      default: () => {
        return {}
      }
    },
    height: {
      type: String,
      default: () => '100%'
    },
    maxHeight: {
      type: String,
      default: () => '100%'
    },
    rowKey: {
      type: String,
      default: () => ''
    },
    loading: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    border: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    tableKey: {
      type: Number,
      default: () => {
        return Math.random()
      }
    },
    loadingText: {
      type: String,
      default: () => ''
    },
    disableFalg: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    radioSelect: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    radioKey: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      radioValue: '',
      radioValueInfo: {}
    }
  },
  computed: {
    combinePagination() {
      const pagination = this.pagination || {}
      return {
        currentPage: pagination.page || 1,
        pageSizes: pagination.pageSizes || [10, 20, 50, 100, 150, 200],
        pageSize: pagination.pageSize || 20,
        total: pagination.total || 0,
        layout: pagination.layout || 'total, sizes, prev, pager, next, jumper'
      }
    }
  },
  methods: {
    // 控制下拉框显示span
    getShowSpan(col = {}, scope) {
      const span = this.getAttr(col, 'span', {})
      const row = this.getRow(scope)
      const show = span.show
      const key = span.key
      const value = span.value
      return show && row[key] === value
    },

    // 存在行icon
    hasIcon(col = {}, scope) {
      const iconObj = col.icon || {}
      const row = this.getRow(scope)
      const show = iconObj.show
      const key = iconObj.key
      const value = iconObj.value
      return show && row[key] === value
    },

    // 根据行判断显示span获取span内容
    getShowSpanContent(col = {}, scope) {
      const span = this.getAttr(col, 'span', {})
      return span.content
    },

    // 控制显示列className
    // row[key] = value的情况下显示col.class的className
    // 如果没有则显示默认的className
    getColumnClass(col, scope) {
      const that = this
      const row = that.getRow(scope)
      const classObj = col.class || {}
      const className = col.className || ''
      if (classObj) {
        const { key, value, className } = classObj
        return row[key] === value ? className : ''
      } else {
        return className
      }
    },

    //  获取form item 绑定的 prop
    getProp(col, scope) {
      const scopeKey = this.scopeKey
      if (scopeKey) {
        return 'data.' + scope.$index + '.' + scopeKey + '.' + this.getAttr(col, 'primaryKey')
      } else {
        return 'data.' + scope.$index + '.' + this.getAttr(col, 'primaryKey')
      }
    },

    //  获取row
    getRow(scope) {
      const scopeKey = this.scopeKey
      return scopeKey ? scope.row[scopeKey] : scope.row
    },

    //  判断组件类型
    isType(col = {}, key = '', expectedType = '') {
      return col[key] === expectedType
    },

    getOptAttr(field = {}, key = '', def = '', scope) {
      const optionsKey = field.optionsKey || ''
      if (!optionsKey) {
        return this.getAttr(field, 'options', [])
      } else {
        const options = scope.row[optionsKey]
        return options
      }
    },

    //  获取组件属性
    getAttr(col = {}, key = '', def = '', scope) {
      if (key === 'disabled') {
        if (this.disableFalg) {
          return col[key]
        }
        return scope && scope.row['disabledKeys'] ? scope.row['disabledKeys'].includes(col.primaryKey) : col[key] || def
      } else if (key === 'nativeType') {
        return scope && scope.row['nativeType'] ? scope.row['nativeType'] : col[key] || def
      } else if (key === 'classShowKey') {
        if (col[key]) {
          return scope.row[col[key]] ? 'distinguishColor' : ''
        }
        return ''
      } else if (key === 'titleShowKey') {
        return scope.row[col[key]]
      } else {
        return col[key] === false ? col[key] : col[key] || def
      }
    },

    //  获取组件 value
    getValue(col = {}, scope, def = '', type) {
      const colCode = col.primaryKey
      const row = this.getRow(scope)
      return row[colCode] === 0 ? 0 : (row[colCode] || def)
    },

    // 获取树形下拉框的值
    getTreeValue(col = {}, scope, def = '') {
      const colCode = col[def]
      const row = this.getRow(scope)
      return row[colCode]
    },

    //  获取校验
    getRules(rules = [], scope) {
      return rules.map(rule => {
        if (typeof rule.validator === 'function') {
          return {
            ...rule,
            validator: (fieldRule, value, cb) => {
              rule.validator(value, scope, cb, this.data)
            }
          }
        } else {
          return rule
        }
      })
    },

    rowClickAble(scope) {
      return !!scope.row[this.rowDisableKey]
    },

    //  获取事件
    getEvent(obj = {}, key, name) {
      return (obj[key] || {})[name] || null
    },

    //  调用col event 中事件入口
    onEvent(value, scope, col = {}, key = '', event) {
      const schemaEvent = this.getEvent(col, key, event)
      if (typeof schemaEvent === 'function') {
        schemaEvent(value, scope.$index, scope.row, col)
      }
    },

    //  input 事件
    getInputEvent(value, col = {}, scope, key = '', event) {
      const colCode = col.primaryKey
      const row = this.getRow(scope)
      if (event === 'input') {
        row[colCode] = value
      }
      this.onEvent(value, scope, col, key, event)
    },

    //  复选框事件
    getCheckboxChange(value, col = {}, scope, key = '', event) {
      const colCode = col.primaryKey
      const val = col.single ? !value : value
      if (col.single) {
        this.data.map(data => {
          data[colCode] = false
        })
      }
      this.data[scope.$index][colCode] = val
      this.onEvent(val, scope, col, key, event)
    },

    //  点击链接文字事件
    getLinkEvent(value, col = {}, scope, key = '', event) {
      this.onEvent(value, scope, col, key, event)
    },

    //  清除表格选中
    clearSelection() {
      this.$refs['el-table'].clearSelection()
    },

    //  当选择项发生变化时会触发该事件
    onSelectionChange(selection) {
      this.$emit('onSelectionChange', selection)
    },

    // 手动勾选数据行的 Checkbox 时触发的事件
    onSelect(selection, row) {
      this.$emit('select', selection, row)
    },

    //  全选事件
    selectAllHandle(select) {
      this.$emit('selectAllHandle', select)
    },

    selectAll() {
      this.$nextTick(() => {
        for (let i = 0; i < this.data.length; i++) {
          this.$refs['el-table'].toggleRowSelection(
            this.data[i],
            true
          )
        }
      })
    },

    //  行点击事件 行存在有checkbox 则选中
    onRowClick(row = {}, col = {}, event) {
      const radioSelect = this.radioSelect
      if (radioSelect) {
        this.radioValue = row[this.radioKey]
        this.radioValueInfo = row
        this.$emit('getRadioEvent', this.radioValue, this.radioValueInfo)
        return
      }
      const columns = this.columns
      const label = col.label || ''
      const hasCheck = columns.filter(item => item.type === 'selection')
      if (hasCheck.length === 0) {
        return
      }
      const clickColumn = columns.filter(line => line.label === label)
      if (clickColumn.length > 0) {
        const { type } = clickColumn[0]
        if (type === 'text') {
          this.$refs['el-table'].toggleRowSelection(row)
          this.$emit('tableRowClick', row)
        }
      }
    },

    onRowDblClick(row, col, event) {
      this.$emit('onRowDblClick', { row, col, event })
    },

    //  下拉事件
    getSelectEvent(value, col = {}, scope, key = '', event) {
      const colCode = col.primaryKey
      const row = this.getRow(scope)
      if (event === 'change') {
        row[colCode] = value
      }
      this.onEvent(value, scope, col, key, event)
    },

    // 树形下拉框事件
    getTreeSelectChange(value, col = {}, scope, key = '', event) {
      const colCode = col.primaryKey
      const row = this.getRow(scope)
      if (event === 'change') {
        row[colCode] = value
      }
      this.onEvent(value, scope, col, key, event)
    },

    //  日期事件
    getDataPickerEvent(value, col = {}, scope, key = '', event) {
      const colCode = col.primaryKey
      const row = this.getRow(scope)
      row[colCode] = value
      this.onEvent(value, scope, col, key, event)
    },

    //  表格操作列
    operationEventChange(value, col = {}, scope, key = '', event) {
      this.$emit('operationChange', { value, scope })
    },

    //  分页change
    handleSizeChange(value) {
      this.$emit('changePage', 'pageSize', value)
    },

    //  分页change
    handleCurrentChange(value) {
      this.$emit('changePage', 'page', value)
    },

    //  form表单校验
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs['el-form'].validate(validateResult => {
          resolve(validateResult)
        })
      })
    },

    //  清除校验
    clearValidate() {
      this.$refs['el-form'].clearValidate()
    },

    /**
     * 行附件列表事件
     */
    handleAvatarSuccess(res, file, scope, col) {
      this.$emit('uploadSuccess', res, scope)
    },
    handleAvatarDelete(file, scope, col) {
      this.$emit('uploadDelete', file, scope)
    },
    updateFileList(fileList, scope, col) {
      this.$emit('updateFileList', fileList, scope, col)
    }

    // getFileEvent(value, col = {}, scope, file, fileIdx, act = 'download', key = '', event) {
    //   const schemaEvent = this.getEvent(col, key, event)
    //   if (typeof schemaEvent === 'function') {
    //     schemaEvent(value, scope.$index, scope.row, fileIdx, file, act)
    //   }
    // },
    // getFileContent(file, key = 'fileName') {
    //   // const fileName = file[key]
    //   // const fileNameArr = fileName.split('.')
    //   // const fileType = fileNameArr.length > 0 ? fileNameArr.slice(-1)[0].toLowerCase() : ''
    //   // if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
    //   //   return ['view', 'download']
    //   // }
    //   return ['download']
    // },
    // getFileIcon(actIcon) {
    //   return `el-icon-${actIcon}`
    // },
    // isText(col = {}, scope, key) {
    //   const textType = this.isType(col, 'type', 'text')
    //   const nativeType = col.nativeType || ''
    //   const editAble = scope.row[key] || false
    //   return textType || (nativeType === 'plain' && !editAble)
    // },
    // onProgress() {
    //
    // },
    // updateFileList(fileList, scope, col) {
    //   this.$emit('updateFileList', fileList, scope, col)
    // },
    // beforeAvatarUpload(file) {
    //   const isLt10M = file.size / 1024 / 1024 < 10
    //   if (!isLt10M) {
    //     this.$message.error('仅支持上传10M以内的附件')
    //     return isLt10M
    //   }
    // },
    // onError() {
    //
    // },
    // exceed() {
    //
    // },
    // download(scope) {
    //   const { row } = scope
    //   const url = `/scm/v1/fnd/api/documents/${row.docId}/download`
    //   const link = document.createElement('a')
    //   link.href = url
    //   link.setAttribute('download', row.docName)
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    //   window.URL.revokeObjectURL(url)
    // },
    // clearRow(scope, col, scopes) {
    //   console.log(scope, col, scopes)
    //   const { row } = scope
    //   const { $index } = scopes
    //   row.vendorList.splice($index, 1)
    // }
  }
}
