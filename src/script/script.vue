<!-- eslint for-direction: 0 -->
<template>
  <div>
    <navbar></navbar>
    <!-- <div class="navbar-fixed">
      <nav>
        <div class="nav-wrapper purple darken-4">
          <span id="currentScene" class="left white-text">
            Scene: <span></span>
          </span>
          <a class="brand-logo center">Live Script</a>
          <ul id="nav-mobile" class="right">
            <li class="show-on-medium-and-up">
              <a href="../account/?redirect=script"
                ><i class="material-icons white-text">account_circle</i></a
              >
            </li>
            <li>
              <a onclick="editMode()"
                ><i class="material-icons white-text">create</i></a
              >
            </li>
            <li
              class="modal-trigger"
              id="commentModalButton"
              href="#commentsModal"
            >
              <a><i class="material-icons white-text">comment</i></a>
            </li>
            <li class="show-on-medium-and-up" style="display: none;">
              <a href="../music"
                ><i class="material-icons white-text">music_note</i></a
              >
            </li>
            <li class="show-on-medium-and-up" style="display: none;">
              <a href="../"><i class="material-icons white-text">tv</i></a>
            </li>
          </ul>
        </div>
      </nav>
    </div> -->

    <!-- <div class="comment commentModeIndicator">
      Edit mode geactiveerd
    </div> -->

    <div class="col hide-on-small-only m3 l2" id="scrollspy">
      <ul class="section table-of-contents"></ul>
    </div>
    <div class="indicator"></div>
    <div class="fixed-action-btn">
      <v-btn elevation="2" fixed bottom right fab>
        <i class="large material-icons">arrow_upward</i>
      </v-btn>
    </div>

    <!-- <div id="overlay">
      <div class="progress transparent">
        <div class="indeterminate purple darken-3"></div>
      </div>
    </div> -->

    <!-- Modal Structure -->
    <!-- <div id="commentsModal" class="modal">
      <div class="modal-content">
        <h3 class="indigo-text">Selecteer comment groep</h3>
        <br />
        <div class="input-field col s12">
          <select>
            <option value="" disabled selected>Selecteer group</option>
            <option value="video">Video</option>
            <option value="geluid">Geluid/Licht</option>
            <option value="toneel">Toneel</option>
            <option value="decor">Decor</option>
          </select>
          <label>Selecteer Comment groep:</label>
        </div>
      </div>
      <br /><br /><br /><br /><br /><br />
      <div class="modal-footer">
        <a
          href="#!"
          class="modal-close waves-effect waves-green btn-flat"
          onclick="saveCommentPreferences()"
          >Opslaan en sluiten</a
        >
      </div>
    </div> -->

    <!-- Modal Structure -->
    <!-- <div id="addCommentModal" class="modal">
      <div class="modal-content">
        <h3 class="indigo-text">Voer comment in voor:</h3>
        <h5></h5>
        <br /><br />
        <div class="input-field col s6">
          <input
            placeholder="comment"
            id="commentInput"
            type="text"
            class="validate"
          />
          <label for="commentInput">Comment</label>
        </div>
      </div>
      <div class="modal-footer">
        <a
          href="#!"
          class="modal-close waves-effect waves-green btn-flat"
          onclick="saveComment()"
          >Opslaan en sluiten</a
        >
      </div>
    </div> -->

    <script-content> </script-content>
  </div>
</template>

<script lang="js">
import navbar from "../components/util/NavBar";
import ScriptContent from "./scriptcontent.vue";

import $ from "jquery";
import firebase from 'firebase/app'
import "firebase/database"

// import "./js/cookies.js"
import {confetti} from "./js/deps/confetti.min.js"
// import "./js/deps/materialize.min.js"
// import "./js/Scroller.js"
// import "./js/main.js"
// import "./js/comment.js"

const docClass = 'c23'
const emptyClass = 'c0'

const database = firebase.database();

