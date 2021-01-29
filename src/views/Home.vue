<template>
  <div>
    <navbar></navbar>
    <div v-if="!showStream && !endofstream">
      <v-container fill-height fluid fill-width>
        <v-row align="center" justify="center">
          <v-col>
            <h1 class="text-center">Coming soon</h1>
            <h3 class="text-center">{{ nextEventTime.title }}</h3>
            <h4 class="text-center">{{ formattedDateStamp }}</h4>
            <br />
            <flip-countdown
              :deadline="`${nextEventTime.date} ${nextEventTime.time}`"
            ></flip-countdown>
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
            <br /><br />
            <div
              class="mx-10"
              v-linkified
              v-html="nextEventTime.announcement"
            ></div>
            <!-- <p class="text-center">
              Tijdens de stream kunnen er vragen gesteld worden. <br />
              Hiervoor moet u inloggen. Dit kan voor de stream.
            </p>
            <v-btn
              style="
                  margin: auto !important;
                  text-align: center;
                  display: flex;
                "
              class="ma-2"
              color="success"
              text
              @click="$router.push('/login')"
              >Klik hier om in te loggen</v-btn
            > -->
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-if="showStream && !endofstream">
      <h1 class="text-center">Live Uitzending</h1>
      <h5 class="text-center">
        Challenge voltooid of toch nog vragen? Stuur dan een whatsapp:
      </h5>
      <h4 class="text-center">+31 6 23315007</h4>
      <h5 class="text-center">
        Na de livestream komt er de mogelijk om via deze website live vragen te
        stellen.
      </h5>
      <v-container fill-width>
        <v-row>
          <v-col cols="12">
            <v-card id="youtubecard" ref="streamcard">
              <v-card-title primary-title>
                <h3>Live stream</h3>
              </v-card-title>
              <v-card-text ref="youtubecard">
                <v-spacer></v-spacer>
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
                <a :href="youtubeURL"
                  ><h4>Werkt de bovenstaande video niet? Klik dan hier</h4></a
                >
                <v-spacer></v-spacer>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- <v-col cols="12" md="5">
            
          </v-col> -->
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
import moment from "moment";
import { db } from "../main";
import navbar from "./NavBar.vue";

import EndOfStream from "../components/EndOfStream.vue";

export default {
  name: "Home",

  components: {
    FlipCountdown,
    navbar,
    EndOfStream,
  },

  data: () => ({
    //
    loading: false,
    showStream: false,
    endofstream: false,
    youtubeURL: "",
    youtubeURLobject: "",
    youtubeID: "",

    windowWidth: window.innerWidth,
    showStreamobject: null,
    endOfStreamobject: null,
    document: document,
    nextEventTime: {
      time: "10:00",
      date: "2021-1-1",
      title: "Volgende evenement aan het inladen...",
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
        start: [2021, 1, 27, 14, 15],
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
      this.showStream = val[".value"] || this.$route.hash == "#showstream";
      // this.showStream = true || val;
    },
    endOfStreamobject: function(val) {
      this.endofstream = val[".value"] || this.$route.hash == "#showend";
      // this.endofstream = false || val;
      if (this.$route.hash == "#showstream") {
        this.endofstream = false;
      }
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

    formattedDateStamp() {
      var date = moment(
        this.nextEventTime.date + " " + this.nextEventTime.time,
        "YYYY-MM-DD hh:mm"
      );
      return date.locale("nl").format("LLL");
    },
  },

  firebase: {
    youtubeURLobject: db.ref("youtubeurl"),
    showStreamobject: db.ref("showstream"),
    endOfStreamobject: db.ref("streamended"),
    nextEventTime: db.ref("nextEventTime"),
  },
};
</script>

<style lang="scss" scoped>
.videoplayer {
  left: 50%;
}
</style>
