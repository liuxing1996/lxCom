/**
  *建立计算器对象, 计算结果可达千位
  *
  *var calculator=new Calculator();
  *
  *方法
  *calculator.plus(a,b); // 计算两个数的和
  *calculator.minus(a,b);  // 返回两个数的差
  *calculator.multiply(a,b); // 返回两个数的积
  *calculator.divide(a,b,fix); //返回两个数的商,fix是保留的小数位
  *calculator.power(a,b);  // 返回a的b次方
  *
*/
function Calculator(a) {
  a = this.opts = a || {}
  this.fix = (typeof a.fix === 'undefined') ? 10 : a.fix
  this.maxOrd = a.maxOrd || 10000
  this.numRegExp = /^-?\d+.?\d*$/
}
Calculator.prototype.plus = function(a, b) {
  a = '' + a
  b = '' + b
  if (a === '0') {
    return b
  }
  if (b === '0') return a
  if (a.charAt(0) === '-' && b.charAt(0) !== '-') {
    a = a.substring(1)
    return this.minus(b, a)
  } else if (a.charAt(0) === '-' && b.charAt(0) === '-') {
    a = a.substring(1)
    b = b.substring(1)
    return '-' + this.plus(a, b)
  } else if (a.charAt(0) !== '-' && b.charAt(0) === '-') {
    b = b.substring(1)
    return this.minus(a, b)
  } else if (a.charAt(0) !== '-' && b.charAt(0) !== '-') {
    let c = 0
    const d = a.indexOf('.')
    const e = b.indexOf('.')
    const f = a.split('').reverse()
    const g = b.split('').reverse()
    if (d === -1 && e === -1) {} else if (d !== -1 && e === -1) {
      const h = c = a.length - d - 1
      f.splice(h, 1)
      for (var i = 0; i < c; i++) {
        g.unshift('0')
      }
    } else if (d === -1 && e !== -1) {
      var j = c = b.length - e - 1
      g.splice(j, 1)
      for (let i = 0; i < c; i++) {
        f.unshift('0')
      }
    } else if (d !== -1 && e !== -1) {
      var h = a.length - d - 1
      var j = b.length - e - 1
      f.splice(h, 1)
      g.splice(j, 1)
      if (h > j) {
        c = h
        for (let i = 0; i < h - j; i++) {
          g.unshift('0')
        }
      } else {
        c = j
        for (let i = 0; i < j - h; i++) {
          f.unshift('0')
        }
      }
    }
    var k = this.tosingle(this.arrplus([f, g]))
    var l = c - k.length + 1
    if (l > 0) {
      for (let i = 0; i < l; i++) {
        k.push('0')
      }
    }
    if (c) {
      k.splice(c, 0, '.')
      var t = 0
      for (let i = 0; i < c; i++) {
        if (!k[0]) {
          k.shift()
          t++
        } else {
          break
        }
      }
      if (t === c) {
        k.shift()
      }
    }
    k.reverse()
    const result = k.join('')
    if (result === '') {
      return '0'
    } else {
      return result
    }
  }
}
Calculator.prototype.minus = function(a, b) {
  a = '' + a
  b = '' + b
  if (!this.numRegExp.test(a)) {
    return ''
  }
  if (!this.numRegExp.test(b)) {
    return ''
  }
  if (a.charAt(0) === '-' && b.charAt(0) !== '-') {
    a = a.substring(1)
    return '-' + this.plus(a, b)
  } else if (a.charAt(0) == '-' && b.charAt(0) == '-') {
    a = a.substring(1)
    b = b.substring(1)
    return this.minus(b, a)
  } else if (a.charAt(0) != '-' && b.charAt(0) == '-') {
    b = b.substring(1)
    return this.plus(a, b)
  } else if (a.charAt(0) != '-' && b.charAt(0) != '-') {
    var c = 0
    var d = a.indexOf('.')
    var e = b.indexOf('.')
    var f = a.split('').reverse()
    var g = b.split('').reverse()
    if (d === -1 && e === -1) {} else if (d != -1 && e === -1) {
      var h = c = a.length - d - 1
      f.splice(h, 1)
      for (var i = 0; i < c; i++) {
        g.unshift(0)
      }
    } else if (d === -1 && e != -1) {
      var j = c = b.length - e - 1
      g.splice(j, 1)
      for (var i = 0; i < c; i++) {
        f.unshift(0)
      }
    } else if (d != -1 && e != -1) {
      var h = a.length - d - 1
      var j = b.length - e - 1
      f.splice(h, 1)
      g.splice(j, 1)
      if (h > j) {
        c = h
        for (var i = 0; i < h - j; i++) {
          g.unshift(0)
        }
      } else {
        c = j
        for (var i = 0; i < j - h; i++) {
          f.unshift(0)
        }
      }
    }
    var k
    var z = this.contrast(f, g)
    if (z) {
      k = this.arrminute(f, g)
    } else {
      k = this.arrminute(g, f)
    }
    var l = c - k.length + 1
    if (l > 0) {
      for (var i = 0; i < l; i++) {
        k.push(0)
      }
    }
    if (c) {
      k.splice(c, 0, '.')
      var t = 0
      for (var i = 0; i < c; i++) {
        if (!k[0]) {
          k.shift()
          t++
        } else {
          break
        }
      }
      if (t === c) {
        k.shift()
      }
    }
    k.reverse()
    let result = k.join('')
    if (!z) {
      result = '-' + result
    }
    if (result === '') {
      return '0'
    } else {
      return result
    }
  }
}
Calculator.prototype.multiply = function(a, b) {
  a = '' + a
  b = '' + b
  if (a === '0' || b === '0') {
    return '0'
  }
  if (a === '' || b === '') {
    return '0'
  }
  var c = 1
  if (a.charAt(0) === '-') {
    a = a.substring(1)
    c *= -1
  }
  if (b.charAt(0) === '-') {
    b = b.substring(1)
    c *= -1
  }
  var d = 0
  var e = a.indexOf('.')
  var f = b.indexOf('.')
  var g = a.split('').reverse()
  var h = b.split('').reverse()
  if (e !== -1) {
    var k = a.length - e - 1
    d += k
    g.splice(k, 1)
  }
  if (f !== -1) {
    var l = b.length - f - 1
    d += l
    h.splice(l, 1)
  }
  var m = []
  for (let i = 0; i < h.length; i++) {
    var n = []
    for (var j = 0; j < i; j++) {
      n.push(0)
    }
    for (let j = 0; j < g.length; j++) {
      n.push(h[i] * g[j])
    }
    m.push(this.tosingle(n))
  }
  var o = this.tosingle(this.arrplus(m))
  var p = d - o.length + 1
  if (p > 0) {
    for (let i = 0; i < p; i++) {
      o.push(0)
    }
  }
  if (d) {
    o.splice(d, 0, '.')
    var t = 0
    for (var i = 0; i < d; i++) {
      if (!o[0]) {
        o.shift()
        t++
      } else {
        break
      }
    }
    if (t === d) {
      o.shift()
    }
  }
  o.reverse()
  let result = o.join('')
  if (c === -1) {
    result = '-' + result
  }
  if (result === '') {
    return 0
  } else {
    return result
  }
}
Calculator.prototype.divide = function(a, b, c) {
  c = (typeof c === 'undefined') ? this.fix : c
  a = '' + a
  b = '' + b
  if (a === '0' || b === '0') {
    return '0'
  }
  var d = 1
  if (a.charAt(0) === '-') {
    a = a.substring(1)
    d *= -1
  }
  if (b.charAt(0) === '-') {
    b = b.substring(1)
    d *= -1
  }
  var e = 0
  var f = a.indexOf('.')
  var g = b.indexOf('.')
  var h = a.split('').reverse()
  var j = b.split('').reverse()
  if (f !== -1) {
    const k = a.length - f - 1
    e += k
    h.splice(k, 1)
  }
  if (g !== -1) {
    const l = b.length - g - 1
    e -= l
    j.splice(l, 1)
  }
  var m = []
  if (e > 0) {
    for (let i = 0; i < e; i++) {
      j.unshift('0')
    }
  } else if (e < 0) {
    for (let i = 0; i < -e; i++) {
      h.unshift('0')
    }
  }
  while (h[h.length - 1] === '0') {
    h.pop()
  }
  while (j[j.length - 1] === '0') {
    j.pop()
  }
  var n = c
  var o = n
  for (let i = 0; i < o; i++) {
    h.unshift('0')
  }
  var p = true
  while (p) {
    var q = h.length
    var r = j.length
    if (q > r) {
      var t = q - r
      var s = []
      if (Number(h[q - 1]) > Number(j[r - 1])) {
        for (let i = 0; i < t; i++) {
          s.push('0')
        }
        s.push('1')
      } else {
        for (var i = 0; i < t - 1; i++) {
          s.push('0')
        }
        s.push('1')
      }
      m.push(s)
      var u = s.slice(0, s.length - 1).concat(j)
      h = this.tosingle2(this.arrminute(h, u))
    } else if (q === r) {
      var v = 0
      for (let i = 0; i < q; i++) {
        if (h[q - 1 - i] > j[r - 1 - i]) {
          m.push([1])
          h = this.tosingle2(this.arrminute(h, j))
          break
        } else if (h[q - 1 - i] == j[r - 1 - i]) {
          v++
        } else if (h[q - 1 - i] < j[r - 1 - i]) {
          p = false
          m.push([0])
          break
        }
      }
      if (v === q) {
        m.push([1])
        h = this.tosingle2(this.arrminute(h, j))
        p = false
      }
    } else if (q < r) {
      m.push([0])
      p = false
    }
  }
  var w = this.tosingle2(this.arrplus(m))
  var x = n - w.length + 1
  if (x > 0) {
    for (var i = 0; i < x; i++) {
      w.push(0)
    }
  }
  if (n) {
    w.splice(n, 0, '.')
    var t = 0
    for (var i = 0; i < n; i++) {
      if (!w[0]) {
        w.shift()
        t++
      } else {
        break
      }
    }
    if (t == n) {
      w.shift()
    }
  }
  w.reverse()
  let result = w.join('')
  if (d === -1) {
    result = '-' + result
  }
  if (result === '') {
    return '0'
  } else {
    return result
  }
}
Calculator.prototype.power = function(a, b) {
  a = '' + a
  b = '' + b
  if (!this.numRegExp.test(a)) {
    alert(a + '不是一个数字')
    return ''
  }
  if (!/^\d+$/.test(b)) {
    alert(b + '不是一个正整数')
    return ''
  }
  b = Number(b)
  var c = [1]
  var d = {
    1: a
  }
  if (b == 0) {
    return 1
  }
  var e = this.maxOrd
  var f = true
  do {
    var t = b - c[0]
    for (var i = 0; i < c.length; i++) {
      if (t >= c[i]) {
        var g = c[0] + c[i]
        var h = this.multiply(d[c[0]], d[c[i]])
        if (e < h.length) {
          if (f && confirm('输出结果超出最大位数' + e + '位,终止运算请点击确认,继续运算请点击取消(可能导致页面卡死)。最大位数警告可通过Calculator的参数maxOrd修改。')) {
            return ''
          } else {
            f = false
          }
        }
        d[g] = h
        c.unshift(g)
        break
      }
    }
  } while (b != c[0])
  if (b == c[0]) {
    return d[c[0]]
  }
}

