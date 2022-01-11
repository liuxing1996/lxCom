import Vue from 'vue'
import Element from 'element-ui'

/**
 * 样式引入
 */
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import '../styles/supplier-common.scss'

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

/**
 * 组件库需要
 */
import lxTable from './lxcomponent/Table/lxTable'

import './lxcomponent/style/index.less'

Vue.component(lxTable.name, lxTable)

