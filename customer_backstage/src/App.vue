<template>
  <div id="app">
    <head-top v-if="isRegisterOrLogin"></head-top>
    <router-view></router-view>
  </div>
</template>

<script>
import HeadTop from "@/components/HeadTop";
import { setItem, getItem } from "@/common/js/util";
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    HeadTop
  },
  mounted() {

  },
  computed: {
    ...mapState(["loading", "isRegisterOrLogin"])
  },
  methods: {
    ...mapMutations(["setLoading", "setIsRegisterOrLogin"])
  }
};
</script>

<style lang="scss">
@import "./src/common/css/mixin/_normalize";
@import "./src/common/css/mixin/_clearfix";
@import "./src/common/css/base";
@import "./src/common/css/mixin/_normalize";

body {
  font-size: 14px;
  font-family: "Microsoft Yahei";
}
#app {
  height: 100%;
}
.el-dialog{
  width: 33%;
}
.home_wrap {
  width: 100%;
  height: auto;
  min-height: 100%;
  background-color: #f3f3f3;
  overflow: hidden;

  section {
    width: 1200px;
    margin: 0 auto;
    margin-top: 60px;
    overflow: hidden;
    overflow-y: auto;

    .main_wrap {
      overflow-y: auto;
      height: auto;
      margin-left: 200px;
      padding: 15px 0 0 15px;
      background-color: transparent;

      .main {
        width: 100%;
        height: auto;
        min-height: 760px;
        margin-bottom: 30px;

        .char_tit {
          height: 44px;
          padding: 0 10px 0 33px;
          margin-bottom: 5px;
          background-color: #fff;
          font-size: 16px;
          line-height: 44px;
          box-sizing: border-box;
          position: relative;
          .banner {
            color: #555555;
            font-size: 14px;
            line-height: 44px;
          }
          .btn_add {
            width: 85px;
            height: 24px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: normal;
            background-color: #fff;
            border: solid 1px #e5e5e5;
            margin-top: 10px;
          }
        }

        .tab_wrap {
          font-size: 14px;
          background-color: #fff;
          th {
            background-color: #e8f2fe;
          }
        }

        .page_wrap {
          padding: 0;
          margin-top: 7px;
          background: #ffffff;

          .checkAll {
            line-height: 44px;
            margin-left: 22px;
          }
          .pages {
            margin-top: 6px;

            li {
              border: solid 1px #cccccc;
              margin: 2px;
              color: #555555;
              font-weight: normal;
              background-color: #ffffff;
            }
            .active {
              background-color: #56bbfc;
              color: #ffffff;
              cursor: default;
            }
            li:not(.disabled):hover {
              color: #56bbfc;
            }
            li.active:hover {
              color: #ffffff;
            }
            button {
              border: solid 1px #cccccc;
              margin: 2px;
              background-color: #ffffff;
            }
          }
          .btn_add {
            width: 48px;
            height: 24px;
            border-radius: 4px;
            background-color: #f2f2f2;
            border: solid 1px #f2f2f2;
            font-size: 14px;
            margin-left: 10px;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
