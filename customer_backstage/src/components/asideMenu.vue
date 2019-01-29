<template>
  <div class="aside_container">
    <aside class="fl">
      <!-- 商品管理--二级菜单 -->
      <template v-if="activeNav.slice(0, 1) === '1'">
        <!-- <p class="fir_fl">首页配置</p> -->
        <ul class="sec_fl clearfix">
          <li v-for="(item, index) in asideOne" :key="index" :class="{active: activeNav == '1-' + (index + 1), fir_fl: index == 0 || index == 8 || index == 10 }" @click="setActiveNav(item, '1-' + (index + 1),index)">
            <a href="javascript:;">{{item.title}}</a>
          </li>
        </ul>
      </template>
      <!-- 平台管理--二级菜单 -->
      <template v-if="activeNav.slice(0, 1) === '2'">
        <ul class="sec_fl clearfix">
          <li
            v-for="(item, index) in asideTwo"
            :key="index"
            :class="{active: activeNav == '2-' + (index + 1), fir_fl: index == 0 || index == 5 || index == 11 }"
            @click="setActiveNav2(item, '2-' + (index + 1),index)"
          >
            <a href="javascript:;">{{item.title}}</a>
          </li>
        </ul>
      </template>
      <!-- 客户管理--二级菜单 -->
      <template v-if="activeNav.slice(0, 1) === '3'">
        <ul class="sec_fl clearfix">
          <li v-for="(item, index) in asideThree" :key="index" :class="{active: activeNav == '3-' + (index + 1),fir_fl: index == 0 || index == 7 }" @click="setActiveNav1(item, '3-' + (index + 1),index)">
            <a href="javascript:;">{{item.title}}</a>
          </li>
        </ul>
      </template>
    </aside>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { setItem, getItem } from "@/common/js/util";
