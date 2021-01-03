<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        FAQ
      </v-card-title>
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(question, key) in askedQuestions"
            :key="key"
          >
            <v-expansion-panel-header>{{
              question.question
            }}</v-expansion-panel-header>
            <v-expansion-panel-content
              >{{ question.answer }}
              <v-btn @click="deleteQuestion(key)" class="float-right" icon
                ><v-icon>close</v-icon></v-btn
              >
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from "../../main";
export default {
  data: () => {
    return {
      askedQuestions: {},
    };
  },

  methods: {
    deleteQuestion(key) {
      console.log(key);
      db.ref(`questions/FAQ/${key}`).remove();
    },
  },

  firebase: {
    askedQuestions: db.ref("questions/FAQ"),
  },
};
</script>

<style></style>
