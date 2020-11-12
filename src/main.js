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

import { rtdbPlugin } from "vuefire";
Vue.use(rtdbPlugin);

import VueYouTubeEmbed from "vue-youtube-embed";
Vue.use(VueYouTubeEmbed);

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

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
