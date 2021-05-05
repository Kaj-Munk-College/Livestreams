<template>
  <v-container class="container">
    <v-spacer></v-spacer>
    <v-row class="kajmunk-logo-container-container">
      <v-spacer></v-spacer>
      <v-col class="kajmunk-logo-container" cols="8">
        <img
          class="kajmunk-logo"
          src="/img/kajmunkHR.png"
          alt="kajmunk logo"
          @click="dialog = !dialog"
        />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-spacer></v-spacer>
    <v-row>
      <v-col style="text-align: center">
        <gb-social-button
          class="login-button"
          @click="loginWithGoogle"
          network="google"
        >
          Log in met Google</gb-social-button
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col style="text-align: center">
        <gb-social-button
          class="login-button"
          @click="loginWithMicrosoft"
          network="yelp"
          >Log in met Microsoft</gb-social-button
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col style="text-align: center">
        <gb-social-button
          class="login-button"
          @click="loginWithApple"
          network="apple"
          >Sign in with Apple</gb-social-button
        >
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title
          :class="
            $vuetify.theme.dark
              ? 'headline grey darken-2'
              : 'headline grey lighten-2'
          "
        >
          Log in met email
        </v-card-title>

        <v-card-text>
          Let op dit deze manier van inloggen is alleen mogelijk voor intern
          gebruik
          <br />
          <p style="color: red" v-if="wrongPassword">
            De gegeven email of wachtwoord is onjuist, of de gebruiker bestaat
            niet. Probeer het opnieuw
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
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" outlined @click="loginWithEmail">Login</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" outlined text @click="dialog = false">
            Sluiten
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
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
          this.$emit("goToApp");
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
          this.$emit("goToApp");
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
          this.$emit("goToApp");
        })
        .catch((err) => console.error(err));
    },

    loginWithApple() {
      var provider = new firebase.auth.OAuthProvider("apple.com");

      // provider.setCustomParameters({
      //   prompt: "consent",
      // });

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          this.$store.commit("setUser", result.user);
          this.$emit("goToApp");
        })
        .catch((err) => console.error(err));
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

<style lang="scss" scoped>
.container {
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.kajmunk-logo {
  width: 100%;
}

.kajmunk-logo-container {
  width: 70%;
}

.kajmunk-logo-container-container {
  margin-top: 15%;
}

.login-button {
  width: 190px;
}
</style>
