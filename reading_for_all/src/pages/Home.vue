<template>
<div class="home_wrap">
  <head-top></head-top>
  <section>
    <aside-menu></aside-menu>
    <div class="main_wrap">
      <router-view/>
    </div>
  </section>
</div>
</template>

<script>
import HeadTop from "@/components/HeadTop";
import asideMenu from "@/components/asideMenu";
export default {
  name: "Home",
  data() {
    return {
      msg: "",
      checked: false
    };
  },
  components: {
    HeadTop,
    asideMenu
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
