<template
  ><div>
    <v-card class="justify-center">
      <v-card-title>Chat</v-card-title>
      <v-card-text>
        <v-btn
          text
          color="secondary"
          @click="questionsExplainedPopUp = !questionsExplainedPopUp"
          >Hoe worden vragen beantwoord?</v-btn
        >
        <div
          :class="
            this.$vuetify.theme.dark
              ? 'chat-box grey darken-4'
              : 'chat-box grey lighten-4'
          "
        >
          <div
            v-if="username == null"
            class="justify-center text-center ma-3"
            ma-3
          >
            <br />
            <h3 class="mt-3">Het lijkt erop dat u niet bent ingelogd.</h3>
            <p>
              Om vragen te kunnen beantwoorden willen wij graag een naam weten
              om u te kunnen addreseren.
            </p>
            <v-btn class="mb-9" color="success" to="/login">Inloggen</v-btn>
            <p>
              Wilt u liever niet inloggen, maar gewoon een naam invullen? Vul
              dan hieronder uw naam in.
            </p>
            <v-text-field
              name="username"
              label="Naam"
              id="usernameEnterBox"
              solo
              hide-details="auto"
              class="mb-3"
              v-model="usernameEnterBox"
            ></v-text-field>
            <v-btn @click="loginAnonymous">Anoniem Inloggen</v-btn>
          </div>
          <div v-if="username != null">
            <h4 class="mt-2 justify-center text-center">
              Welkom {{ username }}
            </h4>

            <!-- eslint-disable-next-line vue/require-v-for-key vue/no-unused-vars -->
            <div v-for="(msg, key, i) in questions" :key="key">
              <template>
                <!-- eslint-disable-next-line vue/require-v-for-key -->
                <div :class="{ 'd-flex flex-row-reverse': !msg.byHost }">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-hover v-slot:default="{ hover }">
                        <v-chip
                          :color="!msg.byHost ? 'primary' : ''"
                          dark
                          style="height:auto;white-space: normal;"
                          class="pa-4 mb-2"
                          v-on="on"
                        >
                          {{ msg.text }}
                          <sub class="ml-2" style="font-size: 0.5rem;">{{
                            msg.created_at
                          }}</sub>
                          <v-icon v-if="hover" small>
                            expand_more
                          </v-icon>
                        </v-chip>
                      </v-hover>
                    </template>
                    <v-list>
                      <v-list-item @click="deleteMessage(key, msg, i)">
                        <v-list-item-title>Verwijderen</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </div>
          </div>
        </div>
        <v-textarea
          name="questionBoxInput"
          label="Stel een vraag"
          id="questionBoxInput"
          v-model="questionBoxInput"
          rows="1"
          solo
          clearable
          auto-grow
          hide-details="auto"
          append-outer-icon="message"
          @click:append-outer="sendQuestion"
          :disabled="username == null"
        ></v-textarea>
      </v-card-text>
    </v-card>

    <v-dialog v-model="questionsExplainedPopUp">
      <v-card>
        <v-card-title>
          Hoe worden vragen beantwoord?
        </v-card-title>

        <v-card-text>
          Zodra u een vraag stelt in de vragenbox gebeurd er het volgende:
          <ol type="1">
            <li>
              De vraag wordt naar de mensen achter de schermen gestuurd
            </li>
            <li>
              De mensen achter de schermen delen de vragen in 3 categorien in:
              <ol type="a">
                <li>
                  Vragen die door hen beantwoord worden en antwoorden die op het
                  scherm terug te zien zijn
                </li>
                <li>
                  Vragen die door de presentatoren beantwoord/gevraagd worden
                </li>
                <li>
                  Vragen die na de uitzending op een Frequently Asked Questions
                  (FAQ) terecht komen
                </li>
              </ol>
            </li>
          </ol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { db } from "../../main";

// For the time now
Date.prototype.timeNow = function() {
  return (
    (this.getHours() < 10 ? "0" : "") +
    this.getHours() +
    ":" +
    (this.getMinutes() < 10 ? "0" : "") +
    this.getMinutes()
  );
};

export default {
  name: "AskingQuestionsBox",

  data: () => {
    return {
      questionsExplainedPopUp: false,
      questionBoxInput: "",
      username: null,
      usernameEnterBox: "",
      questions: [],
    };
  },

  methods: {
    sendQuestion() {
      console.log("asking question: ", this.questionBoxInput);

      var questionref = db.ref(
        `questions/asked/${firebase.auth().currentUser.uid}/messages`
      );
      var newQuestionRef = questionref.push();
      newQuestionRef.set({
        byHost: false,
        text: this.questionBoxInput,
        flags: {
          Answered: false,
          sendToPresentors: false,
        },
        created_at: new Date().toLocaleTimeString(),
      });

      this.questionBoxInput = "";
    },

    loginAnonymous() {
      firebase.auth().signInAnonymously();

      this.username = this.usernameEnterBox;
      this.usernameEnterBox = "";

      firebase.auth().currentUser.updateProfile({
        displayName: this.username,
      });
    },

    deleteMessage(messageKey, message) {
      console.log(messageKey);
      if (message.byHost == false) {
        db.ref(
          `questions/asked/${this.$store.state.user.uid}/messages/${messageKey}`
        ).remove();
      }
    },

    setupDBMeta() {
      db.ref(
        `questions/asked/${firebase.auth().currentUser.uid}/displayName`
      ).set(this.username);

      db.ref(`questions/asked/${firebase.auth().currentUser.uid}/uid`).set(
        this.$store.state.user.uid
      );

      console.log("set uid to: ", this.$store.state.user.uid);
    },
  },

  mounted: function() {
    if (this.$store.state.user != null) {
      this.username = this.$store.state.user.displayName;

      this.setupDBMeta();
    }
  },

  watch: {
    username: {
      immediate: true,
      handler() {
        this.$rtdbBind(
          `questions`,
          db.ref(`questions/asked/${this.$store.state.user.uid}/messages`)
        );
      },
    },
  },

  // firebase: {
  //   questions: db.ref(
  //     `questions/asked/${firebase.auth().currentUser.uid | ""}`
  //   ),
  // },
};
</script>

<style scoped lang="scss">
.chat-box {
  min-height: 400px;
  max-height: 400px;
  border-radius: 5px;
  margin-bottom: 15px;
  margin-top: 15px;
  overflow-y: scroll;
}
</style>
