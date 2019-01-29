<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      <span>馆藏数据推荐文件列表</span>
      <el-upload
        class="fr"
        :data="data"
        :on-success="handleSuccess"
        :on-error='handleError'
        multiple
        :show-file-list='false'
        :file-list="fileList"
        size="mini"
        :before-upload="beforeUpload"
        :action="Api.uploadUrl + '/ImportFile/ImportFile'"
      >
        <el-button
          size="mini"
          type="primary"
        >上传文件</el-button>
      </el-upload>
    </h2>
    <h2 class="char_tit clearfix">
      <label for="">文件名称:</label>
      <el-input
        placeholder="请输入文件名称查询"
        class="MarginR"
        size="mini"
        style="width:200px;"
        v-model.trim="input"
      ></el-input>
      <el-button
        plain
        size="mini"
        @click="searchFile"
      >查找</el-button>
    </h2>
    <!-- 表格部分 -->
    <div
      class="tab_wrap"
      v-loading="false"
    >
      <el-table
        :data="tableData"
        class="data_table"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        style="width: 100%"
        height="500"
        v-loading='loading'
      >
        <el-table-column
          type="selection"
          align="center"
          width="60px"
        >
        </el-table-column>
        <el-table-column
          label="序号"
          align="center"
          width="80px"
          type="index"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column
          prop="FileName"
          label="文件名称"
          align="center"
          width="250px"
        >
        </el-table-column>
        <el-table-column
          prop="UserId"
          label="上传操作人员"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="UploadTime"
          label="上传时间"
          align="center"
          width="200px"
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
              @click="openDialog(scope.$index,scope.row)"
            >{{scope.row.state}}</el-button>
            <el-popover
              :ref="`popover-${scope.$index}`"
              placement="top"
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
                  @click="deleteUser(scope.$index, scope.row)"
                >确定</el-button>
              </div>
              <el-button
                type="text"
                slot="reference"
              >删除</el-button>
            </el-popover>
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
        class="deleteBtn"
        @click="deleteItemConfirm"
      >删除</el-button>
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

    <!-- 启用停用弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal='false'
    >
      <span>您确定{{isUseMsg}}所选文件吗？</span>
      <span slot="footer">
        <el-button
          @click="dialogVisible = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="changeIsUse"
          size="small"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确认删除弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :close-on-click-modal='false'
    >
      <span>确定删除所选文件吗？</span>
      <span slot="footer">
        <el-button
          @click="deleteDialogVisible = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="batchDelete"
          size="small"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetUserList,
  collectionGetList,
  collectionDelInfo,
  collectionIsUse
} from "@/api";
import { loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
import Api from "../../config";
import { getItem, spliceToken } from "../../common/js/util";
export default {
  data() {
    return {
      input: "",
      tableData: [],
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      multipleSelectionAll: [],
      keySign: "Guid",
      PageNum: 10,
      dialogVisible: false,
      deleteDialogVisible: false,
      fileList: [],
      data: {},
      IsUse: 0,
      Guid: "",
      isUseMsg: "",
      Api
    };
  },
  created() {
    this.initTableData();
  },
  mixins: [loadingStatus, globelFnHanle1],
  watch: {
    tableData(val, oldVal) {
      if (!val.length) return false;
      this.changePageRecordData(oldVal);

      setTimeout(item => {
        this.setSelectRow();
      }, 20);
    }
  },
  computed: {
    allSelect: function() {
      return this.multipleSelection.length === this.tableData.length;
    }
  },
  methods: {
    initTableData() {
      const params = {
        PageIndex: this.currentPage,
        PageNum: 10,
        IsUse: "",
        FileName: this.input.replace(/\s+/g, "")
      };

      collectionGetList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          const { Data } = res;
          // this.tableData = res.Data;
          const arr = Data.map(item => {
            if (item.IsUse === "1") {
              item.state = "停用";
            } else {
              item.state = "启用";
            }

            return item;
          });

          this.tableData = arr;

          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    searchFile() {
      this.currentPage = 1;
      this.initTableData();
    },
    indexMethod(index) {
      return index + 1 + this.PageNum * (this.currentPage - 1);
    },
    handleCurrentChange(val) {
      this.currentPage = val;

      this.initTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //单个删除
    deleteUser(index, row) {
      const params = {
        Guid: row.Guid
      };

      collectionDelInfo(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功！");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
    },
    // 批量删除
    batchDelete() {
      this.changePageRecordData(this.tableData);
      const arr = [];
      this.multipleSelectionAll.map(item => {
        arr.push(item.Guid);
      });
      const params = {
        Guid: arr.join()
      };
      collectionDelInfo(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功！");
            this.initTableData();
            this.deleteDialogVisible = false;
          } else {
            this.$message.error("删除失败！");
            this.deleteDialogVisible = false;
          }
        })
        .catch(this.globelErrHandle);
    },
    //停用/启用
    openDialog(index, row) {
      this.dialogVisible = true;
      if (row.IsUse === "1") {
        this.isUseMsg = "停用";
      } else {
        this.isUseMsg = "启用";
      }
      this.IsUse = row.IsUse;
      this.Guid = row.Guid;
    },
    changeIsUse() {
      let state;
      this.IsUse === "1" ? (state = 0) : (state = 1);
      const params = {
        Guid: this.Guid,
        IsUse: state
      };

      collectionIsUse(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("操作成功！");
            this.initTableData();
            this.dialogVisible = false;
          }
        })
        .catch(this.globelErrHandle);
    },
    // 全选框
    handleSelectionAllChange(tableData) {
      const isChecked = !this.allSelect;
      if (tableData) {
        tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, isChecked);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    deleteItemConfirm() {
      if (this.multipleSelection.length === 0) {
        this.$message("还没有选择需要删除的内容哦");
        return false;
      } else {
        this.deleteDialogVisible = true;
      }
    },
    //上传文件
    handleSuccess() {
      this.$message("上传成功！");
      this.initTableData();
    },
    handleError() {
      this.$message.error("上传出错啦！");
    },
    beforeUpload(file) {
      const isExcel = /\.xls$|\.xlsx$/.test(file.name);

      if (!isExcel) {
        this.$message.error("上传文件只能是excel格式!");
      }

      return isExcel;
    },
    //设置选中方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      //标识当前行的唯一键名称
      let idKey = this.keySign;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      //遍历选中
      this.$refs.multipleTable.clearSelection();
      for (let i = 0; i < selectAllIds.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (selectAllIds[i].indexOf(this.tableData[j][idKey]) >= 0) {
            this.$refs.multipleTable.toggleRowSelection(
              this.tableData[j],
              true
            );
          }
        }
      }
    },
    // 记忆选择核心方法
    changePageRecordData(oldVal) {
      // 标识当前行的唯一键的名称
      let idKey = this.keySign;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      oldVal.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
  },
  mounted() {
    const self = this;
    const getUserInfo = () => {
      const User = getItem("User");

      if (User) {
        let { UserId, UserType } = User;

        return {
          UserId: UserId,
          UserType
        };
      } else {
        return {
          login: false
        };
      }
    };
    const User = getUserInfo();
    const timeStamp = +new Date();

    let params = {
      Data: {
        UserId: User.UserId
      }
    };
    const fetchDataJson = params;

    const Defaults = {
      Token: spliceToken(timeStamp, fetchDataJson),
      UserId: User.UserId,
      UserType: User.UserType,
      TimeSpan: timeStamp
    };

    Defaults.Data = Object.assign({}, Defaults.Data, params.Data);
    this.data.Data = JSON.stringify(Defaults);

  }
};
</script>
<style lang="scss" scoped>
label {
  font-size: 14px;
  margin-right: 0 !important;
  color: #555555;
}
.MarginR {
  margin-right: 20px;
}
.deleteBtn {
  margin-left: 20px;
}
</style>
