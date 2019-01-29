<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      <span>购物车信息</span>
    </h2>
    <h2 class="char_tit clearfix">
      <label for="">客户账号:</label>
      <el-select v-model.trim="value1" placeholder="请选择" size="mini" class="MarginR" @change="initCurrentPage" filterable>
        <el-option v-for="item in userOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <label for="">加入购物车时间:</label>
      <el-date-picker v-model.trim="value6" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" size="mini">
      </el-date-picker>
      <el-button type="info" plain size="mini" @click="searchMessage">查找</el-button>
    </h2>
    <!-- 表格部分 -->
    <div class="tab_wrap">
      <el-table :data="tableData" class="data_table" height="500">
        <el-table-column prop="GoodsId" label="商品Id" align="center" width="140">
        </el-table-column>
        <el-table-column prop="Zdddm" label="商品征订码" align="center" width="150">
        </el-table-column>
        <el-table-column prop="BookName" label="商品名称" align="center" width="200">
        </el-table-column>
        <el-table-column prop="Isbn" label="ISBN" align="center" width="150">
        </el-table-column>
        <el-table-column prop="Publiser" label="出版社" align="center" width="150">
        </el-table-column>
        <el-table-column prop="Price" label="定价" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Zbkc" label="总部库存" align="center" width="100">
        </el-table-column>
        <el-table-column prop="Mdkc" label="门店库存" align="center" width="100">
        </el-table-column>
        <el-table-column prop="Count" label="订数" align="center">
        </el-table-column>
        <el-table-column prop="CreatTime" label="加入购物车时间" align="center" width="160">
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
import { GetGoods, GetCompanyUserList } from "@/api";
import { globelFnHanle, globelFnHanle1 } from "@/common/js/mixin";
export default {
  data() {
    return {
      form: {
        userId: "",
        name: "",
        pwd: "",
        tel: ""
      },
      userOptions: [],
      value1: "",
      // value6: [new Date(new Date().setHours(0, 0, 0, 0)-24*60*60*1000),new Date(new Date().setHours(23, 59,59, 59)-24*60*60*1000)],
      value6: "",
      tableData: [],
      state: null,
      time: null,
      currentPage: 1,
      total: null
    };
  },
  mixins: [globelFnHanle1],
  mounted() {
    this.initListData();
    this.initTableData();
  },
  methods: {
    //获取用户列表
    initListData() {
      const params = {
        Search: "",
        RoleName: "",
        PageIndex: this.currentPage,
        PageNum: 1000,
        State: "",
        Type: "",
        UserType: 2
      };
      GetCompanyUserList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.userOptions = res.Data;
          this.value1 = this.userOptions[0];
        })
        .catch(this.globelErrHandle);
    },
    initTableData() {
      // if (this.value6 === "" || this.value6 === null) {
      //   this.$message("请选择时间");
      //   return false;
      // }
      if (this.value6 === "") {
        const params = {
          UserId: this.value1,
          StartTime: this.value6,
          EndTime: this.value6,
          PageNum: 10,
          PageIndex: this.currentPage,
          Channel: ""
        };
        const params2 = {
          UserId: this.value1,
          StartTime: this.value6,
          EndTime: this.value6,
          PageNum: 10,
          PageIndex: this.currentPage,
          Channel: ""
        };
        GetGoods(params, params2)
          .then(this.globelReqHandle1)
          .then(res => {
            this.tableData = res.Data;
            this.total = res.Total;
          })
          .catch(this.globelErrHandle);
      } else {
        const params = {
          UserId: this.value1,
          StartTime: this.value6[0],
          EndTime: this.value6[1],
          PageNum: 10,
          PageIndex: this.currentPage,
          Channel: ""
        };
        const params2 = {
          UserId: this.value1,
          StartTime: this.value6[0].replace(/\s*/g, ""),
          EndTime: this.value6[1].replace(/\s*/g, ""),
          PageNum: 10,
          PageIndex: this.currentPage,
          Channel: ""
        };
        GetGoods(params, params2)
          .then(this.globelReqHandle1)
          .then(res => {
            this.tableData = res.Data;
            this.total = res.Total;
          })
          .catch(this.globelErrHandle);
      }
    },
    initCurrentPage() {
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initTableData();
    },
    searchMessage() {
      this.initTableData();
    },
    dateChange() {}
  }
};
</script>
<style lang="scss" scoped>
label {
  font-size: 14px;
  color: #555555;
}
.edit_user {
  .el-select {
    width: 400px;
  }
  .el-input--mini {
    width: 400px;
  }
  span {
    display: inline-block;
    width: 20%;
  }
  div {
    margin-bottom: 10px;
  }
  .modal_input {
    width: 65%;
  }
}

.MarginR {
  margin-right: 20px;
}
.addUserInfo {
  .el-select {
    width: 400px;
  }
  .el-input--mini {
    width: 400px;
  }
}
</style>
