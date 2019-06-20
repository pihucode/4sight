<template>
  <div id="app">
    <app-header></app-header>
    <course-table></course-table>
  </div>
</template>

<script>
//use components locally
// './' means starting from current folder
import Header from "./components/Header.vue";
import CourseTable from "./components/CourseTable.vue";

export default {
  name: "app",
  components: {
    "app-header": Header,
    "course-table": CourseTable,
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
