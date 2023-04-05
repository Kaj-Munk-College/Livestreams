import Vue from "vue";
import App from "./App.vue";
// import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/analytics";
import "firebase/auth";
import { Plugins } from "@capacitor/core";
const { SplashScreen } = Plugins;

import { rtdbPlugin } from "vuefire";
Vue.use(rtdbPlugin);

import VueSocial from "@growthbunker/vuesocial";
Vue.use(VueSocial, {
  iconPath: "/img/networks/",
});

import linkify from "vue-linkify";
Vue.directive("linkified", linkify);

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const options = {
  // You can set your default options here
};
Vue.use(Toast, options);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBGsm1UZ64EojYB9G7c5QWhVHvoHeddSTQ",
  authDomain: "kleinkunstavondkmc.firebaseapp.com",
  databaseURL: "https://kleinkunstavondkmc.firebaseio.com",
  projectId: "kleinkunstavondkmc",
  storageBucket: "kleinkunstavondkmc.appspot.com",
  messagingSenderId: "477367651017",
  appId: "1:477367651017:web:a119bde14b50f09a8c5b18",
  measurementId: "G-C3G4QTHE50",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.database();

store.dispatch("bindNextEventTime");
store.dispatch("bindInteractiveQuestions");

firebase.auth().onAuthStateChanged((user) => {
  console.log(user);
  if (user != null) {
    store.commit("setUser", user);
    isAdminUser();
  } else {
    store.commit("setUser", null);
    store.commit("setIsAdminUser", false);
  }
});

export function isAdminUser() {
  if (store.state.user == null) return false;
  db.ref("users/" + store.state.user.uid)
    .once("value")
    .then((snapshot) => {
      console.log(snapshot.val().role == "admin");
      store.commit("setIsAdminUser", snapshot.val().role == "admin");
      return snapshot.val().role == "admin";
    });
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

// Hide the splash (you should do this on app launch)
SplashScreen.hide();
