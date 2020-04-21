import Vue from 'vue'
import App from './App.vue'

import store from "./store"


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


import VueKonva from 'vue-konva'
Vue.use(VueKonva)

import UniqueId from 'vue-unique-id';
Vue.use(UniqueId);


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  data: {
    eventBus: new Vue()
  },
  provide() {
    return {
      eventBus: this.eventBus
    }
  }
}).$mount('#app')
