<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="deep-blue" dark>
      <!-- <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon> -->

      <v-toolbar-title>Kleinkunstlive Admin Panel</v-toolbar-title>

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
                ><v-icon v-else
                  >check_box_outline_blank</v-icon
                ></v-list-item-icon
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

    <v-container fluid>
      <v-row dense>
        <v-col cols="auto" xs="12" sm="12" md="6">
          <v-card>
            <v-card-title>
              Youtube URL
            </v-card-title>
            <v-card-subtitle>Change the URL of the livestream</v-card-subtitle>
            <v-card-text>
              <v-text-field
                name="Youtube URL"
                label="Youtube URL"
                id="yturl"
                v-model="youtubeURL"
                :rules="[rules.required, rules.url]"
                dense
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <span v-if="!savedURL" style="color: red"
                >Je hebt nog niet opgeslagen.
              </span>
              <v-spacer></v-spacer>
              <v-btn @click="saveYoutubeURL" color="success">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="auto" xs="12" sm="12" md="6">
          <v-card>
            <v-card-title primary-title>
              Livestream Preview
            </v-card-title>
            <v-card-text>
              <youtube
                style="max-width: 1000px"
                :video-id="youtubeID"
              ></youtube>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { db } from "../main";
import { getIdFromURL } from "vue-youtube-embed";

export default {
  data: () => ({
    drawer: false,
    group: null,
    darkMode: false,
    youtubeURL: "",
    youtubeURLobject: "",
    youtubeID: "",
    savedURL: true,

    rules: {
      required: (value) => !!value || "Required.",
      url: (value) => {
        //eslint-disable-next-line no-useless-escape
        const pattern = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/;
        return pattern.test(value) || "Invalid URL";
      },
    },
  }),

  methods: {
    saveYoutubeURL: function() {
      //eslint-disable-next-line no-useless-escape
      var regex = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/;
      if (regex.test(this.youtubeURL)) {
        db.ref("youtubeurl").set(this.youtubeURL);
        this.savedURL = true;
      } else {
        console.warn("regex failed");
      }
    },
  },

  watch: {
    darkMode: function(val) {
      this.$vuetify.theme.dark = val;
      Cookies.set("darkMode", this.darkMode);
    },
    youtubeURLobject: function(val) {
      console.log(val);
      this.youtubeURL = this.youtubeURLobject[".value"];
    },
    youtubeURL: function(val) {
      this.youtubeID = getIdFromURL(val);
      this.savedURL = this.youtubeURL == this.youtubeURLobject[".value"];
    },
  },

  mounted() {
    this.darkMode =
      Cookies.get("darkMode") != undefined
        ? Cookies.get("darkMode")
        : (this.darkMode = false);
  },

  firebase: {
    youtubeURLobject: db.ref("youtubeurl"),
  },
};
</script>

<style>
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
}
body {
  overflow-x: hidden;
}
</style>
