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

    <div v-if="currentPage == 'chat'">
      <grid-layout
        :col-num="12"
        :is-draggable="true"
        :is-resizable="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        :responsive="true"
        :layout="chatLayout"
        :cols="{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }"
      >
        <grid-item
          :i="0"
          :x="0"
          :y="0"
          :w="2"
          :h="2"
          :key="0"
          style="touch-action: none"
        >
          <div>
            <v-list :v-if="sideMenuOpen">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Chat
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Klik op een chat om te beginnen
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider> </v-divider>

              <v-list nav>
                <v-list-item v-for="(chat, key) in chats" :key="chat.uid">
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
                        @click="
                          selectedChat = chat;
                          selectedUser = key;
                        "
                      >
                        <v-list-item-title>{{
                          chat.displayName
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          chat.messages != undefined
                            ? getLastMessage(chat.messages).text
                            : ""
                        }}</v-list-item-subtitle>
                        <v-list-item-subtitle>
                          12:43 - Gelezen
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-fade-transition>
                  </v-hover>
                </v-list-item>
              </v-list>
            </v-list>
          </div>
        </grid-item>

        <grid-item
          :i="1"
          :x="2"
          :y="0"
          :w="2"
          :h="2"
          :key="1"
          style="touch-action: none"
          resizeIgnoreFrom=".v-textarea, .flex"
        >
          <div>
            <v-card>
              <v-card-title>
                {{
                  selectedChat.displayName || "Klik op iemand om te beginnen"
                }}
              </v-card-title>
              <v-card-text v-if="selectedChat.messages != null">
                <div v-for="(msg, key) in selectedChat.messages" :key="key">
                  <template>
                    <div :class="{ 'd-flex flex-row-reverse': msg.byHost }">
                      <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                          <v-hover v-slot:default="{ hover }">
                            <v-chip
                              :color="msg.byHost ? 'primary' : ''"
                              dark
                              style="height:auto;white-space: normal;"
                              class="pa-2 mb-2"
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
                          <v-list-item>
                            <v-list-item-title>Opties</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-subtitle>
                              <v-checkbox
                                label="Presentators"
                                v-model="msg.flags.showToPresentor"
                                @click="
                                  setShowToPresentor(
                                    key,
                                    msg.flags.showToPresentor
                                  )
                                "
                              ></v-checkbox>
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-subtitle @click="deleteMessage(key)"
                              >Verwijderen</v-list-item-subtitle
                            >
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </template>
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
                  @click:append-outer="sendMessage"
                ></v-textarea>
              </v-card-text>

              <v-card-text v-if="selectedChat.messages == null">
                Geen berichten gevonden.
              </v-card-text>
            </v-card>
          </div>
        </grid-item>

        <grid-item
          :i="2"
          :x="4"
          :y="0"
          :w="2"
          :h="2"
          :key="2"
          style="touch-action: none"
        >
          <div>
            <presentator-view></presentator-view>
          </div>
        </grid-item>
      </grid-layout>
    </div>

    <div v-if="currentPage == 'faq'">
      <grid-layout
        :col-num="12"
        :is-draggable="true"
        :is-resizable="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        :responsive="true"
        :layout="faqLayout"
        :cols="{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }"
      >
        <grid-item
          :i="3"
          :x="0"
          :y="0"
          :w="2"
          :h="2"
          :key="3"
          style="touch-action: none"
        >
          <div>
            <frequent-asked-questions-enter-box></frequent-asked-questions-enter-box>
          </div>
        </grid-item>

        <grid-item
          :i="4"
          :x="2"
          :y="0"
          :w="2"
          :h="2"
          :key="4"
          style="touch-action: none"
        >
          <div>
            <frequent-asked-question-list-admin></frequent-asked-question-list-admin>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import { db } from "../../main";
import navbar from "../NavBar.vue";
import VueGridLayout from "vue-grid-layout";
import PresentatorView from "../../components/PresenterView.vue";
import FrequentAskedQuestionsEnterBox from "../../components/FAQ/FrequentAskedQuestionEnterBox.vue";
import FrequentAskedQuestionListAdmin from "../../components/FAQ/FrequentAskedQuestionListAdmin.vue";

export default {
  components: {
    navbar,
    PresentatorView,
    FrequentAskedQuestionsEnterBox,
    FrequentAskedQuestionListAdmin,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
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
      chatLayout: [
        { x: 0, y: 0, w: 2, h: 2, i: "0" },
        { x: 2, y: 0, w: 2, h: 2, i: "1" },
        { x: 4, y: 0, w: 2, h: 2, i: "2" },
      ],
      faqLayout: [
        { x: 0, y: 0, w: 2, h: 2, i: "3" },
        { x: 2, y: 0, w: 2, h: 2, i: "4" },
      ],
    };
  },

  computed: {
    // chats: {
    //   set() {},
    //   get() {
    //     return this.chatsFire;
    //   },
    // },
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
  },

  firebase: {
    chats: db.ref("questions/asked"),
  },
};
</script>

<style scoped lang="scss">
.multipane.foo.chatLayo-v .multipane-resizer {
  margin: 0;
  left: 0; /* reset default styling */
  width: 15px;
  background: blue;
}

.multipane.foo.chatLayo-h .multipane-resizer {
  margin: 0;
  top: 0; /* reset default styling */
  height: 15px;
  background: blue;
}
</style>
