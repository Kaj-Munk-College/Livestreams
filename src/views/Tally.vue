<template>
  <div
    id="tallyBackground"
    style="    width: 100%;
    height: 100%; backgroundColor: #363636;"
    dark
  >
    <navbar></navbar>
    <v-btn
      fab
      absolute
      bottom
      left
      color="blue"
      dark
      @click="selectCamDialog = !selectCamDialog"
      ><v-icon>photo_camera_front</v-icon></v-btn
    >
    <v-dialog v-model="selectCamDialog">
      <v-card>
        <v-card-title primary-title>
          Selecteer je camera nummer
        </v-card-title>

        <v-card-text>
          <v-text-field
            name="camera"
            label="Camera Selectie"
            v-model="selectedCam"
            type="number"
          ></v-text-field>
        </v-card-text>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="selectCamDialog = false">
          Sluiten
        </v-btn>
      </v-card-actions>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "../main";
import navbar from "./NavBar.vue";
import Cookies from "js-cookie";

export default {
  components: {
    navbar,
  },

  data: () => {
    return {
      tally: {},
      selectedCam: "",
      selectCamDialog: false,
    };
  },

  watch: {
    tally: {
      deep: true,
      handler() {
        console.log(this.tally.program[0]);
        if (this.tally.program[0] == this.selectedCam) {
          console.log("Actual!");
          document.querySelector("#tallyBackground").style.backgroundColor =
            "#ff0000";
        } else if (this.tally.preview[0] == this.selectedCam) {
          console.log("preview");
          document.querySelector("#tallyBackground").style.backgroundColor =
            "#00ff00";
        } else {
          console.log("nothing");
          document.querySelector("#tallyBackground").style.backgroundColor =
            "#363636";
        }
      },
    },

    selectedCam: function() {
      Cookies.set("selectedCameraTally", this.selectedCam);
      if (this.tally.program[0] == this.selectedCam) {
        console.log("Actual!");
        document.querySelector("#tallyBackground").style.backgroundColor =
          "#ff0000";
      } else if (this.tally.preview[0] == this.selectedCam) {
        console.log("preview");
        document.querySelector("#tallyBackground").style.backgroundColor =
          "#00ff00";
      } else {
        console.log("nothing");
        document.querySelector("#tallyBackground").style.backgroundColor =
          "#363636";
      }
    },
  },

  mounted() {
    this.selectedCam = Cookies.get("selectedCameraTally");
  },

  firebase: {
    tally: db.ref("tally"),
  },
};
</script>

<style></style>
