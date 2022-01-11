<template>
  <div id="app" :class="classTheme">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    classTheme() {
      return 'classTheme456'
    }
  },
  mounted() {
    const isUnChrome = navigator.userAgent.toLowerCase().indexOf('chrome') === -1
    if (isUnChrome) {
      this.$message.success('建议使用chrome浏览器，系统性能更佳！')
    }
    window.addEventListener('keydown', (e) => {
      const ev = e || window.event
      // 各种浏览器下获取事件对象
      const obj = ev.relatedTarget || ev.srcElement || ev.target || ev.currentTarget
      // 按下Backspace键
      if (ev.keyCode === 8) {
        // 标签名称
        const tagName = obj.nodeName.toLowerCase()
        const className = obj.className.toLowerCase() // 兼容富文本编辑器
        const classArr = [
          'k-spreadsheet-cell-editor k-spreadsheet-formula-input',
          'k-spreadsheet-cell-editor k-spreadsheet-formula-input',
          'ql-editor'
        ]
        // 如果标签不是input或者textarea则阻止Backspace
        if (tagName !== 'input' && tagName !== 'textarea' && !classArr.includes(className)) {
          return stopIt(ev)
        }
        const tagType = obj.type ? obj.type.toLowerCase() : '' // 标签类型
        // input标签除了下面几种类型，全部阻止Backspace
        if ((tagName === 'input' && (tagType !== 'text' && tagType !== 'textarea' && tagType !== 'password' && tagType !== 'number')) || tagName === 'div' && !classArr.includes(className)) {
          return stopIt(ev)
        }
        // input或者textarea输入框如果不可编辑则阻止Backspace
        if ((tagName === 'input' || tagName === 'textarea') && (obj.readOnly === true || obj.disabled === true)) {
          return stopIt(ev)
        }
      }
      function stopIt(ev) {
        if (ev.preventDefault) {
          // preventDefault()方法阻止元素发生默认的行为
          ev.preventDefault()
        }
        if (ev.returnValue) {
          // IE浏览器下用window.event.returnValue = false;实现阻止元素发生默认的行为
          // window.event.returnValue = false;
        }
        return false
      }
    })
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
.flex{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
