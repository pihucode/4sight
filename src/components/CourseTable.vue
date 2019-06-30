<template>
  <div>
    <!-- COURSE BASKET     -->
    <div class="course-basket">
      <div class="crown">
        <h2>Course Basket</h2>

        <!-- Roster Selector -->
        <!-- courses will be loaded according to selected roster -->
        <label>Roster:</label>
        <select v-model="selectedRoster" v-on:change="loadCourses">
          <option v-for="roster in rosterList">{{ roster }}</option>
        </select>

        <!-- Search Bar -->
        <!-- Search courses by code (PHYS 1112) or 
            title (Physics I: Mechanics & Heat) -->
        <v-select
            v-model="selectedCourse"
            placeholder="Add a course"
            @input="addToBasket(selectedCourse)"
            :options="courseList"
            class="style-chooser"
          ></v-select>
      </div>

      <Container
        :get-child-payload="getChildPayload0"
        @drop="onDrop('basket', $event)"
        class="container"
      >
        <Draggable v-for="item in courseList" :key="item.id">
          <div class="draggable">{{ item.code }}</div>
        </Draggable>
      </Container>
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
import db from "../firebase.js";
import { Container, Draggable } from "vue-smooth-dnd";

export default {
  data() {
    return {
      rosterList: [],
      selectedRoster: "",
      courseList: [],
      selectedCourse: "",
    };
  },
  created() {
    // Prevents a "type error: cannot read property of undefined"
    // keyword “this” goes out of scope of the function, so we define "this"
    var self = this;

    //Load rosters
    db.collection("rosters")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          self.rosterList.push(doc.id);
        });
      });
  },
    methods: {
    // Load courses when roster changes
    loadCourses: function() {
      // Prevents a "type error: cannot read property of undefined"
      // keyword “this” goes out of scope of the function, so we define "this"
      var self = this;

      // Clean course list
      this.courseList = [];

      // Add courses to course list
      db.collection("rosters")
        .doc(this.selectedRoster)
        .collection("courses")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            self.courseList.push(doc.data());
          });
        });
    },
    },
};
</script>

<style lang="scss" scoped>
$draggable-bg-color: #333;
$draggable-text-color: #ddd;

.draggable {
  color: $draggable-text-color;
  background-color: $draggable-bg-color;
  text-align: center;
  padding: 6px;
}

/* Vue-select styling */
@import "vue-select/src/scss/vue-select.scss";

// Prevents users from using the 'x' symbol or 'clear selected' function of the 
// search bar. The 'clear selected' function causes the courses in 
// course basket to be deleted/buggy.
.style-chooser .vs__clear {
  visibility: hidden;
}

.style-chooser .vs__dropdown-menu {
  max-height: 240px;
}

</style>
