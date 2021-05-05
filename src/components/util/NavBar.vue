<template>
  <v-app-bar color="deep-blue" dark app class="titlebar">
    <!-- <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon> -->

    <v-btn
      @click="$emit('menu-button-press')"
      v-if="$route.name == 'Chat Main'"
      icon
      color="primary"
    >
      <v-icon>menu</v-icon>
    </v-btn>

    <v-toolbar-title
      @click="$router.push('/')"
      :style="isElectron ? 'padding-left: 55px' : ''"
      >Kaj Munk Livestreams {{ isElectron ? "Desktop" : "" }}</v-toolbar-title
    >

    <v-spacer></v-spacer>

    <router-link v-if="!$store.state.isUsingBottomBar" to="music"
      ><v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on"><v-icon large>music_note</v-icon></v-btn>
        </template>
        <span>Music</span>
      </v-tooltip>
    </router-link>

    <div class="text-center" v-if="!$store.state.isUsingBottomBar">
      <v-menu>
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn v-on="{ ...tooltip, ...menu }" icon
                ><v-icon large>settings</v-icon></v-btn
              >
            </template>
            <span>Instellingen</span>
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
                  $store.state.user.displayName
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
            <v-list-item-icon @click="$router.push('/login')"
              ><v-icon>settings</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import Cookies from "js-cookie";
import isElectron from "is-electron";

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

  computed: {
    isElectron() {
      return isElectron();
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
.contentPadding {
  padding-top: "56px" !important;
  padding-bottom: 0px !important;
}
.v-application p {
  margin-bottom: 0 !important;
}

scenenode {
  background-color: yellow !important;
}

a:-webkit-any-link {
  text-decoration: none !important;
}

.toptitle {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  text-align: center;
}

.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-top);
}

body {
  overflow-x: hidden;
}
</style>
