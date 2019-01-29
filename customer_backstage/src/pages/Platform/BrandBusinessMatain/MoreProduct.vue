<template>
  <div>
    <div
      class="tab_wrap"
      v-loading="loading"
    >
      <el-table
        :data="tableData"
        class="data_table"
        style="width: 100%"
        height="500"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column
          label="序号"
          align="center"
          width="80px"
          type="index"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column
          prop="AreaName"
          label="区域名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Name"
          label="区域业务员名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="QQ"
          label="QQ号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Tel"
          label="电话"
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
              @click="editItem(scope.$index,scope.row)"
            >修改</el-button>
            <!-- <el-button type="text" size="small" @click="delItem(scope.$index,scope.row)">删除</el-button> -->
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
                  @click="delItem(scope.$index, scope.row)"
                >确定</el-button>
              </div>
              <el-button
                type="text"
                size="small"
                slot="reference"
              >删除</el-button>
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
    <!-- 模态框修改-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      class="add_user"
      :close-on-click-modal='false'
    >
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="区域名称"
          prop="AreaName"
        >
          <el-input
            v-model.trim="ruleForm2.AreaName"
            auto-complete="off"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="业务员名称"
          prop="PicName"
        >
          <el-input
            v-model.trim="ruleForm2.PicName"
            auto-complete="off"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="QQ号"
          prop="PicQQ"
        >
          <el-input
            v-model.trim.number="ruleForm2.PicQQ"
            auto-complete="off"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="PicTel"
        >
          <el-input
            v-model.trim.number="ruleForm2.PicTel"
            auto-complete="off"
            size="mini"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item> -->
      </el-form>
      <!-- <div>
        <span>区域名称:</span>
        <el-input placeholder="请输入区域名称" v-model.trim="tableDataCopy.AreaName" class="modal_input" size="mini"></el-input>
      </div>
      <div>
        <span>区域业务员名称:</span>
        <el-input placeholder="请输入业务员姓名" v-model.trim="tableDataCopy.PicName" class="modal_input" size="mini"></el-input>
      </div>
      <div>
        <span>QQ号:</span>
        <el-input placeholder="请输入QQ号" v-model.trim="tableDataCopy.PicQQ" class="modal_input" size="mini"></el-input>
      </div>
      <div>
        <span>电话:</span>
        <el-input placeholder="请输入电话" v-model.trim="tableDataCopy.PicTel" class="modal_input" size="mini"></el-input>
      </div> -->
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm('ruleForm2')"
          size="medium"
        >提交</el-button>
        <el-button
          @click="resetForm('ruleForm2')"
          size="medium"
        >重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { GetSellerList, AddInfo, UpdateInfo, DelInfo } from "@/api";
