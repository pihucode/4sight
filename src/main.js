import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueFirestore from 'vue-firestore'
import { firestore } from 'firebase'
import { firestorePlugin } from 'vuefire'

// turns off the 'You are running Vue in development mode.' msg
Vue.config.productionTip = false;

// VueResource - handles HTTP requests
// VueFirestore - able to export firestore "db" in "firebase.js"
Vue.use(VueResource, VueFirestore, firestore, firestorePlugin);

new Vue({
  el: '#app',
  render: h => h(App)
})