export default {
  components: {
    navbar,
    ScriptContent
  },

  data() {
    return {
      Scroller: null,
      scrolled: 0,
      scrolling: false,
      topMargin: 0,
      elems: [],
      sceneTag:"c0",
      commentGroup: "",
      commentMode: false,
      commentRef: firebase.database().ref("livescript/comment/" + this.commentGroup),
      comments: [],
      lastCommendClicked: {},
      commentBoxOpen: false,
    }
  },

  methods: {
    /**
     * @private
     * @description This function is currently only executed by the scrollTo function, and will remove any empty, null, undefined or false items from the given array (note: its async so an await on the call is required!)
     */
      filter_array: async function (test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];
    while (++index < arr_length) {
        var value = test_array[index];
        if (value) result[++resIndex] = value;
    }
    return result;
    },

    /**
     * @description This function is executed when the user clicks on "Einde". It will toggle the confetti boolean on in the database.
     */
      toggleConfetti: function() {
        database.ref("livescript/confetti").set(confetti.isRunning() ? false : true);
    },

     /**
     * @description This function is executed when a user clicks (using arrowkeys/space also counts as click) on a script sentence. It calculates which other sentences belong to the selected one and then pushes an array of line indexxes to the realtime firebase database
     */
      scrollTo: async function(target) {
        console.log("SCROOLING")
        if (!this.commentMode) {
        if (location.hash == "#embed" || $(target).text() == "") return;
        var elems_after = [$(target).attr("id")];
        for (var i = 1; i < 100; i++) {
            if (
            $(`#${elems_after[i - 1]}`)
                .next()
                .hasClass(emptyClass)
            )
            break;
            elems_after.push(
            $(`#${elems_after[i - 1]}`)
                .next()
                .attr("id")
            );
        }
        elems_after = elems_after.splice(1, 1);
        var elems_before = [$(target).attr("id")];
        for (var j = 1; j < 100; j++) {
            if (
            $(`#${elems_before[j - 1]}`)
                .prev()
                .hasClass(emptyClass)
            )
            break;
            elems_before.push(
            $(`#${elems_before[j - 1]}`)
                .prev()
                .attr("id")
            );
        }
        this.elems = await this.filter_array(elems_after.concat(elems_before));
        if (this.elems.length == 0) return;
        firebase.database().ref("livescript/scroll").set(this.elems);
        }
      return;
    },

    /**
     * @description This function is executed when the scroll event is fired on the document. It will check which scene is currently visable in the window and set the scrollspy & little thinghy in the up-left corner to the current scene
     */
      onScroll: async function () {
        if (this.elems.length == 0) return;
        var y = (($(`#${this.elems[0]}`).offset().top - this.topMargin) - $(window).scrollTop())
        if ((y < -30 || y > 30)) $(".fixed-action-btn").show()
        else $(".fixed-action-btn").hide()
        var elScrolledBy = [],
        currentSceneText = "scene 1";

        $("." + this.sceneTag).each(function () {
        if (
            $(this).text() != "" &&
            $(this).text().indexOf("Scene") >= 0 &&
            $(this).text().indexOf("Licht Scene") < 0 &&
            $(this).text().indexOf("Fade naar Scene 7") < 0
        ) {
            if (
            window.scrollY + $(window).height() / 2 >
            $(this).offset().top + $(this).height()
            )
            elScrolledBy.push($(this));
        }
        });

        if (elScrolledBy[elScrolledBy.length - 1])
        currentSceneText = $(elScrolledBy[elScrolledBy.length - 1])
            .first()
            .text();
        $("a.active").removeClass("active");
        $(`li[value="${currentSceneText}"`).find("a").addClass("active");
        $("#currentScene span").text(currentSceneText);
    },

    /**
     * @description This function is executed when any key is pressed on the page. It then filters for the arrow keys which will irritate thru the lines.
     */
      onKeydown: async function (e) {
        // if (M.Modal.getInstance($("#addCommentModal")).isOpen) {
        // } else
        if ([37, 38].includes(e.which)) {
        e.preventDefault();
        /* eslint-disable for-direction */
        for (
            var id = parseInt(this.elems[this.elems.length - 1]) - 1;
            id < parseInt(this.elems[this.elems.length - 1]) + 100;
            id--
        ) {
            if ($(`#${id}`).text() != "") {
            $(`#${id}`).click();
            break;
            }
        }
        } else if ([32, 39, 40].includes(e.which)) {
        e.preventDefault();
        for (
            var _id = parseInt(this.elems[0]) + 1;
            _id < parseInt(this.elems[0]) + 100;
            _id++
        ) {
            if ($(`#${_id}`).text() != "") {
            $(`#${_id}`).click();
            break;
            }
        }
        }
    },

    /**
     * @description This function is executed when the database is updated, and will scroll to 300px above the first index (selected line). It will also call to assingSelector to move the purple bar to the selected portion.
     */
      scroll: async function (val, scene) {
        if ($("#overlay").is(":visible")) $("#overlay").hide();
        this.topMargin = scene ? 100 : 200;
        this.elems = val;
        this.assignSelector();
        $(`.${docClass} .selected`).removeClass("selected");
        if (this.scrolling) return;
        this.scrolling = true;
        $("html, body").animate(
        {
            scrollTop: $(`#${this.elems[0]}`).offset().top - this.topMargin,
        },
        location.hash == "#embed" ? 500 : 200,
        "linear",
        () => {
            this.scrolling = false;
            this.scrolled = $(`#${this.elems[0]}`).offset().top - this.topMargin;
        }
      );
    },

    /**
     * @description This function is executed when the FAB (floating action button) is pressed, and will (client side) scroll the user back to the current position.
     */
      scrollTop: async function () {
        this.scroll(this.elems);
    },

    /**
     * @description This function is executed by the scroll function and moves the purple bar to the current selected lines.
     */
      assignSelector: async function () {
        if (location.hash == "#mobile" || $(window).width() < 900)
        $("body").attr("mobile", "true");
        else $("body").attr("mobile", "false");
        var height = 0;
        this.elems.forEach((elem) => (height += $(`#${elem}`).height()));
        $(".indicator")
        // 56 for the navbar compensation
        .css(
            "top",
            $(`#${this.elems[0]}`).offset().top -
            height +
            $(`#${this.elems[0]}`).height() - $(`#app > div.v-application--wrap > div > div > main > div > div > header`).height()
        )
        .css("left", $(`#0`).first().offset().left - 20)
        .css("height", height);
    },
  },

  mounted() {
    $(document).ready(function () {
      $(".modal").modal();
      $("select").formSelect();
      $(".tooltipped").tooltip();
    });

    if (window.location.hash.substring(1) == "video") {
      $("#nav-mobile > li:nth-child(5)").css("display", "block");
    }

    /**
     * @description This function is executed when a change occurs in the scroll reference of the database, and will execute the scroll function with the new indexxes of the selected lines.
     */
    database.ref("livescript/scroll").on("value", (snapshot) => {
      if (snapshot.val()) this.scroll(snapshot.val());
      else this.scroll([0]), this.$toast("Geen huidige regel gevonden...");
    });

    /**
     * @description This function is executed when a change occurs in the confetti reference of the database, and will either start or stop the confetti.
     */
    database.ref("livescript/confetti").on("value", (snapshot) => {
      snapshot.val() ? confetti.start() : confetti.stop();
    });

    /**
     * @description This function is executed when a change occurs in the exclude reference of the database, and will toggle the exclude class on the given indexxes.
     */
    database.ref("livescript/exclude").on("value", function (snapshot) {
      $(".exclude").removeClass("exclude");
      snapshot.val().forEach((exclude) => {
        $(`#${exclude}`).addClass("exclude");
      });
    });

    /**
     * @description This block of code is executed when jQuery is successvully initialized and will give every line a unique index, and will also handle the click events (on the lines and on the scrollspy)
     */
      $(async () => {
    if (localStorage.getItem("theme") == "dark") $("body").attr("theme", "dark");
    if (location.hash == "#embed")
        $(".navbar-fixed").hide(), $("body").attr("embed", "true"); //   These attributes are read by the CSS
    if (location.hash == "#mobile" || $(window).width() < 900)
        $("body").attr("mobile", "true"); // and will hide/show some elements
    $(emptyClass).each(function (index) {
        $(this).attr("id", `scene-${index}`);
        if ($(this).text()) {
        var text = $(this).text();
        $(this).text(
            text.substring(0, text.indexOf(text.match(/\d+/))) +
            text.match(/\d+/)[0]
        );
        $("#scrollspy > ul").append(
            `<li index="${index}"><a>${$(this).text()}</a></li>`
        );
        }
    });
    $("#scrollspy > ul > li").each(function () {
        $(this).attr("value", $(this).text());
        $(this).click(() =>{
          console.log("clicked");
        this.scroll(
            [
            $(`#scene-${$(this).attr("index")}`)
                .parent()
                .attr("id"),
            ],
            true
        )
        }
        );
    });
    document.querySelectorAll(`.${docClass} p`).forEach((el) => {
      el.addEventListener('click', () => {console.log("SCOROL"); this.scrollTo(el)})
    })
    $(`.${docClass} p`).each(function (index) {
        $(this).attr("id", index);
        if (!$(this).is(".title")) $(this).click(() => {this.scrollTo; console.log("Scrolling")});
        this.addEventListener('click', () => {console.log("SCOROL"); this.scrollTo(this)})
    });
    $(".fixed-action-btn").click(() => this.scrollTop());
    });

    $(window)
        .on("resize", this.assignSelector)
        .keydown(this.onKeydown)
        .scroll(this.onScroll);

    if(this.isAdmin){
      $("body").attr("loggedin", "true");
    }
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
  },

  watch: {
    isAdmin(val) {
    if(val){
      $("body").attr("loggedin", "true");
    } else {
      $("body").attr("loggedin", "false");
    }
    }
  }
}
//#endregion
</script>

