<template>
<div class="home_wrap">
  <section>
    <aside-menu></aside-menu>
    <div class="main_wrap">
      <router-view/>
    </div>
  </section>
</div>
</template>

<script>
import asideMenu from "@/components/asideMenu";
import TopicActivity from "./TopicActivity";
export default {
  name: "Home",
  data() {
    return {
      msg: "",
      checked: false
    };
  },
  components: {
    asideMenu,
    TopicActivity
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
