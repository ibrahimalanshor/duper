import Vue from 'vue'
import App from './App.vue'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import VueProgressBar from 'vue-progressbar'

import router from './router'
import store from './store'

Vue.use(Buefy, {
  defaultIconPack: 'fas',
})

Vue.use(VueProgressBar, {
  color: 'hsl(217, 71%, 53%)',
  failedColor: 'hsl(348, 100%, 61%)',
  thickness: '4px',
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
