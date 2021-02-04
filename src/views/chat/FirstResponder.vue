<template>
  <div>
    <navbar @menu-button-press="menuButtonPress" />

    <v-navigation-drawer temporary app v-model="sideMenuOpen">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Moderators
          </v-list-item-title>
          <v-list-item-subtitle>
            Pagina voor moderators
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item
          link
          v-for="link in pages"
          :key="link.id"
          @click="setPage(link.id)"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ link.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div v-if="!isAdmin">
      <not-as-admin-message></not-as-admin-message>
    </div>

    <v-container>
      <v-row v-if="currentPage == 'chat'">
        <v-col cols="6">
          <div class="item-content">
            <div class="my-custom-content">
              <div>
                <v-list :v-if="sideMenuOpen">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Chat
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Klik op een chat om te beginnen <br />
                        Er zijn nu {{ Object.keys(chats).length }} mensen
                        ingelogd
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider> </v-divider>

                  <v-list nav>
                    <v-list-item
                      v-for="chat in orderedChats"
                      :key="chat.uid"
                      :style="`display: ${chat.messages ? 'block' : 'none'}`"
                    >
                      <v-hover v-slot:default="{ hover }">
                        <v-fade-transition>
                          <v-list-item-content
                            :class="
                              `${
                                hover || chat == selectedChat
                                  ? $vuetify.theme.dark
                                    ? 'grey darken-3'
                                    : 'grey lighten-3'
                                  : ''
                              }`
                            "
                            @click="selectedChat = chat"
                          >
                            <v-list-item-title>{{
                              chat.displayName
                            }}</v-list-item-title>
                            <v-list-item-subtitle>
                              <v-icon
                                :color="
                                  chat.messages != undefined
                                    ? getLastMessage(chat.messages).flags
                                        .Answered
                                      ? 'blue'
                                      : 'grey'
                                    : ''
                                "
                              >
                                {{
                                  chat.messages != undefined
                                    ? getLastMessage(chat.messages).byHost
                                      ? "reply"
                                      : getLastMessage(chat.messages).flags
                                          .Answeredd
                                      ? "done_all"
                                      : "done"
                                    : ""
                                }}</v-icon
                              >
                              {{
                                chat.messages != undefined
                                  ? getLastMessage(chat.messages).text
                                  : ""
                              }}</v-list-item-subtitle
                            >
                            <v-list-item-subtitle>
                              {{
                                chat.messages != undefined
                                  ? getLastMessage(chat.messages).created_at
                                  : "geen tijd"
                              }}
                              -
                              {{
                                chat.messages != null
                                  ? Object.values(chat.messages).length
                                  : "geen"
                              }}
                              berichten
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-fade-transition>
                      </v-hover>
                    </v-list-item>
                  </v-list>
                </v-list>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="6">
          <div class="item-content">
            <div>
              <div>
                <v-card>
                  <v-card-title>
                    {{
                      selectedChat.displayName ||
                        "Klik op iemand om te beginnen"
                    }}
                  </v-card-title>
                  <v-card-text v-if="selectedChat.messages != null">
                    <div class="chat-box">
                      <div
                        v-for="(msg, key) in selectedChat.messages"
                        :key="key"
                      >
                        <template>
                          <div
                            :class="{ 'd-flex flex-row-reverse': msg.byHost }"
                          >
                            <v-menu offset-y>
                              <template v-slot:activator="{ on }">
                                <v-hover v-slot:default="{ hover }">
                                  <v-chip
                                    :color="msg.byHost ? 'primary' : ''"
                                    dark
                                    style="height:auto;white-space: normal;"
                                    class="pa-2 mb-2"
                                    v-on="on"
                                    v-linkified
                                  >
                                    {{ msg.text }}
                                    <sub
                                      class="ml-2"
                                      style="font-size: 0.5rem;"
                                      >{{ msg.created_at }}</sub
                                    >
                                    <v-icon v-if="hover" small>
                                      expand_more
                                    </v-icon>
                                  </v-chip>
                                </v-hover>
                              </template>
                              <v-list>
                                <v-list-item>
                                  <v-list-item-title>Opties</v-list-item-title>
                                </v-list-item>
                                <v-list-item>
                                  <v-list-item-subtitle
                                    @click="setShowToPresentor(key, true)"
                                  >
                                    Verstuur naar PRES
                                  </v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                  <v-list-item-subtitle
                                    @click="deleteMessage(key)"
                                    >Verwijderen</v-list-item-subtitle
                                  >
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </template>
                      </div>
                    </div>

                    <v-textarea
                      name="questionBoxInput"
                      label="Beantwoord..."
                      id="questionBoxInput"
                      v-model="questionBoxInput"
                      rows="1"
                      solo
                      clearable
                      auto-grow
                      hide-details="auto"
                      append-outer-icon="message"
                      @click:append-outer="sendMessage"
                      v-on:keyup.13="sendMessage"
                    ></v-textarea>
                  </v-card-text>

                  <v-card-text v-if="selectedChat.messages == null">
                    Geen berichten gevonden.
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </div>
        </v-col>

        <!-- <v-col cols="4">
          <div class="item-content">
            <div class="my-custom-content">
              <presentator-view></presentator-view>
            </div>
          </div>
        </v-col> -->
      </v-row>

      <v-row v-if="currentPage == 'faq'">
        <v-col>
          <div class="item-content">
            <!-- Safe zone, enter your custom markup -->
            <frequent-asked-questions-enter-box></frequent-asked-questions-enter-box>
            <!-- Safe zone ends -->
          </div>
        </v-col>

        <v-col>
          <div class="item-content">
            <!-- Safe zone, enter your custom markup -->
            <div class="my-custom-content">
              <frequent-asked-question-list-admin></frequent-asked-question-list-admin>
            </div>
            <!-- Safe zone ends -->
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// eslint-ignore vue/no-unused-components

