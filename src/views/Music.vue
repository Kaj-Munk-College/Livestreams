<template>
  <div class="container">
    <navbar></navbar>

    <h3 style="margin-bottom: 12px">Huidige nummers</h3>
    <!-- List all songs -->
    <div class="musicList">
      <v-expansion-panels accordion inset focusable hover tile>
        <v-expansion-panel v-for="(item, i) in activeSongs" :key="i">
          <v-expansion-panel-header>{{ i }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list v-for="(song, index) in item" :key="index">
              <v-list-item @click="changeSong(song, $event)">
                <v-list-item-icon>
                  <v-icon>play_arrow</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ song.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Lentefeest {{ i }}, Dans
                    {{ song.number }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    ripple
                    class="DownloadButton"
                    @click="downloadSongMP3(song)"
                  >
                    <v-icon color="grey lighten-1">get_app </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <v-divider style="margin-top: 20px"></v-divider>
    <h3 style="margin-bottom: 12px; margin-top: 5px">Archief</h3>

    <!-- List all songs -->
    <div class="musicList">
      <v-expansion-panels
        accordion
        inset
        focusable
        hover
        tile
        style="margin-bottom: 120px"
      >
        <v-expansion-panel v-for="(item, i) in years" :key="i">
          <v-expansion-panel-header>{{ i }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list v-for="(song, index) in item" :key="index">
              <v-list-item @click="changeSong(song, $event)">
                <v-list-item-icon>
                  <v-icon>play_arrow</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ song.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Lentefeest {{ i }}, Dans
                    {{ song.number }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    ripple
                    class="DownloadButton"
                    @click="downloadSongMP3(song)"
                  >
                    <v-icon color="grey lighten-1">get_app </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- Bottom control panel -->
    <v-footer
      app
      fixed
      width="100%"
      padless
      px-5
      pr-5
      pt-3
      :style="
        $store.state.isUsingBottomBar
          ? 'margin-bottom: 70px'
          : 'margin-bottom: 0px'
      "
    >
      <v-row class="align-center pt-3 px-2 pb-3" no-gutters>
        <v-col
          class="align-center"
          :cols="$vuetify.breakpoint.xs ? 2 : 1"
          justify-center
        >
          <v-btn ref="playPauseButton" icon @click="playPause">
            <v-icon v-if="playing">pause</v-icon>
            <v-icon v-else>play_arrow</v-icon>
          </v-btn>
        </v-col>

        <!-- <v-spacer></v-spacer> -->

        <v-col
          :cols="$vuetify.breakpoint.xs ? 9 : overlay ? 8 : 9"
          class="align-center"
        >
          <v-row pl-5 ml-5>
            <span pl-5 ml-5>{{ title }}</span>
          </v-row>
          <v-row v-if="!overlay">
            <v-col cols="2">
              <span>{{ currentTime }}</span>
            </v-col>
            <v-col :cols="8">
              <v-slider
                :max="durationSeconds"
                v-model="currentSeconds"
                min="0"
                step="0.2"
                hide-details
                @change="updatePlaybackTime"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              <span>{{ durationTime }}</span>
            </v-col>
          </v-row>
        </v-col>

        <v-spacer></v-spacer>

        <v-col align-self="center" v-if="overlay" cols="1">
          <v-btn
            @click="visualizerSettingsSheet = !visualizerSettingsSheet"
            left
          >
            <v-icon>settings</v-icon>
          </v-btn>
        </v-col>

        <v-col
          align-self="center"
          v-if="!isMobile() && !$vuetify.breakpoint.xs"
          cols="1"
        >
          <v-menu
            open-on-hover
            top
            offset-y
            close-delay="500"
            allow-overflow
            :z-index="10"
            background-opacity="0%"
            :close-on-click="false"
          >
            <template v-slot:activator="{ on }">
              <div
                v-on="on"
                class="v-btn v-btn--contained v-btn--left v-size--default v-btn__content v-icon"
                @click="toggleMute()"
              >
                <v-icon v-if="volume > 80">volume_up</v-icon>
                <v-icon v-else-if="volume > 30">volume_down</v-icon>
                <v-icon v-else-if="volume > 0">volume_mute</v-icon>
                <v-icon v-else>volume_off</v-icon>
              </div>
            </template>
            <span>
              <v-slider
                vertical
                px-5
                class="hideOverflow"
                opacity="0%"
                v-model="volume"
                min="0"
                max="100"
              ></v-slider>
            </span>
          </v-menu>
        </v-col>
        <v-col align-self="center" cols="1" v-if="!$vuetify.breakpoint.xs">
          <v-btn @click="overlay = !overlay" left>
            <v-icon v-if="overlay">keyboard_arrow_down</v-icon>
            <v-icon v-else>keyboard_arrow_up</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>

    <!-- Overlay with extra info and visualizer -->
    <transition name="overlaytransition">
      <v-overlay v-show="overlay" class="overlay" opacity="0.8">
        <audio
          :loop="innerLoop"
          ref="audioFile"
          preload="auto"
          style="display: none;"
          :src="file"
          title="title"
          author="Kaj Munk College"
          id="audio"
          playsinline
        ></audio>
        <div
          v-if="!isMobile() || !isNative"
          id="analyzer"
          class="analyzer"
          ref="analyzer"
          style="margin: auto;margin-left: 40px;"
        ></div>

        <v-row class="ml-2" style="margin-left: -4px">
          <span>{{ title }}</span>
        </v-row>
        <v-row></v-row>
        <v-row class="pa-5">
          <v-col cols="1">
            <span>{{ currentTime }}</span>
          </v-col>
          <v-col cols="10">
            <v-slider
              :max="durationSeconds"
              v-model="currentSeconds"
              min="0"
              step="0.2"
              hide-details
              @change="updatePlaybackTime"
              width="50%"
            ></v-slider>
          </v-col>
          <v-col cols="1">
            <span>{{ durationTime }}</span>
          </v-col>
        </v-row>
        <v-btn fab medium fixed top right @click="fullscreenToggle">
          <v-icon v-if="!fullscreen">fullscreen</v-icon>
          <v-icon v-else>fullscreen_exit</v-icon>
        </v-btn>
      </v-overlay>
    </transition>

    <!-- Settings for the visualizer -->
    <v-bottom-sheet v-model="visualizerSettingsSheet">
      <v-sheet class="text-center">
        <v-dialog v-model="importSettingsModal" max-width="290">
          <template v-slot:activator="{ on }">
            <v-btn color="blue" text class="mt-6" v-on="on">Importeer</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline"
              >Imorteer configuratie bestand</v-card-title
            >
            <v-card-text
              ><v-file-input
                v-model="settingsFile"
                accept=".json"
                label="File input"
              ></v-file-input
            ></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-1"
                text
                @click="importSettingsModal = false"
                >sluiten</v-btn
              >
              <v-btn
                color="green darken-1"
                text
                @click="
                  importSettingsModal = false;
                  setUploadedFileAsSettings();
                "
                >importeer</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          class="mt-6"
          text
          color="red"
          @click="visualizerSettingsSheet = !visualizerSettingsSheet"
          >sluiten</v-btn
        >
        <v-btn
          class="mt-6"
          text
          color="blue"
          @click="
            downloadObjectAsJson(settings, 'livescriptMusicVisualizerSettings')
          "
          >Download</v-btn
        >
        <div class="py-3 px-3">
          <v-row>
            <v-col>
              <v-checkbox
                v-model="settings.loRes"
                :label="`Lage resolutie`"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="settings.showPeaks"
                :label="`Pieken`"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="settings.showScale"
                :label="`Schaal`"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="settings.showLeds"
                :label="`Leds`"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="settings.mode"
                :hint="`${settings.mode.name}, ${settings.mode.val}`"
                :items="settingsExtras.audioMotionModes"
                item-text="name"
                item-value="val"
                label="Modus"
                persistent-hint
                return-object
                single-line
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                :items="settingsExtras.gradients"
                v-model="settings.gradient"
                label="Gradient"
                hint="Gradient"
                persistent-hint
                single-line
                menu-props="auto"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-slider
                v-model="settings.smoothing"
                class="align-center"
                :min="0"
                :max="1"
                hide-details
                :label="`Smoothing: ${settings.smoothing}`"
                :persistent-hint="true"
                :step="0.01"
              >
              </v-slider>
            </v-col>

            <v-col>
              <v-slider
                v-model="settings.fftSize"
                class="align-center"
                :min="5"
                :max="14"
                hide-details
                label="Cluster"
                :persistent-hint="true"
                :step="1"
              >
              </v-slider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-range-slider
                v-model="settings.DecibelsRange"
                :max="settingsExtras.DecibelsRange.max"
                :min="settingsExtras.DecibelsRange.min"
                hide-details
                class="align-center"
                hint="Grafiek bereik"
                :persistent-hint="true"
                label="Grafiek bereik"
              >
                <template v-slot:prepend>
                  <v-text-field
                    :value="settings.DecibelsRange[0]"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                    @change="$set(settings.DecibelsRange, 0, $event)"
                  ></v-text-field>
                </template>
                <template v-slot:append>
                  <v-text-field
                    :value="settings.DecibelsRange[1]"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                    @change="$set(settings.DecibelsRange, 1, $event)"
                  ></v-text-field>
                </template> </v-range-slider></v-col
          ></v-row>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import AudioMotionAnalyzer from "audiomotion-analyzer";
import Cookies from "js-cookie";
import Navbar from "../components/util/NavBar";
import { Capacitor } from "@capacitor/core";
// import { Plugins } from "@capacitor/core";
// const { CapacitorMusicControls } = Plugins;

const convertTimeHHMMSS = (val) => {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);

  return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
};

export default {
  name: "music",
  components: {
    Navbar,
  },
  data: function() {
    return {
      isNative: Capacitor.isNative == true,
      overlay: false,
      audio: undefined,
      currentSeconds: 0,
      durationSeconds: 0,
      innerLoop: false,
      loaded: false,
      playing: false,
      previousVolume: 35,
      volume: 100,
      autoPlay: true,
      file: "",
      title: "No Song Playing",
      windowWidth: 0,
      audioMotion: null,
      visualizerSettingsSheet: false,
      importSettingsModal: false,
      fullscreen: false,
      settingsFile: null,
      settings: {
        loRes: false,
        showPeaks: true,
        showScale: false,
        mode: { name: "1/4th octave bands", val: 5 },
        DecibelsRange: [-85, -15],
        gradient: "classic",
        smoothing: 0.5,
        fftSize: 11,
        showLeds: false,
      },
      settingsExtras: {
        DecibelsRange: {
          min: -85,
          max: 0,
        },
        gradients: ["classic", "prism", "rainbow"],
        audioMotionModes: [
          {
            name: "Discrete frequencies",
            val: 0,
          },
          {
            name: "1/24th octave bands",
            val: 1,
          },
          {
            name: "1/12th octave bands",
            val: 2,
          },
          {
            name: "1/8th octave bands",
            val: 3,
          },
          {
            name: "1/6th octave bands",
            val: 4,
          },
          {
            name: "1/4th octave bands",
            val: 5,
          },
          {
            name: "1/3rd octave bands",
            val: 6,
          },
          {
            name: "half octave bands",
            val: 7,
          },
          {
            name: "full octave bands",
            val: 8,
          },
          {
            name: "Line / Area graph",
            val: 10,
          },
        ],
      },

      activeSongs: {
        "2020 MLF Maandag/Woensdag": [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fmaandag%2FMLF2020-Dans%201.mp3?alt=media&token=4d36d17f-1302-4210-b6ff-ef4b42fe8a25",
            name: "MLF2020-Dans 1",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fmaandag%2F1HM1%20jongens.mp3?alt=media&token=4bfc76d7-e2cf-4fb7-b8ee-eaa67f7d8a28",
            name: "1HM1 jongens",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fmaandag%2F1VS1%20Jongens.mp3?alt=media&token=f2109156-b967-470b-835d-161498c3325f",
            name: "1VS1 Jongens",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fmaandag%2F1B1%20jongens.mp3?alt=media&token=e48db98c-c92c-4c78-91b0-4f757540be83",
            name: "1B1 jongens",
            number: "4",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fmaandag%2F1HMB1%20meiden%20versie%201.mp3?alt=media&token=58e21ed3-3cee-4265-babd-132541a0913d",
            name: "1HMB1 meiden",
            number: "5",
          },
        ],
        "2020 MLF Dinsdag": [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdinsdag%2FMLF%20Dans%201%20Dinsdag.mp3?alt=media&token=c11c3b59-f4fd-417f-8ec2-b962e7b84a10",
            name: "Dans 1 Dinsdag",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdinsdag%2FMLF%20Dans%202%20Dinsdag.mp3?alt=media&token=3501b615-8f85-4afa-ad20-6ee60a116638",
            name: "Dans 2 Dinsdag",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdinsdag%2FMLF%20Dans%203%20Dinsdag.mp3?alt=media&token=d1eb844f-9753-42eb-8a52-efd1580fdf4f",
            name: "Dans 3 Dinsdag",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdinsdag%2FMLF%20Dans%204%20Dinsdag.mp3?alt=media&token=98e2025d-9a06-4b88-94d5-c3710968f0ae",
            name: "Dans 4 Dinsdag",
            number: "4",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdinsdag%2FMLF%20Dans%205%20Dinsdag.mp3?alt=media&token=b52a4e34-e5e7-44c0-88d2-377523f03b66",
            name: "Dans 5 Dinsdag",
            number: "5",
          },
        ],
        "2020 MLF Donderdag": [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdonderdag%2FMLF%20Dans%201%20Donderdag.mp3?alt=media&token=82764eb5-c346-4050-854f-b1d5f04ab5b5",
            name: "Dans 1 Donderdag",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdonderdag%2FMLF%20Dans%202%20Donderdag.mp3?alt=media&token=1bab0a5a-f4f0-461a-81ae-79c948885a34",
            name: "Dans 2 Donderdag",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdonderdag%2FMLF%20Dans%203%20Donderdag.mp3?alt=media&token=c57a0b70-b595-4504-b23d-ad8b98119091",
            name: "Dans 3 Donderdag",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%20MLF%2Fdonderdag%2F1HMB%20Meiden%20mix.mp3?alt=media&token=c7f57cc2-2456-490c-a3f0-b0c703d5d93b",
            name: "Dans 4 Donderdag",
            number: "4",
          },
        ],
      },

      // TODO: Use remote files
      years: {
        2020: [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%2FDans%201%20extended_mixdown.mp3?alt=media&token=24c710d9-5d6a-4bbc-9fd4-a5ac1d6cacf1",
            name: "Dans 1",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%2FDans%202_def.mp3?alt=media&token=dcdb4356-13ef-4172-82c1-2f10b5f3474a",
            name: "Dans 2",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%2FDans%203_def.mp3?alt=media&token=ce225c09-21c7-4115-b40a-b3dd8aa5ffa6",
            name: "Dans 3",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%2FDans%204_def.mp3?alt=media&token=aa9e55b3-3156-4fcf-8f0e-d5ce11e42dce",
            name: "Dans 4",
            number: "4",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%2FDans%205_DEFF.mp3?alt=media&token=28c68cd4-03d2-4260-9b81-342828dd53ea",
            name: "Dans 5",
            number: "5",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2020%2FDD_def.mp3?alt=media&token=fdd1ff0b-600b-4443-b550-f4f8fb959df5",
            name: "Docentendans",
            number: "DD",
          },
        ],
        2019: [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2019%2FDans%201%20LF%201819.mp3?alt=media&token=7a947d23-4ae2-4c3c-b73e-6f0ed5cbba9b",
            name: "Dans 1",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2019%2FDans%202%20LF%201819.mp3?alt=media&token=efde108b-018e-48c0-b13f-058a359c70da",
            name: "Dans 2",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2019%2FDans%203%20LF%201819.mp3?alt=media&token=b42c7153-efff-418a-aab9-edf159732671",
            name: "Dans 3",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2019%2FDans%204%20LF%201819.mp3?alt=media&token=54ff8206-99bb-4f9f-8a5a-b80836793473",
            name: "Dans 4",
            number: "4",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2019%2FDans%205%20LF%201819.mp3?alt=media&token=b1c98642-43c8-4c3e-9018-b20eb2881ecf",
            name: "Dans 5",
            number: "5",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2019%2FDocenten%20LF%201819.mp3?alt=media&token=557b03d2-f1bb-4371-ae6c-957d0c832509",
            name: "Docentendans",
            number: "DD",
          },
        ],
        2018: [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2018%2FLF18%20Down%20The%20Rabbithole.mp3?alt=media&token=d085feeb-ebf8-47f2-a4b4-1e8959613237",
            name: "Down The Rabbithole",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2018%2FLF18%20Dark%20Woods%20(Part%20I).mp3?alt=media&token=17fc647e-bdb7-4d89-832a-40f70e939777",
            name: "Dark Woods (Part I)",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2018%2FLF18%20Dark%20Woods%20(Part%20II).mp3?alt=media&token=9f0ec844-4306-48b7-8951-e634f6f4c388",
            name: "Dark Woods (Part II)",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2018%2FLF18%20Half%20Time%20Show.mp3?alt=media&token=7e1ee3e4-cdc7-4150-9cda-e8eeb5ffc18a",
            name: "Half Time Show",
            number: "4",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2018%2FLF18%20Queen%20of%20Hearts.mp3?alt=media&token=27b250bc-99f3-4883-9dfe-84d62732e2f9",
            name: "Queen of Hearts",
            number: "5",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2018%2FLF18%20Royalty.mp3?alt=media&token=89f5c907-ec98-44a9-a816-f6eca9af0cbf",
            name: "Royalty",
            number: "6",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2018%2FLF18%20Docentendans.mp3?alt=media&token=c160e439-1180-41b6-b0aa-b14d22dc947f",
            name: "Docentendans",
            number: "DD",
          },
        ],
        2017: [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%2FLF17%2001%20Fun-eral%20.mp3?alt=media&token=9682a375-71f4-40b1-890b-8a820d6f10b1",
            name: "Fun-eral",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%2FLF17%2002%20From%20Paris%20With%20Love.mp3?alt=media&token=75c3f95f-5c3a-4de4-b1ce-023a1ace9b14",
            name: "From Paris With Love",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%2FLF17%2003%20Trojan%20Battle.mp3?alt=media&token=c49bab37-8b27-4e42-ad17-43a0380d90b2",
            name: "Trojan Battle",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%2FLF17%2004%20Heroic%20Sailing.mp3?alt=media&token=a4980c54-d73a-4f07-a6af-7a0a88225dc4",
            name: "Heroic Sailing",
            number: "4",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%2FLF17%2005%20Olympic%20Seduction.mp3?alt=media&token=abe735f3-f055-43bf-9647-7f12de85d950",
            name: "Olympic Seduction",
            number: "5",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%2FLF17%2006%20DD%20Fallen%20Stars.mp3?alt=media&token=80e212ff-66cd-4a0d-91a3-13658a7c5782",
            name: "DD Fallen Stars",
            number: "DD",
          },
        ],
        "2017 MLF": [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%20MLF%2FMLF17%20Generation%20.mp3?alt=media&token=b9a3b87c-e839-4edb-92f8-f8cd4049da69",
            name: "Generation",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%20MLF%2FMLF17%20Personal.mp3?alt=media&token=a46b037f-20b9-461f-b9be-33c47b2250a7",
            name: "Personal",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2017%20MLF%2FMLF17%20Seasons%20of%20Love.mp3?alt=media&token=b6f03ebf-7c04-4204-8c0a-978c39cc3860",
            name: "Seasons of Love",
            number: "3",
          },
        ],
        2016: [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2016%2FLF%2016%20Time%20lapse.mp3?alt=media&token=27ad5efe-8dbe-496a-a4df-50c4c67702e8",
            name: "Time lapse",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2016%2FLF%2016%20Golddiggers.mp3?alt=media&token=ce840232-aec6-449a-80f7-bb5a1250b380",
            name: "Golddiggers",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2016%2FLF%2016%20Kroeg.mp3?alt=media&token=aed41d59-61ea-4f67-b08f-50b1c2111be8",
            name: "Kroeg",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2016%2FLF%2016%20Discotheek.mp3?alt=media&token=79ceff56-ef9f-4057-a5c2-16d04f5f0f83",
            name: "Discotheek",
            number: "4",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2016%2FLF%2016%20Living%20Art.mp3?alt=media&token=e2c3f5bf-7f73-4118-9db6-ec65c3f23a90",
            name: "Living Art",
            number: "5",
          },
        ],
        2015: [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2015%2FLF%2015%20Born%20in%20The%20USA.mp3?alt=media&token=36246236-329a-4ba1-9bb9-400022f76236",
            name: "Born in The USA",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2015%2FLF%2015%20Fifties%20Retro.mp3?alt=media&token=3d92f745-bf13-4472-a0d8-e6479fd4fbcb",
            name: "Fifties Retro",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2015%2FLF%2015%20Lethal%20Marriage.mp3?alt=media&token=07bf625a-0def-4475-9e1a-2beba2121dd3",
            name: "Lethal Marriage",
            number: "3",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2015%2FLF%2015%20Lethal%20Pain.mp3?alt=media&token=89749cdf-2123-464a-80d7-ef66cc71f43f",
            name: "Lethal Pain",
            number: "4",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2015%2FLF%2015%20Lethal%20Seduction.mp3?alt=media&token=1fd1f8f5-0f7d-4295-9c54-c8ca487e2ab8",
            name: "Lethal Seduction",
            number: "5",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2015%2FLF%2015%20Lethal%20Truth%20def.mp3?alt=media&token=f74bacce-113d-4866-9a56-8ad775b98dad",
            name: "Lethal Truth",
            number: "6",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2015%2FLF%2015%20Lethal%20deals.mp3?alt=media&token=8bdf7a99-a325-4cae-9354-880dabd2f1f0",
            name: "Lethal deals",
            number: "7",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2015%2FLF%2015%20Popoz%20def.mp3?alt=media&token=46d52d91-a647-461e-a7db-d8f5ac1f63db",
            name: "Popoz def",
            number: "8",
          },
        ],
        2014: [
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2014%2FLF%2014%20Laag%202%20Rockmix.mp3?alt=media&token=bfc2d3c5-a179-40cd-a4c4-79dadc3d1578",
            name: "Laag 2 Rockmix",
            number: "1",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2014%2FLF14%20Dance%20Crew%20Gevaarlijke%20jongens.mp3?alt=media&token=0e33ea4a-2125-4a26-86de-df9d7f05eec9",
            name: "Dance Crew Gevaarlijke jongens",
            number: "2",
          },
          {
            file:
              "https://firebasestorage.googleapis.com/v0/b/livescript-kmc.appspot.com/o/muziek%2F2014%2FLF14%20Laag%204%20Jukebox%20Battle.mp3?alt=media&token=ed0cc752-a4e8-4143-9a12-1c558ec3e610",
            name: "Laag 4 Jukebox Battle",
            number: "3",
          },
        ],
      },
    };
  },
  methods: {
    /**
     * Changes song and creates audio visualizer
     */
    changeSong: function(song, event) {
      // If the download button is pressed do not start playing a song
      if (event.target.innerText == "get_app") return;

      // Set the local variables appropiatly
      this.playing = false;
      this.file = song.file;
      this.title = song.name;

      // Creates an visiualizer and configures it with default values
      if (this.audioMotion == null) {
        this.audioMotion = new AudioMotionAnalyzer(
          document.getElementById("analyzer"),
          {
            barSpace: 0.3,
            bgAlpha: 0,
            fftSize: 2048,
            fillAlpha: 1,
            gradient: "classic",
            lineWidth: 0,
            loRes: false,
            lumiBars: false,
            maxDecibels: -15,
            maxFreq: 22000,
            minDecibels: -85,
            minFreq: 20,
            mode: 3,
            overlay: true,
            showFPS: false,
            showLeds: false,
            showPeaks: true,
            showScale: true,
            smoothing: 0.5,
            source: document.getElementById("audio"),
            start: true,
          }
        );

        // Create some custom gradients
        this.createGradient("Jochem", false, [
          "#00FA9A",
          "#00FA9A",
          "#00FA9A",
          "#9400D3",
          "#9370DB",
        ]);
        this.createGradient("weirdo", false, ["#8E54E9", "#4776E6"]);
        this.createGradient("QkeleQ10", true, ["#00FDC3", "#3CC4FC"]);

        // Gets any potential saved cookies for the visualizer settings and applies them if present
        if (Cookies.get("visualizerSettings")) {
          this.settings = JSON.parse(Cookies.get("visualizerSettings"));
        }
      }

      // Sets up the visualizer canvas
      this.setVisualizerCanvas();

      // Auto start playing if it is a mobile device (iOS). Otherwise the user has to tap the song twice
      if (this.isMobile()) {
        setTimeout(() => {
          this.playing = true;
        }, 500);
      }

      // sets cors of the audio player to play the audio from the external source
      this.audio.crossOrigin = "anonymous";

      // Loads the audio
      this.audio.load(); //suspends and restores all audio element
    },

    /**
     * Toggles this.playing between true and false. Always sets the opposite of current value
     */
    playPause: function() {
      this.playing = !this.playing;
    },

    /**
     * Update time variable to sync with the player time var
     */
    update() {
      this.currentSeconds = parseInt(this.audio.currentTime);
    },

    /**
     * Loads audio file and starts playing file
     */
    load() {
      if (this.audio.readyState >= 2) {
        this.loaded = true;
        this.durationSeconds = parseInt(this.audio.duration);
        this.playing = true;
        return;
      }

      throw new Error("Failed to load sound file.");
    },

    /**
     * Sets the time property of the audio player
     */
    updatePlaybackTime(time) {
      this.audio.currentTime = time;
    },

    /**
     * Tests users browser agent
     * @returns {bool} true if is ios device
     */
    isMobile() {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Keeps local variables regarding screen size in sync with browser values
     */
    onResize() {
      this.windowWidth = window.innerWidth;
      this.setVisualizerCanvas();
    },

    /**
     * Toggles the full screen of the browser
     */
    fullscreenToggle() {
      if (document.fullscreenEnabled) {
        if (this.fullscreen) {
          document.exitFullscreen();
        } else {
          document.getElementById("app").requestFullscreen();
        }
        this.fullscreen = !this.fullscreen;
      }
    },

    /**
     * Sets the appropriet resolution for the visualizer canvas
     */
    setVisualizerCanvas() {
      if (this.audioMotion != null && !this.isMobile() && !this.isNative) {
        this.audioMotion.setCanvasSize(
          this.audioMotion.loRes
            ? window.innerWidth * 1.65
            : window.innerWidth * 0.85,
          this.audioMotion.loRes
            ? window.innerHeight * 1.3
            : window.innerHeight * 0.7
        );
      }
    },

    /**
     * Toggles the mute (NO SHIT SHERLOCK)
     */
    toggleMute() {
      if (this.volume == 0) {
        this.volume = this.previousVolume;
      } else {
        this.previousVolume = this.volume;
        this.volume = 0;
      }
    },

    /**
     * Creates a gradient
     * @param {string} name for the gradient
     * @param {bool} horizontal true if effect is horizontal
     * @param {array} stops collor stops to include
     */
    createGradient(name, horizontal, stops) {
      this.audioMotion.registerGradient(name, {
        dir: horizontal ? "h" : null,
        colorStops: stops,
      });
      this.settingsExtras.gradients.push(name);
    },

    /**
     * Saves a javascript option to json file and downloads it on the user pc
     */
    downloadObjectAsJson(exportObj, exportName) {
      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportObj));
      var downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", exportName + ".json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },

    /**
     * Saves a song to the users pc
     */
    downloadSongMP3(song) {
      var dataStr = "data:audio/mpeg;charset=utf-8," + song.file;
      // Creates a button and clicks it. (weird browser behaviour)
      var downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", song.name + ".mp3");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },

    /**
     * Import uploaded json and sets visualizer settings
     */
    setUploadedFileAsSettings: function() {
      var files = this.settingsFile;
      if (files.length <= 0) {
        return false;
      }

      var fr = new FileReader();
      fr.onload = (e) => (this.settings = JSON.parse(e.target.result));
      fr.readAsText(files);
    },

    /**
     * Saves the visualizer settings to local variables and cookies
     */
    saveVisualizerSettings(val) {
      if (this.audioMotion != null) {
        this.audioMotion.setOptions({
          loRes: val.loRes,
          mode: val.mode.val,
          showScale: val.showScale,
          showPeaks: val.showPeaks,
          minDecibels: val.DecibelsRange[0],
          maxDecibels: val.DecibelsRange[1],
          gradient: val.gradient,
          smoothing: val.smoothing,
          fftSize: Math.pow(2, val.fftSize),
          showLeds: val.showLeds,
        });
        this.setVisualizerCanvas();
      }
      Cookies.set("visualizerSettings", val);
    },
  },

  /**
   * Called when view is created
   */
  mounted: function() {
    // Gets the audio player
    this.audio = this.$el.querySelectorAll("audio")[0];
    // Apply all methods to listen for updates
    this.audio.addEventListener("timeupdate", this.update);
    this.audio.addEventListener("loadeddata", this.load);
    this.audio.addEventListener("pause", () => {
      this.playing = false;
    });
    this.audio.addEventListener("play", () => {
      this.playing = true;
    });

    window.addEventListener("keypress", (e) => {
      if (this.$route.name == "Music") {
        if (e.code == "Space" || e.code == "KeyK") {
          // e.preventDefault();
          this.playPause();
        }
      }
    });

    window.addEventListener("resize", this.onResize);
    document.addEventListener("fullscreenchange", function() {
      var fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      console.log(document.fullscreenElement);
      if (fullscreenElement != null) {
        this.fullscreen = true;
      } else {
        this.fullscreen = false;
      }
    });

    // register mobile media player controls
    // if (Capacitor.isNative) {
    //   CapacitorMusicControls.create(
    //     {
    //       track: "Time is Running Out", // optional, default : ''
    //       artist: "Muse", // optional, default : ''
    //       album: "Lentefeest", // optional, default: ''

    //       // hide previous/next/close buttons:
    //       hasPrev: false, // show previous button, optional, default: true
    //       hasNext: false, // show next button, optional, default: true
    //       hasClose: true, // show close button, optional, default: false

    //       // iOS only, optional
    //       duration: 60, // optional, default: 0
    //       elapsed: 10, // optional, default: 0
    //       hasSkipForward: false, //optional, default: false. true value overrides hasNext.
    //       hasSkipBackward: false, //optional, default: false. true value overrides hasPrev.
    //       skipForwardInterval: 15, //optional. default: 15.
    //       skipBackwardInterval: 15, //optional. default: 15.
    //       hasScrubbing: false, //optional. default to false. Enable scrubbing from control center progress bar

    //       // Android only, optional
    //       isPlaying: true, // optional, default : true
    //       dismissable: false, // optional, default : false
    //       // text displayed in the status bar when the notification (and the ticker) are updated
    //       ticker: 'Now playing "Time is Running Out"',
    //       //All icons default to their built-in android equivalents
    //       //The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
    //       playIcon: "media_play",
    //       pauseIcon: "media_pause",
    //       prevIcon: "media_prev",
    //       nextIcon: "media_next",
    //       closeIcon: "media_close",
    //       notificationIcon: "notification",
    //     },
    //     (i) => console.log(i),
    //     (e) => {
    //       console.error(e);
    //     }
    //   );
    // }
  },

  computed: {
    currentPlaybackTime: function() {
      return this.$refs.player.currentTime;
    },
    // Converts to a pretty time
    currentTime() {
      return convertTimeHHMMSS(this.currentSeconds);
    },
    // Converts to a pretty time
    durationTime() {
      return convertTimeHHMMSS(this.durationSeconds);
    },
    // Does simple math
    percentComplete() {
      return parseInt((this.currentSeconds / this.durationSeconds) * 100);
    },
    // JUST READ THE CODE >>>
    muted() {
      return this.volume / 100 === 0;
    },
  },
  watch: {
    // Keeps the audio player volume property in sync with local variable
    volume() {
      this.audio.volume = this.volume / 100;
    },
    // Keeps the audio player playing property in sync with local variable
    playing(value) {
      if (value) {
        return this.audio.play();
      }
      this.audio.pause();
    },
    // Keeps the audio visualizer settings in sync with local variable
    settings: {
      handler: function(val) {
        this.saveVisualizerSettings(val);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
// ALL CSS JUST GOOGLE IT
.container {
  margin-top: 20px;
  overflow: hidden;
}
.overlay {
  margin-bottom: 60px;
}
v-footer {
  bottom: 0px;
  position: fixed !important;
}
.v-slider .v-messages {
  display: none !important;
}
.hideOverflow {
  overflow: hidden;
}
.overlaytransition-enter-active,
.overlaytransition-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.overlaytransition-enter, .overlaytransition-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(100px);
  opacity: 0;
}
</style>
