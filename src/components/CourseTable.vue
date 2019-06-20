<template>
  <div>
      <!-- COURSE BASKET     -->
    <div class="course-basket">
        <div class="crown">
            <h2>Course Basket</h2>
            
            <!-- Roster Selector -->
            <!-- courses will be loaded according to selected roster -->
            <label>Roster:</label>
            <select v-model="selectedRoster">
                <option v-for="roster in rosterList">{{ roster }}</option>
            </select>

            <!-- Search Bar -->
            <!-- TODO: search courses by code or title -->
        </div>
    </div>

    <!-- 4 columns, one column per year  -->
    <div class="course-columns">
        <div class="column">
            <!-- TODO -->
        </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rosterList: [],
      selectedRoster: "",
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
