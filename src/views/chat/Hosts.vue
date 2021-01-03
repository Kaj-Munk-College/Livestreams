<template>
  <div>
    <navbar />
    <presentator-view class="ma-3"></presentator-view>
  </div>
</template>

<script>
import navbar from "../NavBar.vue";
import PresentatorView from "../../components/PresenterView.vue";
export default {
  name: "hosts-view",

  components: {
    PresentatorView,
    navbar,
  },
};
</script>

<style></style>
