<template>
  <div>
    <navbar></navbar>
    <div v-if="!showStream && !endofstream">
      <v-container fill-height fluid fill-width>
        <v-row align="center" justify="center">
          <v-col>
            <h1 class="text-center">Coming soon</h1>
            <h3 class="text-center">Live Informatie Avond</h3>
            <h4 class="text-center">6 Januari 19:30</h4>
            <br />
            <flip-countdown deadline="2021-01-13 19:30:00"></flip-countdown>
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
            <br />
            <br />
            <br />
            <br /><br />
            <p class="text-center">
              Zometeen is er de mogelijkheid om vragen te stellen tijdens de
              livestream. <br />
              Hiervoor is het handig om alvast in te loggen.
            </p>
            <v-btn
              style="
                  margin: auto !important;
                  text-align: center;
                  display: flex;
                "
              class="ma-2"
              color="success"
              @click="$router.push('/login')"
              >Klik hier om in te loggen</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-if="showStream && !endofstream">
      <v-container fill-width>
        <v-row>
          <v-col cols="7">
            <v-card id="youtubecard" ref="streamcard">
              <v-card-title primary-title>
                <h3>Live stream</h3>
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
          <v-col cols="5">
            <asking-question-box></asking-question-box>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-if="endofstream">
      <end-of-stream></end-of-stream>
    </div>
  </div>
</template>

<script>
import FlipCountdown from "vue2-flip-countdown";
import { saveAs } from "file-saver";
import * as ics from "ics";
import { getIdFromURL } from "vue-youtube-embed";
import { db } from "../main";
import navbar from "./NavBar.vue";

import AskingQuestionBox from "./streampage/QuestionAsking";
import EndOfStream from "../components/EndOfStream.vue";

export default {
  name: "Home",

  components: {
    FlipCountdown,
    AskingQuestionBox,
    navbar,
    EndOfStream,
  },

  data: () => ({
    //
    loading: false,
    showStream: true,
    endofstream: false,
    youtubeURL: "",
    youtubeURLobject: "",
    youtubeID: "",

    windowWidth: window.innerWidth,
    showStreamobject: null,
    endOfStreamobject: null,
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
        start: [2021, 11, 13, 19, 30],
        duration: { hours: 1, minutes: 0 },
        title: "Livestream",
        description: "Bekijk de livestream",
        location: "Livestream",
        url: "https://livestream.kajmunk.nl",
        categories: ["Kaj Munk College", "livestream"],
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

        saveAs(data, "kajmunkstream.ics");
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
      // this.showStream = val[".value"];
      this.showStream = true || val;
    },
    endOfStreamobject: function(val) {
      this.endofstream = val[".value"];
      // this.endofstream = true || val;
    },
  },

  computed: {
    youtubeWidth() {
      // console.log(this.$refs.$el.offsetWidth);
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
    endOfStreamobject: db.ref("streamended"),
  },
};
</script>

<style lang="scss" scoped>
.videoplayer {
  left: 50%;
}
</style>
