import Vue from 'vue'
import Thirdparty from '@/components/Thirdparty.vue'



import { BootstrapVue} from 'bootstrap-vue'
Vue.use(BootstrapVue)


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(Thirdparty)
}).$mount('#thirdparty')
