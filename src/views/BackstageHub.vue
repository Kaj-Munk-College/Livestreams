<template>
  <v-container fill-height fill-width fluid>
    <navbar></navbar>
    <v-row align="center" justify="center">
      <v-col>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Backstage Hub</h3>
              <div>
                Makkelijke links voor backstage mensen.
              </div>
            </div>
          </v-card-title>

          <v-card-text>
            Let op alleen voor intern gebruik <br /><br />
            <div v-if="$store.user">
              Momenteel ingelogd als: {{ $store.user.email }}
            </div>

            {{ $store.user }}

            <v-btn @click="$router.push('/chat')" text color="secondary"
              >Chat voor de reaguurders</v-btn
            >
            <br />
            <br />
            <v-btn @click="$router.push('/chat/host')" text color="primary"
              >Chat voor de hosts</v-btn
            >
            <br />
            <br />
            <v-btn @click="$router.push('/tally')" text color="error"
              >Lampjes voor de camera persoontjes</v-btn
            >
            <br />
            <br />
            <v-btn @click="$router.push('/admin')" text color="warning"
              >Stream Settings</v-btn
            >
          </v-card-text>

          <v-card-actions>
            <v-btn text color="primary" @click="$router.push('/login')"
              >Login</v-btn
            >
            <v-btn text color="primary" @click="$router.go(-1)"
              >Vorige Pagina</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import navbar from "./NavBar.vue";

export default {
  components: {
    navbar,
  },
};
</script>

<style></style>
