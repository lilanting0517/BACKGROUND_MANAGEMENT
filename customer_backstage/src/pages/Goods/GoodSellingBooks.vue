<template>
  <div class="main">
    <!-- 标题部分 -->
    <h3 class="char_tit clearfix">
      畅销图书
      <el-button size="small" class="fr choose_prodect" @click="openModal" type="primary">选择商品</el-button>
    </h3>
    <!-- 表格部分 -->
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" class="data_table" style="width: 100%" max-height="500" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center" width="55px">
        </el-table-column>
        <!-- <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
        </el-table-column> -->
        <el-table-column prop="Isbn" label="ISBN" align="center">
        </el-table-column>
        <el-table-column prop="Img" label="商品图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.Img ? scope.row.Img : noBook" alt="" class="img-size">
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="书名" align="center">
        </el-table-column>
        <el-table-column prop="Price" label="定价" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Publisher" label="出版社" align="center">
        </el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="replaceGoods(scope.$index, scope.row)">替换</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button size="mini" style="margin-left:10px" @click="confirmDelete">删除</el-button>
      <!-- <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination> -->
      <!-- 模态框 -->
    </div>
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" :close-on-click-modal='false' width="30%" center>
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="deleteGoods" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择商品" :visible.sync="dialogTableVisible" width="70%" @close="reloadList" :close-on-click-modal='false' @open="initCurrentPageAdd">
      <div class="search_area">
        <!-- <span>类型：</span>
        <el-select v-model.trim="value" placeholder="请选择" size="mini">
          <el-option v-for="item in options" :key="item.ChannelName" :label="item.ChannelName" :value="item.ChannelName">
          </el-option>
        </el-select> -->
        <span class="search_middle">商品信息：</span>
        <el-input v-model.trim="input" placeholder="请输入商品名称" size="mini" style="width:30%;"></el-input>
        <el-button size="mini" style="margin-left:3%;" @click="initCurrentPage1">查找</el-button>
      </div>
      <el-table :data="gridData" height="500" v-loading="modalLoading">
        <el-table-column prop="Isbn" label="ISBN" width="150" align="center"></el-table-column>
        <el-table-column prop="Img" label="商品图片" width="200" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.Img ? scope.row.Img : noBook" alt="" class="img-size">
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="书名" align="center"></el-table-column>
        <el-table-column prop="Price" label="定价" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="EditionName" label="出版社" align="center"></el-table-column>
        <el-table-column prop="Operation" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="addGood(scope.$index,scope.row)" :disabled=" scope.row.Operation==='已添加' ">{{scope.row.Operation}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total1" class="fr pages" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-size="10">
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 替换模态框 -->
    <el-dialog title="选择商品" :visible.sync="dialogReplaceGoods" width="70%" @close="reloadList" @open="initCurrentPageReplace" :close-on-click-modal='false'>
      <div class="search_area">
        <!-- <span>类型：</span>
        <el-select v-model.trim="value" placeholder="请选择" size="mini">
          <el-option v-for="item in options" :key="item.ChannelName" :label="item.ChannelName" :value="item.ChannelName">
          </el-option>
        </el-select> -->
        <span class="search_middle">商品信息：</span>
        <el-input v-model.trim="input" placeholder="请输入商品名称" size="mini" style="width:30%;"></el-input>
        <el-button size="mini" style="margin-left:3%;" @click="initCurrentPage2">查找</el-button>
      </div>
      <el-table :data="gridData" height="500" v-loading="modalLoading">
        <el-table-column prop="Isbn" label="ISBN" width="150" align="center"></el-table-column>
        <el-table-column prop="Img" label="商品图片" width="200" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.Img ? scope.row.Img : noBook" alt="" class="img-size">
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="书名" align="center"></el-table-column>
        <el-table-column prop="Price" label="定价" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="EditionName" label="出版社" align="center"></el-table-column>
        <el-table-column prop="Operation" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="updateGood(scope.$index,scope.row)">替换</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total2" class="fr pages" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-size="10">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  DelMainPageSeq,
  GetMainPageSeqGoods,
  GetList,
  SearchBook,
  ChangeMainPageSeq
} from "@/api";
import { checkAll, loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
export default {
  name: "",
  data() {
    return {
      checked: false,
      dialogTableVisible: false,
      tableData: [],
      gridData: [],
      options: [],
      value: "",
      input: "",
      multipleSelection: [],
      deleteDialogVisible: false,
      dialogReplaceGoods: false,
      Seq: "",
      total: null,
      total1: null,
      total2: null,
      currentPage: 1,
      pageSize: 10,
      currentPage1: 1,
      currentPage2: 1
    };
  },
  mounted() {
    this.initData();
    this.initListData();
  },
  mixins: [checkAll, loadingStatus, globelFnHanle1],
  methods: {
    initListData() {
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
      //       }
      //     }
      //     console.log(this.options);
      //   })
      //   .catch(this.globelErrHandle);
    },
    //初始化列表
    initData() {
      const params = {
        Type: "2"
      };
      GetMainPageSeqGoods(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Data == null) {
            this.tableData = [];
          } else {
            this.tableData = res.Data;
          }
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    initCurrentPage1() {
      this.currentPage1 = 1;
      this.getBook();
    },
    initCurrentPage2() {
      this.currentPage2 = 1;
      this.getBook1();
    },
    initCurrentPageAdd() {
      this.currentPage1 = 1;
      this.getBook();
    },
    initCurrentPageReplace() {
      this.currentPage2 = 1;
      this.getBook1();
    },
    //查找
    getBook() {
      this.setMLoading(true);
      var Type = "2";
      // this.options.map(x => {
      //   if (this.value == x.ChannelName) {
      //     Type = x.ChannelCode;
      //   }
      // });
      // console.log(this.currentPage1);
      const params = {
        Search: this.input.replace(/\s+/g,""),
        PageIndex: this.currentPage1,
        PageNum: 10,
        Type,
        DzzjcType: "",
        IsPoint: ""
      };
      SearchBook(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.gridData = res.Data.BookInfo;
          this.gridData.map(x => {
            x.Operation = "添加";
          });
          this.total1 = res.Total;
          this.total2 = res.Total;
          this.setMLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    //查找
    getBook1() {
      this.setMLoading(true);
      var Type = "2";
      // this.options.map(x => {
      //   if (this.value == x.ChannelName) {
      //     Type = x.ChannelCode;
      //   }
      // });
      // console.log(this.currentPage1);
      const params = {
        Search: this.input.replace(/\s+/g,""),
        PageIndex: this.currentPage2,
        PageNum: 10,
        Type,
        DzzjcType: "",
        IsPoint: ""
      };
      SearchBook(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.gridData = res.Data.BookInfo;
          this.gridData.map(x => {
            x.Operation = "添加";
          });
          this.total1 = res.Total;
          this.total2 = res.Total;
          this.setMLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    //添加
    addGood(index, row) {
      let GoodsId = row.Id;
      let params = {
        ChannelCode: "2",
        Seq: "",
        GoodsId
      };
      ChangeMainPageSeq(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("添加成功");
            //需要合并对象来强制触发vue dom更新
             this.gridData[index].Operation = "已添加";
             this.$set(this.gridData, index , this.gridData[index]);
          } else {
            this.$message.error(res.ErrorMsg);
          }
        })
        .catch(this.globelErrHandle);
    },
    openModal() {
      if(this.tableData.length < 5) {
        this.dialogTableVisible = true;
        this.value = "";
      } else {
        this.$message('该频道最多添加五个商品！')
      }
    },
    handleClose(done) {},
    handleUP() {},
    //批量删除
    confirmDelete() {
      if (this.multipleSelection.length == 0) {
        this.$message("还没有选择需要删除的内容哦");
        return;
      } else {
        this.deleteDialogVisible = true;
      }
    },
    deleteGoods() {
      this.deleteDialogVisible = false;

      let arr = [];
      this.multipleSelection.map(item => {
        arr.push(item.Id);
      });
      arr = arr.toString();
      const params = {
        GoodsId: arr,
        ChannelCode: "2"
      };

      DelMainPageSeq(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功！");
            this.initData();
          }
        })
        .catch(this.globelErrHandle);
    },
    reloadList() {
      this.initData();
    },
    initCurrentPage() {
      this.currentPage1 = 1;
      this.currentPage2 = 1;
      this.getBook1();
      this.getBook();
    },
    //替换
    replaceGoods(index, row) {
      this.dialogReplaceGoods = true;
      this.Seq = row.Seq;
    },
    updateGood(index, row) {
      let GoodsId = row.Id;
      let params = {
        ChannelCode: "2",
        Seq: this.Seq,
        GoodsId
      };

      ChangeMainPageSeq(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("替换成功");
            this.dialogReplaceGoods = false;
          }
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getBook();
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.getBook1();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.searchbox {
  width: 200px;
  height: 28px;
  background-color: #ffffff;
  border: solid 1px #e5e5e5;
  font-size: 14px;
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
.img-size {
  width: 100px;
}
</style>
