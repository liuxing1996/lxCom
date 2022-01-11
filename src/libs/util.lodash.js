/**
 *
 * 从lodash里提炼一些常用的函数
 *
 * https://lodash.com/
 *
 */
import merge from 'lodash/merge'
import uniqueId from 'lodash/uniqueId'
import fill from 'lodash/fill'
import findIndex from 'lodash/findIndex'
import indexOf from 'lodash/indexOf'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import pullAt from 'lodash/pullAt'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import map from 'lodash/map'
import set from 'lodash/set'
import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import isNaN from 'lodash/isNaN'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isDate from 'lodash/isDate'
import isFunction from 'lodash/isFunction'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import isObject from 'lodash/isObject'
import extend from 'lodash/extend'
import keys from 'lodash/keys'
import values from 'lodash/values'
import groupBy from 'lodash/groupBy'
import toNumber from 'lodash/toNumber'
import toString from 'lodash/toString'
import round from 'lodash/round'
import repeat from 'lodash/repeat'
import replace from 'lodash/replace'
import defaults from 'lodash/defaults'
import max from 'lodash/max'
import maxBy from 'lodash/maxBy'
import cloneDeep from 'lodash/cloneDeep'
import concat from 'lodash/concat'
import range from 'lodash/range'
import shuffle from 'lodash/shuffle'
import endsWith from 'lodash/endsWith'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import chunk from 'lodash/chunk'
import trim from 'lodash/trim'
import debounce from 'lodash/debounce'
import random from 'lodash/random'
import noop from 'lodash/noop'
import kebabCase from 'lodash/kebabCase'
import toPath from 'lodash/toPath'
import remove from 'lodash/remove'
import toLower from 'lodash/toLower'
import hasIn from 'lodash/hasIn'
import throttle from 'lodash/throttle'
import omitBy from 'lodash/omitBy'
import pickBy from 'lodash/pickBy'
import drop from 'lodash/drop'
import forEach from 'lodash/forEach'
import startsWith from 'lodash/startsWith'
import flatten from 'lodash/flatten'
import intersection from 'lodash/intersection'
import VueSet, { deepExtend } from './util.vue-set'
// import chain from 'lodash/chain'
// import memoize from "lodash/memoize"
function memoize(fn) {
  const cache = Object.create(null)
  return function memoizedFn() {
    const args = JSON.stringify(arguments)
    cache[args] = (cache[args] || fn.apply(null, arguments))
    return cache[args]
  }
}

function substitute(str, obj) {
  if (typeof str === 'string') {
    return str.replace((/\\?\{([^{}]+)\}/g), function(match, name) {
      if (match.charAt(0) === '\\') {
        return match.slice(1)
      }
      return (obj[name] === null || obj[name] === undefined) ? '' : obj[name]
    })
  } else if (typeof str === 'function') {
    return str(obj)
  }
}

const isEmpty = (val) => {
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (isNull(val) || isUndefined(val) || val === '') { // || ['null', 'undefined'].includes(val)) {
      return true
    }
  }
  return false
}
export default {
  extend,
  merge,
  keys,
  values,
  fill,
  findIndex,
  // 创建一个元素数组。 以 iteratee 处理的结果升序排序。
  // 这个方法执行稳定排序，也就是说相同元素会保持原始排序。
  // iteratees 调用1个参数： (value)。
  //
  sortBy,
  find,
  indexOf,
  // 根据索引 indexes，移除array中对应的元素，并返回被移除元素的数组
  pullAt,
  // 随机生成id
  uniqueId,
  range,
  omit,
  pick,
  map,
  isUndefined,
  isNull,
  isString,
  isNumber,
  isNaN,
  isDate,
  isEmpty,
  isNotEmpty(val) {
    return !isEmpty(val)
  },
  isFunction,
  isPlainObject,
  isObject,
  isArray,
  groupBy,
  toNumber,
  toString,
  repeat,
  replace,
  round,
  kebabCase,
  defaults,
  set,
  get,
  maxBy,
  max,
  cloneDeep,
  concat,
  memoize,
  debounce,
  random,
  noop,
  toPath,
  // chain,
  uniqBy,
  uniq,
  chunk,
  trim,
  shuffle,
  endsWith,
  startsWith,
  isEmptyObject: obj => {
    if (isEmpty(obj)) return true
    const keys = Object.keys(obj)
    return keys.every(it => isEmpty(obj[it]))
  },
  remove,
  toLower,
  hasIn,
  throttle,
  omitBy,
  pickBy,
  drop,
  forEach,
  flatten,
  substitute,
  vueSet: VueSet,
  deepExtend,
  intersection

}
