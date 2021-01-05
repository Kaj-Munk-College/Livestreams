<template>
  <div>
    <v-card>
      <v-card-title>
        FAQ Invoeren
      </v-card-title>
      <v-card-text>
        <v-text-field
          name="FAQ Question"
          label="Vraag..."
          clearable
          v-model="questionBoxInput"
        ></v-text-field>
        <v-textarea
          label="Antwoord..."
          name="FAQ Answer"
          clearable
          v-model="answerBoxInput"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="success" @click="sendQuestion">Toevoegen</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { db } from "../../main";
export default {
  data: () => {
    return {
      questionBoxInput: "",
      answerBoxInput: "",
    };
  },

  methods: {
    sendQuestion() {
      if (this.questionBoxInput == "" || this.answerBoxInput == "")
        return false;
      var questionref = db.ref(`questions/FAQ`);
      var newQuestionRef = questionref.push();
      newQuestionRef.set({
        question: this.questionBoxInput,
        answer: this.answerBoxInput,
        created_at: new Date().toLocaleTimeString(),
      });

      (this.questionBoxInput = ""), (this.answerBoxInput = "");
    },
  },
};
</script>

<style></style>
