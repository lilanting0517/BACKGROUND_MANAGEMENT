<template>
  <div class="main">
    <h2 class="char_tit">
      <span class="cx_title">大中专教材商品排序</span>
      <span class="search_middle">商品信息：</span>
      <el-input v-model.trim="input" placeholder="请输入商品名称" size="mini" style="width:20%;"></el-input>
      <el-button size="mini" style="margin-left:3%;" @click="searchGoods" type="primary">查找</el-button>
    </h2>
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="gridData" height="600">
        <!-- <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
        </el-table-column> -->
        <el-table-column label="排序" align="center" width="80px" prop="Seq">
        </el-table-column>
        <el-table-column prop="Id" label="商品ID" width="120" align="center"></el-table-column>
        <el-table-column prop="Isbn" label="ISBN" width="140" align="center">
        </el-table-column>
        <el-table-column prop="Name" label="商品名称" align="center" width="150px"></el-table-column>
        <el-table-column prop="Price" label="价格" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Publisher" label="出版社" align="center" width="140px"></el-table-column>
        <el-table-column prop="Kb" label="开本" align="center"></el-table-column>
        <el-table-column prop="Operation" label="添加相关图书" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addRangeBook(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Operation" label="顺序修改" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editPosition(scope.$index, scope.row)">顺序修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>

    <!-- 模态框修改-->
    <el-dialog title="" :visible.sync="dialogVisibleMove" width="20%" class="add_user" :close-on-click-modal='false'>
      <h3 class="modal_title">将商品id: {{GoodsId}}</h3>
      <div class="modal_content">
        <span> 移动到：序列</span>
        <el-input-number v-model.trim="num" @change="handleChange" :min="1" :max="10" label="描述文字" size="mini" style="width:100px;"></el-input-number>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMove = false" size="mini">取消</el-button>
        <el-button type="primary" @click="updateListSeq()" size="mini" style="width:21%;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchBook, ChangeSeq } from "@/api";
import { loadingStatus } from "@/common/js/mixin";
export default {
  name: "",
  data() {
    return {
      checked: false,
      dialogTableVisible: false,
      gridData: [],
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
      currentPage: 1,
      pageSize: 10,
      GoodsId: null
    };
  },
  created() {
    this.initGridData();
  },
  mixins: [loadingStatus],
  methods: {
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
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.setLoading(true);

      const params = {
        Search: this.input.replace(/\s+/g,""),
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
    handleSelectionChange() {},
    handleClose(done) {},
    handleUP() {},
    // indexMethod(index) {
    //   return (this.currentPage - 1) * this.pageSize + (index + 1);
    // },
    handleChange() {},
    //修改列表显示顺序
    editPosition(index, row) {
      this.dialogVisibleMove = true;
      this.GoodsId = row.Id;
    },
    addRangeBook(index, scope) {
      this.$router.push({
        name: "largemiddladdbook",
        params: { id: scope.Id,Name: scope.Name}
      });
    },
    updateListSeq() {
      this.dialogVisibleMove = false;

      const params = {
        Seq: this.num,
        GoodsId: this.GoodsId,
        ChannelCode: "5",
        Type: 3,
        Method: "update"
      };

      ChangeSeq(params)
        .then(this.globelReqHandle)
        .then(({ Data, Success }) => {
          if (Success) {
            this.$message("修改成功!");
            this.currentPage = 1;
            this.initGridData();

          }
        })
        .catch(this.globelErrHandle);
    },
    //查找商品信息
    searchGoods() {
      const params = {
        Search: this.input.replace(/\s+/g,""),
        PageIndex: 1,
        PageNum: 10,
        Type: "5",
        DzzjcType: "",
        IsPoint: ""
      };

      SearchBook(params)
        .then(this.globelReqHandle)
        .then(({ Data,Total }) => {
          this.gridData = Data.BookInfo;
          this.currentPage = 1;
          this.total = Total;
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
.cx_title {
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

