<template>
  <div>
    <navbar></navbar>
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
        <v-col cols="auto" xs="12" sm="6" md="3">
          <v-card>
            <v-card-title primary-title>
              Show Stream
            </v-card-title>
            <v-card-subtitle>
              Show the livestream instead of the countdown (True = show)
            </v-card-subtitle>
            <v-card-text>
              <v-switch
                inset
                label="Show Stream"
                v-model="showStream"
              ></v-switch>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <span v-if="!savedShow" style="color: red"
                >Je hebt nog niet opgeslagen.
              </span>
              <v-spacer></v-spacer>
              <v-btn @click="saveShowStream" color="success">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { db } from "../main";
import { getIdFromURL } from "vue-youtube-embed";
import navbar from "./NavBar.vue";

export default {
  components: {
    navbar,
  },

  data: () => ({
    drawer: false,
    group: null,
    youtubeURL: "",
    youtubeURLobject: "",
    youtubeID: "",
    savedURL: true,

    showStream: false,
    showStreamobject: null,
    savedShow: true,

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

    saveShowStream: function() {
      db.ref("showstream").set(this.showStream);
      this.savedShow = true;
    },
  },

  watch: {
    youtubeURLobject: function(val) {
      console.log(val);
      this.youtubeURL = this.youtubeURLobject[".value"];
    },
    youtubeURL: function(val) {
      this.youtubeID = getIdFromURL(val);
      this.savedURL = this.youtubeURL == this.youtubeURLobject[".value"];
    },
    showStreamobject: function(val) {
      this.showStream = val[".value"];
    },
    showStream: function() {
      this.savedShow = this.showStream == this.showStreamobject[".value"];
    },
  },

  firebase: {
    youtubeURLobject: db.ref("youtubeurl"),
    showStreamobject: db.ref("showstream"),
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
