<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Maak een Vraag
      </v-card-title>

      <v-card-text>
        <v-select
          :items="possibleQuestionTypes"
          v-model="questionTypeSelectionValue"
          label="Selecteer de soort vraag"
        ></v-select>
        <v-text-field
          v-model="inputValues.question"
          name="question"
          label="Vraag..."
        ></v-text-field>
        <v-container v-for="(answer, key) in inputValues.answers" :key="key">
          <v-row>
            <v-col cols="1">
              <v-checkbox
                v-model="inputValues.answers[key].correct"
              ></v-checkbox>
            </v-col>
            <v-col cols="10"
              ><v-textarea
                hide-details="auto"
                :label="`Antwoord ${key + 1}`"
                class="ml-2"
                auto-grow
                clearable
                rows="1"
                v-model="inputValues.answers[key].text"
              ></v-textarea
            ></v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="addPosibility" color="success">Voeg Toe</v-btn>

        <v-btn @click="removePosibilty" color="success">Verwijder</v-btn>

        <v-spacer> </v-spacer>

        <v-btn @click="addQuestionToDatabase" color="success">Save</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { db } from "../../../main";
export default {
  data: () => ({
    possibleQuestionTypes: ["fourQuestions", "Test (Werkt niet)"],
    questionTypeSelectionValue: "fourQuestions",

    inputValues: {
      question: "",
      answers: [
        {
          text: "",
          correct: false,
        },
      ],
    },
  }),

  methods: {
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    addPosibility: function() {
      if (this.inputValues.answers.length < 8) {
        this.inputValues.answers.push({
          text: "",
          correct: false,
        });
      }
    },

    removePosibilty: function() {
      this.inputValues.answers.pop();
    },

    addQuestionToDatabase: function() {
      var doNotAllowSubmit = false;
      var noCorrectAnswer = true;

      if (this.inputValues.question == "") {
        doNotAllowSubmit = true;
      }

      this.inputValues.answers.forEach((answer) => {
        if (answer.text == "") {
          doNotAllowSubmit = true;
        }

        if (answer.correct) {
          noCorrectAnswer = false;
        }
      });

      if (doNotAllowSubmit) {
        console.log("Check of alle antwoorden juist zijn ingevuld");
      } else if (noCorrectAnswer) {
        console.log("vink op zijn minst 1 correct antwoord aan");
      } else {
        this.inputValues.uid = this.uuidv4();

        db.ref("interactiveQuestions/FourQuestions")
          .push()
          .set(this.inputValues);

        this.inputValues.question = "";
        this.inputValues.answers = [];
        this.addPosibility();
      }
    },
  },
};
</script>

<style></style>
