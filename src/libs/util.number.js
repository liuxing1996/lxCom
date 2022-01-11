/**
 * @date   2020/3/5-22:56
 */
import _ from './util.lodash'
import Decimal from 'decimal.js'

/**
 * 检查输入的一串字符是否是数字
 * 输入:str  字符串
 * 返回:true 或 flase; true表示为小数
 */
export function isNumber(str) {
  if (_.isEmpty(str)) {
    return false
  }
  if (_.isNumber(str)) {
    return !_.isNaN(str) && str !== Infinity
  } else if (!_.isString(str)) {
    return false
  }
  if (str.trim() === '') {
    return false
  }
  str = str.replace(/,/g, '')
  return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(str)
}
/**
 *
 * 安全转换为数值
 *
 * @param val
 * @returns {*}
 */
export const toNumber = (val) => {
  if (_.isEmpty(val)) return 0
  if (_.isNumber(val)) {
    return val
  } else {
    let ret = Number(val)
    // 处理千分位和百分号
    if (_.isNaN(ret)) {
      val = val.replace(/,/g, '').trim()
      const len = val.length - 1
      const hasPer = val.charAt(len) === '%'
      if (hasPer) {
        val = val.substr(0, len)
      }
      ret = Number(val)
      if (_.isNaN(ret)) {
        return 0
      }
      if (hasPer) {
        return 100 * val
      }
    }
    return ret
  }
}

/**
 * 检查输入的一串字符是否为整型数据
 * 输入:str  字符串
 * 返回:true 或 flase; true表示为小数
 */
export function isInteger(str) {
  return (str.match(/^[-+]?\d*$/) != null)
}

/** *
 * 将数值格式化为千分位
 *
 * @param _num
 * @returns {string}
 *
 */
export function toThousands(_num, defval = '', precision = 8, max = 8, zeroAppend = true) {
  let num = (_.isNotEmpty(_num) ? _num : defval).toString().trim(); let result = ''
  if (num === '') {
    return result
  }
  const ss = num.split('.')
  num = ss[0]
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  if (ss.length === 2) {
    let fr = ss[1]
    if (precision) {
      if (fr.length > precision) {
        fr = fr.substr(0, precision)
      }
      const adds = precision - fr.length
      if (adds > 0 && zeroAppend && fr.length < 2) {
        fr = fr + _.repeat('0', 2 - fr.length)
      }
    }
    // fr = fr.replace(/(0+)$/g, '') // 去掉后边多余的0
    if (fr.length > max) {
      fr = fr.substr(0, max)
    } else if (fr.length === 1 && zeroAppend) { // 如果金额的数据且小数位数为1位  需要补足两位
      fr = fr + _.repeat('0', 1)
    }
    result = result + '.' + fr
  } else if (zeroAppend) {
    if (precision) {
      result = result + '.' + _.repeat('0', precision)
    } else {
      result = result + '.' + _.repeat('0', 2)
    }
    // result = result + '.' + _.repeat('0', 2)
  }
  const char = result.charAt(result.length - 1)
  if (char === '.') {
    if (zeroAppend) {
      result += _.repeat('0', 2)
    } else {
      result = result.substr(0, result.length - 1)
    }
  }
  return result
}

/** *
 * 价格格式化千分位 小数不处理
 * @param _num
 * @param defval
 * @returns {string}
 */
