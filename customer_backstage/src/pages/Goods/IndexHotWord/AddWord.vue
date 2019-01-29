<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      热词
    </h2>
    <div class="input_area">
      <span>热词：</span>
      <el-input placeholder="请输入热词名称" style="width:30%" size="mini" v-model.trim="hotWord" ref="hotWordInput"></el-input>
      <div class="btn-container fr">
        <el-button type="primary" size="mini" style="width:112px; margin-right:15px;" @click="save">保存</el-button>
        <el-button size="mini" style="width:112px;" @click="back">返回</el-button>
      </div>
    </div>
    <h2 class="char_tit clearfix">
      商品信息
      <el-button size="small" class="fr choose_prodect" @click="openDialog" type="primary">添加商品</el-button>
    </h2>
    <div class="tab_wrap">
      <el-table :data="tableData" class="data_table" style="width: 100%" height="600" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center">
        </el-table-column>
        <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="BookName" label="名称" align="center">
        </el-table-column>
        <el-table-column prop="Isbn" label="ISBN" align="center">
        </el-table-column>
        <el-table-column prop="Publisher" label="出版社名称" align="center">
        </el-table-column>
        <el-table-column prop="PublishTime" label="出版时间" align="center">
        </el-table-column>
        <el-table-column prop="Price" label="价格" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="deleteItem(scope.$index,scope.row)">{{scope.row.Operation[0]}}</el-button> -->
            <el-button type="text" size="small" @click="changeSeq(scope.$index,scope.row)">{{scope.row.Operation[0]}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button id="" class="" size="mini" @click="deleteItem()">删除</el-button>
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>
    <!-- <div class="btn-container fr">
      <el-button type="primary" size="mini" style="width:112px; margin-right:15px;" @click="save">保存</el-button>
      <el-button size="mini" style="width:112px;" @click="back">返回</el-button>
    </div> -->
    <el-dialog title="添加商品" :visible.sync="dialogTableVisible" width="60%" @close="reloadList" @open="getBook" :close-on-click-modal='false'>
      <div class="search_area">
        <span>类型：</span>
        <el-select v-model.trim="value" placeholder="请选择类型" size="mini">
          <el-option v-for="item in options" :key="item.Name" :label="item.Name" :value="item.Name">
          </el-option>
        </el-select>
        <span class="search_middle">商品信息：</span>
        <el-input v-model.trimvv="input" placeholder="书名/ISBN" size="mini" style="width:20%;"></el-input>
        <el-button size="mini" style="margin-left:3%;" @click="initCurrentPage1">查找</el-button>
        <el-button size="mini" style="margin-right:3%;" class="fr" @click="batchImport">批量导入</el-button>
      </div>
      <el-table :data="gridData" height="500" v-loading="modalLoading">
        <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="Id" label="商品ID" width="150" align="center"></el-table-column>
        <el-table-column prop="Isbn" label="ISBN" width="200" align="center">
        </el-table-column>
        <el-table-column prop="Name" label="书名" align="center"></el-table-column>
        <el-table-column prop="Price" label="价格" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Publisher" label="出版社" align="center"></el-table-column>
        <el-table-column prop="ChannelName" label="频道名称" align="center"></el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
             <el-button type="text" size="small" @click="addGood(scope.$index,scope.row)" :disabled=" scope.row.Operation==='已添加' ">{{scope.row.Operation}}</el-button>
            <!-- <el-button type="text" size="small" @click="addGood(scope.$index,scope.row)">{{scope.row.Operation}}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="total1" class="fr pages" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-size="10">
      </el-pagination>
    </el-dialog>
  </div>
</template>


<script>
import {
  GetMainPageGoods,
  GetList,
  SearchBook,
  AddHotWord,
  GetAllChannel,
  GetListHotWord,
  DelHotWord
} from "@/api";
import { checkAll, loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
export default {
  name: "addWord",
  data() {
    return {
      tableData: [],
      gridData: [],
      options: [],
      value: "",
      input: "",
      hotWord: "",
      multipleSelection: [],
      dialogTableVisible: false,
      currentPage: 1,
      currentPage1: 1,
      total: null,
      total1: null
    };
  },
  mounted() {
    this.initData();
  },
  mixins: [checkAll, loadingStatus, globelFnHanle1],
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.reloadList();
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getBook();
    },
    initData() {
      const params = {
        PageIndex: 1,
        PageNum: 100
      };
      const parmas = {
        IsUse: ""
      };
      GetAllChannel(parmas)
        .then(this.globelReqHandle1)
        .then(res => {
          this.options = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    back() {
      this.$router.go(-1);
    },
    save() {
      if (this.hotWord == "") {
        this.$message.error("请输入热词名称");
      } else {
        let GoodsId = "";
        let params = {
          Word: this.hotWord.replace(/\s+/g,""),
          GoodsId
        };
        AddHotWord(params)
          .then(this.globelReqHandle1)
          .then(res => {
            if (res.Success) {
              this.$message("添加成功");
              this.$router.go(-1);
            }
          })
          .catch(this.globelErrHandle);
      }
    },
    deleteItem(index, scope) {
      let arr = [];
      this.multipleSelection.map(x => {
        arr.push(x.Guid);
      });
      let Guid = arr.join(",");
      // console.log(Guid);
      const params = {
        Guid
      };
      DelHotWord(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            let params = {
              Word: this.hotWord.replace(/\s+/g,""),
              PageIndex: 1,
              PageNum: 10
            };
            GetListHotWord(params)
              .then(this.globelReqHandle1)
              .then(res => {
                this.tableData = res.Data;
                this.total = res.Total;
                this.tableData.map(x => {
                  x.Operation = ["修改排序"];
                });
              })
              .catch(this.globelErrHandle);
          }
        })
        .catch(this.globelErrHandle);
    },
    changeSeq() {
      // console.log("seq");
    },
    reloadList() {
      const params = {
        Word: this.hotWord.replace(/\s+/g,""),
        PageIndex: this.currentPage,
        PageNum: 10
      };
      GetListHotWord(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.tableData.map(x => {
            x.Operation = ["修改排序"];
          });
        })
        .catch(this.globelErrHandle);
    },
    openDialog() {
      this.dialogTableVisible = true;
    },
    batchImport() {
      if (this.hotWord == "") {
        this.$message.error("请填写热词名称");
        this.dialogTableVisible = false;
      } else {
        this.$router.push({
          name: "BatchImport",
          params: { word: this.hotWord.replace(/\s+/g,"") }
        });
      }
    },
    addGood(index, scope) {
      if (this.hotWord == "") {
        this.$message.error("请输入热词名称");
        this.dialogTableVisible = false;
      } else {
        let GoodsId = scope.Id;
        let params = {
          Word: this.hotWord.replace(/\s+/g,""),
          GoodsId
        };
        AddHotWord(params)
          .then(this.globelReqHandle)
          .then(res => {
            // console.log(res);
            if (res.Success) {
              this.$message("添加成功");
              this.gridData[index].Operation = "已添加";
              this.$set(this.gridData, index, this.gridData[index]);
            } else {
              this.dialogTableVisible = false;
              this.$refs.hotWordInput.focus();
              this.$message.error(res.ErrorMsg);
            }
          })
          .catch(this.globelErrHandle);
      }
    },
    initCurrentPage1() {
      this.currentPage1 = 1;
      this.getBook();
    },
    getBook() {
      this.setMLoading(true);
      var Type;
      this.options.map(x => {
        if (this.value == x.Name) {
          Type = x.Code;
        }
      });
      const params = {
        Search: this.input,
        PageIndex: this.currentPage1,
        PageNum: 10,
        Type,
        DzzjcType: "",
        IsPoint: ""
      };
      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.gridData = res.Data.BookInfo;
          this.total1 = res.Total;
          this.gridData.map(x => {
            x.Operation = "添加";
          });
          this.setMLoading(false);
        })
        .catch(this.globelErrHandle);
    }
  }
};
</script>








<style lang="scss" scoped>
.input_area {
  height: 50px;
  line-height: 90px;
  padding-left: 95px;
  margin-bottom: 40px;
}
.search_area {
  margin-bottom: 30px;
}
.search_middle {
  margin-left: 5%;
}

.choose_prodect{
  margin-top: 5px;
}
</style>


