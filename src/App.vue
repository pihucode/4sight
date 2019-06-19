<template>
  <div id="app">
    <app-header></app-header>
  </div>
</template>

<script>
//use components locally
// './' means starting from current folder
import Header from "./components/Header.vue";

export default {
  name: "app",
  components: {
    "app-header": Header,
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-color: #333;
}
</style>
