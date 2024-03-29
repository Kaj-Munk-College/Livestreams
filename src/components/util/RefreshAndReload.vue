<template>
  <div class="pr-wrap">
    <div class="wrap-part first">
      <vue-scroll
        ref="vs"
        :ops="ops"
        @refresh-start="handleRS"
        @load-before-deactivate="handleLBD"
        @refresh-before-deactivate="handleRBD"
        @load-start="handleLoadStart"
      >
        <template v-for="(item, index) in amount">
          <div class="rl-child" :key="index" :class="getClass(index)" />
        </template>
        <div slot="load-beforeDeactive" v-if="noData">
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8056"
          >
            <path
              d="M469.333333 384h85.333334v213.333333h-85.333334z m0 298.666667h85.333334v85.333333h-85.333334z"
              fill=""
              p-id="8057"
            ></path>
            <path
              d="M549.717333 108.032c-14.762667-27.904-60.672-27.904-75.434666 0l-384 725.333333A42.624 42.624 0 0 0 128 896h768a42.581333 42.581333 0 0 0 37.674667-62.592L549.717333 108.032zM198.869333 810.666667L512 219.221333 825.130667 810.666667H198.869333z"
              fill=""
              p-id="8058"
            ></path>
          </svg>
          "No More Data"
        </div>
      </vue-scroll>
    </div>
    <div class="wrap-part second">
      <vue-scroll :ops="operationOps" ref="op">
        <table class="customize-table">
          <tr>
            <th>autoLoadEnable</th>
            <td>
              True:<input
                type="radio"
                :value="true"
                v-model="ops.vuescroll.pushLoad.auto"
              />
              False:
              <input
                type="radio"
                :value="false"
                v-model="ops.vuescroll.pushLoad.auto"
              />
            </td>
          </tr>
          <tr>
            <th>autoLoadDistance</th>
            <td>
              <input
                type="number"
                min="0"
                v-model="ops.vuescroll.pushLoad.autoLoadDistance"
                :disabled="!ops.vuescroll.pushLoad.auto"
              />
            </td>
          </tr>
          <tr>
            <th>Trigger Refresh Or Load</th>
            <td>
              Load: <input type="radio" value="load" v-model="triggerType" />
              <br /><br />
              Refresh:
              <input type="radio" value="refresh" v-model="triggerType" />
              <br />
              <br />
              <button @click="trigger">Trigger</button>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="animate-tip">
              <a :href="config.animateAddr" target="_blank">
                {{ config.animateTip }}</a
              >
            </td>
          </tr>
        </table>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
import vuescroll from "vuescroll";

export default {
  components: {
    vuescroll,
  },
  mounted() {
    console.log(this.$refs.op);
  },
  data() {
    const config = {};
    const ops = {
      vuescroll: {
        mode: "slide",
        pullRefresh: {
          enable: true,
        },
        pushLoad: {
          enable: true,
          auto: true,
          autoLoadDistance: 10,
        },
      },
    };

    config.animateTip =
      "You can also customize different refreh/load animations via slot.";
    config.animateAddr =
      "https://vuescrolljs.yvescoding.org/guide/slot.html#usage-2";
    return {
      ops,
      config,
      width: "",
      operationOps: {
        rail: {
          size: "20px",
        },
        bar: {
          size: "15px",
          opacity: 0.5,
          onlyShowBarOnScroll: false,
        },
      },
      itemAmount: 3,
      refresh: 1,
      noData: false,
      triggerType: "load",
    };
  },
  computed: {
    amount() {
      function getRandom() {
        let str = "#";
        for (let i = 0; i < 6; i++) {
          str += Math.floor(Math.random() * 16).toString(16);
        }
        return str;
      }
      return (
        this.refresh &&
        Array.apply(null, {
          length: this.itemAmount,
        }).map((item) => {
          return getRandom();
        })
      );
    },
  },
  methods: {
    getClass(index) {
      return ["child" + ((index % 7) + 1)];
    },
    handleRS(_vsInstance, _refreshDom, done) {
      const vm = this;
      setTimeout(() => {
        this.refresh++;
        done();
      }, 1500);
    },
    handleLoadStart(_vm, _dom, done) {
      setTimeout(() => {
        const random = Math.floor(Math.random() * 2) + 1;
        if (random == 1) {
          this.noData = true;
        } else {
          this.noData = false;
        }
        done();
      }, 600);
    },
    handleLBD(_vm, _loadDom, done) {
      setTimeout(() => {
        if (!this.noData) {
          this.itemAmount += 2;
        }
        done();
      }, 500);
    },
    handleRBD(vm, loadDom, done) {
      setTimeout(() => {
        done();
      }, 500);
    },
    getBg() {
      let str = "#";
      let i = 6;
      while (i--) {
        str += Math.floor(Math.random() * 16).toString(16);
      }
      return {
        backgroundColor: str,
      };
    },
    trigger() {
      this.$refs["vs"].triggerRefreshOrLoad(this.triggerType);
    },
  },
};
</script>

<style lang="stylus" scoped>
@media (max-width: 719px) {
  .pr-wrap {
    flex-wrap: wrap;
    .wrap-part {
      width: 100% !important;
      &.first {
        height: 60%;
      }
      &.second {
        height: 40%;
      }
    }
  }
}
.pr-wrap {
  display: flex;
  height: 100%;
  justify-content: center;
  table {
    margin: 0;
  }
  .rl-child {
    width: 100%;
    height: 200px;
  }
  .wrap-part {
    height: 100%;
    &.first {
      width: 40%;
    }
    &.second {
      width: 30%;
    }
    .parent {
      .rl-child {
      }
    }
    table {
      display: table;
      width: 100%;
    }
  }
}
.child1 {
  background-color: #43d2c6;
}
.child2 {
  background-color: #589be5;
}
.child3 {
  background-color: #f3b500;
}
.child4 {
  background-color: #ff705a;
}
.child5 {
  background-color: #fe7a9c;
}
.child6 {
  background-color: #7a85ee;
}
.child7 {
  background-color: #57cc71;
}
.animate-tip {
  text-align: center;
}
</style>
