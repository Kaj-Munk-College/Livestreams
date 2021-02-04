<template>
  <div>
    <navbar />

    <v-container>
      <v-row>
        <v-col>
          <admin-question-current-selection></admin-question-current-selection>
        </v-col>
        <v-col>
          <admin-question-making></admin-question-making>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <show-results-stats></show-results-stats>
        </v-col>
        <v-col>
          <admin-question-list-view></admin-question-list-view>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Navbar from "../components/util/NavBar";
import AdminQuestionCurrentSelection from "../components/interactive/FourQuestions/AdminQuestionCurrentSelection";
import AdminQuestionMaking from "../components/interactive/FourQuestions/AdminQuestionMaking";
import ShowResultsStats from "../components/interactive/FourQuestions/ShowResultsStats";
import AdminQuestionListView from "../components/interactive/FourQuestions/AdminQuestionListView";

export default {
  components: {
    Navbar,
    AdminQuestionCurrentSelection,
    AdminQuestionMaking,
    ShowResultsStats,
    AdminQuestionListView,
  },
};
</script>

<style></style>
