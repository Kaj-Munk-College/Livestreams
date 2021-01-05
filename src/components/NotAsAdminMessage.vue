<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      :overlay="false"
      persistent
    >
      <div>
        <v-card>
          <v-card-title class="justify-center">
            Niet Ingelogd als Admin
          </v-card-title>
          <v-card-text class="justify-center">
            Het Lijkt erop dat je niet bent ingelogd als admin. Om deze pagina
            te bezoeken moet je admin rechten hebben.

            <br />
            <br /><br />
            <v-btn to="/login" color="success">Inloggen</v-btn>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => {
    return {
      dialog: true,
    };
  },

  mounted() {
    if (this.$route.hash == "#nodialog") {
      this.dialog = false;
    }
  },
};
</script>

<style></style>
