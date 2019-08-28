<template>
  <div class="groups">
    <!-- COURSE BASKET     -->
    <div class="group">
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
          <div class="draggable-item" @click="showModal">{{ item.code }}</div>
        </Draggable>
      </Container>
    </div>

    <!-- 4 columns, one column per year -->
    <!-- Each column has fall and spring -->
      <!-- Freshman Fall -->
      <div class="group">
        <div>
          <div class="crown">
            <h2>Fall</h2>
            <p>{{ items1.length }} Courses</p>
            <p>{{ totalCredits1 }} Credits</p>
          </div>
          <Container
            group-name="1"
            :get-child-payload="getChildPayload1"
            @drop="onDrop('items1', $event)"
            :drop-placeholder="dropPlaceholder"
            :remove-on-drop-out="true"
            class="container"
          >
            <Draggable v-for="item in items1" :key="item.id">
              <div class="draggable-item" @click="showModal">
                {{ item.code }}
                <br />
                <p class="subtext">
                  {{ item.credits }} Credits
                  <br />
                  {{ item.offered }}
                  <br />
                </p>

              <!-- Modal Component -->
              <modal v-show="isModalVisible">
                <h3 slot="header">{{ item.label }}</h3>
                <div slot="body">
                  <p>{{ item.credits }} Credits</p>
                  <p>Offered: {{ item.offered }}</p>
                  <p>{{ item.descr }}</p>
                </div>
              </modal>
              </div>
            </Draggable>
          </Container>
        </div>

        <!-- Freshmen Spring -->
        <div>
          <div class="container-crown">
            <h2>Spring</h2>
            <p>{{ items2.length }} Courses</p>
            <p>{{ totalCredits2 }} Credits</p>
          </div>
          <Container
            group-name="1"
            :get-child-payload="getChildPayload2"
            @drop="onDrop('items2', $event)"
            :drop-placeholder="dropPlaceholder"
            class="container"
          >
            <Draggable v-for="item in items2" :key="item.id">
              <div class="draggable-item">
                {{ item.code }}
                <br />
                <p class="subtext">
                  {{ item.credits }} Credits
                  <br />
                  {{ item.offered }}
                  <br />
                </p>
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
import modal from "./CourseModal.vue";

export default {
  components: { Container, Draggable, vSelect, modal },
  data() {
    return { 
    
      //SCHEMAS
      //schemaKey should be passed from previous component
      // schemaKey: "evGVN6f8wIKZq9TWBwTz",
      //schema stores name, basket, fall1, spring1, fall2, spring2, ...
      schema: [],

      //SEARCH BAR
      rosterList: [],
      selectedRoster: "",
      search: "",
      courseList: [],
      selectedCourse: "",

      //COURSE MODAL
      isModalVisible: false,

      // DRAG AND DROP
      dropPlaceholder: {
        className: "ghost",
        animationDuration: "150",
        showOnTop: true
      },      
      
      // COURSE HOLDERS
      // basket: [],
      // items1: [],
      // items2: [],

      courseMap: { basket: [], items1: [], items2: [] },
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

    // NOTE: accessing specific fields of a firestore document is difficult,
    // Instead, we store the entire document with all its fields as a single
    // object in our vue data()
    // This object will be named "schema" which will:
    // Read contents of schema
    // Load contents to the lists: basket, items1, items2, ... 
    var schemaDoc = db.collection("schemas").doc(self.schemaKey);
    schemaDoc
      .get()
      .then(function(doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          self.schema = doc.data();
        } else {
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  },
  
  computed: {
    totalCredits1: function() {
      return this.items1.reduce((acc, item) => acc + item.credits, 0);
    },
    totalCredits2: function() {
      return this.items2.reduce((acc, item) => acc + item.credits, 0);
    }
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

    //COURSE MODAL
    showModal() {
      this.isModalVisible = true;
    },
    
    closeModal() {
      this.isModalVisible = false;
    },

    // DRAG AND DROP METHODS
    onDrop(collection, dropResult) {
      this[collection] = applyDrag(this[collection], dropResult);
    },

    getChildPayloadBasket(index) {
      return this.basket[index];
    },

    getChildPayload1(index) {
      return this.items1[index];
    },
    getChildPayload2(index) {
      return this.items2[index];
    },
  },
};
</script>

<style lang="scss">
// no scope else draggable container and v-select styling will not work

// Variables
$box-bg-color: #1f262a;
$container-bg-color: rgb(78, 78, 82);
$draggable-bg: #ffbf00;

$draggable-text-color: #361b28;

$ghost-bg-color: #ffc60b;
$ghost-border: 2px dashed #ff8b00;

$h2-text-color: #c0c0c0;
$p-text-color: #c0c0c0;
$p-font: Verdana, Arial, sans-serif;

$select-bg: #c0c0c0;

p {
  color: $p-text-color;
  font-style: $p-font;
}

.groups {
  display: flex;
  /* justify-content: stretch; */
  margin-top: 50px;
  margin-right: 50px;
}
.group {
  margin: 8px;
  padding: 12px;
  width: 200px;
  min-height: 300px;
  background-color: $box-bg-color;
  border-radius: 8px;
}

.container {
  background-color: $container-bg-color;
  padding: 6px 0;
  min-height: 120px;
}

.draggable-item {
  padding: 4px;
  margin: 6px 12px;
  background-color: $draggable-bg;
  color: $draggable-text-color;
  text-align: center;
}

h2 {
  margin: 0;
  padding: 0;
  font-size: 22px;
  color: $h2-text-color;
}

.ghost {
  opacity: 0.65;
  border: $ghost-border;
  background-color: $ghost-bg-color;
}

.draggable-item,
.ghost {
  border-radius: 6px;
}

.subtext {
  font-size: 16px;
  text-align: right;
  color: $draggable-text-color;
  margin: 0;
}

/* Vue-select styling */
// @import "vue-select/src/scss/vue-select.scss";

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