function w(a) {
  var b = a.slice(0)
  b.reverse()
  return b.join('')
}
Calculator.prototype.sqr = function(a, b) {
  alert('暂不支持开方')
  return
  a = '' + a
  if (!this.numRegExp.test(a)) {
    alert(a + '不是一个数字')
    return ''
  }
  if (/^-/g.test(a)) {
    alert(a + '不是一个正数')
    return ''
  }
  var b = b || 0
  var c = a.indexOf('.')
  var d = a.split('').reverse()
  var e
  var f = 0
  if (c != -1) {
    var g = a.length - c - 1
    d.splice(g, 1)
    e = Math.ceil(g / 2) > b ? Math.ceil(g / 2) : b
    f = e * 2 - g
  } else {
    e = b
    f = e * 2
  }
  var h
  do {
    h = d.pop()
  } while (h == 0)
  h && d.push(h)
  var k = Math.ceil(d.length / 2)
  var l = []
  for (var i = 0; i < k; i++) {
    l.push('0')
  }
  var m = [0]
  var n = d
  for (var i = k - 1; i > -1; i--) {
    console.log('开始测试第' + i + '位')
    console.log('当前平方值' + w(m))
    n = this.tosingle2(this.arrminute(d, m))
    console.log('还差' + w(n))
    if (n.length == 0) {
      for (var j = 0; j < i; j++) {
        l[j] = 0
      }
      break
    }
    var o = l.slice(0)
    var t = 5
    console.log('此位先写个5')
    var p = 0
    console.log('定义数字增减方向')
    for (;;) {
      o[i] = t
      var q = [o[i]]
      for (var j = 0; j < i; j++) {
        q.unshift('0')
      }
      console.log('增加的数字为' + w(q))
      var r = this.arrMul(this.arrplus([l, o]), q)
      console.log('增加的平方值为' + w(r))
      var s = ''
      if (p == 0) {
        s = '没定义方向'
      } else if (p == -1) {
        s = '减向'
      } else if (p == 1) {
        s = '加向'
      }
      console.log('之前的dir方向为' + s)
      if (this.contrast(n, r)) {
        console.log(w(n) + '>=' + w(r))
        if (p && p == -1) {
          break
        }
        t++
        p = 1
      } else {
        console.log(w(n) + '<' + w(r))
        t--
        if (p && p == 1) {
          break
        }
        p = -1
      }
    }
    l[i] = t
    m = this.tosingle(this.arrMul(l, l))
  }
  l.splice(e, 0, '.')
  l.reverse()
  return l.join('')
}
Calculator.prototype.arrMul = function(a, b) {
  var c = []
  for (var i = 0; i < a.length; i++) {
    var d = []
    for (var j = 0; j < i; j++) {
      d.push(0)
    }
    for (var j = 0; j < a.length; j++) {
      d.push(b[i] * a[j])
    }
    c.push(this.tosingle(d))
  }
  return this.tosingle(this.arrplus(c))
}
Calculator.prototype.tosingle = function(a) {
  var b = []
  var c = 0
  for (var i = 0; i < a.length; i++) {
    b.push((a[i] + c) % 10)
    c = parseInt((a[i] + c) / 10)
  }
  while (c > 9) {
    b.push(c % 10)
    c = parseInt(c / 10)
  }
  if (c != 0) b.push(c)
  return b
}
Calculator.prototype.arrplus = function(a) {
  var b = []
  var c = 0
  var d = a.length
  var e = 0
  while (e < d) {
    var f = 0
    e = 0
    for (var i = 0; i < d; i++) {
      if (!a[i][c] && a[i][c] != 0) e++
      f += a[i][c] ? Number(a[i][c]) : 0
    }
    if (e < d) b.push(f)
    c++
  }
  return b
}
Calculator.prototype.tosingle2 = function(a) {
  var b = []
  var c = 0
  for (var i = 0; i < a.length; i++) {
    var d = a[i] + c
    if (d >= 0) {
      b.push(d % 10)
      c = parseInt(d / 10)
    } else {
      if (d % 10 == 0) {
        b.push(d % 10)
        c = parseInt(d / 10)
      } else {
        b.push(10 + (d % 10))
        c = parseInt((d / 10) - 1)
      }
    }
  }
  while (c > 9 || c < -9) {
    var d = a[i] + c
    if (d >= 0) {
      b.push(d % 10)
      c = parseInt(d / 10)
    } else {
      if (d % 10 == 0) {
        b.push(d % 10)
        c = parseInt(d / 10)
      } else {
        b.push(10 + (d % 10))
        c = parseInt((d / 10) - 1)
      }
    }
  }
  if (c != 0) b.push(c)
  while (b[b.length - 1] == 0) {
    b.pop()
  }
  return b
}
Calculator.prototype.arrminute = function(c, d) {
  var e = []
  var f = c.length > d.length ? c.length : d.length
  for (var i = 0; i < f; i++) {
    if (!c[i] && c[i] != 0) {
      var a = 0
    } else {
      var a = Number(c[i])
    }
    if (!d[i] && d[i] != 0) {
      var b = 0
    } else {
      var b = Number(d[i])
    }
    e.push(a - b)
  }
  return this.tosingle2(e)
}
Calculator.prototype.contrast = function(a, b) {
  var c = a.length
  var d = b.length
  if (c < d) {
    return false
  } else if (c === d) {
    for (var i = c - 1; i > -1; i--) {
      if (Number(a[i]) < Number(b[i])) {
        return false
      } else if (Number(a[i]) > Number(b[i])) {
        return true
      }
    }
  }
  return true
}

export default Calculator
