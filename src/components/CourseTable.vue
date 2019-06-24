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
        <!-- TODO: search courses by code or title -->
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
</style>
