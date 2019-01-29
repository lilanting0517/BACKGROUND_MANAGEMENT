<template>
  <div>
    <h2 class="char_tit clearfix">
      <label for="">外部用户单位名称:</label>
      <el-select
        v-model.trim="value"
        size="mini"
        class="MarginR"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading2"
      >
        <el-option
          :value="item.Dwmc"
          v-for="(item,index) in store"
          :key="item.Dwmc"
          :label="item.Dwmc"
          @click.native="selectOut(index)"
        ></el-option>
      </el-select>
      <label for="">连锁门店单位:</label>
      <el-select
        v-model.trim="value1"
        size="mini"
        class="MarginR"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod1"
        :loading="loading1"
      >
        <el-option
          :value="item.Dwmc"
          v-for="(item,index) in unit"
          :key="item.Dwmc"
          :label="item.Dwmc"
          @click.native="selectIn(index)"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        size="mini"
        @click="associBtn"
      >关联</el-button>
    </h2>
    <!-- 表格部分 -->
    <div
      class="tab_wrap"
      v-loading="loading"
    >
      <el-table
        :data="tableData"
        class="data_table"
        style="width: 100%"
        height="500"
      >
        <el-table-column
          prop="order"
          label="序号"
          align="center"
          width="100px"
          type="index"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column
          prop="CustomName"
          label="外部用户单位名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="ShopName"
          label="连锁门店单位名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Operation"
          label="操作"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="editAssociation(scope.$index, scope.row)"
            >修改关联</el-button>
            <!-- <el-button type="text" size="small" @click="deleteAssociation(scope.$index, scope.row)">删除关联</el-button> -->
            <el-popover
              :ref="`popover-${scope.$index}`"
              placement="top"
              v-model="scope.row.canDel"
              trigger="click"
            >
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  type="text"
                  size="mini"
                  @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                >取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="deleteAssociation(scope.$index, scope.row)"
                >确定</el-button>
              </div>
              <el-button
                type="text"
                size="small"
                slot="reference"
              >删除关联</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        class="fr pages"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
      >
      </el-pagination>
    </div>
    <!-- 模态框 -->
    <el-dialog
      title="修改关联"
      :visible.sync="dialogVisible"
      width="30%"
      class="modal"
      :close-on-click-modal='false'
    >
      <div>
        <span>外部用户单位:</span>
        <el-select
          v-model.trim="unitName"
          size="mini"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading2"
          disabled
        >
          <el-option
            :value="item.Dwmc"
            v-for="(item,index) in store"
            :key="item.Dwmc"
            :label="item.Dwmc"
            @click.native="selectOut(index)"
          ></el-option>
        </el-select>

      </div>
      <div class="middle">
        <span>连锁门店单位:</span>
        <el-select
          v-model.trim="storeName"
          size="mini"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod1"
          :loading="loading1"
        >
          <el-option
            :value="item.Dwmc"
            v-for="(item,index) in unit"
            :key="item.Dwmc"
            :label="item.Dwmc"
            @click.native="selectIn(index)"
          ></el-option>
        </el-select>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="updateLink"
          size="mini"
        >关联</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetCompanyList,
  GetRelationList,
  AddRelation,
  DeleteRelation,
  UpdateRelation
} from "@/api";
import { loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
export default {
  data() {
    return {
      options: [],
      value: "",
      value1: "",
      tableData: [
        {
          order: "1",
          outComName: "sddfsds",
          chainComName: "sf",
          Operation: "修改关联"
        }
      ],
      dialogVisible: false,
      formLabelWidth: "120px",
      store: [],
      storeName: "",
      unit: [],
      unitName: "",
      CompanyCode: "",
      UnitCode: "",
      CustomCode: "",
      ShopCode: "",
      Guid: "",
      currentPage: 1,
      total: null,
      loading1: false,
      loading2: false,
      query:'',
      query1:''
    };
  },
  mounted() {
    this.initTableData();
  },
  mixins: [loadingStatus, globelFnHanle1],
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    //获取外部用户单位
    remoteMethod(query) {
      //去除select框首尾空格，避免返回100错误代码
      query = this.trimInput(query);
      this.query = query;
      this.loading2 = true;
      const params = {
        InOut: "O",
        Search: query
      };
      GetCompanyList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.store = res.Data;
          this.loading2 = false;
        })
        .catch(this.globelErrHandle);
    },
    trimInput(s) {
      return s.replace(/(^\s*)|(\s*$)/g, "");
    },
     //获取连锁门店单位
    remoteMethod1(query) {
      query = this.trimInput(query);
      this.query1 = query;
      this.loading1 = true;
      const params = {
        InOut: "I",
        Search: query
      };
      GetCompanyList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.unit = res.Data;
          this.loading1 = false;
        })
        .catch(this.globelErrHandle);
    },
    //获取单位关联维护列表
    initTableData() {
      const params = {
        PageIndex: 1,
        PageNum: 10,
        CustomName: "",
        ShopName: ""
      };

      GetRelationList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    //新增单位关联维护列表
    selectOut(index) {
      this.CompanyCode = this.store[index].Dwbh;
      this.CustomCode = this.store[index].Dwbh;
    },
    selectIn(index) {
      this.UnitCode = this.unit[index].Dwbh;
      this.ShopCode = this.unit[index].Dwbh;
    },
    associBtn() {
      if (this.value === "") {
        this.$message.error("外部用户单位不能为空");
        return false;
      }
      if (this.value1 === "") {
        this.$message.error("连锁门店单位不能为空");
        return false;
      }
      const params = {
        CustomName: this.value,
        ShopName: this.value1,
        ShopCode: this.UnitCode,
        CustomCode: this.CompanyCode
      };

      AddRelation(params)
        .then(this.globelReqHandle1)
        .then(({ Data, Success }) => {
          if (Success) {
            this.initTableData();
            this.value = "";
            this.value1 = "";
          }
        })
        .catch(this.globelErrHandle);
    },
    //删除关联
    deleteAssociation(index, row) {
      const params = {
        Guid: row.Guid
      };
      DeleteRelation(params)
        .then(this.globelReqHandle1)
        .then(({ Data, Success }) => {
          if (Success) {
            this.$message("删除成功");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
    },
    //修改关联
    editAssociation(index, row) {
      this.dialogVisible = true;
      this.unitName = row.CustomName;
      this.storeName = row.ShopName;
      this.CustomCode = row.CustomCode;

      this.unit.map((el, index) => {
        if (el.Dwmc == row.ShopName) {
          this.ShopCode = el.Dwbh;
        }
      });
      this.Guid = row.Guid;
    },
    updateLink() {
      this.dialogVisible = false;

      const params = {
        CustomName: this.unitName,
        ShopName: this.storeName,
        ShopCode: this.ShopCode,
        CustomCode: this.CustomCode,
        Guid: this.Guid
      };

      UpdateRelation(params)
        .then(this.globelReqHandle1)
        .then(({ Data, Success }) => {
          if (Success) {
            this.$message("修改成功");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      const params = {
        PageIndex: this.currentPage,
        PageNum: 10,
        CustomName: "",
        ShopName: ""
      };

      GetUserList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
        })
        .catch(this.globelErrHandle);
    }
  }
};
</script>
<style lang="scss">
label {
  font-size: 14px;
  color: #555555;
  margin-right: 2%;
}
.MarginR {
  margin-right: 20px;

  .el-input {
    input {
      height: 35px !important;
    }
  }
}
.modal {
  span {
    margin-right: 5%;
  }
}
.middle {
  margin-top: 30px;
}
</style>
