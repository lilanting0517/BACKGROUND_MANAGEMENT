<template>
  <div class="main">
    <!-- 标题部分 -->
    <h3 class="char_tit clearfix">
      多元产品
      <el-button
        size="small"
        class="fr choose_prodect"
        @click="openModal"
        type="primary"
      >选择商品</el-button>
    </h3>
    <!-- 表格部分 -->
    <div
      class="tab_wrap"
      v-loading="loading"
    >
      <el-table
        :data="tableData"
        class="data_table"
        style="width: 100%"
        max-height="500"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column
          type="selection"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Name"
          label="商品名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="GoodPic"
          label="商品图片"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.Image ? scope.row.Image[0] : noBook"
              alt=""
              class="img-size"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="Price"
          label="定价"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Brand"
          label="品牌"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Package"
          label="规格"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Operation"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="replaceGoods(scope.$index,scope.row)"
            >替换</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox
        :disabled="!tableData.length"
        :value="allSelect"
        @change="handleSelectionAllChange(tableData)"
        class="checkAll"
      >全选</el-checkbox>
      <el-button
        size="mini"
        style="margin-left:10px"
        @click="confirmDelete"
      >删除</el-button>
      <!-- <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination> -->
      <!-- 模态框 -->
    </div>
    <!-- <el-button type="text" @click="dialogTableVisible = true">点击打开 Dialog</el-button> -->
    <el-dialog
      title="选择商品"
      :visible.sync="dialogTableVisible"
      width="70%"
      @close="reloadList"
      @open="initCurrentPageAdd"
      :close-on-click-modal='false'
    >
      <div class="search_area">
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
          @click="getVariety"
        >查找</el-button>
      </div>
      <el-table
        :data="gridData"
        v-loading="modalLoading"
        max-height="500"
      >
        <el-table-column
          prop="Name"
          label="商品名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="GoodPic"
          label="商品图片"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.Image ? scope.row.Image[0] : noBook"
              alt=""
              class="img-size"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="Price"
          label="定价"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Brand"
          label="品牌"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Package"
          label="规格"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Operation"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="addGood(scope.$index,scope.row)"
              :disabled=" scope.row.Operation==='已添加' "
            >{{scope.row.Operation}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_wrap clearfix">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total1"
          class="fr pages"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-size="10"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 删除模态框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :close-on-click-modal='false'
      center
    >
      <span>确定删除吗？</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="deleteDialogVisible = false"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="deleteGoods"
          size="mini"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 替换模态框 -->
    <el-dialog
      title="选择商品"
      :visible.sync="dialogReplaceGoods"
      width="70%"
      @close="reloadList"
      @open="initCurrentPageReplace"
      :close-on-click-modal='false'
    >
      <div class="search_area">
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
          @click="getVariety"
        >查找</el-button>
      </div>
      <el-table
        :data="gridData"
        v-loading="modalLoading"
        max-height="500"
      >
        <el-table-column
          prop="Name"
          label="商品名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="GoodPic"
          label="商品图片"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.Image ? scope.row.Image[0] : noBook"
              alt=""
              class="img-size"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="Price"
          label="定价"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Brand"
          label="品牌"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Package"
          label="规格"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Operation"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="updateGood(scope.$index,scope.row)"
            >替换</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_wrap clearfix">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total2"
          class="fr pages"
          @current-change="handleCurrentChange2"
          :current-page="currentPage2"
          :page-size="10"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetMainPageSeqGoods,
  GetList,
  SearchMultiGoods,
  ChangeMainPageSeq,
  DelMainPageSeq
} from "@/api";
import { checkAll, loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
export default {
  name: "",
  data() {
    return {
      checked: false,
      dialogTableVisible: false,
      deleteDialogVisible: false,
      dialogReplaceGoods: false,
      tableData: [],
      gridData: [],
      options: [],
      value: "",
      input: "",
      multipleSelection: [],
      Seq: "",
      total: null,
      total1: null,
      total2: null,
      currentPage: 1,
      currentPage1: 1,
      currentPage2: 1
    };
  },
  mixins: [checkAll, loadingStatus, globelFnHanle1],
  mounted() {
    this.initData();
  },
  methods: {
    openModal() {
      if (this.tableData.length < 10) {
        this.dialogTableVisible = true;
      } else {
        this.$message("该频道最多添加十个商品！");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    initData() {
      const params = {
        Type: "6"
      };
      GetMainPageSeqGoods(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Data == null) {
            this.tableData = [];
            this.total = 0;
          } else {
            this.tableData = res.Data;
            this.total = res.Total;
            this.setLoading(false);
          }
        })
        .catch(this.globelErrHandle);
    },
    handleClose(done) {},
    deleteGoods() {
      this.deleteDialogVisible = false;

      let arr = [];
      this.multipleSelection.map(item => {
        arr.push(item.Id);
      });
      arr = arr.toString();
      const params = {
        GoodsId: arr,
        ChannelCode: "6"
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
    confirmDelete() {
      if (this.multipleSelection.length == 0) {
        this.$message("还没有选择需要删除的内容哦");
        return;
      } else {
        this.deleteDialogVisible = true;
      }
    },
    //添加
    addGood(index, row) {
      let GoodsId = row.Id;
      let params = {
        ChannelCode: "6",
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
            this.$set(this.gridData, index, this.gridData[index]);
          } else {
            this.$message.error(res.ErrorMsg);
          }
        })
        .catch(this.globelErrHandle);
    },
    initCurrentPageAdd() {
      this.currentPage1 = 1;
      this.getVariety();
    },
    initCurrentPageReplace() {
      this.currentPage2 = 1;
      this.getVariety1();
    },
    reloadList() {
      this.initData();
    },
    //查找
    getVariety() {
      this.setMLoading(true);
      const params = {
        Search: this.input.replace(/\s+/g, ""),
        PageIndex: this.currentPage1,
        PageNum: 10,
        PriceStart: "",
        PriceEnd: "",
        ShowAll: 2,
        TypeId: ""
      };
      SearchMultiGoods(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.gridData = res.Data;
          this.gridData.map(x => {
            x.Operation = "添加";
          });
          this.total1 = res.Total;
          this.setMLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    //查找
    getVariety1() {
      const params = {
        Search: this.input.replace(/\s+/g, ""),
        PageIndex: this.currentPage2,
        PageNum: 10,
        PriceStart: "",
        PriceEnd: "",
        ShowAll: 2,
        TypeId: ""
      };
      SearchMultiGoods(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.gridData = res.Data;
          this.gridData.map(x => {
            x.Operation = "添加";
          });
          this.total2 = res.Total;
        })
        .catch(this.globelErrHandle);
    },
    //替换
    replaceGoods(index, row) {
      this.dialogReplaceGoods = true;
      this.Seq = row.Seq;
    },
    updateGood(index, row) {
      let GoodsId = row.Id;
      let params = {
        ChannelCode: "6",
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
      this.getVariety();
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.getVariety1();
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
