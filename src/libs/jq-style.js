/**
 */
import domApi from './dom.api'

const isArray = Array.isArray ||
  function(object) {
    return object instanceof Array
  }
const selectElements = function(selector, context = document) {
  // class, id, tag name or universal selector
  if (/^[\#.]?[\w-]+$/.test(selector)) {
    var firstChar = selector[0]
    if (firstChar === '.') {
      return Array.from(context.getElementsByClassName(selector.slice(1)))
    }
    if (firstChar === '#') {
      var el = context.getElementById(selector.slice(1))
      return el ? [el] : []
    }
    if (selector === 'body') {
      return [document.body]
    }
    return Array.from(context.getElementsByTagName(selector))
  }
  return Array.from(context.querySelectorAll(selector))
}
const JQ_STYLE_OBJ = '_jq_style_'
const jqStyle = (selector, context = document) => {
  let elements
  if (typeof selector === 'string') {
    elements = JQ_STYLE_OBJ === context._type
      ? context.find(selector).get()
      : selectElements(selector, context)
  } else if (isArray(selector)) {
    elements = sanitize(selector)
  } else if (
    selector instanceof NodeList ||
    selector instanceof HTMLCollection
  ) {
    elements = Array.from(selector)
  } else if (JQ_STYLE_OBJ === selector._type) {
    return selector
  } else {
    // assume DOM node
    elements = selector ? [selector] : []
  }

  return {
    _type: JQ_STYLE_OBJ,
    elements,
    length: elements.length,
    size() {
      return this.length
    },
    isEmpty() {
      return this.elements.length === 0
    },
    each: function(callback) {
      // callback(index, element) where element == this
      const els = this.elements
      const len = this.length
      for (let i = 0; i < len; i++) {
        const node = els[i]
        callback.call(node, i, node)
      }
      return this
    },
    map: function(callback, flattenArrays = true) {
      const dom = this.get()
      const len = this.length
      const values = []
      for (var i = 0; i < len; i++) {
        const el = dom[i]
        const val = callback.call(el, i, el)
        if (flattenArrays && isArray(val)) {
          var valLen = val.length
          for (var j = 0; j < valLen; j++) {
            values.push(val[j])
          }
          continue
        }
        values.push(val)
      }
      return jqStyle(values)
    },

    // 样式
    css(css) {
      if (arguments.length === 2) {
        css = `${arguments[0]}:${arguments[1]}`
      }
      this.elements.forEach((element) => {
        domApi.css(element, css)
      })
      return this
    },
    addCls(cls) {
      this.elements.forEach((element) => {
        domApi.addCls(element, cls)
      })
      return this
    },
    removeCls(cls) {
      this.elements.forEach((element) => {
        domApi.removeCls(element, cls)
      })
      return this
    },
    toggleCls(cls) {
      this.elements.forEach((element) => {
        domApi.toggleCls(element, cls)
      })
      return this
    },
    hasCls(cls) {
      return this.hasClass(cls)
    },
    addClass(cls) {
      return this.addCls(cls)
    },
    removeClass(cls) {
      return this.removeCls(cls)
    },
    toggleClass(cls) {
      return this.toggleCls(cls)
    },

    // 存取值
    html(html) {
      if (arguments.length === 0) {
        const ret = this.elements.map(element => domApi.html(element))
        if (ret.length === 0) {
          return ''
        } else if (ret.length === 1) {
          return ret[0]
        }
        return ret
      }
      this.elements.forEach((element) => {
        domApi.html(element, html)
      })
      return this
    },
    val(val) {
      if (arguments.length === 0) {
        const ret = this.elements.map(element => domApi.val(element))
        if (ret.length === 0) {
          return ''
        } else if (ret.length === 1) {
          return ret[0]
        }
        return ret
      }
      this.elements.forEach((element) => {
        domApi.val(element, val)
      })
      return this
    },
    text(text) {
      if (arguments.length === 0) {
        const ret = this.elements.map(element => domApi.text(element))
        if (ret.length === 0) {
          return ''
        } else if (ret.length === 1) {
          return ret[0]
        }
        return ret
      }
      this.elements.forEach((element) => {
        domApi.text(element, text)
      })
      return this
    },
    textJson(json) {
      const keys = Object.keys(json)
      keys.forEach((key) => {
        const inputs = this._elementsByName(key)
        const val = json[key]
        inputs.forEach((it) => {
          domApi.text(it, val)
        })
      })
    },
    clear() {
      const first = this.get(0)
      const tagName = first.tagName
      this.elements.forEach((element) => {
        if (tagName === 'INPUT') {
          if (element.type === 'checkbox' || element.type === 'radio') {
            element.checked = false
          } else {
            element.value = ''
          }
        } else if (tagName === 'SELECT') {
          element.selectedIndex = 0
        } else if (tagName === 'TEXTAREA') {
          element.value = ''
        }
      })
      return this
    },
    json(json) {
      if (arguments.length === 0) {
        const o = {}
        this.elements.forEach((element) => {
          const name = element.name || element.id
          const e = element
          if (e.type === 'checkbox') {
            if (e.checked && !e.disabled) {
              if (o[name]) {
                o[name].push(e.value || '')
              } else {
                o[name] = [e.value]
              }
            }
          } else if (e.type === 'radio') {
            if (e.checked) {
              o[name] = e.value || ''
            }
          } else {
            o[name] = domApi.val(e) || ''
          }
        })
        return o
      }
      for (const key in json) {
        const inputs = this._elementsByName(key)
        const val = json[key]
        if (inputs.length > 0) {
          const first = inputs[0]
          const tagName = first.tagName
          if (tagName === 'INPUT') {
            if (first.type === 'checkbox' || first.type === 'radio') {
              const chkVals = domApi.isArray(val) ? val : [val]
              for (let i = 0; i < inputs.length; ++i) {
                const el = inputs[i]
                const elVal = el.value
                for (let j = 0; j < chkVals.length; ++j) {
                  if (elVal === `${chkVals[j]}`) {
                    if (!el.checked) {
                      el.checked = true
                    }
                  } else {
                    if (el.checked) {
                      el.checked = false
                    }
                  }
                }
              }
            } else {
              first.value = val
            }
          } else if (tagName === 'TEXTAREA') {
            first.value = val
          } else if (tagName === 'SELECT') {
            // 目前仅处理单选
            const opts = first.options
            let idx = 0
            for (let i = 0; i < opts.length; ++i) {
              if (`${val}` === opts[i].value) {
                idx = i
                break
              }
            }
            first.selectedIndex = idx
          }
        }
      }
      return this
    },

    // 存取属性
    attr: function(name, value) {
      const isFunc = typeof value === 'function'
      if (typeof value === 'string' || typeof value === 'number' || isFunc) {
        return this.each(function(i) {
          if (this.nodeType > 1) return
          this.setAttribute(
            name, isFunc ? value.call(this, i, this.getAttribute(name)) : value
          )
        })
      }
      if (typeof name === 'object') {
        var attrNames = Object.keys(name)
        var attrNamesLen = attrNames.length
        return this.each(function() {
          if (this.nodeType > 1) return
          for (var i = 0; i < attrNamesLen; i++) {
            var attribute = attrNames[i]
            this.setAttribute(attribute, name[attribute])
          }
        })
      }
      const el = this.get(0)
      if (!el || el.nodeType > 1) return
      const attrValue = el.getAttribute(name)
      if (attrValue == null) {
        return undefined
      }
      if (!attrValue) {
        return name
      }
      return attrValue
    },
    removeAttr: function(attributeName) {
      if (attributeName) {
        const attributes = attributeName.trim().split(' ')
        const attributesLen = attributes.length
        this.each(function() {
          if (this.nodeType > 1) return
          for (var i = 0; i < attributesLen; i++) {
            this.removeAttribute(attributes[i])
          }
        })
      }
      return this
    },

    // 事件
    on(name, fn, useCapture) {
      this.each(function() {
        domApi.addEvt(this, name, fn, useCapture)
      })
      return this
    },
    off(name, fn, useCapture) {
      this.each(function() {
        domApi.rmEvt(this, name, fn, useCapture)
      })
      return this
    },
    one(name, fn, useCapture) {
      this.each(function() {
        domApi.one(this, name, fn, useCapture)
      })
      return this
    },

    // 遍历
    get: function(index) {
      if (index > this.elements.length - 1) {
        return undefined
      }
      if (index == null) {
        return this.elements
      }
      if (index < 0) {
        index += this.elements.length
      }
      return this.elements[index]
    },
    find(selector) {
      if (this.isEmpty()) {
        console.warn('jqStyle find selector, need  elements and must be DOM Element')
        return undefined
      }
      return jqStyle(selector, this.elements[0])
    },
    closest(selector) {
      if (this.isEmpty()) {
        console.warn('jqStyle closest, need  elements and must be DOM Element')
        return undefined
      }
      return jqStyle(domApi.closest(this.elements[0], selector))
    },
    first() {
      if (this.isEmpty()) {
        console.warn('jqStyle find selector, need  elements and must be DOM Element')
        return undefined
      }
      return jqStyle(this.elements[0])
    },
    last() {
      if (this.isEmpty()) {
        console.warn('jqStyle find selector, need  elements and must be DOM Element')
        return undefined
      }
      return jqStyle(this.elements[this.elements.length - 1])
    },
    eq(idx) {
      if (idx > this.elements.length - 1) {
        return undefined
      }
      return jqStyle(this.get(idx))
    },
    children(selector) {
      const dom = []
      const self = this
      this.each(function() {
        if (this.nodeType > 1) return
        const nodes = this.children
        const nodesLen = nodes.length
        for (let i = 0; i < nodesLen; i++) {
          const node = nodes[i]
          if (!selector || self.is(selector, node)) {
            dom.push(node)
          }
        }
      })
      return jqStyle(dom)
    },
    parent(selector) {
      return findAncestors.call(this, true, true, false, selector)
    },
    parents(selector) {
      /* Differences with jQuery:
       * 1. $("html").parent() and $("html").parents() return an empty set.
       * 2. The returned set won't be in reverse order.
       */
      return findAncestors.call(this, true, false, false, selector)
    },
    next(selector) {
      return selectImmediateAdjacentSibling(this, 'next', selector)
    },
    nextAll(selector) {
      return selectAdjacentSiblings(this, 'next', selector)
    },
    nextUntil(selector, filter) {
      return selectAdjacentSiblings(this, 'next', filter, selector)
    },
    prev(selector) {
      if (!selector) {
        const el = this.elements[0]
        return jqStyle(domApi.prev(el))
      }
      return selectImmediateAdjacentSibling(this, 'previous', selector)
    },
    prevAll(selector) {
      return selectAdjacentSiblings(this, 'previous', selector)
    },
    prevUntil(selector, filter) {
      return selectAdjacentSiblings(this, 'previous', filter, selector)
    },
    siblings(selector) {
      const siblings = []
      const self = this
      this.each(function(i, el) {
        jqStyle(this).parent().children().each(function() {
          if (this === el || (selector && !self.is(selector, this))) return
          siblings.push(this)
        })
      })
      return jqStyle(siblings)
    },

    // 判断
    is(selector, element) {
      // element is undocumented, internal-use only.
      // It gives better perfs as it prevents the creation of many objects in internal methods.
      var set = element ? [element] : this.get()
      var setLen = set.length

      if (typeof selector === 'string') {
        for (var i = 0; i < setLen; i++) {
          var el = set[i]
          if (el.nodeType > 1) continue
          if (el[matches](selector)) {
            return true
          }
        }
        return false
      }
      if (typeof selector === 'object') {
        // Sprint object or DOM element(s)
        const obj = selector.length ? selector : [selector]

        const objLen = obj.length
        for (let i = 0; i < setLen; i++) {
          for (let j = 0; j < objLen; j++) {
            if (set[i] === obj[j]) {
              return true
            }
          }
        }
        return false
      }
      if (typeof selector === 'function') {
        for (let i = 0; i < setLen; i++) {
          if (selector.call(this, i, this)) {
            return true
          }
        }
        return false
      }
    },
    hasClass(name) {
      let i = this.length
      while (i--) {
        const el = this.get(i)
        if (el.nodeType > 1) return
        if (el.classList.contains(name)) {
          return true
        }
      }
      return false
    },

    // 动画
    show(display) {
      const dispStyle = display ? `display:${display}` : 'display: block'
      this.elements.forEach((element) => {
        setStyle(element, dispStyle)
      })
      return this
    },
    hide() {
      this.elements.forEach((element) => {
        setStyle(element, 'display: none')
      })
      return this
    },

    slideUp(duration, complete) {
      const options = {
        duration,
        complete
      }
      this.elements.forEach((element) => {
        slideUp(element, options)
      })
      return this
    },
    slideDown(duration, complete) {
      const options = {
        duration,
        complete
      }
      this.elements.forEach((element) => {
        slideDown(element, options)
      })
      return this
    },
    slideToggle(duration, complete) {
      const options = {
        duration,
        complete
      }
      this.elements.forEach((element) => {
        slideToggle(element, options)
      })
      return this
    },

    _elementsByName(name) {
      const ret = []
      for (let i = 0; i < this.elements.length; ++i) {
        const domname = this.elements[i].name || this.elements[i].id
        if (domname === name && !this.elements[i].disabled) {
          ret.push(this.elements[i])
        }
      }
      return ret
    }

  }
}
/**
 * /*animate(book, {
	left: 50,
	duration: 2000
})

 animate1(book, {
	start: 500,
  end:   0,
  prop: 'left',
	duration: 2000
})

 function bnt_click(){
  slideToggle(book,{ end: 500 })
}

 * @param elem
 * @param options
 */
function slideToggle(elem, options) {
  const DATA_HEIGHT = 'data-h'
  options = options || {}
  const h = elem.offsetHeight
  const none = getStyle(elem, 'display') === 'none'
  if (h === 0 || none) {
    var end = +elem.getAttribute(DATA_HEIGHT) || getSize(elem).height
    elem.style.height = 0
    elem.style.display = 'block'
    options.end = end
    slideDown(elem, options)
  } else {
    elem.setAttribute(DATA_HEIGHT, h)
    slideUp(elem, options)
  }
}

function slideUp(elem, options) {
  options = options || {}
  animate(elem, {
    start: options.start || getSize(elem).height,
    end: 0,
    prop: 'height',
    duration: options.duration || 2000
  })
}

function slideDown(elem, options) {
  options = options || {}
  animate(elem, {
    start: options.start || 0,
    end: options.end,
    prop: 'height',
    duration: options.duration || 2000
  })
}

function animate(elem, options) {
  // 动画初始值
  var start = options.start
  // 动画结束值
  var end = options.end
  // 动画id
  var timerId
  var createTime = function() {
    return (+new Date())
  }
  // 动画开始时间
  var startTime = createTime()

  function tick() {
    // 每次变化的时间
    var remaining = Math.max(0, startTime + options.duration - createTime())
    var temp = remaining / options.duration || 0
    var percent = 1 - temp
    var stop = function() {
      // 停止动画
      clearInterval(timerId)
      timerId = null
      options.complete && options.complete()
    }
    var setStyle = function(value) {
      elem.style[options.prop] = value + 'px'
    }
    // 移动的距离
    var now = (end - start) * percent + start
    if (percent === 1) {
      setStyle(now)
      stop()
    } else {
      setStyle(now)
    }
  }

  // 开始执行动画
  setInterval(tick, 13)
}

const matches = (function() {
  const names = [
    'mozMatchesSelector',
    'webkitMatchesSelector',
    'msMatchesSelector',
    'matches'
  ]
  let i = names.length
  while (i--) {
    const name = names[i]
    if (!Element.prototype[name]) continue
    return name
  }
}())

const selectAdjacentSiblings = function(me, direction, selector, until) {
  const dom = []
  const prop = direction + 'ElementSibling'
  me.each(function() {
    let el = this[prop]
    while (el) {
      if (until && me.is(until, el)) break
      if (selector && !me.is(selector, el)) continue
      dom.push(el)
      el = el[prop]
    }
  })
  return jqStyle(removeDuplicates(dom))
}

const selectImmediateAdjacentSibling = function(me, direction, selector) {
  const prop = direction + 'ElementSibling'
  return me.map(function() {
    const el = this[prop]
    if (!el || (selector && !me.is(selector, el))) return
    return el
  }, false)
}

const findAncestors = function(startAtParent, limitToParent, limitToFirstMatch, selector, context) {
  const dom = []
  const self = this
  this.each(function() {
    var prt = startAtParent ? this.parentElement : this
    while (prt) {
      if (context && context === prt) break
      if (!selector || self.is(selector, prt)) {
        dom.push(prt)
        if (limitToFirstMatch) break
      }
      if (limitToParent) break
      prt = prt.parentElement
    }
  })
  return jqStyle(removeDuplicates(dom))
}

const removeDuplicates = function(arr) {
  const clean = []
  const arrLen = arr.length
  let cleanLen = 0
  for (let i = 0; i < arrLen; i++) {
    var el = arr[i]
    var duplicate = false
    for (let j = 0; j < cleanLen; j++) {
      if (el !== clean[j]) continue
      duplicate = true
      break
    }
    if (duplicate) continue
    clean[cleanLen++] = el
  }
  return clean
}

const sanitize = function(arr, flattenObjects, requireDomNodes) {
  /*
   * Remove null's from array. Optionally, flatten Sprint objects and convert strings and numbers
   * to DOM text nodes.
   */
  const arrLen = arr.length
  let i = arrLen

  // Check if arr needs to be sanitized first (significant perf boost for the most common case)
  while (i--) {
    // arr needs to be sanitized
    if ((!arr[i] && arr[i] !== 0) ||
      (flattenObjects && JQ_STYLE_OBJ === arr[i]._type) ||
      (requireDomNodes && (typeof arr[i] === 'string' || typeof arr[i] === 'number'))
    ) {
      const sanitized = []
      for (let j = 0; j < arrLen; j++) {
        const el = arr[j]
        if (el) {
          if (flattenObjects && JQ_STYLE_OBJ === el._type) {
            for (let k = 0; k < el.length; k++) {
              sanitized.push(el.get(k))
            }
            continue
          }
          if (requireDomNodes && (typeof el === 'string' || typeof el === 'number')) {
            sanitized.push(document.createTextNode(el))
            continue
          }
          sanitized.push(el)
        }
      }
      return sanitized
    }
  }

  // arr didn't need to be sanitized, return it
  return arr
}

function type(o) {
  var _t
  return ((_t = typeof (o)) === 'object' ? o == null && 'null' || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase()
}
// 获取元素样式
function getStyle(el, styleName) {
  return el.style[styleName] ? el.style[styleName] : el.currentStyle ? el.currentStyle[styleName] : window.getComputedStyle(el, null)[styleName]
}

function getStyleNum(el, styleName) {
  return parseInt(getStyle(el, styleName).replace(/px|pt|em/ig, ''))
}

function setStyle(el, obj) {
  if (type(obj) === 'object') {
    for (const s in obj) {
      const cssArrt = s.split('-')
      for (let i = 1; i < cssArrt.length; i++) {
        cssArrt[i] = cssArrt[i].replace(cssArrt[i].charAt(0), cssArrt[i].charAt(0).toUpperCase())
      }
      const cssArrtnew = cssArrt.join('')
      el.style[cssArrtnew] = obj[s]
    }
  } else if (type(obj) === 'string') {
    el.style.cssText = obj
  }
}

export function getSize(el) {
  if (getStyle(el, 'display') !== 'none') {
    return { width: el.offsetWidth || getStyleNum(el, 'width'), height: el.offsetHeight || getStyleNum(el, 'height') }
  }
  const _addCss = { display: '', position: 'absolute', visibility: 'hidden' }
  const _oldCss = {}
  for (const i in _addCss) {
    _oldCss[i] = getStyle(el, i)
  }
  setStyle(el, _addCss)
  const _width = el.clientWidth || getStyleNum(el, 'width')
  const _height = el.clientHeight || getStyleNum(el, 'height')
  setStyle(el, _oldCss)
  return { width: _width, height: _height }
}

export default jqStyle