<style scoped lang="scss">
#currentScene {
  margin-left: 1rem;
  font-weight: bold;
  color: #fff !important;
}

#currentScene > span {
  text-transform: capitalize;
  font-weight: 300 !important;
  color: #fff !important;
}

#scrollspy {
  position: fixed;
  right: 3vw;
  top: 50vh;
  /* width: 230px; */
  transform: translateY(-50%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
  text-transform: capitalize;
}

.exclude,
.exclude * {
  text-decoration: line-through !important;
  text-decoration-color: red !important;
  color: red !important;
}

.table-of-contents a:hover {
  border-left-color: rgb(133, 53, 184) !important;
}

.table-of-contents a.active {
  border-left-color: rgb(106, 27, 154) !important;
  color: #808080 !important;
}

body[theme="dark"] .c8,
body[theme="dark"] .c18,
body[theme="dark"] .brand-logo {
  color: #eee !important;
}

body[theme="dark"] .c19,
body[theme="dark"] .c11,
body[theme="dark"] .c29,
body[theme="dark"] .c15 {
  color: black !important;
}

body[theme="dark"],
body[theme="dark"] .c24 {
  background-color: #202124 !important;
}

body[theme="dark"] span,
body[theme="dark"] p {
  color: #a9a9a9 !important;
}

