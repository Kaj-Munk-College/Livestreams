<template>
  <v-container fill-height fill-width fluid>
    <navbar />
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-spacer></v-spacer>
        <v-card
          class="px-5 text-center"
          max-width="360px"
          v-if="$store.state.user == null"
        >
          <v-card-title
            style="text-align: center;"
            class="text-center justify-center"
            >Inloggen</v-card-title
          >
          <v-card-subtitle
            >Om in te loggen druk op de gewenste manier van inloggen.
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col
                ><gb-social-button @click="loginWithGoogle" network="google"
                  >Log in met Google</gb-social-button
                ></v-col
              >
            </v-row>
            <v-row>
              <v-col>
                <gb-social-button @click="loginWithMicrosoft" network="yelp"
                  >Log in met Microsoft</gb-social-button
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <v-text-field
                  name="username"
                  label="Naam"
                  id="usernameEnterBox"
                  solo
                  hide-details="auto"
                  class="mb-3"
                  v-model="usernameEnterBox"
                ></v-text-field>
                <v-btn @click="loginAnonymous">Anoniem Inloggen</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gb-social-button network="rss" @click="dialog = !dialog"
                  >Log in met Email</gb-social-button
                >
                <v-dialog v-model="dialog" width="500">
                  <v-card>
                    <v-card-title class="headline grey lighten-2">
                      Log in met email
                    </v-card-title>

                    <v-card-text>
                      Let op dit deze manier van inloggen is alleen mogelijk
                      voor intern gebruik
                      <br />
                      <p style="color: red" v-if="wrongPassword">
                        De gegeven email of wachtwoord is onjuist, of de
                        gebruiker bestaat niet. Probeer het opnieuw
                      </p>
                      <v-form ref="emailform" @submit="loginWithEmail">
                        <v-text-field
                          name="email"
                          label="Email"
                          id="emailTextField"
                          v-model="email"
                          type="email"
                        ></v-text-field>

                        <v-text-field
                          name="password"
                          label="Wachtwoord"
                          id="passwordTextField"
                          v-model="password"
                          type="password"
                        ></v-text-field>

                        <v-btn color="success" @click="loginWithEmail"
                          >Login</v-btn
                        >
                      </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="secondary" text @click="dialog = false">
                        Sluiten
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            Let op email is alleen beschikbaar voor intern gebruik.
          </v-card-text>

          <br />

          <v-card-actions class="text-center justify-center">
            <v-btn
              class="text-center justify-center"
              color="secondary"
              @click="$router.go(-1)"
              >Terug</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-card
          class="px-5 text-center"
          max-width="360px"
          v-if="$store.state.user != null"
        >
          <v-card-title
            style="text-align: center;"
            class="text-center justify-center"
            >Account</v-card-title
          >
          <v-card-subtitle
            >U bent momenteel ingelogd met: <br />
            <i>{{
              $store.state.user.email != null
                ? $store.state.user.email
                : `Anoniem account`
            }}</i>
          </v-card-subtitle>

          <v-card-text class="text-center justify-center">
            <v-btn @click="signOut" color="warning"
              >Klik hier om uit te loggen</v-btn
            >

            <br /><br />
            <br />
            <br />
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
            <v-btn color="success" @click="changeDisplayName">Verander</v-btn>
          </v-card-text>

          <v-card-actions class="text-center justify-center">
            <v-btn text color="secondary" @click="$router.go(-1)"
              >Terug naar de vorige pagina</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import navbar from "../components/util/NavBar";

export default {
  components: {
    navbar,
  },
  data: () => {
    return {
      email: "",
      password: "",
      wrongPassword: false,
      dialog: false,
      changeUsername: "",
      usernameEnterBox: "",
    };
  },
  methods: {
    loginWithEmail() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          console.log(result);
          this.$store.commit("setUser", result.user);
          this.wrongPassword = false;
          this.dialog = false;
        })
        .catch((error) => {
          console.error(error);
          if (
            error.code == "auth/user-not-found" ||
            error.code == "auth/wrong-password"
          ) {
            this.wrongPassword = true;
          }
          // ...
        });
    },
    loginWithGoogle() {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().useDeviceLanguage();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          this.$store.commit("setUser", result.user);
          console.log(result.user.uid);
        })
        .catch((err) => console.error(err));
    },

    loginWithMicrosoft() {
      var provider = new firebase.auth.OAuthProvider("microsoft.com");

      // provider.setCustomParameters({
      //   prompt: "consent",
      // });

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          this.$store.commit("setUser", result.user);
        })
        .catch((err) => console.error(err));
    },

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

    loginAnonymous() {
      firebase.auth().signInAnonymously();

      this.username = this.usernameEnterBox;
      this.usernameEnterBox = "";

      firebase.auth().currentUser.updateProfile({
        displayName: this.username,
      });
    },
  },
};
</script>

<style></style>
