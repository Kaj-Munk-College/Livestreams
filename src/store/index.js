import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firebaseAction } from "vuexfire";
import { db } from "../main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    packageVersion: process.env.PACKAGE_VERSION || "0",
    isAdminUser: false,
    nextEventTime: {
      time: "10:00",
      date: "2021-1-1",
      title: "Volgende evenement aan het inladen...",
      announcement:
        "Het volgende evenement aan het inladen... Mocht dit na 10 seconde niet gelanden zijn probeer dan de pagina opnieuw te laden, of hem te openen in incognito/prive. Mochten er nog andere vragen zijn? -> whatsapp: 0623315007",
    },
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setIsAdminUser(state, data) {
      state.isAdminUser = data != undefined ? data : false;
    },
    ...vuexfireMutations,
  },
  actions: {
    bindNextEventTime: firebaseAction(({ bindFirebaseRef }) => {
      // return the promise returned by `bindFirebaseRef`
      return bindFirebaseRef("nextEventTime", db.ref("nextEventTime"));
    }),
  },
  modules: {},
  getters: {
    appVersion: (state) => {
      return state.packageVersion;
    },
  },
});
