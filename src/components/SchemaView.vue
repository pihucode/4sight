<template>
  <div>
    <!-- Create a New Schema -->
    <form>
      <div v-show="step === 1">
        <h1>Step One</h1>
        <p>
          <h2>{{ schemaName }}</h2>
          <legend for="name">Schema Name:</legend>
          <input id="name" name="name" v-model="schemaName" />
        </p>

        <button @click.prevent="next()">Next</button>
      </div>

      <div v-show="step === 2">
        <h1>Step Two</h1>
        <p>
          <legend for="street">Schema Key: {{ schemaKey }}</legend>
          <!-- Display schemaKey -->
          <!-- Let users know: Save this key to use it to access 
          your schema in the future!-->
          <p>Save this key to use it to access your schema in the future!</p>
        </p>

        <!-- Do not allow users to go back 
        to avoid running "createSchema()" multiple times -->
        <!-- <button @click.prevent="prev()">Previous</button> -->
        <input type="submit" value="Done" />
      </div>
    </form>
  </div>
</template>

<script>
import db from "../firebase.js";

export default {
  data() {
    return {
      step: 1,
      schemaName: "",
      schemaKey: "",
      generatedSchemaKey: ""
    };
  },

  methods: {

    // Creates a new schema with "schemaName" as name
    createSchema() {
      var self = this;

      db.collection("schemas").add({
        name: this.schemaName,
      })
      .then(function(docRef) {
          console.log("Schema created with ID: ", docRef.id);
          // NOTE: "this.schemaKey" gives undefined 
          // so we must use "self.schemaKey"
          self.schemaKey = docRef.id
          console.log("schemaKey: " + self.schemaKey)
      })
      .catch(function(error) {
          console.error("Error adding schema: ", error);
      });
    },

    // Goes to next step of multistep form
    next() {
        this.createSchema()
        this.step++
    },

    // Takes user to GroupDnDFirestore
    submit() {
      // Pass schemaKey to GroupDnDFirestore
      console.log("submitted!");
    }
  }
};
</script>

<style scoped lang="scss">
</style>
