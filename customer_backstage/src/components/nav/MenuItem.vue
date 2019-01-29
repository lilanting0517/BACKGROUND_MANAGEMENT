<template>
  <li
    :class="{'active': active}"
     class="fl"
    @click="handleItemClick"
  >
    <slot></slot>
  </li>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Menu from "./menu-mixin";
import Emitter from "@/common/js/emitter";

export default {
  name: "MenuItem",
  componentName: "MenuItem",
  mixins: [Menu, Emitter],
  props: {
    index: {
      type: String,
      required: true
    },
    first:{
      required:true
    },
    disabled: Boolean
  },
  watch:{
    index(newVal,oldVal){
     this.index=newVal;
    },
    first(newVal,oldVal){
      this.first=newVal;
    }
  },
  computed: {
    ...mapState(["activeNav"]),
    active: function() {
      // console.log(this.activeNav);
      // console.log(this.index);
      // console.log(this.first);
      //  console.log(this.activeNav.slice(0,1) + "-"+this.first , this.index);
      return this.activeNav.slice(0, 1) +  "-" + this.first=== this.index;
    }
  },
  methods: {
    ...mapMutations(["updateActiveNav"]),
    handleItemClick() {
      if (!this.disabled) {
        /* 派发组件自身点击事件至父组件 */
        this.dispatch("NavMenu", "item-click", this);
        /* 触发组件自定义点击事件 */
        this.$emit("click", this);
      }
    }
  }
};
</script>

<style lang="scss">

</style>
