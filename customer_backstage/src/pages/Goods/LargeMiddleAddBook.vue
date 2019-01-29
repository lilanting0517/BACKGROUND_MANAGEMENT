<template>
  <div class="main">
    <h2 class="char_tit">
      <span class="cx_title1">{{goodsInfo}}</span>
      <el-button size="mini" @click="$router.go(-1)">返回</el-button>
      <el-button size="mini" style="margin-left:'50px'" @click="addBooks">添加相关商品</el-button>
    </h2>
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" height="600">
        <el-table-column prop="Id" label="商品ID" width="120" align="center"></el-table-column>
        <el-table-column prop="Isbn" label="ISBN" width="140" align="center">
        </el-table-column>
        <el-table-column prop="Name" label="商品名称" align="center" width="200px"></el-table-column>
        <el-table-column prop="Price" label="价格" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Publisher" label="出版社" align="center" width="150px"></el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteRelateBook(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="选择商品" :visible.sync="dialogTableVisible" width="70%" @close="reloadList" :close-on-click-modal='false'>
      <div class="search_area">
        <span class="search_middle">商品信息：</span>
        <el-input v-model.trim="input" placeholder="请输入商品名称" size="mini" style="width:30%;"></el-input>
        <el-button size="mini" style="margin-left:3%;" @click="searchGoods">查找</el-button>
      </div>
      <el-table :data="gridData" max-height="500" v-loading="modalLoading">
        <el-table-column label="排序" align="center" width="80px" prop="Seq">
        </el-table-column>
        <el-table-column prop="Id" label="商品ID" width="150" align="center"></el-table-column>
        <el-table-column prop="Isbn" label="ISBN" width="150" align="center"></el-table-column>
        <el-table-column prop="Name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="Kb" label="开本" align="center" width="150px"></el-table-column>
        <el-table-column prop="Price" label="定价" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="EditionName" label="出版社" align="center"></el-table-column>
        <el-table-column prop="Operation" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="addGood(scope.$index,scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchBook, ChangeSeq, relateBookGetList,relateBookAddInfo,relateBookDelInfo } from "@/api";
import { loadingStatus } from "@/common/js/mixin";
export default {
  name: "",
  data() {
    return {
      checked: false,
      dialogTableVisible: false,
      gridData: [],
      tableData:[],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        }
      ],
      value: "",
      input: "",
      num: 1,
      dialogVisibleMove: false,
      GoodsId: "",
      total: null,
      total1: null,
      currentPage: 1,
      pageSize: 10,
      GoodsId: null,
      goodsInfo:''
    };
  },
  created() {
    this.initTableData();
    this.initGridData();
    this.goodsInfo = this.$route.params.Name;
  },
  mixins: [loadingStatus],
  methods: {
    initTableData() {
      const params = {
        PageIndex: 1,
        PageNum: 10,
        GoodsId:this.$route.params.id
      };

      relateBookGetList(params)
        .then(this.globelReqHandle)
        .then(res => {
          if(res.Success) {

            this.tableData = res.Data;
            this.setLoading(false);
          }

        })
        .catch(this.globelErrHandle);
    },
    initGridData() {
      const params = {
        Search: "",
        PageIndex: this.currentPage,
        PageNum: 10,
        Type: "5",
        DzzjcType: "",
        IsPoint: ""
      };

      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.gridData = res.Data.BookInfo;
          this.total = res.Total;
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.setLoading(true);
      const params = {
        Search: "",
        PageIndex: this.currentPage,
        PageNum: 10,
        Type: "5",
        DzzjcType: "",
        IsPoint: ""
      };

      SearchBook(params)
        .then(this.globelReqHandle)
        .then(({ Data }) => {
          this.gridData = Data.BookInfo;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    reloadList() {
      this.initTableData();
    },
    updateListSeq() {
      this.dialogVisibleMove = false;

      const params = {
        Seq: this.num,
        GoodsId: this.GoodsId,
        ChannelCode: "5",
        Type: 2,
        Method: "update"
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
    },
    //查找商品信息
    searchGoods() {
      const params = {
        Search: this.input,
        PageIndex: 1,
        PageNum: 10,
        Type: "5",
        DzzjcType: "",
        IsPoint: ""
      };

      SearchBook(params)
        .then(this.globelReqHandle)
        .then(({ Data }) => {
          this.gridData = Data.BookInfo;
          this.currentPage = 1;
        })
        .catch(this.globelErrHandle);
    },
    //添加相关商品
    addBooks() {
      if(this.tableData.length < 10) {
        this.dialogTableVisible = true;
      } else {
        this.$message('最多只能添加10个相关推荐商品~');
      }
    },
    addGood(index,row) {
      const params = {
        GoodsId:this.$route.params.id,
        RelateGoodsId:row.Id
      }

      relateBookAddInfo(params)
        .then(this.globelReqHandle)
        .then(({ Success,ErrorMsg,Data }) => {
          if(Success) {
            this.$message('添加成功！')
            this.dialogTableVisible = false;
          } else {
            this.$message(ErrorMsg);
          }
        })
        .catch(this.globelErrHandle);

    },
    //删除相关商品
    deleteRelateBook(index,row) {
      const params = {
        Guid: row.Guid
      }

      relateBookDelInfo(params)
        .then(this.globelReqHandle)
        .then(({ Success,Data }) => {
          if(Success) {
            this.$message('删除成功！')
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
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
.cx_title1 {
  margin-right: 2%;
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
    margin-left: 6%;
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

