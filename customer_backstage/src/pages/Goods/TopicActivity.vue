<template>
  <div class="main">
    <!-- 标题部分 -->
    <h2 class="char_tit clearfix">
      主题活动
    </h2>
    <!-- banner 选择部分 -->
    <div class="banner_select">
      <router-link to="/homegoods/topicactivity/banner1" @click.native="move($event)">banner图一</router-link>
      <router-link to="/homegoods/topicactivity/banner2" @click.native="move($event)">banner图二</router-link>
      <router-link to="/homegoods/topicactivity/banner3" @click.native="move($event)">banner图三</router-link>
      <el-button class="fr add_banner" size="small" @click="addBanner" type="primary">新增活动</el-button>
      <div class="border_bottom" :class="{position_one:isPositionOne, position_two :isPositionTwo}">

      </div>
    </div>
    <router-view ref="child2"></router-view>
  </div>
</template>

<script>
import { setItem, getItem } from "@/common/js/util";
import Bus from "@/common/js/bus";
export default {
  name: "BannerManage",
  data() {
    return {
      isPositionOne: false,
      isPositionTwo: false,
      tableData: [
        {
          Num: "1",
          Picdisc: "图片描述",
          Word: "文字描述文字描述文字描述文字描述文字描述文字",
          Time: "2017.08.03--2018.08.03",
          State: "正常",
          Move: "",
          Operation: "修改"
        },
        {
          Num: "2",
          Picdisc: "图片描述",
          Word: "文字描述文字描述文字描述文字描述文字描述文字",
          Time: "2017.08.03--2018.08.03",
          State: "正常",
          Move: "",
          Operation: "修改"
        }
      ],
      checked: false,
      to: "banner1",
      multipleSelection: [],
      isBanner2: false
    };
  },
  mounted() {
    let bannerPosition = getItem("bannerPosition");
    switch (bannerPosition) {
      case "1":
        this.isPositionOne = false;
        this.isPositionTwo = false;
        this.to = "banner1";
        this.$router.push({ name: "banner1" });
        break;
      case "2":
        this.isPositionOne = true;
        this.isPositionTwo = false;
        this.to = "banner2";
        this.$router.push({ name: "banner2" });
        break;
      case "3":
        this.isPositionOne = false;
        this.isPositionTwo = true;
        this.to = "banner3";
        this.$router.push({ name: "banner3" });
        break;
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    move(e) {
      this.$nextTick(() => {
        switch (e.target.innerHTML) {
          case "banner图一":
            this.isPositionOne = false;
            this.isPositionTwo = false;
            setItem("bannerPosition", "1");
            this.isBanner2 = false;
            this.to = "banner1";
            break;
          case "banner图二":
            this.isPositionOne = true;
            this.isPositionTwo = false;
            setItem("bannerPosition", "2");
            this.isBanner2 = true;
            this.to = "banner2";
            break;
          case "banner图三":
            this.isPositionOne = false;
            this.isPositionTwo = true;
            setItem("bannerPosition", "3");
            this.isBanner2 = false;
            this.to = "banner3";
            break;
        }
      });
    },
    addBanner() {
      if (this.isPositionOne) {
        if (this.$refs.child2.getdata2() < 1) {
          let to = this.to;
          this.$router.push({ name: "add", params: { from: to } });
        } else {
          this.$message("banner2只能添加一张哦！");
        }
      } else {
        let to = this.to;
        this.$router.push({ name: "add", params: { from: to } });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.banner_select {
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
  }
  .border_bottom {
    position: absolute;
    width: 75px;
    height: 2px;
    bottom: 4px;
    left: 32px;
    background-color: #168ce2;
  }
  .position_one {
    left: 131px;
  }
  .position_two {
    left: 230px;
  }
  .add_banner {
    display: inline-block;
    margin-right: 10px;
    margin-top: 5px;
  }
}
</style>
