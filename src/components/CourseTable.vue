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
        title (Physics I: Mechanics & Heat)-->
        <v-select
          v-model="selectedCourse"
          placeholder="Add a course"
          @input="addToBasket(selectedCourse)"
          :options="courseList"
        ></v-select>
      </div>

      <!-- Course Basket -->
      <Container
        :get-child-payload="getChildPayloadBasket"
        @drop="onDrop('basket', $event)"
        class="container"
      >
        <Draggable v-for="item in courseList" :key="item.id">
          <div class="draggable">{{ item.code }}</div>
        </Draggable>
      </Container>
    </div>

    <!-- 4 columns, one column per year  -->
    <div
      class="course-columns"
      v-for="column in columns" :key="column.id"
    >
      <!-- Fall Section-->
        <div>
          <div class="container-crown">
            <h2>Fall</h2>
          </div>
          <Container
            group-name="1"
            :get-child-payload="getChildPayload(column.id)"
            @drop="onDrop('items1', $event)"
            :drop-placeholder="dropPlaceholder"
            :remove-on-drop-out="true"
            class="container"
          >
            <Draggable v-for="item in items1" :key="item.id">
              <div class="draggable-item">
                <!-- TODO: Display course info here -->
                <!-- Course code -->
                <!-- Course name -->
                <!-- Course credits -->
              </div>
            </Draggable>
          </Container>
        </div>

        <!-- Spring Section -->
        <div>
          <div class="container-crown">
            <h2>Spring</h2>
          </div>
          <Container
            group-name="1"
            :get-child-payload="getChildPayload(column.id)"
            @drop="onDrop('items2', $event)"
            :drop-placeholder="dropPlaceholder"
            class="container"
          >
            <Draggable v-for="item in items2" :key="item.id">
              <div class="draggable-item">
                <!-- TODO: Display course info here -->
                <!-- Course code -->
                <!-- Course name -->
                <!-- Course credits -->
              </div>
            </Draggable>
          </Container>
        </div>
      </div>

  </div>
</template>

<script>
import db from "../firebase.js";
import { Container, Draggable } from "vue-smooth-dnd";
import vSelect from "vue-select";

export default {
  components: { Container, Draggable, vSelect },
  data() {
    return {
      rosterList: [],
      selectedRoster: "",
      courseList: [],
      selectedCourse: "",
      basket: [],
      payloads: {
        //payloads here
      }
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

    // SEARCH BAR
    addToBasket: function(selectedCourse) {
      // Prevent pushing a duplicate course
      if (!this.basket.includes(selectedCourse)) {
        this.basket.push(selectedCourse);
      }
    },

    // DRAG AND DROP METHODS
    onDrop(collection, dropResult) {
      this[collection] = applyDrag(this[collection], dropResult);
    },

    getChildPayloadBasket(index) {
      return this.basket[index];
    },

    // Reduce redundancy
    getCardPayload(columnId) {
      return index => {
        return this.payloads.filter(p => p.id === columnId)[0].payload[index]
      }
    },
};
</script>

<style lang="scss">
// no scope else draggable container and v-select styling will not work

$draggable-bg-color: #333;
$draggable-text-color: #ddd;

$select-bg: #c0c0c0;

.draggable {
  color: $draggable-text-color;
  background-color: $draggable-bg-color;
  text-align: center;
  padding: 6px;
}

/* Vue-select styling */
@import "vue-select/src/scss/vue-select.scss";

.v-select {
  border-radius: 6px;
  background-color: $select-bg;
}

// // Prevents users from using the 'x' symbol or 'clear selected' function of the
// // search bar. The 'clear selected' function causes the courses in
// // course basket to be deleted/buggy.
// .style-chooser .vs__clear {
//   visibility: hidden;
// }

// .style-chooser .vs__dropdown-menu {
//   max-height: 240px;
// }
</style>
