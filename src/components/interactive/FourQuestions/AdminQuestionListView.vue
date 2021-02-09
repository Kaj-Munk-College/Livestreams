<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Vragen
      </v-card-title>

      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(question, key) in $store.state.interactiveQuestions
              .FourQuestions"
            :key="key"
          >
            <v-expansion-panel-header>
              {{ question.question }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container v-for="(answer, key) in question.answers" :key="key">
                <v-row>
                  <v-col :style="`color: ${answer.correct ? 'green' : 'red'}`">
                    {{ answer.text }}
                  </v-col>
                </v-row>
              </v-container>
              <v-container>
                <v-row>
                  <v-col
                    ><v-btn color="primary" icon><v-icon>edit</v-icon></v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      @click="addQuestionToNext(question)"
                      color="primary"
                      icon
                      ><v-icon>add</v-icon></v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn color="primary" icon><v-icon>delete</v-icon></v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from "../../../main";
export default {
  methods: {
    addQuestionToNext(question) {
      db.ref("interactiveQuestions/next")
        .push()
        .set(question);
    },
  },
};
</script>

<style></style>
