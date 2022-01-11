import Vue from 'vue'
import _ from './util.lodash'
const castPath = require('lodash/_castPath')
const isIndex = require('lodash/_isIndex')
const isObject = require('lodash/isObject')
const toKey = require('lodash/_toKey')
// baseAssignValue = require('lodash/_baseAssignValue'),
const eq = require('lodash/eq')
/** Used for built-in method references. */
const objectProto = Object.prototype
/** Used to check objects for own properties. */
const hasOwnProperty = objectProto.hasOwnProperty
function assignValue(object, key, value) {
  const objValue = object[key]
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
    (value === undefined && !(key in object))) {
    // baseAssignValue(object, key, value);
    Vue.set(object, key, value)
  }
}
/**
 * 设置Vue的响应对象的字段
 *
 * @param {Object} object The object to modify.
 * @param {Array|string} path The patszh of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 *
 */
export default function(object, path, value, customizer) {
  if (!isObject(object)) {
    return object
  }
  path = castPath(path, object)
  let index = -1
  const length = path.length
  const lastIndex = length - 1
  let nested = object
  while (nested != null && ++index < length) {
    const key = toKey(path[index])
    let newValue = value
    if (index !== lastIndex) {
      const objValue = nested[key]
      newValue = customizer ? customizer(objValue, key, nested) : undefined
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {})
      }
    }
    assignValue(nested, key, newValue)
    nested = nested[key]
  }
  return object
}
const deepExtendDest = (destination, source) => {
  for (const property in source) {
    const val = source[property]
    if (_.isArray(val)) {
      Vue.set(destination, property, val)
    } else if (_.isObject(val)) {
      Vue.set(destination, property, {})
      deepExtend(destination[property], val)
    } else {
      Vue.set(destination, property, val)
    }
  }
  return destination
}
/**
 *
 * 复制一个对象的字段值到Vue的要给响应对象，使新的属性能响应
 *
 * @param destination 目标对象
 * @param source 原来对象
 * @param fields 需要复制哪些字段，如果空是所有字段
 *
 */
export const deepExtend = (destination, source, fields) => {
  if (_.isNotEmpty(fields)) {
    source = _.pick(source, fields)
  }
  return deepExtendDest(destination, source)
}
