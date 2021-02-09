<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Volgende vragen
      </v-card-title>

      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel
            expand
            focusable
            v-for="(question, key) in $store.state.interactiveQuestions.next"
            :key="key"
          >
            {{ question.question }}
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from "../../../main";
export default {
  computed: {},
  methods: {
    goToNextQuestions() {
      if (this.$store.state.interactiveQuestions.current.type == "wait") {
        db.ref("interactiveQuestions/current").set(
          Object.values(this.$store.state.interactiveQuestions.next)[0]
        );
      }
    },
  },
};
</script>

<style></style>
