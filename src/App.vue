<template>
  <v-app>
    <div v-if="$store.state.user == null && !usingMainApp">
      <mobile-start @goToApp="goToApp"></mobile-start>
    </div>
    <div v-if="$store.state.user != null || usingMainApp">
      <div class="content-container">
        <v-main style="margin-bottom: 84px">
          <router-view></router-view>
        </v-main>
        <v-btn
          elevation="2"
          fab
          fixed
          bottom
          right
          @click="dialog = !dialog"
          v-if="$route.name == 'Home'"
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
                livestream hoort te beginnen, zodra wij klaar zijn om te
                beginnen zal hij automatisch overschakelen naar de
                livestream.</i
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

        <v-footer
          absolute
          class="font-weight-medium"
          fill-width
          v-if="$route.name != 'Music'"
        >
          <v-col class="text-center" cols="12">
            <span>
              ©{{ new Date().getFullYear() }} —
              <a
                style="color: inherit; text-decoration: none; font-weight: bold"
                href="https://kajmunk.nl"
                >Kaj Munk College</a
              >
              —
              <i @click="$router.push('/backstage')">Versie: 1.2.11</i>
            </span>

            <br />
            <span
              >Website door:
              <a
                style="color: inherit; text-decoration: none; font-weight: bold"
                href="https://bramkoene.nl"
                target="_blank"
                >Bram Koene</a
              ></span
            >
          </v-col>
        </v-footer>
      </div>

      <bottom-navigation v-if="isNative" fixed></bottom-navigation>
    </div>
  </v-app>
</template>

<script>
import isElectron from "is-electron";
import { Capacitor } from "@capacitor/core";

import MobileStart from "./views/MobileStart.vue";
import BottomNavigation from "./components/util/BottomNavigation.vue";

export default {
  name: "App",

  components: {
    MobileStart,
    BottomNavigation,
  },

  data: () => ({
    //
    dialog: false,
    usingMainApp: true,
  }),

  computed: {
    isElectron() {
      return isElectron();
    },

    isNative() {
      return Capacitor.isNative;
    },
  },

  mounted() {
    if (Capacitor.isNative == true) {
      this.usingMainApp = false;
      this.$store.commit("setIsUsingBottomBar", true);
    }
  },

  methods: {
    goToApp() {
      this.usingMainApp = true;
      this.$router.go("/");
    },
  },
};
</script>

<style lang="scss">
.v-overlay__content {
}

.linkified {
  color: rgb(0, 162, 255) !important;
}

html {
  --ion-safe-area-top: env(safe-area-inset-top);
  --ion-safe-area-bottom: env(safe-area-inset-bottom);
  --ion-safe-area-left: env(safe-area-inset-left);
  --ion-safe-area-right: env(safe-area-inset-right);
}

.content-container {
  margin-top: env(safe-area-inset-top);
  margin-bottom: 48px;
}
</style>
