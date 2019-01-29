<template>
    <aside class="fl">
        <p class="fir_fl">商品管理</p>
        <ul class="sec_fl clearfix">
          <router-link v-if="userType.banner" :class="{ active: isActive }" @click.native="changeClass" tag="li" to="/banner">
            <a>banner图管理</a>
          </router-link>
          <router-link v-if="userType.news" tag="li" to="/news"  @click.native="changeClass">
            <a>最新资讯管理</a>
          </router-link>
          <router-link v-if="userType.all" tag="li" to="/permission"  @click.native="changeClass">
            <a>权限设置</a>
          </router-link>
          <router-link v-if="userType.classify" tag="li" to="/classify"  @click.native="changeClass">
            <a>分类管理</a>
          </router-link>
        </ul>
    </aside>
</template>
<script>
import { GetAllNewsInfo } from "@/api";
import { mapState, mapMutations } from "vuex";
export default {
  name: "asideMenu",
  data() {
    return {
      isActive: true,
      userType: {
        banner: false,
        news: false,
        all: false,
        classify: false
      }
    };
  },
  methods: {
    changeClass() {
      this.isActive = false;
    },
    changeClass1() {
      this.isActive = false;
    }
  },
  computed: {},
  mounted() {
    let location = this.$router.history.current.path;
    let userType = JSON.parse(localStorage.getItem("userType"));
    this.userType = userType;
    if (location !== "/banner") {
      this.isActive = false;
    }
  }
};
</script>
<style lang="scss">
.router-link-active {
  border-left: 2px solid #56bbfc;
  background-color: #fbfbfb;
}
aside {
  position: fixed;
  height: 100%;
  width: 200px;
  top: 60px;
  padding-top: 30px;
  background-color: #fff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .fir_fl {
    padding-left: 32px;
    line-height: 1em;
    margin-bottom: 10px;
    color: #ccc;
    font-size: 14px;
  }
  ul,
  ol {
    list-style: none;
    padding-left: 0;
    margin: 0;

    a {
      display: block;
      padding-left: 40px;
      border-left: 2px solid #fff;
      line-height: 34px;
      color: #555;
    }
    .active a {
      // border-left: 2px solid #56bbfc;
      background-color: #fbfbfb;
    }
  }
}
</style>


