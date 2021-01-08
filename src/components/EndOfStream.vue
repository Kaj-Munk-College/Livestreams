<template>
  <div>
    <div>
      <v-container fill-height fluid fill-width>
        <v-row align="center" justify="center">
          <v-col>
            <h1 class="text-center">Het Einde</h1>
            <h3 class="text-center">Dit was de Live Informatie Avond</h3>
            <h4 class="text-center">We zien u graag de volgende keer terug</h4>

            <br />
            <h4 class="text-center">Nog meer weten?</h4>
            <p class="text-center">
              kijk <a href="https://www.onzeopendag.nl/kajmunk/">hier</a> op
              onze college tour.
            </p>
            <br />
            <br />

            <h4 class="text-center">Veel gestelde vragen</h4>
            <v-container>
              <v-row>
                <v-col>
                  <v-expansion-panels>
                    <v-expansion-panel
                      v-for="(question, key) in askedQuestions"
                      :key="key"
                    >
                      <v-expansion-panel-header>{{
                        question.question
                      }}</v-expansion-panel-header>
                      <v-expansion-panel-content v-linkified
                        >{{ question.answer }}
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { db } from "../main";

export default {
  data: () => {
    return {
      askedQuestions: {},
    };
  },

  firebase: {
    askedQuestions: db.ref("questions/FAQ"),
  },
};
</script>

<style></style>
