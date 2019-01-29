<template>
  <div class="main">
    <h2 class="char_tit">
      <span class="cx_title">商品列表</span>
      <el-button
        size="mini"
        class="fr look_important"
        @click="$router.push({ name: 'importantGoodslist'})"
        type="primary"
      >查看推荐商品</el-button>
    </h2>
    <div class="num_detail">
      <span>
        全部商品：
        <span class="blue_text">{{headerTotal.all}}</span>
      </span>
      <span>
        可供商品：
        <span class="blue_text">{{headerTotal.kg}}</span>
      </span>
      <span>
        不可供商品：
        <span class="blue_text">{{headerTotal.bkg}}</span>
      </span>
    </div>
    <h3 class="char_tit">
      <span class="cx_title">筛选查找</span>
    </h3>
    <div class="search_area">
      <span>选择频道：</span>
      <el-cascader
        v-model="channelVal"
        placeholder="请选择频道"
        :options="channelOptions"
        filterable
        clearable
        change-on-select
        size="mini"
        separator='>'
      ></el-cascader>
      <span class="search_middle">商品信息：</span>
      <el-input
        v-model.trim="input"
        placeholder="请输入商品名称"
        size="mini"
        style="width:30%;"
      ></el-input>
      <el-button
        size="mini"
        style="margin-left:3%;"
        @click.native="getBook"
        type="primary"
      >查找</el-button>
    </div>
    <div
      class="tab_wrap"
      v-loading="loading"
    >
      <el-table
        :data="gridData"
        height="500"
      >
        <!-- <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
        </el-table-column> -->
        <!-- <el-table-column prop="Id" label="商品ID" width="150" align="center"></el-table-column> -->
        <el-table-column
          label="序号"
          align="center"
          width="80px"
          type="index"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column
          prop="Isbn"
          label="ISBN"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Name"
          label="书名"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Price"
          label="价格"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Publisher"
          label="出版社"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Kb"
          label="开本"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="ChannelName"
          label="频道名称"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
    <div class="page_wrap clearfix">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="fr pages"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="PageNum"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { SearchBook, GetList, GetCount, GetAllChannel,GetChannelTree } from "@/api";
import { getItem } from "@/common/js/util";
import { loadingStatus } from "@/common/js/mixin";
export default {
  name: "",
  data() {
    return {
      checked: false,
      dialogTableVisible: false,
      gridData: [],
      total: null,
      value: "",
      input: "",
      currentPage: 1,
      headerTotal: {
        kg: "",
        bkg: "",
        all: ""
      },
      gridData1: [],
      PageNum: 10,
      channelOptions: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则"
            },
            {
              value: "daohang",
              label: "导航"
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic"
            },
            {
              value: "navigation",
              label: "Navigation",
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ],
      channelVal:[]
    };
  },
  mixins: [loadingStatus],
  mounted() {
    this.initData();
    this.getBook();
    this.getChannelList();
  },
  methods: {
    indexMethod(index) {
      return index + 1 + this.PageNum * (this.currentPage - 1);
    },
    getChannelList(){
      GetChannelTree()
        .then(this.globelReqHandle)
        .then(res => {
          res.Data.map(item => {
            item.label = item.Name;
            item.children = item.ChildChannel;
            item.value = item.Code;
            item.children.map(e => {
              e.value = e.Code;
              e.label = e.Name;
            })
          })
          this.channelOptions = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    initData() {
      const data = {
        UserId: getItem("User").UserId
      };
      GetCount(data)
        .then(this.globelReqHandle)
        .then(res => {
          this.headerTotal = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.setLoading(true);
      var Type = "";
      if(this.channelVal.length) {
        Type = this.channelVal[this.channelVal.length - 1];
      } else {
        Type = "";
      }
      const params = {
        Search: this.input.replace(/\s+/g, ""),
        PageIndex: this.currentPage,
        PageNum: this.PageNum,
        Type: Type,
        DzzjcType: "",
        IsPoint: ""
      };
      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.gridData = res.Data.BookInfo;
          this.gridData.map(x => {
            x.Operation = "添加";
          });
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    getBook() {
      this.currentPage = 1;
      var Type = "";

      if(this.channelVal.length) {
        Type = this.channelVal[this.channelVal.length - 1]
      } else {
        Type = ""
      }

      const params = {
        Search: this.input.replace(/\s+/g, ""),
        PageIndex: this.currentPage,
        PageNum: this.PageNum,
        Type: Type,
        DzzjcType: "",
        IsPoint: ""
      };
      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          if(res.Success) {
            this.gridData = res.Data.BookInfo;
            this.gridData.map(x => {
              x.Operation = "添加";
            });
            this.total = res.Total;
            this.setLoading(false);
          } else {
            this.$message.error(res.ErrorMsg);
            this.setLoading(false);
          }

        })
        .catch(this.globelErrHandle);
    },
    handleSizeChange(val) {
      this.PageNum = val;
      this.getBook();
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.searchbox {
  width: 200px;
  height: 28px;
  background-color: #ffffff;
  border: solid 1px #e5e5e5;
  font-size: 14px;
}
.cx_title {
  margin-right: 44%;
}
.choose_prodect {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
.num_detail {
  height: 44px;
  line-height: 44px;
  span {
    display: inline-block;
    width: 33%;
    text-align: center;
    .blue_text {
      text-align: left;
      color: #168ce2;
    }
  }
}
.search_area {
  margin-bottom: 30px;
  padding: 0 10px 0 33px;

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
.look_important {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
.el-cascader__label {
  span {
    color: #2f9be1 !important;
  }
}
</style>
