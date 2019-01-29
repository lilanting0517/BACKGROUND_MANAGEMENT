<template>
  <div class="main">
    <div class="banner_select">
      <a href="javascript:;" v-for="(item,index) in lists" @click="move(item.com,index)" :class={active:active[index]}>{{item.Name}}</a>
    </div>
    <keep-alive>
      <component :is="whitch" ref="children"></component>
    </keep-alive>
  </div>
</template>
<script>
import UnitAssociationStore from "./UnitAssociationMatain/UnitAssociationStore";
import UnitAssociationClassification from "./UnitAssociationMatain/UnitAssociationClassification";
export default {
  data() {
    return {
      lists: [
        {
          Name: "外部单位与门店关联",
          com: "UnitAssociationStore"
        },
        {
          Name: "外部单位与分类关联",
          com: "UnitAssociationClassification"
        }
      ],
      active: [true, false],
      whitch: "UnitAssociationStore"
    };
  },
  components: {
    UnitAssociationStore,
    UnitAssociationClassification
  },
  methods: {
    move(whitch, index) {
      this.whitch = whitch;
      for (var i = 0; i < this.active.length; i++) {
        this.active[i] = false;
        this.active[index] = true;
      }
      this.$set(this.active, 2, 0);
    }
  }
};
</script>
<style lang="scss" scoped>
.banner_select {
  height: 44px;
  line-height: 44px;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 0 20px;
  a {
    margin-right: 50px;
    color: #666;
    font-size: 15px;
    text-decoration: none;
    height: 40px;
    padding-bottom: 10px;
  }
  .active {
    border-bottom: 2px solid #168ce2;
  }
}
</style>
