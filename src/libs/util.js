/**
 * @description 多维对象转一维数组
 */
export function flattenObj({ targetObj, childrenKey = 'children', level = 0, parentId = -1, namePath = '' }) {
  let result = []
  const target = targetObj instanceof Array ? targetObj : [targetObj]
  target.forEach(item => {
    let children
    if (item[childrenKey] && item[childrenKey].length > 0) {
      children = item[childrenKey]
      // delete item[childrenKey]
    }
    item.$level = level
    item.$hasChild = !!children
    item.$parentId = parentId
    item.$namePath = namePath
    result.push(item)
    if (children) {
      result = result.concat(flattenObj({
        targetObj: children,
        childrenKey,
        level: level + 1,
        parentId: item.id,
        namePath: (namePath ? (namePath + '/') : '') + item.name
      }))
    }
  })
  return result
}

/**
 * @description 鼠标事件
 */
export const mouseEvent = ('ontouchstart' in window)
  ? {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend',
    over: 'touchstart',
    out: 'touchend'
  }
  : {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
    over: 'mouseover',
    out: 'mouseout'
  }

/**
 * @description 阻止鼠标冒泡事件
 * @param {MouseEvent} e MouseEvent事件
 */
export function stopMouseEventPop(e) {
  e = e || window.event
  if (e.stopPropagation) { // W3C阻止冒泡方法
    e.stopPropagation()
  } else {
    e.cancelBubble = true // IE阻止冒泡方法
  }
}

/**
 * @description 获取窗口可视高度
 */
export function getClientHeight() {
  let clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  } else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  }
  return clientHeight
}

export function urlParse() {
  const url = window.location.href
  const obj = {}
  const reg = /[?&][^?&]+=[^?&]+/g
  const arr = url.match(reg)
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      const tempArr = item.substring(1).split('=')
      const key = decodeURIComponent(tempArr[0])
      const val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
export function queryStringToArgs(url, pageName = false) {
  url = url == null ? window.location.href : url
  // url = urlUncompile(url)
  if (url.lastIndexOf('?') === -1) {
    return {}
  }
  const qs = url.substring(url.lastIndexOf('?') + 1)
  const args = {}
  const items = qs.length > 0 ? qs.split('&') : []
  let item = null
  let name = null
  let value = null
  for (let i = 0; i < items.length; i++) {
    item = items[i].split('=')
    // 判断是不是拖拽页面，是的话就不调用选中方法
    if (!(url.indexOf('page-editor') === -1)) {
      name = decodeURIComponent(item[0])
      value = decodeURIComponent(item[1])
    } else {
      // 用decodeURIComponent()分别解码name 和value（因为查询字符串应该是被编码过的）。
      name = item[0]
      value = item[1]
    }
    if (name.length) {
      args[name] = value
    }
  }
  return args
}

export function urlCompile(url) {
  const urlArr = url.split('?')
  const code = urlArr[1] || ''
  var c = String.fromCharCode(code.charCodeAt(0) + code.length)
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1))
  }
  return urlArr[0] + (code ? '?' + escape(c) : '')
}
export function urlUncompile(url) {
  const urlArr = url.split('?')
  let code = urlArr[1] || ''
  if (!code || code.indexOf('&') !== -1) {
    return url
  } else {
    code = unescape(code)
    var c = String.fromCharCode(code.charCodeAt(0) - code.length)
    for (var i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1))
    }
    return urlArr[0] + '?' + c
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
/*
* 日期转换为 yyyy-MM-dd格式
* */
export function dateFormat(date, format = 'yyyy-MM-dd') {
  // 获取时间
  if (!date) {
    return ''
  }
  // 解决ie new Date 的 vlaue 有 '-' 时候的bug
  const value = typeof date !== 'object' ? new Date(Date.parse(date.replace(/-/g, '/'))) : new Date(date)
  const yearD = value.getFullYear()
  const monthD = (value.getMonth() + 1) < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1
  const dayD = (value.getDate() < 10) ? '0' + value.getDate() : value.getDate()
  const hourD = (value.getHours() < 10) ? '0' + value.getHours() : value.getHours()
  const minuteD = (value.getMinutes() < 10) ? '0' + value.getMinutes() : value.getMinutes()
  const secondD = (value.getSeconds() < 10) ? '0' + value.getSeconds() : value.getSeconds()

  // 替换格式
  if (format.indexOf('yyyy') !== -1) format = format.replace('yyyy', yearD)
  if (format.indexOf('MM') !== -1) format = format.replace('MM', monthD)
  if (format.indexOf('dd') !== -1) format = format.replace('dd', dayD)
  if (format.indexOf('hh') !== -1) format = format.replace('hh', hourD)
  if (format.indexOf('mm') !== -1) format = format.replace('mm', minuteD)
  if (format.indexOf('ss') !== -1) format = format.replace('ss', secondD)
  return format
}
export function getAnyMonth1(date, n) {
  const benchmarkDate = new Date(date)
  benchmarkDate.setMonth(benchmarkDate.getMonth() + n)
  const year = benchmarkDate.getFullYear()
  let month = benchmarkDate.getMonth() + 1
  month = month === 13 ? 1 : month
  let day = benchmarkDate.getDate()
  const days = new Date(year, month, 0).getDate()
  const num = n > 0 ? 0 : 1
  if (day + num <= days) {
    day = day + num < 10 ? '0' + (day + num) : day + num
    month = month < 10 ? '0' + month : month
  } else {
    day = '01'
    month = month + num < 10 ? '0' + (month + num) : month + num
  }
  month = month === '00' || 0 ? 12 : (month === (13 || '13') ? '01' : month)
  return year + '-' + month + '-' + day
}

