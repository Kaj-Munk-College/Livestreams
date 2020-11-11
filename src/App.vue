<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),

  mounted() {},

  methods: {
    addToCalendar: function () {
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
