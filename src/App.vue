<template>
  <v-app>
    <v-main style="margin-bottom: 84px">
      <router-view></router-view>
    </v-main>
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
            >Dit kan kloppen. De timer telt af tot het moment dat de livestream
            hoort te beginnen, zodra wij klaar zijn om te beginnen zal hij
            automatisch overschakelen naar de livestream.</i
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

    <v-footer absolute class="font-weight-medium" fill-width>
      <v-col class="text-center" cols="12">
        <span>
          ©{{ new Date().getFullYear() }} —
          <a
            style="color: inherit; text-decoration: none; font-weight: bold"
            href="https://kajmunk.nl"
            >Kaj Munk College</a
          >
          —
          <i @click="$router.push('/backstage')">Versie: 1.2.9</i>
        </span>

        <br />
        <span
          >Website door:
          <a
            style="color: inherit; text-decoration: none; font-weight: bold"
            href="https://github.com/minestarnl"
            target="_blank"
            >Bram Koene</a
          ></span
        >
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import isElectron from 'is-electron';

export default {
  name: "App",

  components: {},

  data: () => ({
    //
    dialog: false,
  }),

  computed: {
    isElectron() {
      return isElectron();
    }
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss">
.v-overlay__content {
}

.linkified {
  color: rgb(0, 162, 255) !important;
}
</style>
