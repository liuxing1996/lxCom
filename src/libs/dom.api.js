const u = {}

u.trim = function(str) {
  if (String.prototype.trim) {
    return str == null ? '' : String.prototype.trim.call(str)
  } else {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }
}
u.trimAll = function(str) {
  return str.replace(/\s*/g, '')
}
u.isElement = function(obj) {
  return !!(obj && obj.nodeType === 1)
}
u.isArray = function(obj) {
  if (Array.isArray) {
    return Array.isArray(obj)
  } else {
    return obj instanceof Array
  }
}
u.isEmptyObject = function(obj) {
  if (JSON.stringify(obj) === '{}') {
    return true
  }
  return false
}
u.addEvt = function(el, name, fn, useCapture) {
  if (!u.isElement(el)) {
    console.warn('$api.addEvt Function need el param, el param must be DOM Element')
    return
  }
  useCapture = useCapture || false
  if (el.addEventListener) {
    el.addEventListener(name, fn, useCapture)
  }
}
u.rmEvt = function(el, name, fn, useCapture) {
  if (!u.isElement(el)) {
    console.warn('$api.rmEvt Function need el param, el param must be DOM Element')
    return
  }
  useCapture = useCapture || false
  if (el.removeEventListener) {
    el.removeEventListener(name, fn, useCapture)
  }
}
u.one = function(el, name, fn, useCapture) {
  if (!u.isElement(el)) {
    console.warn('$api.one Function need el param, el param must be DOM Element')
    return
  }
  useCapture = useCapture || false
  const that = this
  const cb = function() {
    fn && fn()
    that.rmEvt(el, name, cb, useCapture)
  }
  that.addEvt(el, name, cb, useCapture)
}
u.dom = function(el, selector) {
  if (arguments.length === 1 && typeof arguments[0] === 'string') {
    if (document.querySelector) {
      return document.querySelector(arguments[0])
    }
  } else if (arguments.length === 2) {
    if (el.querySelector) {
      return el.querySelector(selector)
    }
  }
}
u.domAll = function(el, selector) {
  if (arguments.length === 1 && typeof arguments[0] === 'string') {
    if (document.querySelectorAll) {
      return document.querySelectorAll(arguments[0])
    }
  } else if (arguments.length === 2) {
    if (el.querySelectorAll) {
      return el.querySelectorAll(selector)
    }
  }
}
u.byId = function(id) {
  return document.getElementById(id)
}
u.first = function(el, selector) {
  if (arguments.length === 1) {
    if (!u.isElement(el)) {
      console.warn('$api.first Function need el param, el param must be DOM Element')
      return
    }
    return el.children[0]
  }
  if (arguments.length === 2) {
    return this.dom(el, selector + ':first-child')
  }
}
u.last = function(el, selector) {
  if (arguments.length === 1) {
    if (!u.isElement(el)) {
      console.warn('$api.last Function need el param, el param must be DOM Element')
      return
    }
    const children = el.children
    return children[children.length - 1]
  }
  if (arguments.length === 2) {
    return this.dom(el, selector + ':last-child')
  }
}
u.eq = function(el, index) {
  return this.dom(el, ':nth-child(' + index + ')')
}
u.not = function(el, selector) {
  return this.domAll(el, ':not(' + selector + ')')
}
u.prev = function(el) {
  if (!u.isElement(el)) {
    console.warn('$api.prev Function need el param, el param must be DOM Element')
    return
  }
  let node = el.previousSibling
  if (node.nodeType && node.nodeType === 3) {
    node = node.previousSibling
    return node
  }
}
u.next = function(el) {
  if (!u.isElement(el)) {
    console.warn('$api.next Function need el param, el param must be DOM Element')
    return
  }
  let node = el.nextSibling
  if (node.nodeType && node.nodeType === 3) {
    node = node.nextSibling
    return node
  }
}
u.closest = function(el, selector) {
  if (!u.isElement(el)) {
    console.warn('$api.closest Function need el param, el param must be DOM Element')
    return
  }
  let doms, targetDom
  const isSame = function(doms, el) {
    let i = 0
    const len = doms.length
    for (i; i < len; i++) {
      if (doms[i].isEqualNode(el)) {
        return doms[i]
      }
    }
    return false
  }
  const traversal = function(el, selector) {
    doms = u.domAll(el.parentNode, selector)
    targetDom = isSame(doms, el)
    if (!targetDom) {
      el = el.parentNode
      if (el != null && el.nodeType === el.DOCUMENT_NODE) {
        return false
      }
      traversal(el, selector)
    }
    return targetDom
  }
  return traversal(el, selector)
}
u.contains = function(parent, el) {
  let mark = false
  if (el === parent) {
    mark = true
    return mark
  } else {
    do {
      el = el.parentNode
      if (el === parent) {
        mark = true
        return mark
      }
    } while (el === document.body || el === document.documentElement)
    return mark
  }
}
u.remove = function(el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el)
  }
}
u.attr = function(el, name, value) {
  if (!u.isElement(el)) {
    console.warn('$api.attr Function need el param, el param must be DOM Element')
    return
  }
  if (arguments.length === 2) {
    return el.getAttribute(name)
  } else if (arguments.length === 3) {
    el.setAttribute(name, value)
    return el
  }
}
u.removeAttr = function(el, name) {
  if (!u.isElement(el)) {
    console.warn('$api.removeAttr Function need el param, el param must be DOM Element')
    return
  }
  if (arguments.length === 2) {
    el.removeAttribute(name)
  }
}
u.hasCls = function(el, cls) {
  if (!u.isElement(el)) {
    console.warn('$api.hasCls Function need el param, el param must be DOM Element')
    return
  }
  if (el.className.indexOf(cls) > -1) {
    return true
  } else {
    return false
  }
}
u.addCls = function(el, cls) {
  if (!u.isElement(el)) {
    console.warn('$api.addCls Function need el param, el param must be DOM Element')
    return
  }
  if (this.hasCls(el, cls)) {
    return el
  }
  if ('classList' in el) {
    const clses = cls.split(' ').map((it) => it.trim())
    clses.forEach(c => el.classList.add(c))
  } else {
    const preCls = el.className
    const newCls = preCls + ' ' + cls
    el.className = newCls
  }
  return el
}
u.removeCls = function(el, cls) {
  if (!u.isElement(el)) {
    console.warn('$api.removeCls Function need el param, el param must be DOM Element')
    return
  }
  if ('classList' in el) {
    const clses = cls.split(' ').map((it) => it.trim())
    clses.forEach(c => el.classList.remove(c))
  } else {
    const preCls = el.className
    const newCls = preCls.replace(cls, '')
    el.className = newCls
  }
  return el
}
u.toggleCls = function(el, cls) {
  if (!u.isElement(el)) {
    console.warn('$api.toggleCls Function need el param, el param must be DOM Element')
    return
  }
  if ('classList' in el) {
    el.classList.toggle(cls)
  } else {
    if (u.hasCls(el, cls)) {
      u.removeCls(el, cls)
    } else {
      u.addCls(el, cls)
    }
  }
  return el
}
u.val = function(el, val) {
  if (!u.isElement(el)) {
    console.warn('$api.val Function need el param, el param must be DOM Element')
    return
  }
  if (arguments.length === 1) {
    switch (el.tagName) {
      case 'SELECT':
        return el.options[el.selectedIndex].value
      case 'INPUT':
        return el.value
      case 'TEXTAREA':
        return el.value
      default:
        return ''
    }
  }
  if (arguments.length === 2) {
    switch (el.tagName) {
      case 'SELECT':
        el.options[el.selectedIndex].value = val
        return el
      case 'INPUT':
        el.value = val
        return el
      case 'TEXTAREA':
        el.value = val
        return el
      default:
        return el
    }
  }
}
u.prepend = function(el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.prepend Function need el param, el param must be DOM Element')
    return
  }
  el.insertAdjacentHTML('afterbegin', html)
  return el
}
u.append = function(el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.append Function need el param, el param must be DOM Element')
    return
  }
  el.insertAdjacentHTML('beforeend', html)
  return el
}
u.before = function(el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.before Function need el param, el param must be DOM Element')
    return
  }
  el.insertAdjacentHTML('beforebegin', html)
  return el
}
u.after = function(el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.after Function need el param, el param must be DOM Element')
    return
  }
  el.insertAdjacentHTML('afterend', html)
  return el
}
u.html = function(el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.html Function need el param, el param must be DOM Element')
    return
  }
  if (arguments.length === 1) {
    return el.innerHTML
  } else if (arguments.length === 2) {
    el.innerHTML = html
    return el
  }
}
u.text = function(el, txt) {
  if (!u.isElement(el)) {
    console.warn('$api.text Function need el param, el param must be DOM Element')
    return
  }
  if (arguments.length === 1) {
    return el.textContent
  } else if (arguments.length === 2) {
    el.textContent = txt
    return el
  }
}
u.offset = function(el) {
  if (!u.isElement(el)) {
    console.warn('$api.offset Function need el param, el param must be DOM Element')
    return
  }
  const sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft)
  const st = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
  const rect = el.getBoundingClientRect()
  return {
    l: rect.left + sl,
    t: rect.top + st,
    w: el.offsetWidth,
    h: el.offsetHeight
  }
}
u.css = function(el, css) {
  if (!u.isElement(el)) {
    console.warn('$api.css Function need el param, el param must be DOM Element')
    return
  }
  if (typeof css === 'string' && css.indexOf(':') > 0) {
    el.style && (el.style.cssText += ';' + css)
  }
}
u.cssVal = function(el, prop) {
  if (!u.isElement(el)) {
    console.warn('$api.cssVal Function need el param, el param must be DOM Element')
    return
  }
  if (arguments.length === 2) {
    const computedStyle = window.getComputedStyle(el, null)
    return computedStyle.getPropertyValue(prop)
  }
}
u.jsonToStr = function(json) {
  if (typeof json === 'object') {
    return JSON && JSON.stringify(json)
  }
}
u.strToJson = function(str) {
  if (typeof str === 'string') {
    return JSON && JSON.parse(str)
  }
}

/* end */
export default u
