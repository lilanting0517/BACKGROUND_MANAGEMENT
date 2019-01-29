<template>
  <!-- 表格部分 -->
  <div class="tab_wrap" v-loading="loading">
    <el-table :data="tableData" class="data_table" style="width: 100%" height="600" @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column type="selection" align="center">
      </el-table-column>
      <el-table-column prop="Seq" label="排序" align="center" width="80px">
      </el-table-column>
      <el-table-column prop="Id" label="商品ID" align="center" width="120px">
      </el-table-column>
      <el-table-column prop="Isbn" label="ISBN" align="center" width="130px">
      </el-table-column>
      <el-table-column prop="BookName" label="书名" align="center" width="200px">
      </el-table-column>
      <el-table-column prop="Price" label="定价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Publisher" label="出版社" align="center" width="150px">
      </el-table-column>
      <el-table-column prop="Author" label="作者" align="center">
      </el-table-column>
      <el-table-column prop="PublishTime" label="出版日期" align="center" width="110px">
      </el-table-column>
      <el-table-column prop="Kc" label="总部库存" align="center">
      </el-table-column>
      <el-table-column prop="Operation" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openModal(scope.$index,scope.row)">排序</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button id="" class="" size="mini" @click="delItem">删除</el-button>
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>
    <!-- 添加商品模态框 -->
    <el-dialog title="添加商品" :visible.sync="dialogTableVisible" width="60%" @open="loadData" @close="reloadData" :close-on-click-modal='false'>
      <div class="search_area">
        <span class="search_middle">商品信息：</span>
        <el-input v-model.trim="input" placeholder="书名/ISBN" size="mini" style="width:20%;"></el-input>
        <el-button size="mini" style="margin-left:3%;" @click="getBook1">查找</el-button>
        <el-button size="mini" style="margin-right:3%;" class="fr" @click="batchImport">批量导入</el-button>
      </div>
      <el-table :data="gridData" v-loading="modalLoading">
        <el-table-column prop="Isbn" label="ISBN" width="150" align="center"></el-table-column>
        <el-table-column prop="Id" label="商品Id" width="150" align="center"></el-table-column>
        <el-table-column prop="Name" label="书名" align="center"></el-table-column>
        <el-table-column prop="Price" label="定价" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="EditionName" label="出版社" align="center"></el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addGoods(scope.$index,scope.row)" :disabled="scope.row.Operation==='已添加'">{{scope.row.Operation}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 增加商品添加顺序 -->
      <el-dialog title="" :visible.sync="dialogVisibleMove" width="20%" class="add_user" append-to-body :close-on-click-modal='false'>
        <h3 class="modal_title">将商品id:{{GoodsId}}</h3>
        <div class="modal_content">
          <span> 移动到：序列</span>
          <el-input-number v-model.trim="num" @change="handleChange" :min="1" label="描述文字" size="mini" style="width:100px;"></el-input-number>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleMove = false" size="mini">取消</el-button>
          <el-button type="primary" @click="updateListSeq()" size="mini" style="width:21%;">确定</el-button>
        </div>
      </el-dialog>

      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total1" class="fr pages" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-size="10">
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 修改商品顺序模态框 -->
    <el-dialog title="" :visible.sync="changeDialogOrder" width="20%" class="add_user" append-to-body @close="reloadData" :close-on-click-modal='false'>
      <h3 class="modal_title">将商品id: {{GoodsId}}</h3>
      <div class="modal_content">
        <span> 移动到：序列</span>
        <el-input-number v-model.trim="updatenum" @change="handleChange" :min="1" label="描述文字" size="mini" style="width:100px;"></el-input-number>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDialogOrder = false" size="mini">取消</el-button>
        <el-button type="primary" @click="changeListSeq()" size="mini" style="width:21%;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<style>
</style>



