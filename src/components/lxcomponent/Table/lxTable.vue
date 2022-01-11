<template>
  <div class="table-pagination pds-component-table" style="height: 100%">
    <el-form ref="el-form" :model="{data}" style="height: calc(100% - 37px)">
      <el-table
        ref="el-table"
        :key="tableKey"
        v-loading="loading"
        size="mini"
        :data="data"
        :border="border"
        :row-key="rowKey"
        :empty-text="emptyText"
        class="table-component"
        :height="height"
        :max-height="maxHeight"
        style="width: 100%"
        @selection-change="onSelectionChange"
        @select="onSelect"
        @select-all="selectAllHandle"
        @row-click="onRowClick"
        @row-dblclick="onRowDblClick"
      >
        <template v-for="(col, idx) in columns">
          <!--单选框-->
          <el-table-column
            v-if="isType(col, 'type', 'radio')"
            :key="idx"
            :label="getAttr(col, 'label', '单选')"
            :fixed="getAttr(col, 'fixed', false)"
            :align="getAttr(col, 'align', 'center')"
            :header-align="getAttr(col, 'headerAlign', 'center')"
            :width="getAttr(col, 'width', '52px')"
          >
            <template slot-scope="scope">
              <el-radio
                :label="radioValue"
                :value="scope.row[radioKey]"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <!--复选框-->
          <el-table-column
            v-else-if="isType(col, 'type', 'selection')"
            :key="idx"
            type="selection"
            :reserve-selection="getAttr(col, 'reserveSelection', false)"
            :selectable="(row, index) => { return !row.checked }"
            :fixed="getAttr(col, 'fixed', false)"
            :align="getAttr(col, 'align', 'center')"
            :header-align="getAttr(col, 'headerAlign', 'center')"
            :width="getAttr(col, 'width', '52px')"
          />
          <!--序号-->
          <el-table-column
            v-else-if="isType(col, 'type', 'index')"
            :key="idx"
            type="index"
            :label="getAttr(col, 'label', '序号')"
            :fixed="getAttr(col, 'fixed', false)"
            :header-align="getAttr(col, 'headerAlign', 'center')"
            :align="getAttr(col, 'align', 'center')"
            :width="getAttr(col, 'width', '52px')"
          />

          <!--文字链接-->
          <el-table-column
            v-else-if="isType(col, 'type', 'link')"
            :key="idx"
            :label="getAttr(col, 'label', '序号')"
            :fixed="getAttr(col, 'fixed', false)"
            :align="getAttr(col, 'align', 'center')"
            :header-align="getAttr(col, 'headerAlign', 'center')"
            :show-overflow-tooltip="getAttr(col, 'showOverflowTooltip', false)"
            :min-width="getAttr(col, 'minWidth', '')"
            :width="getAttr(col, 'width', '100px')"
          >
            <template slot-scope="scope">
              <ColumnLink :col="col" :scope="scope" :scope-key="scopeKey" @onEvent="onEvent" />
            </template>
          </el-table-column>

          <!--纯文本显示-->
          <el-table-column
            v-else-if="isType(col, 'type', 'text')"
            :key="idx"
            :label="getAttr(col, 'label', '序号')"
            :fixed="getAttr(col, 'fixed', false)"
            :align="getAttr(col, 'align', 'center')"
            :header-align="getAttr(col, 'headerAlign', 'center')"
            :min-width="getAttr(col, 'minWidth', '')"
            :show-overflow-tooltip="getAttr(col, 'showOverflowTooltip', false)"
            :class-name="getAttr(col, 'className', '')"
          >
            <template slot-scope="scope">
              <ColumnText :col="col" :scope="scope" :scope-key="scopeKey" @onEvent="onEvent" />
            </template>
          </el-table-column>

          <!--操作按钮-->
          <el-table-column
            v-else-if="isType(col, 'type', 'operation') && getAttr(col, 'visible', false)"
            :key="idx"
            :label="getAttr(col, 'label', '操作')"
            :fixed="getAttr(col, 'fixed', false)"
            :align="getAttr(col, 'align', 'center')"
            :header-align="getAttr(col, 'headerAlign', 'center')"
            :width="getAttr(col, 'width', '120px')"
          >
            <template slot-scope="scope">
              <ColumnOperation :col="col" :scope="scope" @operationEventChange="operationEventChange" />
            </template>
          </el-table-column>

          <el-table-column
            v-else
            :key="idx"
            :prop="getAttr(col, 'primaryKey')"
            :label="getAttr(col, 'label', '')"
            :sortable="getAttr(col, 'sortable', false)"
            :fixed="getAttr(col, 'fixed', false)"
            :align="getAttr(col, 'align', 'center')"
            :header-align="getAttr(col, 'headerAlign', 'center')"
            :min-width="getAttr(col, 'minWidth', '')"
          >
            <template slot="header">
              <span>
                <span v-if="getAttr(col, 'required', false)" class="requiredIcon">*</span>
                <span>{{ getAttr(col, 'label', '') }}</span>
              </span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="getProp(col, scope)"
                :rules="getRules(getAttr(col, 'rules', []), scope)"
                :style="col.style"
                :class="col.class"
              >
                <!-- 根据行判断显示编辑内容还是span -->
                <span v-if="getShowSpan(col, scope)" style="width: 100%">
                  {{ getShowSpanContent(col, scope) }}
                </span>

                <div v-else style="width: 100%;" :style="hasIcon(col, scope) ? 'display : flex' : ''">
                  <!-- 文本框 -->
                  <el-input
                    v-if="isType(col, 'type', 'input')"
                    :class="getColumnClass(col, scope)"
                    :type="getAttr(col, 'nativeType', 'text')"
                    :placeholder="getAttr(col, 'placeholder', '')"
                    :maxlength="getAttr(col, 'maxLength')"
                    :disabled="getAttr(col, 'disabled', false, scope)"
                    :rows="getAttr(col, 'rows', 2)"
                    :value="getValue(col, scope)"
                    :readonly="getAttr(col, 'readonly', false)"
                    :clearable="getAttr(col, 'clearable', true)"
                    :show-word-limit="getAttr(col, 'showWordLimit', false)"
                    :title="getAttr(col, 'titleShowKey', '', scope)"
                    @mouseover.native="getInputEvent($event, col, scope,'event', 'mouseover')"
                    @input="getInputEvent($event, col, scope,'event', 'input')"
                    @blur="getInputEvent($event.target.value, col, scope,'event', 'blur')"
                    @focus="getInputEvent($event, col, scope,'event', 'focus')"
                    @clear="getInputEvent('', col, scope, 'event', 'clear')"
                  />

                  <!-- 远程搜索下拉框 从服务器搜索数据，输入关键字进行查找 -->
                  <el-select
                    v-if="isType(col, 'type', 'select')"
                    :class="getColumnClass(col, scope)"
                    :value="getValue(col, scope)"
                    :multiple="getAttr(col, 'multiple', false)"
                    :filterable="getAttr(col, 'filterable', false)"
                    :remote="getAttr(col, 'remote', false)"
                    :clearable="getAttr(col, 'clearable', true)"
                    reserve-keyword
                    :disabled="getAttr(col, 'disabled', false, scope)"
                    :placeholder="getAttr(col, 'placeholder', '')"
                    :remote-method="str => getAttr(col, 'remoteMethod', () => [])(str, scope)"
                    :loading="getAttr(col, 'loading', false)"
                    :readonly="getAttr(col, 'readonly', false)"
                    @change="getSelectEvent($event, col, scope, 'event', 'change')"
                    @blur="getSelectEvent($event, col, scope, 'event', 'blur')"
                    @clear="getSelectEvent('', col, scope, 'event', 'clear')"
                  >
                    <el-option
                      v-for="item in getAttr(col, 'options', scope.row[getAttr(col, 'optionsKey', '')] || [])"
                      :key="item.value"
                      :label="col.labelKey ? item[col.labelKey] : item.valueName"
                      :value="col.valueKey ? item[col.valueKey] : item.valueCode"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-form>
    <div v-if="showPagination" class="el-table-pagination" style="padding: 5px 0 0; text-align: right;background-color: white">
      <el-pagination
        v-bind="combinePagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import Mixin from './mixin/index'
