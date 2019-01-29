<template>
  <div class="main">
    <h2 class="char_tit">
      <span>推荐商品列表</span>
      <el-button size="mini" style="margin-left:20px;" @click="back">返回</el-button>
      <el-button size="mini" class="fr add_important" @click="addImportantProdect" type="primary">添加推荐商品</el-button>
    </h2>
    <h2 class="char_tit">
      <span>类型：</span>
      <el-select v-model.trim="value" placeholder="请选择" size="mini">
        <el-option v-for="item in options" :key="item.Name" :label="item.Name" :value="item.Name">
        </el-option>
      </el-select>
      <span class="search_middle">商品信息：</span>
      <el-input v-model.trim="input" placeholder="请输入商品名称" size="mini" style="width:30%;"></el-input>
      <el-button size="mini" style="margin-left:3%;" @click.native="searchBook">查找</el-button>
    </h2>
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" height="500" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center">
        </el-table-column>
        <el-table-column prop="Isbn" label="ISBN" width="200" align="center">
        </el-table-column>
        <el-table-column prop="Name" label="书名" align="center"></el-table-column>
        <el-table-column prop="Price" label="价格" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Publisher" label="出版社" align="center"></el-table-column>
        <el-table-column prop="Kb" label="开本" align="center"></el-table-column>
        <el-table-column prop="ChannelName" label="频道名称" align="center"></el-table-column>
        <!-- <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delImportant(scope)">{{scope.row.Operation}}</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button id="" class="" size="mini" @click="delImportant">删除</el-button>
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>
    <el-dialog title="选择商品" :visible.sync="dialogTableVisible" width="60%" @close="reloadData" @open="searchBookModal" :close-on-click-modal='false'>
      <div class="search_area">
        <span>类型：</span>
        <el-select v-model.trim="value1" placeholder="请选择" size="mini">
          <el-option v-for="item in options1" :key="item.Name" :label="item.Name" :value="item.Name">
          </el-option>
        </el-select>
        <span class="search_middle">商品信息：</span>
        <el-input v-model.trim="searchContent" placeholder="请输入商品名称" size="mini" style="width:30%;"></el-input>
        <!-- <el-button size="mini" style="margin-left:3%;" @click.native="getBookModal">查找</el-button> -->
        <el-button size="mini" style="margin-left:3%;" @click.native="searchBookModal">查找</el-button>
        <el-button size="mini" style="margin-right:3%;" class="fr" @click="batchImport">批量导入</el-button>
      </div>
      <div class="tab_wrap" v-loading="modalLoading">
        <el-table :data="gridData1" height="500">
          <el-table-column prop="Isbn" label="ISBN" width="150" align="center"></el-table-column>
          <el-table-column prop="Id" label="商品Id" width="150" align="center"></el-table-column>
          <el-table-column prop="Name" label="书名" align="center"></el-table-column>
          <el-table-column prop="Price" label="定价" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Publisher" label="出版社" align="center"></el-table-column>
          <el-table-column prop="Operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addImportant(scope.$index,scope)" :disabled="scope.row.Operation==='已添加'">{{scope.row.Operation}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total1" class="fr pages" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-size="10">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { SearchBook, GetList, ChangePointGoods, GetAllChannel } from "@/api";
import { getItem } from "@/common/js/util";
import { checkAll, loadingStatus } from "@/common/js/mixin";
export default {
  name: "",
  data() {
    return {
      checked: false,
      dialogTableVisible: false,
      tableData: [],
      multipleSelection: [],
      options: [],
      options1: [],
      total: null,
      total1: null,
      value: "",
      value1: "",
      input: "",
      searchContent: "",
      currentPage: 1,
      currentPage1: 1,
      headerTotal: {
        kg: "",
        bkg: "",
        all: ""
      },
      gridData1: []
    };
  },
  mixins: [checkAll, loadingStatus],
  mounted() {
    this.initData();
    this.getBook();
  },
  methods: {
    initData() {
      // const params = {
      //   PageIndex: 1,
      //   PageNum: 100
      // };
      // GetList(params)
      //   .then(this.globelReqHandle)
      //   .then(({ Data }) => {
      //     for (let i = 0; i < Data.length; i++) {
      //       for (let j = 0; j < Data[i].Data.length; j++) {
      //         this.options.push({
      //           ChannelCode: Data[i].Data[j].Activity.ChannelCode,
      //           ChannelName: Data[i].Data[j].Activity.ChannelName
      //         });
      //         this.options1.push({
      //           ChannelCode: Data[i].Data[j].Activity.ChannelCode,
      //           ChannelName: Data[i].Data[j].Activity.ChannelName
      //         });
      //       }
      //     }
      //     console.log(this.options);
      //   })
      //   .catch(this.globelErrHandle);
      // const data = {
      //   UserId: getItem("User").UserId
      // };
      const params = {
        IsUse: ""
      };
      GetAllChannel(params)
        .then(res => {
          this.options = res.Data;
          this.options1 = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getBookModal();
    },
    reloadData() {
      this.getBook();
    },
    batchImport() {
      this.$router.push({ name: "BatchImport" });
    },
    addImportantProdect() {
      this.dialogTableVisible = true;
    },
    addImportant(index, scope) {
      //var Type = "";
      // this.options1.map(x => {
      //   if (this.value1 == x.lName) {
      //     Type = x.Code;
      //   }
      // });
      let GoodsId = scope.row.Id;
      const params = {
        GoodsId: GoodsId,
        IsPoint: "1",
      };
      ChangePointGoods(params)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("添加成功");
             //需要合并对象来强制触发vue dom更新
            this.gridData1[index].Operation = "已添加";
            this.$set(this.gridData1, index, this.gridData1[index]);
          }
        })
        .catch(this.globelErrHandle);
    },
    delImportant() {
      var Type = "";
      this.options1.map(x => {
        if (this.value1 == x.Name) {
          Type = x.Code;
        }
      });
      let arr = [];
      this.multipleSelection.map(x => {
        arr.push(x.Id);
      });
      let GoodsId = arr.join(",");
      const params = {
        GoodsId,
        IsPoint: "0",
        Type
      };
      ChangePointGoods(params)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.getBook();
          }
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBook();
    },
    searchBook() {
      this.currentPage = 1;
      this.getBook();
    },
    getBook() {
      this.setLoading(true);
      var Type = "";
      this.options.map(x => {
        if (this.value == x.Name) {
          Type = x.Code;
        }
      });
      const params = {
        Search: this.input.replace(/\s+/g,""),
        PageIndex: this.currentPage,
        PageNum: 10,
        Type: Type,
        DzzjcType: "",
        IsPoint: "1"
      };
      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.tableData = res.Data.BookInfo;
          this.tableData.map(x => {
            x.Operation = "删除";
          });
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    searchBookModal() {
      this.currentPage1 = 1;
      this.getBookModal();
    },
    getBookModal() {
      this.setMLoading(true);
      var Type = "";
      this.options.map(x => {
        if (this.value1 == x.Name) {
          Type = x.Code;
        }
      });
      const params = {
        Search: this.searchContent,
        PageIndex: this.currentPage1,
        PageNum: 10,
        Type: Type,
        DzzjcType: "",
        IsPoint: ""
      };
      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.gridData1 = res.Data.BookInfo;
          this.gridData1.map(x => {
            x.Operation = "添加";
          });
          this.total1 = res.Total;
          this.setMLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    handleClose(done) {},
    handleUP() {},
    indexMethod(index) {
      return index + 1;
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>






<style lang="scss" scoped>
.search_area {
  margin-bottom: 25px;
  padding: 0 10px 0 33px;
  span {
    color: #555555;
  }
  .search_middle {
    margin-left: 30px;
  }
}
label {
  font-size: 14px;
  color: #555555;
}
.add_important {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
</style>
