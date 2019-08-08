<template>
  <div>
      <div>
        <h2>Create a New Schema</h2>
        <div>
            <h3>Schema Name:</h3>
            <!-- string input -->
        </div>
      </div>

      <div>
        <h2>Load Schema</h2>
        <div>
            <h3>Schema Key:</h3>
            <!-- string input -->
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        schemaName: '',
        schemaKey: '',
        generatedSchemaKey: '',
    }
  },
}
</script>

<style scoped lang="scss">

</style>
