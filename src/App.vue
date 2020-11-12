<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <v-btn elevation="2" fab fixed bottom right @click="dialog = !dialog"
        >?</v-btn
      >
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2"> Hulp </v-card-title>

          <v-card-text>
            <h3>Oh nee er werkt iets niet wat nu?</h3>
            <h4>
              Blijf vooral rustig en bekijk de volgende veel gestelde vragen:
            </h4>
            <br />
            <b>Ziet u alleen een timer? </b>
            <br />
            <i
              >Dit kan kloppen. De timer telt af tot het moment dat de
              livestream hoort te beginnen, zodra wij klaar zijn om te beginnen
              zal hij automatisch overschakelen naar de livestream.</i
            >
            <br />
            <br />
            <b>Denkt u dat er iets anders niet naar behoren werkt?</b><br />
            <i
              >Probeer dan de webpagina te openen in incognito/prive. Dit lost
              meestal het probleem op.</i
            >

            <br /><br />
            <b>Heeft u nog andere vragen?</b> <br />
            <i
              >Bereik ons dan op: <br />
              email: av@kajmunk.nl <br />
              whatsapp: 0623315007</i
            >
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              Sluiten
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
    dialog: false,
  }),

  mounted() {},

  methods: {},
};
</script>
