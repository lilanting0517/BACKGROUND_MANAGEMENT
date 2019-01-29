<template>
  <div class="main">
    <h2 class="char_tit">
      区域业务员维护
      <el-button id="add" class="fr add_hot_word add_new" size="mini" @click="addItem" type="primary">新增</el-button>
      <!-- <el-button id="add" class="fr add_hot_word" size="mini" @click="saveChange">确定</el-button> -->
    </h2>
    <!-- 活动选择 -->
    <div class="banner_select">
      <a href="javascript:;" v-for="(item,index) in lists" @click="move(item.com,index)" :class={active:active[index]}>{{item.Name}}</a>
    </div>
    <keep-alive>
      <component :is="whitch" ref="children" :formData.sync="formData"></component>
    </keep-alive>
  </div>
</template>


<script>
import ActivityTopic from "./BrandBusinessMatain/ActivityTopic";
import GoodSale from "./BrandBusinessMatain/GoodSale";
import ImportantProduct from "./BrandBusinessMatain/ImportantProduct";
import LargeMiddle from "./BrandBusinessMatain/LargeMiddle";
import MoreProduct from "./BrandBusinessMatain/MoreProduct";
import NewBook from "./BrandBusinessMatain/NewBook";
import CommonBooks from "./BrandBusinessMatain/CommonBooks";
import interviewData from "./BrandBusinessMatain/interviewData";

export default {
  name: "brandbusinessmatain",
  data() {
    return {
      tableData: [],
      checked: false,
      lists: [
        {
          Name: "活动图书",
          com: "ActivityTopic"
        },
        {
          Name: "畅销图书",
          com: "GoodSale"
        },
        {
          Name: "重点产品",
          com: "ImportantProduct"
        },
        {
          Name: "大中专教材",
          com: "LargeMiddle"
        },
        {
          Name: "多元产品",
          com: "MoreProduct"
        },
        {
          Name: "最新图书",
          com: "NewBook"
        },
        {
          Name: "一般图书",
          com: "CommonBooks"
        },
        {
          Name: "采访数据",
          com: "interviewData"
        }
      ],
      active: [true, false, false, false, false, false, false,false],
      multipleSelection: [],
      options: [],
      value: "",
      activeName: "",
      isPositionOne: false,
      isPositionTwo: false,
      whitch: "ActivityTopic",
      formData: "ActivityTopic"
    };
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    move(whitch, index) {
      this.whitch = whitch;
      this.formData = whitch;
      for (var i = 0; i < this.active.length; i++) {
        this.active[i] = false;
        this.active[index] = true;
      }
      this.$set(this.active, 8, 0);
    },
    addItem() {
      this.$refs.children.pushItem();
    },
    handleClick() {},
    handleSelectionChange(val) {},
    saveChange() {}
  },
  components: {
    ActivityTopic,
    GoodSale,
    ImportantProduct,
    LargeMiddle,
    MoreProduct,
    NewBook,
    CommonBooks,
    interviewData
  }
};
</script>




<style lang="scss" scoped>
.add_hot_word {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
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
    height: 40px;
    float: left;
  }
  .active {
    border-bottom: 2px solid #168ce2;
  }
}
</style>
