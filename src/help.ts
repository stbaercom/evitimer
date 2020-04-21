import Vue from 'vue'
import Help from '@/components/Help.vue'


import {BootstrapVue} from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
    render: h => h(Help),
}).$mount('#pagehelp')
