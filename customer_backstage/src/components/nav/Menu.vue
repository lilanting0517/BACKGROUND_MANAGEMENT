<template>
  <ul>
    <slot></slot>
  </ul>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { setItem, getItem } from "@/common/js/util";
export default {
  name: "NavMenu",
  componentName: "NavMenu",
  data() {
    return {};
  },
  provide() {
    return {
      rootMenu: this
    };
  },
  computed: {
    ...mapState(["loading", "activeNav"])
  },
  mounted() {
    this.$on("item-click", this.handleItemClick);
    // this.updateActiveNav(index);
  },
  methods: {
    ...mapMutations(["setLoading", "updateActiveNav"]),
    handleItemClick(item) {
      this.updateActiveNav(item.index);
      setItem("activeNav", item.index);
    }
  }
};
</script>

<style lang="scss">
@import "../../common/css/_var";

/* 导航栏 */
.nav_wrap {
  width: 100%;
  height: 36px;
  background-color: $theme_color;
  .nav {
    width: 1200px;
    margin: 0 auto;
    li {
      font-size: 16px;
      line-height: 18px;
      padding: 9px 0;
      letter-spacing: 0.8px;
      cursor: pointer;
      > a {
        padding: 0 43px;
        color: #fefefe;
        border-left: 1px solid #ba0909;
      }
    }
    .active {
      background-color: #fff;
      > a {
        border-left: none;
        color: $theme_color;
        background-color: #fff;
      }
    }
    .active + li {
      > a {
        border-left: none;
      }
    }
  }
}
</style>