import { loadingStatus } from "@/common/js/mixin";
export default {
  name: "brandbusinessmatain",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("区域名称不能为空"));
      } else {
        if (this.ruleForm2.AreaName !== "") {
          // this.$refs.ruleForm2.validateField("AreaName");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("区域业务员姓名不能为空"));
      } else {
        if (this.ruleForm2.PicName !== "") {
          // this.$refs.ruleForm2.validateField("PicName");
        }
        callback();
      }
    };
    var checkQQ = (rule, value, callback) => {
      var patt = new RegExp("^[1-9]\\d{4,10}$");
      if (value === "") {
        callback(new Error("QQ不能为空"));
      } else if (!patt.test(value)) {
        callback(new Error("QQ号码格式不正确"));
      } else {
        if (this.ruleForm2.PicQQ !== "") {
          // this.$refs.ruleForm2.validateField("PicQQ");
        }
        callback();
      }
    };
    var checkTel = (rule, value, callback) => {
      var re = /^1\d{10}$/;
      if (value === "") {
        callback(new Error("电话不能为空"));
      } else if (!re.test(value)) {
        callback(new Error("电话格式不对"));
      } else {
        if (this.ruleForm2.PicTel !== "") {
          // this.$refs.ruleForm2.validateField("PicTel");
        }
        callback();
      }
    };
    return {
      ruleForm2: {
        AreaName: "",
        PicName: "",
        PicQQ: "",
        PicTel: ""
      },
      rules2: {
        AreaName: [{ validator: validatePass, trigger: "blur" }],
        PicName: [{ validator: validatePass2, trigger: "blur" }],
        PicQQ: [{ validator: checkQQ, trigger: "blur" }],
        PicTel: [{ validator: checkTel, trigger: "blur" }]
      },
      tableData: [],
      title: "新增管理员",
      checked: false,
      multipleSelection: [],
      options: [],
      value: "",
      dialogVisible: false,
      Guid: "",
      currentPage: 1,
      PageIndex: 1,
      PageNum: 10,
      total: null
    };
  },
  props: {
    formData: String
  },
  watch: {},
  created() {
    this.initTableData();
  },
  mixins: [loadingStatus],
  methods: {
    initTableData() {
      const params = {
        Type: "6",
        PageIndex: 1,
        PageNum: 10
      };
      GetSellerList(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    indexMethod(index) {
      return index + 1;
    },
    handleClick() {},
    handleSelectionChange(val) {},
    pushItem() {
      if (this.formData == "MoreProduct") {
        if (this.tableData.length < 4) {
          this.dialogVisible = true;
          this.title = "新增管理员";
          this.ruleForm2 = {
            AreaName: "",
            PicName: "",
            PicQQ: "",
            PicTel: ""
          };
        } else {
          this.$message("区域业务员最多四名哦");
        }
      }
    },
    handleChange() {
      if (this.formData == "MoreProduct") {
        const params = {
          ChannelCode: "6",
          ...this.ruleForm2
        };
        if (this.title == "新增管理员") {
          AddInfo(params)
            .then(this.globelReqHandle)
            .then(res => {
              if (res.Success) {
                this.$message("新增成功");
                this.dialogVisible = false;
                this.initTableData();
              }
            })
            .catch(this.globelErrHandle);
        } else {
          const params1 = {
            ChannelCode: "6",
            ...this.ruleForm2,
            Guid: this.Guid
          };
          UpdateInfo(params1)
            .then(this.globelReqHandle)
            .then(res => {
              if (res.Success) {
                this.$message("修改成功");
                this.dialogVisible = false;
                this.initTableData();
              }
            });
        }
      }
    },
    submitForm(formName) {
      let isGoOn = false;
      this.$refs[formName].validate(valid => {
        if (valid) isGoOn = true;
      });

      if (!isGoOn) return false;
      if (this.formData == "MoreProduct") {
        const params = {
          ChannelCode: "6",
          ...this.ruleForm2
        };
        if (this.title == "新增管理员") {
          AddInfo(params)
            .then(this.globelReqHandle)
            .then(res => {
              if (res.Success) {
                this.$message("新增成功");
                this.dialogVisible = false;
                this.initTableData();
              }
            })
            .catch(this.globelErrHandle);
        } else {
          const params1 = {
            ChannelCode: "6",
            ...this.ruleForm2,
            Guid: this.Guid
          };
          UpdateInfo(params1)
            .then(this.globelReqHandle)
            .then(res => {
              if (res.Success) {
                this.$message("修改成功");
                this.dialogVisible = false;
                this.initTableData();
              }
            });
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    delItem(index, scope) {
      let Guid = scope.Guid;
      let params = {
        Guid
      };
      DelInfo(params)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
    },
    editItem(index, scope) {
      this.title = "修改管理员信息";
      this.Guid = scope.Guid;
      this.dialogVisible = true;
      if (this.formData == "MoreProduct") {
        this.ruleForm2 = {
          AreaName: this.tableData[index].AreaName,
          PicName: this.tableData[index].Name,
          PicQQ: this.tableData[index].QQ,
          PicTel: this.tableData[index].Tel
        };
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      const params = {
        Type: "6",
        PageIndex: this.currentPage,
        PageNum: 10,
      };

      GetSellerList(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    }
  }
};
</script>



<style lang="scss" scoped>
.add_user {
  span {
    display: inline-block;
    width: 20%;
    margin-right: 5%;
  }
  .modal_input {
    width: 65%;
  }
}
</style>


