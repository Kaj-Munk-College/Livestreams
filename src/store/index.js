import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    packageVersion: process.env.PACKAGE_VERSION || "0",
    isAdminUser: false,
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setIsAdminUser(state, data) {
      state.isAdminUser = data != undefined ? data : false;
    },
  },
  actions: {},
  modules: {},
  getters: {
    appVersion: (state) => {
      return state.packageVersion;
    },
  },
});
