<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Presentator View</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="!areThereChats()">
          Het lijkt erop dat er nog geen vragen zijn voor de presentatoren
        </div>
        <div v-for="person in chats" :key="person.uid">
          <div v-if="hasChatsToShow(person)">
            <h3>Gebruiker: {{ person.displayName }}</h3>
          </div>
          <div v-for="(message, key) in person.messages" :key="key">
            <div v-if="message.flags.sendToPresentors">
              <v-chip
                label
                color="secondary"
                text-color="grey"
                close
                @click:close="doNotShowOnPresenter(key, person)"
                class="mb-2"
              >
                {{ message.text }} - <i>{{ message.created_at }}</i>
              </v-chip>
            </div>
          </div>
          <br />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="warning">Alles Sluiten</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { db } from "../main";

export default {
  name: "presentator-view",

  data: () => {
    return {
      chats: {},
    };
  },

  methods: {
    hasChatsToShow: function(person) {
      var has = false;
      if (person.messages)
        Object.values(person.messages).forEach((message) => {
          if (message.flags.sendToPresentors) has = true;
        });
      return has;
    },

    filteredChats: function(person) {
      var filtered = [];

      if (person.messages)
        Object.values(person.messages).forEach((message) => {
          if (message.flags.sendToPresentors) filtered.push(message);
        });

      return filtered;
    },

    areThereChats() {
      var filtered = [];

      Object.values(this.chats).forEach((person) => {
        if (person.messages)
          Object.values(person.messages).forEach((message) => {
            if (message.flags.sendToPresentors) filtered.push(message);
          });
      });

      return filtered.length > 0;
    },

    doNotShowOnPresenter(key, person) {
      db.ref(
        `questions/asked/${person.uid}/messages/${key}/flags/sendToPresentors`
      ).set(false);
    },
  },

  firebase: {
    chats: db.ref("questions/asked"),
  },
};
</script>

<style></style>
