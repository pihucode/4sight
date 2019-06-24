import Vue from 'vue'
import App from './App.vue'
import { firestore } from 'firebase'
import { firestorePlugin } from 'vuefire'

// turns off the 'You are running Vue in development mode.' msg
Vue.config.productionTip = false;

Vue.use(firestore, firestorePlugin);

new Vue({
  el: '#app',
  render: h => h(App)
})