body[theme="dark"] .comment {
  background-color: #3f3f3f;
  color: white !important;
}

body[theme="light"] .comment {
  background-color: #aaaaaa;
  color: black !important;
}

* {
  user-select: none;
  transition: text 400ms;
  transition: background 400ms;
}

body[embed="true"] {
  width: calc(100vw - 30px) !important;
  padding: 0 !important;
  margin: 0 !important;
  background-color: transparent !important;
  /* overflow: hidden !important; */
}

body[embed="true"] .c24 {
  background-color: transparent !important;
  width: calc(100vw - 30px) !important;
  padding: 0 !important;
  margin: 20px !important;
  /* overflow: hidden !important; */
}

body[embed="true"] .c19 {
  color: black !important;
}

body[embed="true"] #scrollspy,
body[embed="true"] .fixed-action-btn {
  display: none !important;
}

body[embed="true"] span {
  color: #e6e6e6;
}

body[embed="true"] * {
  color: #e6e6e6;
  font-size: large;
}

body[mobile="true"] {
  width: calc(100vw - 40px) !important;
  padding: 0 !important;
  margin: 0 !important;
  /* overflow: hidden !important; */
}

body[mobile="true"] .c24 {
  background-color: transparent !important;
  width: calc(100vw - 40px) !important;
  padding: 0 !important;
  margin: 20px !important;
  /* overflow: hidden !important; */
  padding-left: 10px !important;
}

body[mobile="true"] .show-on-large {
  display: none !important;
}

#overlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 2;
  cursor: wait;
}

.progress {
  position: absolute;
  /* height: 10px;
    width: 100px; */
  width: 50rem;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%);
  height: 10px;
  border-radius: 50px !important;
}

/* h1 {
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%);
    font-size: 25px;
    color: white;
} */

.indeterminate::before {
  border-radius: 50px !important;
}

.indicator {
  position: absolute;
  width: 5px;
  background-color: rgb(106, 27, 154);
}

.selected {
  /* outline: 5px solid rgb(106, 27, 154); */
  /* border-left: 5px solid rgb(106, 27, 154); */
  animation: blinker 1s linear infinite;
  box-shadow: -5px 0px 0px 0px rgb(106, 27, 154);
}

body[loggedin="true"] .c24 p {
  cursor: pointer !important;
}

.c24 p {
  cursor: not-allowed;
}

@media only screen and (max-width: 600px) {
  body[embed="true"] {
    width: calc(100vw - 30px) !important;
    padding: 0 !important;
    margin: 0 !important;
    /* overflow: hidden !important; */
  }
  body[embed="true"] .c24 {
    /* background-color: transparent !important; */
    width: calc(100vw - 30px) !important;
    padding: 0 !important;
    margin: 20px !important;
    /* overflow: hidden !important; */
  }
  #currentScene {
    display: none !important;
  }
}

:target {
  display: block;
}

.comment {
  right: 80px;
  position: absolute;
  padding: 10px;
  padding-top: 7px;
  padding-bottom: 7px;
  border-radius: 10%;
  max-width: 20%;
  background-color: #aaaaaa;
  color: black !important;
}

.commentModeIndicator {
  position: fixed !important;
}

/* docs.css */
</style>
