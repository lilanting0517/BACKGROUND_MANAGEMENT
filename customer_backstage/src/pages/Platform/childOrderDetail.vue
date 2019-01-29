<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      订单明细
      <el-button size="mini" type="text" @click="$router.go(-1)" style="margin-left:10px;">返回主单</el-button>
    </h2>
    <!-- 表格部分 -->
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" class="data_table" style="width: 100%" height="500">
        <el-table-column prop="ChannelName" label="频道名称" align="center">
        </el-table-column>
        <el-table-column prop="BookName" label="书名" align="center" width="150">
        </el-table-column>
        <el-table-column prop="Isbn" label="ISBN" align="center" width="120">
        </el-table-column>
        <el-table-column prop="Publisher" label="出版社" align="center">
        </el-table-column>
        <el-table-column prop="Price" label="价格" align="center">
        </el-table-column>
        <el-table-column prop="TotalPrice" label="订购码洋" align="center">
        </el-table-column>
        <el-table-column prop="XyCount" label="学用数量" align="center">
        </el-table-column>
        <el-table-column prop="JyCount" label="教用数量" align="center">
        </el-table-column>
        <el-table-column prop="Count" label="数量" align="center">
        </el-table-column>
        <el-table-column prop="OrderState" label="订单状态" align="center">
        </el-table-column>
        <el-table-column prop="Remark" label="备注" align="center">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import { GetOrderDetail } from "@/api";
import { loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
export default {
  name: "",
  created() {
    this.initTableData();
  },
  data() {
    return {
      tableData: [],
      input: "",
      currentPage: 1,
      PageIndex: 1,
      PageNum: 10,
      total: null,
      OrderId:this.$route.query.id
    };
  },
  mixins: [loadingStatus, globelFnHanle1],
  methods: {
    initTableData() {
      const params = {
        PageIndex: this.currentPage,
        PageNum: this.PageNum,
        OrderId: this.OrderId,
      };

      GetOrderDetail(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initTableData();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
label {
  font-size: 14px;
  color: #555555;
}
.MarginR {
  margin-right: 30px;
}
.datepicker {
  width:350px !important;
}
</style>
