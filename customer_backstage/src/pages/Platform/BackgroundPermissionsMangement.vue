<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      <span>后台用户权限管理</span>
      <el-button
        size="mini"
        class="fr add_btn"
        @click="addUser"
        type="primary"
      >新增管理员</el-button>
    </h2>
    <h2 class="char_tit clearfix">
      <label for="">角色名称:</label>
      <el-input
        placeholder="输入用户名称/账号"
        class="MarginR"
        size="mini"
        style="width:200px;"
        v-model.trim="searchForm.roleName"
      ></el-input>
      <label for="">用户账号:</label>
      <el-input
        placeholder="输入用户名称/账号"
        class="MarginR"
        size="mini"
        style="width:200px;"
        v-model.trim="searchForm.admin"
      ></el-input>
      <el-button
        size="mini"
        @click="searchAdmin"
      >查找</el-button>
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
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column
          type="selection"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Id"
          label="用户账号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="CompanyName"
          label='单位名称'
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="RoleName"
          label="角色名称"
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
              @click="changeAdminInfo(scope.$index,scope.row)"
            >修改信息</el-button>
            <el-button
              type="text"
              @click="turnUser(scope.$index,scope.row)"
            >修改权限</el-button>
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
        style="margin-left:15px;"
        @click="deleteDialogVisible = true"
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
    <!-- 模态框新增-->
    <el-dialog
      title="新增管理员"
      :visible.sync="dialogVisibleAdd"
      width="30%"
      class="add_user"
      :close-on-click-modal='false'
    >

      <el-form
        :model="modalAddInObj"
        :rules="inRules"
        ref="modalAddInObj"
        label-width="100px"
      >
        <el-form-item
          label="用户名称:"
          prop="userName"
        >
          <el-input
            placeholder="请输入账号信息"
            v-model.trim="modalAddInObj.userName"
            class="modal_input"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="登录密码:"
          prop="userPassword"
        >
          <el-input
            placeholder="请设置登录密码"
            v-model.trim="modalAddInObj.userPassword"
            class="modal_input"
            size="mini"
            :type="showPwd"
          ></el-input>
          <i :class="eyeShow"  @click="changePwdState"></i>
        </el-form-item>
        <el-form-item
          label="所属角色:"
          prop="userRole"
        >
          <el-select
            v-model.trim="modalAddInObj.userRole"
            placeholder="请选择角色名称"
            size="mini"
            class="modal_input"
          >
            <el-option
              v-for="(item,index) in options"
              :key="item.index"
              :label="item.Name"
              :value="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="单位:"
          prop="value"
        >
          <el-select
            v-model.trim="modalAddInObj.value"
            size="mini"
            class="modal_input"
            remote
            filterable
            :remote-method="remoteMethod"
            placeholder="请输入关键词"
            :loading='loading2'
          >
            <el-option
              :value="item.Dwmc"
              v-for="(item,index) in store"
              :key="item.Dwmc"
              :label="item.Dwmc"
              @click.native="selectOut(item)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="add_Admin('modalAddInObj')"
            size="mini"
          >确定</el-button>
          <el-button
            @click="dialogVisibleAdd = false"
            size="mini"
          >取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <!-- 模态框修改-->
    <el-dialog
      title="修改管理员信息"
      :visible.sync="dialogVisibleUpdate"
      width="30%"
      class="add_user"
      :close-on-click-modal='false'
    >

      <el-form
        :model="modalupdateObj"
        :rules="inRules"
        ref="modalupdateObj"
        label-width="100px"
      >
        <el-form-item
          label="用户名称:"
          prop="userName"
        >
          <el-input
            placeholder="请输入账号信息"
            v-model.trim="modalupdateObj.userName"
            class="modal_input"
            size="mini"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="登录密码:"
          prop="userPassword"
        >
          <el-input
            placeholder="请设置登录密码"
            v-model.trim="modalupdateObj.userPassword"
            class="modal_input"
            size="mini"
            :type="showPwd"
          ></el-input>
          <i :class="eyeShow"  @click="changePwdState"></i>
        </el-form-item>
        <el-form-item
          label="所属角色:"
          prop="userRole"
        >
          <el-select
            v-model.trim="modalupdateObj.userRole"
            placeholder="请选择角色名称"
            size="mini"
            class="modal_input"
          >
            <el-option
              v-for="(item,index) in options"
              :key="item.index"
              :label="item.Name"
              :value="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="单位:"
          prop="value"
        >
          <el-select
            v-model.trim="modalupdateObj.value"
            size="mini"
            class="modal_input"
            remote
            filterable
            :remote-method="remoteMethod"
            placeholder="请输入关键词"
            :loading='loading2'
          >
            <el-option
              :value="item.Dwmc"
              v-for="(item,index) in store"
              :key="item.Dwmc"
              :label="item.Dwmc"
              @click.native="selectOut(item)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="update_Admin('modalupdateObj')"
            size="mini"
          >确定</el-button>
          <el-button
            @click="dialogVisibleUpdate = false"
            size="mini"
          >取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :close-on-click-modal='false'
    >
      <span>确定删除吗？</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="removeUser()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import {
  globelFnHanle,
  globelFnHanle1,
  checkAll,
  loadingStatus
} from "@/common/js/mixin";
import {
  GetRoleFuncList,
  GetAllRoleInfo,
  ChangeUser,
  GetUserList,
  ChangeAdminUser,
  GetCompanyList
} from "@/api";
export default {
  name: "",
  data() {
    return {
      loading2:false,
      tableData: [],
      store: [],
      pageIndex: 1,
      pageSize: 15,
      modalAddInObj: {
        userName: "",
        userPassword: "",
        userRole: "",
        RoleId: "",
        value: ""
      },
      modalupdateObj: {
        userName: "",
        userPassword: "",
        userRole: "",
        RoleId: "",
        value: ""
      },
      searchForm: {
        admin: "",
        roleName: ""
      },
      checked: false,
      dialogVisibleAdd: false,
      multipleSelection: [],
      options: [],
      total: null,
      currentPage: 1,
      activeName: "first",
      CompanyCode: "",
      deleteDialogVisible: false,
      inRules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" }
        ],
        userRole: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        value: [{ required: true, message: "请输入单位名称", trigger: "blur" }]
      },
      dialogVisibleUpdate: false,
      showPwd:'password',
      eyeShow:'eyeClose'
    };
  },
  mixins: [globelFnHanle, globelFnHanle1, checkAll, loadingStatus],
  mounted() {
    // 初始化 banner 表格信息
    this.initTableData();
    this.initListData();
    this.initData();
  },
  methods: {
    initData() {
      this.setLoading(true);
      const params = {
        Search: this.searchForm.admin.replace(/\s+/g,""),
        RoleName: this.searchForm.roleName.replace(/\s+/g,""),
        PageIndex: this.currentPage,
        PageNum: 10,
        State: "",
        Type: "",
        UserType: 1
      };

      GetUserList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    initTableData() {
      const params = {
        RoleId: 2
      };
      GetRoleFuncList(params)
        .then(this.globelReqHandle1)
        .then(data => {})
        .catch(this.globelErrHandle);
    },
    initListData() {
      const params = {
        RoleId: ""
      };
      GetAllRoleInfo(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.options = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    remoteMethod(query) {
      if(query !== '') {
        this.loading2 = true;
      }

     const params = {
        Search: query.replace(/\s+/g, ""),
        InOut: "I"
      };

      GetCompanyList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.store = res.Data;
          this.loading2 = false;
        })
        .catch(this.globelErrHandle);
    },
    selectCom(val) {
      let item = this.store.filter(item => item.Dwmc === val);
      item = item[0];
      const {Dwbh} = item;

      this.CompanyCode = Dwbh;

    },
    selectOut(item) {
      this.CompanyCode = item.Dwbh;
    },
    searchAdmin() {
      this.setLoading(true);
      const params = {
        Search: this.searchForm.admin,
        RoleName: this.searchForm.roleName,
        PageIndex: this.currentPage,
        PageNum: 10,
        State: "",
        Type: "",
        UserType: 1
      };

      GetUserList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.setLoading(false);
          this.currentPage = 1;
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },
    addUser() {
      this.modalAddInObj = {};
      this.showPwd = 'password';
      this.eyeShow = 'eyeClose';
      this.dialogVisibleAdd = true;
    },
    removeUser() {
      let roleArr = [];
      this.multipleSelection.map(x => {
        roleArr.push(x.Id);
      });
      const params = {
        UserId: roleArr.join(","),
        Psw: "",
        CompanyName: "",
        Name: "",
        Tel: "",
        Method: "delete",
        CompanyCode: "",
        InOut: "I",
        UserType: 1,
        RoleId: ""
      };
      ChangeUser(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initData();
            this.deleteDialogVisible = false;
          }
        })
        .catch(this.globelErrHandle);
    },
    add_Admin(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.options.map(x => {
            if (this.modalAddInObj.userRole === x.Name) {
              this.modalAddInObj.RoleId = x.Code;
            }
          });
          var params = {
            UserId: this.modalAddInObj.userName,
            Psw: this.modalAddInObj.userPassword,
            CompanyName: this.modalAddInObj.value,
            Name: "",
            Tel: "",
            Method: "add",
            CompanyCode: this.CompanyCode,
            InOut: "I",
            UserType: 1,
            RoleId: this.modalAddInObj.RoleId
          };

          ChangeUser(params)
            .then(this.globelReqHandle1)
            .then(res => {
              if (res.Success) {
                this.$message("新增成功！");
                this.dialogVisibleAdd = false;
                this.initData();
              }
            })
            .catch(this.globelErrHandle);
        } else {
          this.$message.error("添加失败！");
          return false;
        }
      });
    },
    update_Admin(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.options.map(x => {
            if (this.modalupdateObj.userRole === x.Name) {
              this.modalupdateObj.RoleId = x.Code;
            }
          });
          var params = {
            UserId: this.modalupdateObj.userName,
            Psw: this.modalupdateObj.userPassword,
            CompanyName: this.modalupdateObj.value,
            Name: "",
            Tel: "",
            Method: "update",
            CompanyCode: this.CompanyCode,
            InOut: "I",
            UserType: 1,
            RoleId: this.modalupdateObj.RoleId
          };

          ChangeUser(params)
            .then(this.globelReqHandle1)
            .then(res => {
              if (res.Success) {
                this.$message("修改成功！");
                this.dialogVisibleUpdate = false;
                this.initData();
              }
            })
            .catch(this.globelErrHandle);
        } else {
          this.$message.error("修改失败！");
          return false;
        }
      });
    },
    turnUser(index, row) {
      this.$router.push({
        name: "backgroundpermissionsmangementedit",
        query: {
          id: this.tableData[index].Id,
          roleName: row.RoleName
        }
      });
    },
    changeAdminInfo(index, row) {
      this.dialogVisibleUpdate = true;
      this.modalupdateObj.userName = row.Id;
      this.modalupdateObj.userPassword = row.Psw;
      this.modalupdateObj.userRole = row.RoleName;
      this.modalupdateObj.RoleId = row.RoleId;
      this.modalupdateObj.value = row.CompanyName;
      this.showPwd = 'password';
      this.eyeShow = 'eyeClose';
    },
    //密码明文显示
    changePwdState() {
      this.eyeShow === 'eye' ? this.eyeShow = 'eyeClose' : this.eyeShow = 'eye';
      this.showPwd === 'password' ? this.showPwd = 'text' : this.showPwd = 'password';
    }
  }
};
</script>


<style lang="scss" scoped>

label {
  font-size: 14px;
  color: #555555;
}
.MarginR {
  margin-right: 20px;
}
.tab_wrap {
  a {
    color: #56bbfc;
    text-decoration: none;
    font-size: 12px;
  }
}
.add_btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
.add_user {
  span {
    display: inline-block;
    width: 20%;
    margin-right: 5%;
  }
  div {
    margin-bottom: 10px;
  }
  .modal_input {
    width: 65%;
  }
  .eye {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    background-size: 100% 100%;
    background-image: url("../../../static/eye.png");
    vertical-align: middle;
    cursor: pointer;
  }
  .eyeClose {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    background-size: 100% 100%;
    background-image: url("../../../static/eye-close.png");
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