import { db } from "../../main";
import navbar from "../../components/util/NavBar";
// import PresentatorView from "../../components/PresenterView.vue";
import FrequentAskedQuestionsEnterBox from "../../components/FAQ/FrequentAskedQuestionEnterBox.vue";
import FrequentAskedQuestionListAdmin from "../../components/FAQ/FrequentAskedQuestionListAdmin.vue";
import NotAsAdminMessage from "../../components/NotAsAdminMessage.vue";
import _ from "lodash";

export default {
  components: {
    navbar,
    // PresentatorView,
    FrequentAskedQuestionsEnterBox,
    FrequentAskedQuestionListAdmin,
    NotAsAdminMessage,
  },

  data: () => {
    return {
      sideMenuOpen: false,
      chatsFire: [],
      selectedChat: {},
      questionBoxInput: "",
      selectedUser: "",
      chats: {},
      currentPage: "chat",
      pages: [
        {
          label: "Chat",
          icon: "question_answer",
          id: "chat",
        },
        {
          label: "FAQ",
          icon: "help_center",
          id: "faq",
        },
      ],
    };
  },

  methods: {
    menuButtonPress() {
      this.sideMenuOpen = !this.sideMenuOpen;
    },

    getLastMessage(messages) {
      var sortable = [];
      for (var message in messages) {
        sortable.push([message, messages[message].created_at]);
      }

      return messages[sortable[sortable.length - 1][0]];
    },

    sendMessage() {
      console.log(
        "asking question: ",
        this.questionBoxInput,
        " to: ",
        this.selectedChat
      );
      if (this.selectedChat != {}) {
        var questionref = db.ref(
          `questions/asked/${this.selectedChat.uid}/messages`
        );
        var newQuestionRef = questionref.push();
        newQuestionRef.set({
          byHost: true,
          text: this.questionBoxInput,
          flags: {
            Answered: false,
            sendToPresentors: false,
          },
          created_at: new Date().toLocaleTimeString(),
        });
        db.ref(
          `questions/asked/${this.selectedChat.uid}/latestMessageTimestamp`
        ).set(Date.now());
        this.questionBoxInput = "";
      }
    },

    deleteMessage(messageKey) {
      console.log(messageKey);
      db.ref(
        `questions/asked/${this.selectedChat.uid}/messages/${messageKey}`
      ).remove();
    },

    setShowToPresentor(messageKey, show) {
      db.ref(
        `questions/asked/${this.selectedChat.uid}/messages/${messageKey}/flags/sendToPresentors`
      ).set(show);
    },

    onDragEnd(size) {
      console.log("onDragEnd", size);
    },

    setPage(pageId) {
      this.currentPage = pageId;
      this.sideMenuOpen = false;
    },
  },

  watch: {
    chats: {
      deep: true,
      handler(val) {
        if (this.selectedChat != null && this.selectedChat.uid != undefined)
          this.selectedChat.messages = val[this.selectedChat.uid].messages;
      },
    },

    selectedChat: {
      deep: true,
      handler(val) {
        var el = document.querySelector(".chat-box");

        setTimeout(() => {
          if (el != null && el.children.length > 0) {
            el.lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }, 20);

        Object.values(val.messages).forEach((msg, i) => {
          // console.log(msg, Object.keys(val.messages)[i]);
          db.ref(
            `questions/asked/${val.uid}/messages/${
              Object.keys(val.messages)[i]
            }/flags/Answered`
          ).set(true);
        });
      },
    },
  },

  computed: {
    isAdmin() {
      // console.log(this.$store.state.user.email);
      return (
        (this.$store.state.user != null &&
          this.$store.state.user.email == "av@kajmunk.nl") ||
        this.$store.state.isAdminUser
      );
    },

    orderedChats: function() {
      return _.reverse(_.orderBy(this.chats, (o) => o.latestMessageTimestamp));
    },
  },

  firebase: {
    chats: db.ref("questions/asked"),
  },
};
</script>

<style scoped lang="scss">
.chat-box {
  overflow-y: scroll;
  min-height: 300px;
  max-height: 500px;
}
.item-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
