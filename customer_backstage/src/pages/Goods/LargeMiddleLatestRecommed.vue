<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      <span>大中专最新推荐维护</span>
    </h2>
    <div class="teaching_material_select">
      <router-link to="/homegoods/largemiddlelatestrecommed/university" @click.native="move($event)" class="first_indent">大学本科</router-link>
      <router-link to="/homegoods/largemiddlelatestrecommed/vocational" @click.native="move($event)">高职高专</router-link>
      <router-link to="/homegoods/largemiddlelatestrecommed/secondaryvocational" @click.native="move($event)">中职中专</router-link>
      <el-button class="fr add_banner" size="small" @click="open" type="primary">新增</el-button>
      <div class="border_bottom" :class="{position_one:isPositionOne, position_two :isPositionTwo}">

      </div>
    </div>
    <router-view :isOpenModal="isOpenModal"></router-view>
  </div>
</template>

<script>
import { setItem, getItem } from "@/common/js/util";
export default {
  name: "largemiddlelatestrecommed",
  data() {
    return {
      isPositionOne: false,
      isPositionTwo: false,
      isOpenModal: false
    };
  },
  mounted() {
    let position = getItem("lateRecommed");
    switch (position) {
      case "大学本科":
        this.isPositionOne = false;
        this.isPositionTwo = false;
        this.$router.push({name: "university" })
        break;
      case "高职高专":
        this.isPositionOne = true;
        this.isPositionTwo = false;
        this.$router.push({name: "vocational" })
        break;
      case "中职中专":
        this.isPositionOne = false;
        this.isPositionTwo = true;
        this.$router.push({name: "secondaryvocational" })
        break;
    }
  },
  methods: {
    move(e) {
      switch (e.target.innerHTML) {
        case "大学本科":
          this.isPositionOne = false;
          this.isPositionTwo = false;
          setItem("lateRecommed", "大学本科");
          break;
        case "高职高专":
          this.isPositionOne = true;
          this.isPositionTwo = false;
          setItem("lateRecommed", "高职高专");
          break;
        case "中职中专":
          this.isPositionOne = false;
          this.isPositionTwo = true;
          setItem("lateRecommed", "中职中专");
          break;
      }
    },
    open() {
      this.isOpenModal = !this.isOpenModal;
    }
  }
};
</script>












<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.teaching_material_select {
  height: 44px;
  width: 100%;
  line-height: 44px;
  padding-left: 33px;
  background-color: #fff;
  position: relative;
  margin-bottom: 10px;
  a {
    margin-right: 20px;
    color: #666;
    font-size: 14px;
    text-decoration: none;
    width: 56px;
    float: left;
  }

  .border_bottom {
    position: absolute;
    width: 56px;
    height: 2px;
    bottom: 4px;
    left: 32px;
    background-color: #168ce2;
  }
  .position_one {
    left: 106px;
    width: 56px;
  }
  .position_two {
    left: 184px;
    width: 56px;
  }
  .add_banner {
    margin-top: 5px;
    margin-right: 10px;
  }
}
</style>
