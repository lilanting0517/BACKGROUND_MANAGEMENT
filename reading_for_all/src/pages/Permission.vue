<template>
  <div class="main">
    <!-- 标题部分 -->
    <h3 class="char_tit clearfix">
      <p class="fl banner">后台权限管理</p>
      <el-button type="info" plain size="mini" class="fr" style="margin-right: 8px;margin-top: 9px;" @click="dialogFormVisible = true">新增管理员</el-button>
      <el-dialog title="信息填写" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="图书馆名称:" :label-width="formLabelWidth" size="mini">
            <el-select v-model="value" placeholder="请选择图书馆">
              <el-option v-for="item in libList" :key="item.index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名:" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入用户名" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="登录密码:" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.pwd" auto-complete="off" placeholder="请输入登录密码" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="saveAdminInfo" size="small">保存</el-button>
        </div>
      </el-dialog>
      <el-button type="info" plain size="mini" class="fr" style="margin-right: 8px;margin-top: 9px;" @click="searchByName">搜索</el-button>
      <span class="fr inputbox">
        <label for="">单位:</label>
        <el-input v-model="libName" placeholder="请输入单位ID/名称" class="" size="mini" style="width:200px;"></el-input>
      </span>
    </h3>
    <!-- 表格部分 -->
    <div class="tab_wrap">
      <el-table :data="tableData" ref="multipleTable" class="data_table" style="width: 100%" height="600" @selection-change="handleSelectionChange">
        <el-table-column type="selection" header-align="center">
        </el-table-column>
        <el-table-column prop="order" label="序号" header-align="center">
        </el-table-column>
        <el-table-column prop="USER_ID" label="单位ID" header-align="center">
        </el-table-column>
        <el-table-column prop="LIB_TYPE" label="图书馆单位名称" header-align="center">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button size="mini" @click="confirmDelete" style="margin-left: 8px;margin-top: 8px;">删除</el-button>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="dataTotalNum"
        :page-size="pageSize"
        @current-change="handleCurrentPage"
        class="fr pages"
      >
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" center>
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="deleteAdmin" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { globelFnHanle } from "@/common/js/mixin";
import {
  GetAllPermissonInfo,
  AddAdmin,
  DeletePermission,
  getLibyList
} from "@/api";
export default {
  name: "",
  data() {
    return {
      checked: false,
      dialogFormVisible: false,
      tableData: [],
      value: "",
      libName: "",
      libList: [],
      form: {
        name: "",
        pwd: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      pageIndex: 1,
      pageSize: 10,
      dataTotalNum: 0,
      Start: 1,
      End: 10,
      checked: false,
      multipleSelection: [],
      multipleSelectionAll: [],
      keySign: 'USER_ID',
      deleteDialogVisible: false
    };
  },
  mixins: [globelFnHanle],
  watch: {
    tableData(val, oldVal) {
      this.changePageRecordData(oldVal)

      setTimeout( item => {
        this.setSelectRow()
      }, 20)
    }
  },
  computed: {
    allSelect: function() {
      return this.multipleSelection.length === this.tableData.length;
    }
  },
  created() {
    // 初始化 banner 表格信息
    this.initTableData();
    this.getSelect();
  },
  components: {},
  methods: {
    initTableData() {

      const { Start, End } = this;
      const params = {
        Start,
        End,
        SearchContent:''
      }

      GetAllPermissonInfo(params)
        .then(this.globelReqHandle)
        .then(([data,Success, ErrMsg, total, ErrCode]) => {
          data.map((el, index) => {
            return (el.order =
              (this.pageIndex - 1) * this.pageSize + (index + 1));
          });

          this.dataTotalNum = total;
          this.tableData = data;
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
    //获取下拉框列表
    getSelect() {
      getLibyList()
        .then(this.globelReqHandle)
        .then(([data]) => {
          this.libList = data;
        })
        .catch(this.globelErrHandle);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //增加管理员信息
    saveAdminInfo() {
      const params = {
        data: {
          LibType: this.value,
          UserId: this.form.name,
          Pwd: this.form.pwd
        }
      };
      AddAdmin(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) {
            this.$message("新增成功");
            this.initTableData();
            this.value = ''
            this.form.name = ''
            this.form.pwd = ''
          }
        })
        .catch(this.globelErrHandle);
      this.dialogFormVisible = false;
    },
    //删除管理员信息
    confirmDelete() {
      this.changePageRecordData(this.tableData);
      if (this.multipleSelectionAll.length == 0) {
        this.$message("还没有选择需要删除的内容哦");
        return;
      } else {
        this.deleteDialogVisible = true;
      }
    },
    deleteAdmin() {
     this.deleteDialogVisible = false;
      let arr = [];
      this.multipleSelectionAll.map(item => {
        arr.push(item.USER_ID);
      });
      arr = arr.toString();
      const params = {
        data: {
          Id: arr
        }
      };
      DeletePermission(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) {
            this.$message("删除成功");
            this.Start = 1;
            this.End = 10;
            this.pageIndex = 1;
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
      this.dialogFormVisible = false;
    },
    //搜索
    searchByName() {

      const params = {
        Start:this.Start,
        End:this.End,
        SearchContent:this.libName
      }
      GetAllPermissonInfo(params)
        .then(this.globelReqHandle)
        .then(([data]) => {
          data.map((el, index) => {
            return (el.order =
              (this.pageIndex - 1) * this.pageSize + (index + 1));
          });

          this.tableData = data;
        })
        .catch(this.globelErrHandle);
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
      this.multipleSelectionAll .forEach(row=>{
        selectAllIds.push(row[idKey]);
      })
      //遍历选中
      this.$refs.multipleTable.clearSelection();
      for(let i = 0; i < selectAllIds.length; i++) {
        for(let j = 0; j < this.tableData.length; j++) {
          if ( selectAllIds[i].indexOf(this.tableData[j][idKey]) >= 0 ) {
            this.$refs.multipleTable.toggleRowSelection(this.tableData[j], true);
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
      this.multipleSelectionAll.forEach(row=>{
        selectAllIds.push(row[idKey]);
      })
      let selectIds = []
      // 获取当前页选中的id
      this.multipleSelection.forEach(row=>{
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      })
      let noSelectIds = [];
      // 得到当前页没有选中的id
     oldVal.forEach(row=>{
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      })
      noSelectIds.forEach(id=>{
        if (selectAllIds.indexOf(id) >= 0) {
          for(let i = 0; i< that.multipleSelectionAll.length; i ++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      })
    },
    //分页
    handleCurrentPage(val) {
      this.pageIndex = val
      const { pageSize } = this;
      this.Start = (val - 1) * pageSize + 1;
      // debugger
      this.End = val * pageSize


      this.initTableData();
    },
  }
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
label {
  font-size: 14px;
  color: #555555;
}
.inputbox {
  line-height: 44px;
  margin-right: 5px;
}
.el-form-item {
  margin-bottom: 15px;
}
.el-table__row{
  height: 54px;
}
</style>