export function priceToThousands(_num, defval = '') {
  let num = (_.isNotEmpty(_num) ? _num : defval).toString().trim()
  let result = ''
  if (num === '') {
    return result
  }
  const ss = num.split('.')
  num = ss[0]
  while ((num.length > 3 && num.indexOf('-') === -1) || num.length > 4) {
    result = ',' + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  if (ss.length === 2) {
    const fr = ss[1]
    result = result + '.' + fr
  }
  return result
}

export function replaceToThousands(value) {
  return value.replace(',', '')
}

/**
 * 确保是一个数字
 *
 * @param val
 * @return {string|*}
 */
export function asNumber(val) {
  val = _.isNotEmpty(val) ? val.toString().trim() : ''
  if (_.isEmpty(val)) {
    return '0'
  }
  val = removeNoNum(val)
  if (!isNumber(val)) {
    return ''
  }
  return new Decimal(val).toFixed()
}
const POINT = '.'
export function removeLastZero(strVal) {
  if (_.isEmpty(strVal)) {
    return strVal
  }

  if (strVal.indexOf(POINT) === -1) {
    return strVal
  }
  let sz = strVal.length
  let ret = strVal
  while (--sz >= 0) {
    if (strVal.charAt(sz) !== '0') {
      break
    }
  }
  if (sz > 0) {
    if (strVal.charAt(sz) === POINT) {
      ret = strVal.substring(0, sz)
    } else if (sz !== strVal.length - 1) {
      ret = strVal.substring(0, sz + 1)
    }
  }
  return ret
}

export function removeNoNum(value) {
  if (!_.isString(value)) value = value.toString()
  // 先把非数字的都替换掉，除了数字和.
  value = value.replace(/[^\d.]/g, '')
  // 必须保证第一个为数字而不是.
  value = value.replace(/^\./g, '')
  // 保证只有出现一个.而没有多个.
  value = value.replace(/\.{2,}/g, '.')
  // 保证.只出现一次，而不能出现两次以上
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  return value.charAt(value.length - 1) !== '.' ? value : value.substr(0, value.length - 1)
}

export function numRound(value, round, roundType) {
  const num = asNumber(value)
  return new Decimal(num).toFixed(round, Decimal[roundType])
}

/**
 * 大数加法运算
 * @param x
 * @param y
 * @param round
 * @param roundType
 */
export function addNum(x, y, round = 0, roundType = Decimal.ROUND_UP) {
  if (asNumber(x) && asNumber(y)) {
    if (round > 0) {
      return new Decimal(x).add(new Decimal(y)).toFixed(round, Decimal[roundType])
    }
    return new Decimal(x).add(new Decimal(y)).toFixed()
  } else {
    return '0'
  }
}

/**
 * 大数减法运算
 * @param x
 * @param y
 * @param round
 * @param roundType
 */
export function subNum(x, y, round = 0, roundType = Decimal.ROUND_UP) {
  if (asNumber(x) && asNumber(y)) {
    if (round > 0) {
      return new Decimal(removeNoNum(x)).sub(new Decimal(removeNoNum(y))).toFixed(round, Decimal[roundType])
    }
    return new Decimal(removeNoNum(x)).sub(new Decimal(removeNoNum(y))).toFixed()
  } else {
    return '0'
  }
}

/**
 * 大数乘法运算
 * @param x
 * @param y
 * @param round
 * @param roundType
 */
export function mulNum(x, y, round = 0, roundType = Decimal.ROUND_UP) {
  if (asNumber(x) && asNumber(y)) {
    if (round > 0) {
      return new Decimal(x).mul(new Decimal(y)).toFixed(round, Decimal[roundType])
    }
    return new Decimal(x).mul(new Decimal(y)).toFixed()
  } else {
    return '0'
  }
}

/**
 * 大数除法运算
 * @param x
 * @param y
 * @param round
 * @param roundType
 */
export function divNum(x, y, round = 0, roundType = Decimal.ROUND_UP) {
  if (asNumber(x) && asNumber(y)) {
    if (round > 0) {
      return new Decimal(x).div(new Decimal(y)).toFixed(round, Decimal[roundType])
    }
    return new Decimal(x).div(new Decimal(y)).toFixed()
  } else {
    return '0'
  }
}

// Todo 处理数字最后的0  => 1200.00100: 1200.001 / 1200.00000: 1200 / 0.000011111: 0.000011111
export function numUtils(value) {
  if (!value) {
    return ''
  }
  const regexp = /(?:\.0*|(\.\d+?)0+)$/
  return (value + '').replace(regexp, '$1')
}
export function removeThousands(val) {
  val = _.isNotEmpty(val) ? val.toString() : ''
  if (_.isNotEmpty(val)) {
    return val.toString().replace(/,/gi, '')
  } else {
    return ''
  }
}

// 字符串作比较 flag => '0' :st1 > st2 ; flag => '1' :st1 < st2 ; flag => '2' :st1 = st2
export function toCompareStr(str1, str2) {
  if (_.isEmpty(str1) || _.isEmpty(str2)) return
  let flag = ''
  let integer = []
  let decimal = []
  if (str1.indexOf('.') > -1) {
    integer = [Number(str1.split('.')[0])]
    decimal = [Number(str1.split('.')[1])]
  } else {
    integer = [...integer, Number(str1)]
    decimal = [...decimal, 0]
  }
  if (str2.indexOf('.') > -1) {
    integer = [...integer, Number(str2.split('.')[0])]
    decimal = [...decimal, Number(str2.split('.')[1])]
  } else {
    integer = [...integer, Number(str2)]
    decimal = [...decimal, 0]
  }
  if (integer[0] > integer[1]) {
    flag = '0'
  } else if (integer[0] < integer[1]) {
    flag = '1'
  } else {
    if (decimal[0] > decimal[1]) {
      flag = '0'
    } else if (decimal[0] < decimal[1]) {
      flag = '1'
    } else {
      flag = '2'
    }
  }
  return flag
}

export default {
  isNumber, isInteger, asNumber, toThousands, removeLastZero, removeNoNum, numRound, addNum, subNum, mulNum, divNum, toNumber, numUtils
}
