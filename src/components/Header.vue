<template>
  <header>
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      title: '4sight',
    }
  },
}
</script>

<style lang="scss" scoped>
$title-color: whitesmoke;
$title-size: 32px;

header {
    padding: 12px;
}

h1 {
    text-align: center;
    font-size: $title-size;
    color: $title-color;
}
</style>
