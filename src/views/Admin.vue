<template>
  <div>
    <navbar></navbar>

    <div v-if="!isAdmin">
      <not-as-admin-message></not-as-admin-message>
    </div>

    <v-container fluid>
      <v-row dense>
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-card>
                <v-card-title>
                  Youtube URL
                </v-card-title>
                <v-card-subtitle
                  >Change the URL of the livestream</v-card-subtitle
                >
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
          </v-row>
          <v-row>
            <v-col>
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
            <v-col>
              <v-card>
                <v-card-title primary-title>
                  Show Eindscherm
                </v-card-title>
                <v-card-subtitle>
                  Laat het eindscherm met FAQ zien (True = show)
                </v-card-subtitle>
                <v-card-text>
                  <v-switch inset label="Show End" v-model="showEnd"></v-switch>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <span v-if="!savedEnd" style="color: red"
                    >Je hebt nog niet opgeslagen.
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn @click="saveShowEnd" color="success">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title primary-title>
              Livestream Preview
            </v-card-title>
            <v-card-text>
              <div :style="styles.widthLimitter">
                <div :style="styles.renderingAreaProvider">
                  <iframe
                    :src="`https://www.youtube.com/embed/${this.youtubeID}`"
                    :style="styles.iframe"
                    frameborder="0"
                    allowfullscreen="true"
                  ></iframe>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              Countdown
            </v-card-title>
            <v-card-subtitle>Selecteer de afteltijd</v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" lg="4">
                  <v-time-picker
                    v-model="nextEventTime.time"
                    format="24hr"
                    full-width
                    landscape
                  ></v-time-picker>
                </v-col>
                <v-col cols="12" md="6" lg="4">
                  <v-date-picker
                    v-model="nextEventTime.date"
                    :landscape="true"
                    :reactive="true"
                    show-adjacent-months
                    full-width
                  ></v-date-picker>
                </v-col>
                <v-col cols="12" md="12" lg="4">
                  <v-row>
                    <v-col>
                      <v-text-field
                        name="eventname"
                        label="Evenement naam"
                        id="id"
                        v-model="nextEventTime.title"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-textarea
                        v-model="nextEventTime.announcement"
                        label="Melding"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <span v-if="!savedNextEventTime" style="color: red"
                >Je hebt nog niet opgeslagen.
              </span>
              <v-spacer></v-spacer>
              <v-btn @click="saveNextEventTime" color="success">Save</v-btn>
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
import NotAsAdminMessage from "../components/NotAsAdminMessage.vue";

export default {
  components: {
    navbar,
    NotAsAdminMessage,
  },

  data: () => ({
    drawer: false,
    group: null,
    youtubeURL: "",
    youtubeURLobject: "",
    youtubeID: "",
    savedURL: true,
    datePickerMenu: false,

    showStream: false,
    showStreamobject: null,
    savedShow: true,

    showEnd: false,
    showEndobject: null,
    savedEnd: true,

    nextEventTime: {
      date: "",
      time: "",
      title: "",
      announcement: "",
    },
    nextEventTimeObject: null,
    savedNextEventTime: false,

    rules: {
      required: (value) => !!value || "Required.",
      url: (value) => {
        //eslint-disable-next-line no-useless-escape
        const pattern = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/;
        return pattern.test(value) || "Invalid URL";
      },
    },

    styles: {
      widthLimitter: {
        maxWidth: "1000px",
      },
      renderingAreaProvider: {
        background: "#f0f0f0",
        height: 0,
        margin: "1rem 0",
        /*
         * - '56.25%' indicates the aspect rasio (9/16 = 56.25%).
         * - note that percentage inside 'padding-(top|bottom)' is calculated based on
         *   its current width. this is a specification of 'calc' used inside
         *   the 'padding-(top|bottom)' property.
         *
         * see: https://nathan.gs/2018/01/07/responsive-slideshare-iframe/
         */
        paddingBottom: "calc(56.25%)",
        position: "relative",
        width: "100%",
      },
      iframe: {
        height: "100%",
        left: 0,
        position: "absolute",
        top: 0,
        width: "100%",
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

    saveShowEnd: function() {
      db.ref("streamended").set(this.showEnd);
      this.savedEnd = true;
    },

    saveNextEventTime: function() {
      db.ref("nextEventTime").set(this.nextEventTime);
      this.savedNextEventTime = true;
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
    showEndobject: function(val) {
      this.showEnd = val[".value"];
    },
    showEnd: function() {
      this.savedEnd = this.showEnd == this.showEndobject[".value"];
    },
    nextEventTimeObject: {
      deep: true,
      handler: function(val) {
        this.nextEventTime.time = val.time;
        this.nextEventTime.date = val.date;
        this.nextEventTime.title = val.title;
        this.nextEventTime.announcement = val.announcement;
      },
    },
    nextEventTime: {
      deep: true,
      handler: function() {
        this.savedNextEventTime =
          this.nextEventTime.time == this.nextEventTimeObject.time &&
          this.nextEventTime.date == this.nextEventTimeObject.date &&
          this.nextEventTime.title == this.nextEventTimeObject.title &&
          this.nextEventTime.announcement ==
            this.nextEventTimeObject.announcement;
      },
    },
  },

  computed: {
    isAdmin() {
      // console.log(this.$store.state.user.email);
      return (
        this.$store.state.user != null &&
        this.$store.state.user.email === "av@kajmunk.nl"
      );
    },
  },

  firebase: {
    youtubeURLobject: db.ref("youtubeurl"),
    showStreamobject: db.ref("showstream"),
    showEndobject: db.ref("streamended"),
    nextEventTimeObject: db.ref("nextEventTime"),
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