<script>
import {
  globeTableLoding,
  checkAll,
  loadingStatus,
  globelFnHanle1
} from "@/common/js/mixin";
import { mapState, mapMutations } from "vuex";
import { SearchBook, GetDzzjcBanner, ChangeSeq, DelSeq } from "@/api";
import { getItem } from "@/common/js/util";
export default {
  name: "BannerManage",
  data() {
    return {
      tableData: [],
      checked: false,
      multipleSelection: [],
      dialogTableVisible: false,
      dialogVisibleMove: false,
      changeDialogOrder: false,
      num: "",
      gridData: [],
      value: "",
      input: "",
      total: null,
      total1: null,
      currentPage: null,
      currentPage1: null,
      GoodsId: "",
      updateGoodsId: "",
      updatenum: "",
      index:''
    };
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isOpenModal() {
      this.dialogTableVisible = true;
    }
  },
  mixins: [globeTableLoding, checkAll, loadingStatus, globelFnHanle1],
  mounted() {
    this.initData();
  },
  methods: {
    indexMethod(index) {
      return index++;
    },
    initData() {
      const params = {
        PageIndex: "1",
        PageNum: "10",
        Type: "2"
      };
      GetDzzjcBanner(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    loadData() {
      this.setMLoading(true);
      const params = {
        Search: "",
        PageIndex: 1,
        PageNum: 10,
        Type: "5",
        DzzjcType: "2",
        IsPoint: ""
      };
      SearchBook(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.gridData = res.Data.BookInfo;
          this.gridData.map(x => {
            x.Operation = "添加";
            this.total1 = res.Total;
          });
          this.setMLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    openModal(index, row) {
      this.changeDialogOrder = true;
      this.GoodsId = row.Id;
    },
    up(index, row) {
      if (index == 0) {
        this.$message("已经是第一条了哦！！");
      } else {
      }
    },
    down(index, row) {
      if (index == this.tableData.length - 1) {
        this.$message("已经是最后一条了哦！！");
      }
    },
    getBook() {
      this.setMLoading(true);
      const params = {
        PageIndex: this.currentPage,
        PageNum: 10,
        Type: "2",
      };
      GetDzzjcBanner(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    getBook1() {
      this.setMLoading(true);
      const params = {
        Search: this.input.replace(/\s+/g,""),
        PageIndex: this.currentPage1,
        PageNum: 10,
        Type: "5",
        DzzjcType: "2",
        IsPoint: ""
      };
      // console.log(params);
      SearchBook(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if(res.Data.BookInfo == null) {
            this.setMLoading(false);
            this.$message('没有内容哦')
            return false;
          }
          this.gridData = res.Data.BookInfo;
          this.gridData.map(x => {
            x.Operation = "添加";
          });
          this.setMLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    addGoods(index, row) {
      this.dialogVisibleMove = true;
      this.GoodsId = row.Id;
      this.index = index;
    },
    batchImport() {
      this.$router.push({ name: "BatchImport" });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBook();
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getBook1();
    },
    handleChange() {},
    updateListSeq() {
      this.dialogVisibleMove = false;

      const params = {
        Seq: this.num,
        GoodsId: this.GoodsId,
        ChannelCode: "5",
        Type: "2",
        Method: "add"
      };
      ChangeSeq(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("添加成功");
            this.gridData[this.index].Operation = "已添加";
            this.$set(this.gridData, this.index, this.gridData[this.index]);
          } else {
            this.$message("该商品已经添加过了哦");
          }
        })
        .catch(this.globelErrHandle);
    },
    delItem() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请勾选要删除的内容");
        return false;
      }
      if (this.tableData.length - this.multipleSelection.length < 4) {
        this.$message.error("大中专教材最少保留四本");
        return false;
      }
      let goodsArr = [];
      this.multipleSelection.map(x => {
        goodsArr.push(x.Id);
      });
      let GoodsId = goodsArr.join(",");
      const params = {
        GoodsId,
        ChannelCode: "5",
        Type: "2"
      };
      DelSeq(params)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initData();
          } else {
            this.$message.error(res.ErrorMsg);
          }
        });
    },
    changeListSeq() {
      const params = {
        Seq: this.updatenum,
        GoodsId: this.updateGoodsId,
        ChannelCode: "5",
        Type: "2",
        Method: "update"
      };
      ChangeSeq(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("修改成功");
          }
        })
        .catch(this.globelErrHandle);
    },
    reloadData() {
      this.initData();
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.search_area {
  margin-bottom: 30px;
}
</style>


