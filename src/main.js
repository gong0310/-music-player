import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.config.productionTip = false
// 全局过滤器
Vue.filter('playTimeFormat', function (val) {
  let time = val
  let min = parseInt(time / 1000 / 60)
  if (min < 10) {
    min = '0' + min
  }
  let sec = parseInt((time / 1000) % 60)
  if (sec < 10) {
    sec = '0' + sec
  }
  return `${min}:${sec}`
})

Vue.filter('playNumFormat', function (playCount) {
  if (playCount > 100000) {
    return parseInt(playCount / 10000) + '万'
  }
  return playCount
})

Vue.filter('dateFormat', function (val) {
  const dt = new Date(val)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
