<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-text-field
          name="password"
          label="password"
          id="password"
          type="password"
          v-model="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="login" color="success">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data: () => {
    return {
      password: "",
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword("av@kajmunk.nl", this.password)
        .catch(function(error) {
          console.error(error);
          // ...
        });
      this.$router.push("/admin");
    },
  },
};
</script>

<style></style>
