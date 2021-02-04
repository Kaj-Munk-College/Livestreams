<template>
  <div>
    <navbar />
    <div v-if="!isAdmin">
      <not-as-admin-message></not-as-admin-message>
    </div>

    <presentator-view class="ma-3"></presentator-view>
  </div>
</template>

<script>
import navbar from "../../components/util/NavBar";
import PresentatorView from "../../components/PresenterView.vue";
import NotAsAdminMessage from "../../components/NotAsAdminMessage.vue";

export default {
  name: "hosts-view",

  components: {
    PresentatorView,
    navbar,
    NotAsAdminMessage,
  },

  computed: {
    isAdmin() {
      // console.log(this.$store.state.user.email);
      return (
        (this.$store.state.user != null &&
          this.$store.state.user.email == "av@kajmunk.nl") ||
        this.$store.state.isAdminUser
      );
    },
  },
};
</script>

<style></style>
