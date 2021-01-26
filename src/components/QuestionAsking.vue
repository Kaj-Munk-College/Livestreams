<template
  ><div>
    <v-card class="justify-center">
      <v-card-title>Chat</v-card-title>
      <v-card-text>
        <p>
          Vragen kunnen gesteld worden via deze chat en op whatsapp via:
          0623315007
        </p>
        <v-btn
          text
          color="secondary"
          style="font-size: smaller;"
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
            <v-btn to="/login">Inloggen</v-btn>
            <br /><br />
            <p>
              Liever simpel en anoniem inloggen? Vul dan hieronder uw naam in.
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
            <div
              class="chat-scrollbox"
              @dragover.prevent
              @dragleave="dragleave"
              @dragenter="dragenter"
              @drop="drop"
              ref="dropzone"
            >
              <template>
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
                              class="pa-2 mb-2"
                              v-on="on"
                              v-linkified
                              :class="!msg.byHost ? 'own' : ''"
                            >
                              {{ msg.text }}
                              <sub class="ml-2" style="font-size: 0.5rem;">{{
                                msg.created_at
                              }}</sub>
                              <v-icon v-if="hover && !msg.byHost" small>
                                expand_more
                              </v-icon>
                            </v-chip>
                          </v-hover>
                        </template>
                        <v-list v-if="!msg.byHost">
                          <v-list-item @click="deleteMessage(key, msg, i)">
                            <v-list-item-title>Verwijderen</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </template>
                </div>
                <v-fade-transition>
                  <v-overlay v-if="files.length > 0" absolute>
                    <v-container fill-height fill-width>
                      <v-app-bar>
                        <v-toolbar-title>
                          Upload
                        </v-toolbar-title>
                      </v-app-bar>
                    </v-container>
                  </v-overlay>
                </v-fade-transition>
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
          v-on:keyup.13="sendQuestion"
          @click:prepend="$refs.filebtn.click()"
        ></v-textarea>

        <input
          ref="filebtn"
          class="filebtn"
          type="file"
          :multiple="multiple"
          :accept="
            validatedAccept &&
              [
                ...validatedAccept.extensions,
                ...validatedAccept.mimetypes,
              ].join(',')
          "
          @input="upload"
        />
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
import { db } from "../main";
import { uploadImage } from "../util/fileUpload";

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

      // File upload
      hoverCounter: 0,
      hoveringContent: null,
      matchAnything: /.*/,
      files: [],
      multiple: true,
      label: "Upload",
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

      db.ref(
        `questions/asked/${
          firebase.auth().currentUser.uid
        }/latestMessageTimestamp`
      ).set(Date.now());

      this.questionBoxInput = "";
    },

    loginAnonymous() {
      if (this.usernameEnterBox != "")
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {
            this.username = this.usernameEnterBox;
            console.log(
              "signed in anonymously with: ",
              this.usernameEnterBox,
              this.username
            );

            this.$store.commit("setUser", this.usernameEnterBox);
            this.usernameEnterBox = "";

            firebase.auth().currentUser.updateProfile({
              displayName: this.username,
            });
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

      if (this.$store.state.user != null)
        db.ref(`questions/asked/${firebase.auth().currentUser.uid}/uid`).set(
          this.$store.state.user.uid
        );

      console.log("set up db metadata");
    },

    async upload() {
      const files = this.filebtn.files ?? [];
      for (let i = 0; i < files.length; i++) {
        if (!this.multiple) {
          this.files.splice(0, this.files.length);
        }
        const shouldPush =
          this.validTypes.extensions.reduce(
            (prev, regex) => prev || !!files[i].name.match(regex),
            false
          ) ||
          this.validTypes.mimetypes.reduce(
            (prev, regex) => prev || !!files[i].type.match(regex),
            false
          );
        if (shouldPush) {
          this.files.push(files[i]);

          // Upload the file to firebase storage
          await uploadImage(firebase.auth().currentUser.uid, files[i]);
        }
      }
      this.filebtn.value = "";
    },
    dragenter(e) {
      this.hoveringContent = e.dataTransfer.items;
      this.hoverCounter++;
    },
    /** Counts leave events (fix for event rippling issues) */
    dragleave() {
      this.hoverCounter--;
    },
    /** Validates and keeps track of dropped content */
    drop(e) {
      e.preventDefault(); // Keep from leaving the page
      this.hoverCounter = 0; // Content can't be dragged out, so go ahead and reset the counter
      if (e.dataTransfer.items) {
        const rejected = []; // Keeps track of rejected items for reporting at the end
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === "file") {
            // Directories are not supported. Skip any that are found
            if (e.dataTransfer.items[i].webkitGetAsEntry) {
              const entry = e.dataTransfer.items[i].webkitGetAsEntry();
              if (entry.isDirectory) {
                rejected.push(entry.name);
                continue;
              }
            }
            const file = e.dataTransfer.items[i].getAsFile();
            if (file) {
              const shouldPush = // Check against Regex arrays from accept property
                this.validTypes.extensions.reduce(
                  (prev, regex) => prev || !!file.name.match(regex),
                  false
                ) ||
                this.validTypes.mimetypes.reduce(
                  (prev, regex) => prev || !!file.type.match(regex),
                  false
                );
              if (shouldPush) {
                if (this.multiple) {
                  // Remove duplicates
                  this.files
                    .filter((currFile) => currFile.name === file.name)
                    .forEach((fileToRemove) =>
                      this.files.splice(this.files.indexOf(fileToRemove), 1)
                    );
                } else {
                  // Remove all
                  this.files.splice(0, this.files.length);
                }
                this.files.push(file);
              } else {
                rejected.push(file); // Keep track of rejected files
                continue;
              }
            } else {
              continue;
            }
          }
        }
        // Emit rejected files
        if (rejected.length) {
          this.$emit("rejectedFiles", rejected);
        }
      }
    },
    /** Removes attachment per user's request */
    remove(file) {
      const arr = this.files;
      arr.splice(arr.indexOf(file), 1);
      this.$emit("update", null);
    },
  },

  mounted: function() {
    if (this.$store.state.user != null) {
      this.username = this.$store.state.user.displayName;

      this.setupDBMeta();
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if(user.displayName != null && user.displayName != ""){
          this.username = user.displayName;
        }

        this.setupDBMeta();
      }
    });
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

    questions: {
      deep: true,
      handler() {
        var el = document.querySelector(".chat-scrollbox");

        setTimeout(() => {
          if (el != null && el.children.length > 0) {
            el.lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }, 20);
      },
    },

    multiple(val) {
      if (!val) {
        this.files.splice(0, this.files.length - 1);
      }
    },
    hoveringContent(val) {
      // If a file is hovering
      if (val) {
        // If we have type checking and we're using mimetypes only
        if (
          this.accept &&
          this.accept.length &&
          this.validTypes.extensions.length === 0
        ) {
          let shouldDim = false;
          // For each file hovering over the box...
          for (let i = 0; i < val.length; i++) {
            if (
              // Check the type against all our mime types
              this.validTypes.mimetypes.reduce(
                (prev, regex) => prev || !!val[i].type.match(regex)
              )
            ) {
              shouldDim = true;
              break;
            }
          }
          // If we found a match, dim the box
          if (shouldDim) {
            this.dropzone.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
          }
          // If not, we can't definitively typecheck, so...
        } else {
          // Check that we have a file in there
          let shouldDim = false;
          for (let i = 0; i < val.length; i++) {
            if (val[i].kind === "file") {
              shouldDim = true;
              break;
            }
          }
          // ... and dim the box
          if (shouldDim) {
            this.dropzone.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
          }
        }
        // Otherwise...
      } else {
        // Un-dim the box
        this.dropzone.style.backgroundColor = "";
      }
    },
    hoverCounter(val) {
      if (val === 0) {
        this.hoveringContent = null;
      }
    },
  },

  computed: {
    filebtn: {
      cache: false,
      get() {
        return this.$refs.filebtn;
      },
    },
    dropzone: {
      cache: false,
      get() {
        return this.$refs.dropzone;
      },
    },
    validTypes() {
      if (this.validatedAccept) {
        return {
          extensions: this.validatedAccept.extensions
            .map((ext) => ext.replace(/(\W)/g, "\\$1")) // Escape all potential regex tokens
            .map((rgxstr) => new RegExp(`${rgxstr}$`, "i")), // Transform into regex to look for extension
          mimetypes: this.validatedAccept.mimetypes
            .map((mt) => mt.replace(/([-+/])/g, "\\$1")) // Escape special characters
            .map((mt) => mt.replace(/\*/g, "(?:[A-Za-z0-9\\-\\+]*)*")) // Enable wildcards
            .map((rgxstr) => new RegExp(`^${rgxstr}$`)), // Transform into regex
        };
      } else {
        // If we haven't been given any filters...
        return {
          extensions: [this.matchAnything],
          mimetypes: [this.matchAnything],
        };
      }
    },
    validatedAccept() {
      if (this.accept) {
        return {
          extensions: this.accept
            .split(",")
            .filter((type) => type.match(/^\.(?!.*\/)/)), // Get only extension filters
          mimetypes: this.accept
            .split(",")
            .filter((type) =>
              type.match(
                /^(?:(?:[A-Za-z0-9\-+]*)|\*)\/(?:(?:[A-Za-z0-9\-+.]*)|\*)$/
              )
            ), // Get only mimetype filters
        };
      } else {
        return null;
      }
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
  max-height: 80%;
  border-radius: 5px;
  margin-bottom: 15px;
  margin-top: 15px;
}
.chat-scrollbox {
  overflow-y: scroll;
  height: 350px;
  padding-right: 0px;
}

.linkified {
  color: red;
}

// Input box
h1 {
  font-size: 1.5em;
  font-weight: 400;
  font-family: Roboto, sans-serif;
  color: hsla(0, 0%, 100%, 0.7);
}
p {
  margin: 0;
  font-size: 0.75em;
  font-weight: 100;
}
.dropzone {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: 2px dashed hsla(0, 0%, 100%, 0.7);
  border-radius: 20px;
  overflow: hidden;
  transition: background-color 0.2s;
}
div.input-container {
  min-width: 50%;
}
.v-input {
  ::v-deep div.v-input__control {
    div.v-input__slot {
      margin-top: 4px;
      margin-bottom: 0 !important;
    }
    div.v-messages {
      display: none;
    }
  }
}
input.filebtn {
  display: none;
}
</style>