export default {
  name: 'lxTable',
  mixins: [Mixin]
}
</script>
<style lang="scss">
$elTableThBg:    #F2F3F8;
$elTableThColor: #464646;
$tableBorderColor: #e8e8e8;
// el-table
.pds-component-table {
  .el-table {
    font-size: 12px;
    th {
      height: 42px;
      white-space: nowrap;
      font-weight: 400;
      color: $elTableThColor;
      background-color: $elTableThBg;
      .cell {
        padding-left: 8px;
        padding-right: 8px;
        white-space: nowrap;
      }
      &.is-leaf {
        border-bottom: 1px solid $tableBorderColor;
      }
      &.is-left {
        text-align: left;
      }
      &.is-center {
        text-align: center;
      }
    }
    td {
      height: 42px;
      padding: 0;
      border-bottom: 1px solid $tableBorderColor;
      .cell {
        padding-left: 8px;
        padding-right: 8px;
      }
      &.is-center {
        text-align: center;
      }
    }
    // 锁定列滚动条到底部错位问题
    .el-table__body-wrapper.is-scrolling-none ~ .el-table__fixed,
    .el-table__body-wrapper.is-scrolling-none ~ .el-table__fixed-right {
      height: 100% !important;
    }
    .el-table__fixed, .el-table__fixed-right {
      height: calc(100% - 12px) !important;
      box-shadow: -4px 0px 8px rgba(0, 0, 0, 0.12);
      .el-table__fixed-body-wrapper {
        height: calc(100% - 36px) !important;
      }
    }
    .el-table__body-wrapper.is-scrolling-left ~ .el-table__fixed-right {
      &::before {
        display: none;
      }
    }
    .el-table__body-wrapper {
      border-bottom: transparent !important;
    }
    .el-table__fixed-right-patch {
      background-color: $elTableThBg;
    }
    &--border {
      border: 1px solid $tableBorderColor;
      border-right: none;
      border-bottom: none;
      th, td {
        border-right: 1px solid $tableBorderColor;
      }
      &:before, &:after {
        background-color: $tableBorderColor;
      }
    }
  }
}
// el-table th nowrap
.th-nowrap {
  .el-table__header-wrapper {
    .el-table__header {
      th {
        .cell {
          white-space: nowrap !important;
        }
      }
    }
  }
}
</style>
<style scoped lang="less">
  /deep/ .table-component {
    .el-form-item__content {
      height: 100%;
      display: flex;
      /*justify-content: center;*/
      align-items: center;
      font-size: 12px;
    }
  }
  /deep/.el-radio__label{
    padding: 0;
  }
  .requiredIcon {
    color: #ff4949;
    font-size: 10px;
    margin-right: 4px;
  }
  .el-input-number--medium {
    width: 100%;
    /deep/ .el-input-number__decrease {
      display: none !important;
    }
    /deep/ .el-input-number__increase {
      display: none !important;
    }
    /deep/ .el-input__inner {
      text-align: left !important;
      padding-left: 16px !important;
    }
  }
  /deep/ .el-form .el-input--medium .el-input__inner{
    padding-right: 15px;
  }
  .inputTextColor {
    color: red;
    /deep/ .el-input__inner {
      color: red;
    }
  }
  .distinguishColor{
    color: red;
    /deep/.el-input__inner{
      color: red;
    }
  }
  .file-list-line {
    font-size:12px;
    button {
      height: auto;
      padding: 5px !important;
    }
  }
  .downStyle {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .vtable .cell{
    /*align-items: flex-end;*/
    line-height: normal;
  }

  /deep/ .el-table-column--selection{
    .cell{
      text-align: center;
    }
  }

  // /deep/ table tr th:first-child > .cell,
  // table tr td:first-child > .cell {
  //   text-align: center !important;
  // }

</style>
<style lang="scss">
  $inputHeight:  36px;
  $primaryColor: #0573E4;
  $tableTextColor: #1F2329;
  table {
    .el-input--medium .el-input__inner,
    .el-input__inner,
    .el-input-number__increase,
    .el-input-number__decrease {
      border-color: transparent;
    }
    .el-checkbox__inner:hover,
    .el-radio__inner:hover,
    .el-textarea__inner:focus,
    .el-checkbox__input.is-focus .el-checkbox__inner,
    .el-pagination__sizes .el-input .el-input__inner:hover,
    .el-input__inner:focus,
    .el-select .el-input__inner:focus,
    .el-select .el-input.is-focus .el-input__inner,
    .el-range-editor.is-active,
    .el-range-editor.is-active:hover {
      border-color: transparent;
    }
    .el-form-item.is-error .el-input__inner,
    .el-form-item.is-error .el-input__inner:focus,
    .el-form-item.is-error .el-textarea__inner,
    .el-form-item.is-error .el-textarea__inner:focus {
      border-color: #ff4949;
    }
  }
  // 行编辑表格
  .table-form-item {
    .vue-treeselect .vue-treeselect__control{
      border:none;
      border-radius: none !important;
      height: 36px;
    }
    .vue-treeselect .vue-treeselect__placeholder, .vue-treeselect .vue-treeselect__single-value{
      line-height: 36px;
    }
    .vue-treeselect .vue-treeselect__control-arrow-container:before{
      top:16px
    }
    .el-input--medium .el-input__inner {
      font-size: 12px;
      height: $inputHeight;
      line-height: $inputHeight;
      border-radius: 0;
      box-sizing: border-box;
    }
    .el-table {
      td {
        height: $inputHeight;
        .cell {
          padding-left: 0;
          padding-right: 0;
          overflow: visible;
        }
      }
      &.el-table--mini {
        td {
          padding-top: 0;
          padding-bottom: 0;
        }
      }

    }
    .el-form {
      td{
        .el-form-item {
          margin-bottom: 0;
          .el-form-item__content {
            position: relative;
            line-height: $inputHeight;
            & > div {
              width: 100%;
            }
            .el-form-item__error {
              line-height: 22px;
              padding: 4px 10px;
              color: white;
              border-radius: 4px;
              background-color: black;
              position: absolute;
              top: 80%;
              left: 40%;
              z-index: 999;
            }
            &>i {
              margin-left: 5px;
            }
            .el-date-editor.el-input {
              width: 100%;
            }
            .el-range-editor--medium{
              .el-range__icon, .el-range-separator {
                line-height: ($inputHeight - 6px);
              }
              &.el-input__inner {
                width: 100%;
                height: $inputHeight;
              }
            }
          }
        }
      }
    }
  }
  .pds-component-table {
    // el-checkbox
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-radio__input.is-checked .el-radio__inner,
    .el-switch.is-checked .el-switch__core,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: $primaryColor;
      border-color: $primaryColor;
    }
    table {
      td {
        .is-checked .el-checkbox__inner{
          background-color: $primaryColor;
          border-color: $primaryColor;
        }
      }
    }
    .pds-column-click {
      color: $primaryColor;
      cursor: pointer;
      &:hover {
        color: $primaryColor;
      }
    }
    .el-table {
      color: $tableTextColor;
    }
    // 操作列 more icon
    .el-dropdown {
      .el-button {
        //padding-left: 0 !important;
        .pds-el-icon-more {
          color: $primaryColor;
        }
      }
    }
  }
</style>
