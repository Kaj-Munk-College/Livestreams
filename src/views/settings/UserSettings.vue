<template>
  <v-container>
    <navbar></navbar>

    <v-row class="text-center justify-center">
      <v-col class="text-center justify-center">
        <v-card>
          <v-card-title>
            Account Instellingen
          </v-card-title>
          <v-card-text class="text-center justify-center">
            <p>
              U wordt momenteel aangesproken met: <br />
              <i>{{ $store.state.user.displayName }}</i>
            </p>
            <v-text-field
              name="changeUsername"
              label="Gebruikersnaam veranderen?"
              id="changeUsername"
              solo
              hide-details="auto"
              class="mb-3"
              v-model="changeUsername"
            ></v-text-field>
            <v-btn color="success" @click="changeDisplayName" outlined
              ><v-icon style="margin-right: 10px">person_add</v-icon>
              Verander</v-btn
            >
            <br /><br />
            <v-btn @click="signOut" color="warning" outlined
              ><v-icon style="margin-right: 10px">logout</v-icon>Log Uit</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="text-center justify-center">
      <v-col class="text-center justify-center">
        <v-card>
          <v-card-title style="padding-bottom: 0px">
            Thema
          </v-card-title>
          <v-card-text>
            <v-switch label="Dark Mode" v-model="darkMode"></v-switch>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import Navbar from "../../components/util/NavBar.vue";
import Cookies from "js-cookie";

export default {
  components: {
    Navbar,
  },

  data: () => {
    return {
      changeUsername: "",
      usernameEnterBox: "",
      darkMode: false,
    };
  },

  watch: {
    darkMode: function(val) {
      this.$vuetify.theme.dark = val;
      Cookies.set("darkMode", this.darkMode);
    },
  },

  mounted() {
    this.darkMode =
      Cookies.get("darkMode") != undefined
        ? Cookies.get("darkMode")
        : (this.darkMode = false);
  },

  methods: {
    signOut() {
      firebase.auth().signOut();
    },

    changeDisplayName() {
      if (this.changeUsername != "" && this.changeUsername != null)
        firebase
          .auth()
          .currentUser.updateProfile({ displayName: this.changeUsername });

      console.log(firebase.auth().currentUser);
      this.$store.commit("setUser", this.changeUsername);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-btn {
  width: 150px;
}
</style>
