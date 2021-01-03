<template>
  <v-app-bar color="deep-blue" dark app>
    <!-- <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon> -->

    <v-btn
      @click="$emit('menu-button-press')"
      v-if="$route.name == 'Chat Main'"
      icon
      color="primary"
    >
      <v-icon>menu</v-icon>
    </v-btn>

    <v-toolbar-title @click="$router.push('/')"
      >Kaj Munk Livestreams</v-toolbar-title
    >

    <v-spacer></v-spacer>

    <div class="text-center">
      <v-menu>
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn v-on="{ ...tooltip, ...menu }" icon
                ><v-icon large>settings</v-icon></v-btn
              >
            </template>
            <span>Settings</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item @click="darkMode = !darkMode">
            <v-list-item-icon
              ><v-icon v-if="darkMode">check_box</v-icon
              ><v-icon v-else>check_box_outline_blank</v-icon></v-list-item-icon
            >
            <v-list-item-content>
              <v-list-item-title>Dark mode</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon
              ><v-icon>brightness_medium</v-icon></v-list-item-icon
            >
          </v-list-item>
          <v-list-item class="noUnderline">
            <router-link v-if="$store.state.user" to="login"
              ><v-list-item-content>
                <v-list-item-title>Ingelogd als</v-list-item-title>
                <v-list-item-subtitle>{{
                  $store.state.user.email
                }}</v-list-item-subtitle>
              </v-list-item-content></router-link
            >

            <router-link v-else to="login"
              ><v-list-item-content>
                <v-list-item-title>Je bent niet ingelogd</v-list-item-title>
                <v-list-item-subtitle
                  >klik hier om in te loggen</v-list-item-subtitle
                >
              </v-list-item-content></router-link
            >
            <v-list-item-icon><v-icon>settings</v-icon> </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "navbar",

  data: () => ({
    darkMode: false,
  }),

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
};
</script>

<style scoped>
a:-webkit-any-link {
  text-decoration: none !important;
}
</style>