import { globelFnHanle } from "@/common/js/mixin";
import { GetFuncList } from "@/api";
import bus from "@/bus";
export default {
  name: "asideMenuone",
  data() {
    return {
      asideOne: [
        {
          title: "首页配置",
          name: "indexconfig"
        },
        {
          title: "",
          name: "banner1",
          seq: 3
        },
        {
          title: "",
          name: "indexhotword",
          seq: 4
        },
        {
          title: "",
          name: "latestbooks",
          seq: 5
        },
        {
          title: "",
          name: "goodSellingBooks",
          seq: 6
        },
        {
          title: "",
          name: "importantprodect",
          seq: 7
        },
        {
          title: "",
          name: "largemiddlematerial",
          seq: 8
        },
        {
          title: "",
          name: "creativeproducts",
          seq: 9
        },
        {
          title: "商品管理",
          name: "goodsmanage"
        },
        {
          title: "",
          name: "goodslist",
          seq: 11
        },
        {
          title: "频道商品维护",
          name: "channelmatain"
        },

        {
          title: "",
          name: "largemiddlepublicmatain",
          seq: 13
        },
        {
          title: "",
          name: "university",
          seq: 14
        },
        {
          title: "",
          name: "largemiddlesort",
          seq: 15
        },
        {
          title: "",
          name: "goodsellingbooksmatain",
          seq: 16
        },
        {
          title: "",
          name: "importantprodectmatain",
          seq: 17
        },
        {
          title: "",
          name: "latestprodectmatain",
          seq: 18
        },
        {
          title: "",
          name: "variousprodectmatain",
          seq: 19
        },
        {
          title: "",
          name: "interviewdata",
          seq: 20
        }
      ],
      asideTwo: [
        {
          title: "用户管理",
          name: ""
        },
        {
          title: "",
          name: "usermanagement",
          seq: 42
        },
        {
          title: "",
          name: "rolematain",
          seq: 43
        },
        {
          title: "",
          name: "backgroundpermissionsmangement",
          seq: 44
        },
        {
          title: "",
          name: "unitassociationmatain",
          seq: 45
        },
        {
          title:'功能管理',
          name:''
        },
        {
          title: "",
          name: "brandbusinessmatain",
          seq: 47
        },
        {
          title: "",
          name: "warmgreeting",
          seq: 48
        },
        {
          title: "",
          name: "publicsortmatain",
          seq: 49
        },
        {
          title: "",
          name: "channebarmatain",
          seq: 50
        },
        {
          title: "",
          name: "collectiondatamatain",
          seq: 51
        },
        {
          title:'订单信息',
          name:''
        },
        {
          title: "",
          name: "orderdetail",
          seq: 53
        }
      ],
      asideThree: [
        {
          title: "客服管理",
          name: ""
        },
        {
          title: "",
          name: "latestbookscustom",
          seq: 62
        },
        {
          title: "",
          name: "importantprodectcustom",
          seq: 63
        },
        {
          title: "",
          name: "topicactivitycustom",
          seq: 64
        },
        {
          title: "",
          name: "goodsellingbookscustom",
          seq: 65
        },
        {
          title: "",
          name: "largemiddlematerialcustom",
          seq: 66
        },
        {
          title: "",
          name: "variousprodectcustom",
          seq: 67
        },
        {
          title: "客户购物信息",
          name: ""
        },
        {
          title: "",
          name: "customershopcarmessage",
          seq: 69
        }
      ]
    };
  },
  mixins: [globelFnHanle],
  computed: {
    ...mapState(["activeNav"])
  },
  mounted() {
    //本地存储记录左侧导航第几次加载防止功能路由跳转重复执行
    if (getItem("num") == null) {
      setItem("num", 1);
    } else {
      let num = getItem("num");
      num++;
      setItem("num", num);
    }
    const params = {
      UserId: getItem("User").UserId
    };

    GetFuncList(params)
      .then(this.globelFnHanle)
      .then(res => {
        if (res.Data.length == 0) {
          this.$message.error("没有权限哦，请联系超级管理员");
          return false;
        }
        res.Data.map(x => {
          if (
            x.ParentName == "频道维护" ||
            x.ParentName == "首页配置" ||
            x.ParentName == "商品管理"
          ) {
            for (let i = 0; i < this.asideOne.length; i++) {
              this.asideOne[parseInt(x.Id) - 2].title = x.FunctionName;
            }
          }

          if (x.ParentName == "用户管理" || x.ParentName == "功能管理" || x.ParentName == "订单信息") {
            for (let i = 0; i < this.asideTwo.length; i++) {
              this.asideTwo[parseInt(x.Id) - 41].title = x.FunctionName;
            }
          }

          if (x.ParentName == "客服管理" || x.ParentName == "客户购物信息") {
            for (let i = 0; i < this.asideThree.length; i++) {
              this.asideThree[parseInt(x.Id) - 61].title = x.FunctionName;
            }
          }
        });

        const menu = {
          goods: this.asideOne,
          platform: this.asideTwo,
          customer: this.asideThree
        };

        bus.$emit("successBack", "data");
        setItem("menu", menu);
      })
      .catch(this.globelErrHandle);
  },
  methods: {
    ...mapMutations(["updateActiveNav"]),
    setActiveNav(item, index, indexnum) {
      if (indexnum == 0 || indexnum == 8 || indexnum == 10) {
        return false;
      }
      this.updateActiveNav(index);
      setItem("activeNav", index);
      this.$router.push({ name: item.name });
    },
    setActiveNav1(item, index, indexnum) {

      if (indexnum == 0 || indexnum == 7) {
        return false;
      }
      this.updateActiveNav(index);
      setItem("activeNav", index);
      this.$router.push({ name: item.name });
    },
    setActiveNav2(item, index, indexnum) {
       if (indexnum == 0 || indexnum == 5 ||indexnum == 11 ) {
        return false;
      }
      this.updateActiveNav(index);
      setItem("activeNav", index);
      this.$router.push({ name: item.name });
    }
  }
};
</script>
<style lang="scss" scoped>
aside {
  position: fixed;
  height: 100%;
  width: 200px;
  box-sizing: border-box;
  padding-top: 60px;
  padding-bottom: 50px;
  top: 0;
  overflow-y: auto;
  background-color: #fff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  // li:nth-child(7),
  // li:nth-child(8) {
  //   margin-bottom: 40px;
  // }
  .fir_fl {
    a {
      padding-left: 15px;
      margin-top: 30px;
      line-height: 1em;
      margin-bottom: 10px;
      font-weight: 900;
      color: #000;
      font-size: 16px;
    }
  }
  // .news_management,
  // .pd_wh {
  //   position: absolute;
  //   top: 336px;
  //   left: 0;
  // }
  // .pd_wh {
  //   top: 410px;
  // }
  ul,
  ol {
    list-style: none;
    padding-left: 0;
    margin: 0;

    a {
      display: block;
      padding-left: 27px;
      border-left: 2px solid #fff;
      line-height: 34px;
      color: #555;
    }
    .active a {
      border-left: 2px solid #56bbfc;
      background-color: #fbfbfb;
    }
  }
}
</style>


