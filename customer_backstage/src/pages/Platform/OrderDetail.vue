<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      订单详情
    </h2>
    <h2 class="char_tit clearfix">
      <label for="">订单查询:</label>
      <el-input placeholder="商品名称/订单号" class="MarginR" size="mini" style="width:150px;" v-model.trim="input"></el-input>
      <label for="" style="margin-left:-22px;">订单类型:</label>
      <el-select v-model="valueSelect" placeholder="请选择" size="mini" style="width:100px;">
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <label for="" style="margin-left:10px">订单时间:</label>
      <el-date-picker v-model.trim="time" class='datepicker' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" @change="dateChange" value-format="yyyy-MM-dd:HH:mm:ss" >
      </el-date-picker>
      <el-button size="mini" @click="searchOrder" type="primary">搜索</el-button>
    </h2>

    <!-- 表格部分 -->
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" class="data_table" style="width: 100%" height="500">
        <el-table-column prop="OrderId" label="原始单号" align="center">
        </el-table-column>
        <el-table-column prop="Count" label="订购数量" align="center">
        </el-table-column>
        <el-table-column prop="TypeCount" label="订购品种" align="center">
        </el-table-column>
        <el-table-column prop="TotalPrice" label="订购码洋" align="center">
        </el-table-column>
        <el-table-column prop="OrderDate" label="订单日期" align="center">
        </el-table-column>
        <el-table-column prop="OrderType" label="订单类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.InOut === 'I'">内部订单</span>
            <span v-else>外部订单</span>
          </template>
        </el-table-column>
        <el-table-column prop="State" label="备注信息" align="center">
        </el-table-column>
         <el-table-column prop="OrderDetail" label="订单明细" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="checkOrderDetail(scope.$index,scope.row)">查看明细</el-button>
          </template>
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
import { GetOrder, SearchOrder } from "@/api";
import { loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
export default {
  name: "",
  created() {
    this.initTableData();
  },
  data() {
    return {
      tableData: [],
      time: "",
      input: "",
      currentPage: 1,
      total: null,
      valueSelect: "",
      types: [
        {
          label:'全部',
          value: ""
        },
        {
          label:'内部订单',
          value: "I"
        },
        {
          label:'外部订单',
          value: "O"
        }
      ]
    };
  },
  mixins: [loadingStatus, globelFnHanle1],
  methods: {
    initTableData() {
      const params = {
        PageIndex: 1,
        PageNum: 10,
        OrderId: this.input.replace(/\s+/g,""),
        StartTime: "",
        EndTime: "",
        State:'',
        Isbn:'',
        InOut:''
      };

      GetOrder(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    searchOrder() {
      if (this.time === "" || this.time === null) {
        const params = {
          PageIndex: 1,
          PageNum: 10,
          OrderId: this.input.replace(/\s+/g,""),
          StartTime: "",
          EndTime: "",
          State:'',
          Isbn:'',
          InOut: this.valueSelect
        };
        GetOrder(params)
          .then(this.globelReqHandle1)
          .then(({ Data }) => {
            this.tableData = Data;
          })
          .catch(this.globelErrHandle);
        return false;
      }
      this.time[0] = this.time[0].split("");
      this.time[0][10] = "";
      this.time[0] = this.time[0].join("");

      this.time[1] = this.time[1].split("");
      this.time[1][10] = "";
      this.time[1] = this.time[1].join("");

      const params2 = {
        PageIndex: 1,
        PageNum: 10,
        OrderId: this.input.replace(/\s+/g,""),
        StartTime: this.time[0],
        EndTime: this.time[1],
        State:'',
        Isbn:'',
        InOut: this.valueSelect
      };
      this.time[0] =
        this.time[0].substr(0, 10) +
        " " +
        this.time[0].substr(10, this.time[0].length - 10);
      this.time[1] =
        this.time[1].substr(0, 10) +
        " " +
        this.time[1].substr(10, this.time[1].length - 10);
      const params = {
        PageIndex: 1,
        PageNum: 10,
        OrderId: this.input.replace(/\s+/g,""),
        StartTime: this.time[0],
        EndTime: this.time[1],
        State:'',
        Isbn:'',
        InOut: this.valueSelect
      };

      SearchOrder(params, params2)
        .then(this.globelReqHandle1)
        .then(({ Data }) => {
          this.tableData = Data;
          this.currentPage = 1;
        })
        .catch(this.globelErrHandle);
    },
    dateChange(val) {
      // console.log(val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      const params = {
        PageIndex: this.currentPage,
        PageNum: 10,
        OrderId: this.input.replace(/\s+/g,""),
        StartTime: "",
        EndTime: "",
        State:'',
        Isbn:'',
        InOut: this.valueSelect
      };

      GetOrder(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    checkOrderDetail(index,row) {
      this.$router.push({
        name: "childorderdetail",
        query: {
          id: row.OrderId
        }
      });
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
