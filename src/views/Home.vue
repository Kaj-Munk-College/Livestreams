<template>
  <div>
    <div v-if="!showStream">
      <v-container fill-height fluid fill-width>
        <v-row align="center" justify="center">
          <v-col>
            <h1 class="text-center">Coming soon</h1>
            <h3 class="text-center">Kleinkunstavond</h3>
            <h4 class="text-center">13 November 19:30</h4>
            <br />
            <flip-countdown deadline="2020-11-13 19:30:00"></flip-countdown>
            <br />
            <span class="fill-width" style="width: 100%">
              <v-btn
                style="
                  margin: auto !important;
                  text-align: center;
                  display: flex;
                "
                class="ma-2"
                :loading="loading"
                :disabled="loading"
                color="secondary"
                @click="addToCalendar"
              >
                Voeg toe aan calender
              </v-btn>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-if="showStream">
      <v-container>
        <v-row>
          <v-col>
            <v-card id="youtubecard">
              <v-card-title primary-title>
                <h3>Kleinkunst live stream</h3>
              </v-card-title>
              <v-card-text ref="youtubecard">
                <v-spacer></v-spacer>
                <youtube
                  :player-width="youtubeWidth"
                  :player-height="youtubeHeight"
                  :video-id="youtubeID"
                  class="videoplayer"
                ></youtube>
                <a :href="youtubeURL"
                  ><h4>Werkt de bovenstaande video niet? Klik dan hier</h4></a
                >
                <v-spacer></v-spacer>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import FlipCountdown from "vue2-flip-countdown";
import { saveAs } from "file-saver";
import * as ics from "ics";
import { getIdFromURL } from "vue-youtube-embed";
import { db } from "../main";

export default {
  name: "Home",

  components: {
    FlipCountdown,
  },

  data: () => ({
    //
    loading: false,
    showStream: true,
    youtubeURL: "",
    youtubeURLobject: "",
    youtubeID: "",

    windowWidth: window.innerWidth,
    showStreamobject: null,
    document: document,
  }),

  mounted() {
    console.log(db);

    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },

  methods: {
    addToCalendar: function() {
      this.loading = true;
      const event = {
        start: [2020, 11, 13, 19, 30],
        duration: { hours: 1, minutes: 0 },
        title: "Kleinkunstavond",
        description: "Bekijk de kleinkunstavond",
        location: "Livestream",
        url: "https://kleinkunstlive.kajmunk.nl",
        categories: ["Kaj Munk College", "kleinkunstavond"],
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: { name: "Kaj munkcollege", email: "av@kajmunk.nl" },
      };

      ics.createEvent(event, (error, value) => {
        if (error) {
          console.log(error);
          return;
        }

        var data = new Blob([value], { type: "text/x-vCalendar" });

        saveAs(data, "kleinkunstavond.ics");
        this.loading = false;
      });
    },
  },

  watch: {
    youtubeURLobject: function() {
      this.youtubeURL = this.youtubeURLobject[".value"];
    },
    youtubeURL: function(val) {
      this.youtubeID = getIdFromURL(val);
      this.savedURL = this.youtubeURL == this.youtubeURLobject[".value"];
    },
    showStreamobject: function(val) {
      this.showStream = val[".value"];
    },
  },

  computed: {
    youtubeWidth() {
      return document.getElementById("youtubecard")
        ? document.getElementById("youtubecard").offsetWidth - 50
        : 300;
      // return 100;
    },

    youtubeHeight() {
      return (this.youtubeWidth / 16) * 9;
    },
  },

  firebase: {
    youtubeURLobject: db.ref("youtubeurl"),
    showStreamobject: db.ref("showstream"),
  },
};
</script>

<style lang="scss" scoped>
.videoplayer {
  left: 50%;
}
</style>
