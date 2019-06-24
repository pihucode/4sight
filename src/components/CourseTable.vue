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
      courseList: [
        { code: "CS 2110", name: "ABCs of Programming", id: 0 },
        { code: "ASTRO 1101", name: "Intro to Astronomy", id: 1 },
        { code: "CHEM 2090", name: "Chemistry Chaos", id: 2 },
        { code: "PHYS 1112", name: "Physics Appreciation", id: 3 },
        { code: "INFO 1300", name: "Intro to Web Design Principles", id: 4 },
        { code: "MATH 1910", name: "Calculus Appreciation", id: 5 }
      ]
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