// export function getAnyMonth(date, n) {
//   const benchmarkDate = new Date(date)
//   benchmarkDate.setMonth(benchmarkDate.getMonth() + n)
//   const year = benchmarkDate.getFullYear()
//   let month = benchmarkDate.getMonth() + 1
//   month = month === 13 ? 1 : month
//   let day = benchmarkDate.getDate()
//   const days = new Date(year, month, 0).getDate()
//   const num = n > 0 ? -1 : 1
//   if (day + num === 0) {
//     day = new Date(year, benchmarkDate.getMonth(), 0).getDate()
//     month = month + num < 10 ? '0' + (month + num) : month + num
//   } else if (day + num <= days) {
//     day = day + num < 10 ? '0' + (day + num) : day + num
//     month = month < 10 ? '0' + month : month
//   } else {
//     day = '01'
//     month = month + num < 10 ? '0' + (month + num) : month + num
//   }
//   month = month === 0 ? 12 : (month === 13 ? 1 : month)
//   return year + '-' + month + '-' + day
// }

export function getAnyMonth(date, n) {
  const benchmarkDate = new Date(date)
  benchmarkDate.setMonth(benchmarkDate.getMonth() + n)
  const year = benchmarkDate.getFullYear()
  let month = benchmarkDate.getMonth() + 1
  month = month === 13 ? 1 : month
  let day = benchmarkDate.getDate()
  const days = new Date(year, month, 0).getDate()
  const num = n > 0 ? -1 : 1
  if (day + num === 0) {
    day = new Date(year, benchmarkDate.getMonth(), 0).getDate()
    month = month + num < 10 ? '0' + (month + num) : month + num
  } else if (day + num <= days) {
    day = day + num < 10 ? '0' + (day + num) : day + num
    month = month < 10 ? '0' + month : month
  } else {
    day = '01'
    month = month + num < 10 ? '0' + (month + num) : month + num
  }
  month = month === '00' || 0 ? 12 : (month === (13 || '13') ? '01' : month)
  return year + '-' + month + '-' + day
}

export function closeWebPage() {
  if (navigator.userAgent.indexOf('MSIE') > 0) {
    if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
      window.opener = null
      window.close()
    } else {
      window.open('', '_top')
      window.top.close()
    }
  } else if (navigator.userAgent.indexOf('Firefox') > 0 || navigator.userAgent.indexOf('Presto') > 0) {
    window.location.href = 'about:blank'
    window.close()
  } else {
    window.opener = null
    window.open('', '_self', '')
    window.close()
  }
}
