<template>
  <v-bottom-navigation flat style="height: 70px" fixed shift>
    <v-container>
      <v-row
        style="
          display: flex;
          justify-content: space-between;
          text-align: center;
          padding-left: 20px;
          padding-right: 20px;
          margin: auto;
          max-width: 800px;
        "
      >
        <v-btn to="/" class="roundedButton">
          <span style="top: 25px !important">Home</span>
          <v-icon>home</v-icon>
        </v-btn>

        <v-btn to="/music" class="roundedButton">
          <span style="top: 25px !important">Music</span>
          <v-icon>music_note</v-icon>
        </v-btn>

        <v-btn to="/settings" class="roundedButton">
          <span style="top: 25px !important">Settings</span>
          <v-icon>settings</v-icon>
        </v-btn>
      </v-row>
    </v-container>
  </v-bottom-navigation>
</template>
<script>
export default {
  mounted() {
    this.safeArea = getComputedStyle(document.documentElement).getPropertyValue(
      "--sab"
    );
  },
};
</script>

<style lang="scss" scoped>
v-container {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
// v-btn {
//   padding-bottom: 34px;
// }
.bottomSafe {
  padding-bottom: env(save-area-inset-top);
}
.bottomPadding {
  padding-bottom: 12px;
}

.roundedButton {
  border-radius: 15px !important;
}

.v-btn--active {
  height: 48px !important;
}
</style>
