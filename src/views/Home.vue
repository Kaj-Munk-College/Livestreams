<template>
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
</template>

<script>
import FlipCountdown from "vue2-flip-countdown";
import { saveAs } from "file-saver";
import * as ics from "ics";

export default {
  name: "Home",

  components: {
    FlipCountdown,
  },

  data: () => ({
    //
    loading: false,
  }),

  mounted() {},

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
};
</script>
