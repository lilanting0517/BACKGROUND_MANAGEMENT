<template>
  <div class="main">
    <h2 class="char_tit">
      <span class="dy_title">多元商品维护</span>
    </h2>
    <div class="banner_select">
      <a href="javascript:;" v-for="(item,index) in lists" @click="move(item.com,index)" :class={active:active[index]}>{{item.Name}}</a>
    </div>
    <component :is="whitch"></component>
  </div>
</template>
<script>
import { SearchBook, ChangeSeq } from "@/api";
import GoodsMatain from "./VariousProdectMatain/GoodsMatain"
import AttributeMatain from "./VariousProdectMatain/AttributeMatain"
export default {
  name: "",
  data() {
    return {
      checked: false,
      dialogTableVisible: false,
      gridData: [],
      options: [],
      value: "",
      input: "",
      num: 1,
      dialogVisibleMove: false,
      whitch: "GoodsMatain",
      active: [true, false],
      lists: [
        {
          Name: "商品维护",
          com: "GoodsMatain"
        },
        {
          Name: "属性维护",
          com: "AttributeMatain"
        }
      ]
    };
  },
  created() {
    this.initGridData();
  },
  components:{
    GoodsMatain,
    AttributeMatain
  },
  methods: {
    initGridData() {
      const params = {
        Search: "",
        PageIndex: 1,
        PageNum: 10,
        Type: "6"
      };

      // SearchBook(params)
      //   .then(this.globelReqHandle)
      //   .then(({ Data }) => {
      //     this.gridData = Data.BookInfo;
      //   })
      //   .catch(this.globelErrHandle);
    },
    move(whitch,index){
      this.whitch = whitch;
      for (var i = 0; i < this.active.length; i++) {
        this.active[i] = false;
        this.active[index] = true;
      }
      this.$set(this.active, 2, 0);
    },
    handleSelectionChange() {},
    handleClose(done) {},
    handleUP() {},
    handleChange() {},
    editPosition(scope) {
      this.dialogVisibleMove = true;
    },
    //查找商品信息
    searchGoods() {
      const params = {
        Search: this.input,
        PageIndex: 1,
        PageNum: 10,
        Type: "6"
      };

      SearchBook(params)
        .then(this.globelReqHandle)
        .then(({ Data }) => {
          this.gridData = Data.BookInfo;
        })
        .catch(this.globelErrHandle);
    },
    //修改列表显示顺序
    editPosition(index, row) {
      this.dialogVisibleMove = true;
      this.GoodsId = row.Id;
    },
    updateListSeq() {
      this.dialogVisibleMove = false;

      const params = {
        Seq: this.num,
        GoodsId: this.GoodsId,
        ChannelCode: "6",
        Type: 3
      };

      ChangeSeq(params)
        .then(this.globelReqHandle)
        .then(({ Data, Success }) => {
          if (Success) {
            this.$message("success!");
            this.initGridData();
          }
        })
        .catch(this.globelErrHandle);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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

.searchbox {
  width: 200px;
  height: 28px;
  background-color: #ffffff;
  border: solid 1px #e5e5e5;
  font-size: 14px;
}
.dy_title {
  margin-right: 44%;
}
.choose_prodect {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
.search_area {
  margin-bottom: 30px;
  .search_middle {
    margin-left: 30px;
  }
}
label {
  font-size: 14px;
  color: #555555;
}
.inputbox {
  line-height: 44px;
  margin-right: 5px;
}
.modal_title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.modal_content {
  text-align: center;
  font-size: 14px;
}
</style>


