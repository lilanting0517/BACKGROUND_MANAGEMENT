<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      <span>用户管理</span>
      <el-button size="mini" style="margin-left: 772px;" @click="addUser" type="primary">添加新用户</el-button>
    </h2>
    <h2 class="char_tit clearfix">
      <label for="">用户账号查询:</label>
      <el-input placeholder="输入用户名称/账号" class="MarginR" size="mini" style="width:200px;" v-model.trim="input"></el-input>
      <label for="">账号状态:</label>
      <el-select v-model.trim="value1" placeholder="请选择" size="mini" class="MarginR">
        <el-option v-for="item in state" :key="item.index" :label="item" :value="item">
        </el-option>
      </el-select>
      <label for="">用户类型:</label>
      <el-select v-model.trim="value2" placeholder="请选择" size="mini" class="MarginR">
        <el-option v-for="item in type" :key="item.index" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button plain size="mini" @click="searchUser">查找</el-button>
    </h2>
    <!-- 表格部分 -->
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" class="data_table" style="width: 100%" height="500">
        <el-table-column prop="Id" label="用户账号" align="center">
        </el-table-column>
        <el-table-column prop="Psw" label="密码" align="center" v-if='false'>
        </el-table-column>
        <el-table-column prop="Name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="Type" label="用户类型" align="center">
        </el-table-column>
        <el-table-column prop="CompanyName" label="单位名称" align="center">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="Tel" label="手机号" align="center">
        </el-table-column>
        <el-table-column prop="Operation" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="updateUser(scope.$index, scope.row)">修改</el-button>
            <el-popover
             :ref="`popover-${scope.$index}`"
              placement="top"
              v-model="scope.row.canDel"
              trigger="click"
            >
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteUser(scope.$index, scope.row)">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popover>
            <!-- <el-button type="text" @click="deleteUser(scope.$index, scope.row)">删除</el-button> -->
            <el-button type="text" @click="changeUserState(scope.$index, scope.row)" v-if=" scope.row.IsUse == '启用' ">封号</el-button>
            <el-button type="text" @click="changeUserState(scope.$index, scope.row)" v-else>解封</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>

    <!-- 新用户信息填写 -->
    <el-dialog title="添加新用户" :visible.sync="dialogFormVisible" class="addUserInfo" :close-on-click-modal='false'>
      <el-form :model="form" status-icon :rules="rules2" ref="form">
        <el-form-item label="用户账号:" :label-width="formLabelWidth" prop="userId">
          <el-input v-model.trim="form.userId" auto-complete="off" placeholder="请输入账号信息" size="mini" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" :label-width="formLabelWidth">
          <el-input
            :type="showPwd"
            v-model.trim="form.pwd"
            auto-complete="off"
            placeholder="请输入登录密码"
            size="mini"
            style="width:70%;"
          ></el-input>
          <i :class="eyeShow"  @click="changePwdState"></i>
        </el-form-item>
        <el-form-item label="单位名称:" :label-width="formLabelWidth" size="mini" prop="value">
          <el-select
            v-model.trim="form.value"
            filterable
            remote
            placeholder="请输入关键词选择单位名称"
            :remote-method="getCompany"
            @change="selectCom"
            :loading="loading2"
            style="width:70%;"
          >
            <el-option v-for="(item,index) in libList" :key="item.Dwmc" :label="item.Dwmc" :value="item.Dwmc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名:" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="form.name" auto-complete="off" placeholder="请输入用户姓名" size="mini" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" :label-width="formLabelWidth" prop="tel">
          <el-input v-model.trim="form.tel" auto-complete="off" placeholder="请输入手机号" size="mini" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="选择权限:" :label-width="formLabelWidth" size="mini">
          <el-select v-model.trim="choosedChannel" placeholder="请选择频道名称" style="width:70%;" multiple>
            <el-option v-for="(item,index) in channels" :key="item.name" :label="item.name" :value="item.name" @click.native="chooseChannel(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="能否导入退货单:" :label-width="formLabelWidth" size="mini">
          <el-select v-model.trim="isReturn" placeholder="请选择能否导入退货单" style="width:70%;">
            <el-option v-for="(item,index) in selectReturn" :key="item.index" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="handleSave('form')">确定添加</el-button>
      </div>
    </el-dialog>

    <!-- 模态框 封号-->
    <el-dialog
      title="封号"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      width="25%"
    >
      <h4>确认要对改用户进行{{stateMsg}}？</h4>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveState" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框修改-->
    <el-dialog title="修改用户信息" :visible.sync="dialogVisibleEdit" class="edit_user" :close-on-click-modal='false'>
      <el-form :model="form" status-icon :rules="rules2" ref="form">
        <el-form-item label="用户账号:" :label-width="formLabelWidth" prop="userId">
          <el-input v-model.trim="form.userId" auto-complete="off" placeholder="请输入账号信息" size="mini" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" :label-width="formLabelWidth">
          <el-input
            :type="showPwd"
            v-model.trim="form.pwd"
            auto-complete="off"
            placeholder="请输入登录密码"
            size="mini"
          ></el-input>
          <i :class="eyeShow"  @click="changePwdState"></i>
        </el-form-item>
        <el-form-item label="单位名称:" :label-width="formLabelWidth" size="mini" prop="value">
          <el-select
            v-model.trim="form.value"
            @change="selectCom"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词选择单位名称"
            :remote-method="getCompany"
            :loading="loading2"
            style="width:70%;"
          >
            <el-option v-for="(item,index) in libList" :key="item.Dwmc" :label="item.Dwmc" :value="item.Dwmc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名:" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="form.name" auto-complete="off" placeholder="请输入用户姓名" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" :label-width="formLabelWidth" prop="tel">
          <el-input v-model.trim="form.tel" auto-complete="off" placeholder="请输入手机号" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="选择权限:" :label-width="formLabelWidth" size="mini" style="margin-top:24px">
          <el-select v-model.trim="choosedChannel" placeholder="请选择频道名称" multiple>
            <el-option v-for="(item,index) in channels" :key="item.name" :label="item.name" :value="item.name" @click.native="chooseChannel(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="能否导入退货单:" :label-width="formLabelWidth" size="mini">
          <el-select v-model.trim="isReturn" placeholder="请选择能否导入退货单" style="width:70%;">
            <el-option v-for="(item,index) in selectReturn" :key="item.index" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="saveUpdate('form')">确定修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetUserList,
  ChangeUser,
  ChangeUserState,
  GetCompanyList
} from "@/api";
import { loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
export default {
  data() {
    var checkTel = (rule, value, callback) => {
      var re = /^1\d{10}$/;
      if (value === "") {
        callback(new Error("电话不能为空"));
      } else if (!re.test(value)) {
        callback(new Error("电话格式不对"));
      } else {
        if (this.form.tel !== "") {
          // this.$refs.ruleForm2.validateField("PicTel");
        }
        callback();
      }
    };
    var checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("姓名不能为空"));
      } else {
        if (this.form.name !== "") {
          // this.$refs.ruleForm2.validateField("PicName");
        }
        callback();
      }
    };
    var checkUserId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("用户名不能为空"));
      } else {
        if (this.form.name !== "") {
          // this.$refs.ruleForm2.validateField("PicName");
        }
        callback();
      }
    };
    var checkCompany = (rule, value, callback) => {
      if(value === '') {
        callback(new Error("单位名称不能为空"));
      } else {
        callback();
      }
    };

    return {
      state: ["封号", "未封号"],
      type: ["系统内", "系统外"],
      form: {
        userId: "",
        name: "",
        pwd: "",
        tel: "",
        value: ""
      },
      defaultform: {
        userId: "",
        name: "",
        pwd: "",
        tel: "",
        value: ""
      },
      rules2: {
        userId: [{ validator: checkUserId, trigger: "blur" }],
        name: [{ validator: checkName, trigger: "blur" }],
        tel: [{ validator: checkTel, trigger: "blur" }],
        value: [{ validator: checkCompany, trigger: "blur" }]
      },
      choosedChannel: [],
      handleChannel: [],
      value1: "",
      value2: "",
      params1:'',
      params2:'',
      tableData: [],
      libList: [],
      channels: [
        {
          name: "最新图书",
          code: 0
        },
        {
          name: "畅销图书",
          code: 1
        },
        {
          name: "主题活动",
          code: 1
        },
        {
          name: "重点产品",
          code: 2
        },
        {
          name: "大中专教材",
          code: 3
        },
        {
          name: "多元产品",
          code: 4
        },
        {
          name: "采访数据",
          code: 8
        }
      ],
      dialogVisible: false,
      formLabelWidth: "120px",
      dialogVisibleEdit: false,
      modalEditObj: {
        userLogin: "",
        region: ""
      },
      dialogFormVisible: false,
      UserId: "",
      IsUse: "",
      CompanyCode: "",
      InOut: "",
      input: "",
      currentPage: 1,
      total: null,
      loading2: false,
      selectReturn:[{
        label:'是',
        index:1
      },{
        label:'否',
        index:2
      }],
      isReturn:'否',
      return:0,
      query:'',
      timer: null,
      stateMsg:'封号',
      showPwd:'password',
      eyeShow:'eyeClose'
    };
  },
  created() {
    this.initTableData();
    // this.initCompanyList();
  },
  mixins: [loadingStatus, globelFnHanle1],
  methods: {
    //获取用户列表
    initTableData() {
      const params = {
        Search: "",
        RoleName: "",
        PageIndex: 1,
        PageNum: 10,
        State: "",
        Type: "",
        UserType: 2
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      const params = {
        Search: this.input.replace(/\s+/g,""),
        RoleName: "",
        PageIndex: this.currentPage,
        PageNum: 10,
        State: "",
        Type: "",
        UserType: 2
      };

      GetUserList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
        })
        .catch(this.globelErrHandle);
    },
    //获取单位列表
    /* Debounce(action, delay) {
      var timer = null;

      return function() {
          var self = this, args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function() {
            action.apply(self, args)
          }, delay);
      }
    }, */
    Debounce(method, time) {
      let timer = null;

      return function() {
        const context = this;

        //在函数执行的时候先清除timer定时器;
        clearTimeout(timer);

        timer = setTimeout(() => {
          method.call(context);
        }, time);
      };
    },
    getCompany(query) {

      this.query = query.replace(/\s+/g, "");

      if(this.query !== '') {
        this.loading2 = true;
      }

       this.remoteMethod();

    },
    remoteMethod() {
      const params = {
        Search: this.query,
        InOut: ""
      };

      GetCompanyList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.libList = res.Data;
          this.loading2 = false;
        })
        .catch(this.globelErrHandle);
    },
    selectCom(val) {
      let item = this.libList.filter(item => item.Dwmc === val);
      item = item[0];
      const {Dwbh} = item;

      this.CompanyCode = Dwbh;
      this.InOut = item.Inout == "内" ? 'I' : 'O';
    },
    closeAccountNumber() {
      this.dialogVisible = true;
    },
    chooseChannel(index) {},
    //删除用户
    deleteUser(index, row) {
      const params = {
        UserId: row.Id,
        Psw: row.Psw,
        CompanyName: row.CompanyName,
        Name: row.Name,
        Tel: row.Tel,
        Method: "delete",
        CompanyCode: this.CompanyCode,
        InOut: this.InOut,
        UserType: 2,
        RoleId: this.choosedChannel.join(",")
      };
      ChangeUser(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功！");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
    },
    //添加用户
    addUser() {
      this.form = {};
      this.choosedChannel = [];
      this.showPwd = 'password'
      this.eyeShow = 'eyeClose'
      this.dialogFormVisible = true;
    },
    handleSave(formName) {
      let isGoOn = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          isGoOn = true;
        }
      });
      if (!isGoOn) return false;

      this.choosedChannel.map(x => {
        switch (x) {
          case "最新图书":
            this.handleChannel.push(1);
            break;
          case "畅销图书":
            this.handleChannel.push(2);
            break;
          case "主题活动":
            this.handleChannel.push(3);
            break;
          case "重点产品":
            this.handleChannel.push(4);
            break;
          case "大中专教材":
            this.handleChannel.push(5);
            break;
          case "多元产品":
            this.handleChannel.push(6);
            break;
          case "采访数据":
            this.handleChannel.push(8);
            break;
        }
      });
      this.isReturn === '否' ? this.return = 0 : this.return = 1;
      const params = {
        UserId: this.form.userId,
        Psw: this.form.pwd,
        CompanyName: this.form.value,
        Name: this.form.name,
        Tel: this.form.tel,
        Method: "add",
        CompanyCode: this.CompanyCode,
        InOut: this.InOut,
        UserType: 2,
        RoleId: this.handleChannel.join(","),
        IsBackOrder : this.return
      };
      ChangeUser(params)
        .then(this.globelReqHandle)
        .then(({ Data, Success, ErrorMsg }) => {
          if (Success) {
            this.$message("新增成功！");
            this.dialogFormVisible = false;

            this.currentPage = 1;
            this.initTableData();
          } else {
            this.$message.error(ErrorMsg);
          }
        })
        .catch(this.globelErrHandle);
    },
    //修改用户信息
    updateUser(index, row) {

      this.dialogVisibleEdit = true;
      this.form.userId = row.Id;
      this.form.pwd = row.Psw;
      this.form.value = row.CompanyName;
      this.form.name = row.Name;
      this.form.tel = row.Tel;
      this.choosedChannel = [];
      this.showPwd = 'password';
      this.eyeShow = 'eyeClose';
      row.RoleId.map(x => {
        this.choosedChannel.push(x.name);
      });
      this.CompanyCode = row.CompanyCode;
      this.InOut = row.InOut;
    },
    saveUpdate(formName) {
      let isGoOn = false;
      this.$refs[formName].validate(valid => {
        if (valid) isGoOn = true;
      });
      if (!isGoOn) return false;
      this.handleChannel=[];
      this.choosedChannel.map(x => {
        switch (x) {
          case "最新图书":
            this.handleChannel.push(1);
            break;
          case "畅销图书":
            this.handleChannel.push(2);
            break;
          case "主题活动":
            this.handleChannel.push(3);
            break;
          case "重点产品":
            this.handleChannel.push(4);
            break;
          case "大中专教材":
            this.handleChannel.push(5);
            break;
          case "多元产品":
            this.handleChannel.push(6);
            break;
          case "采访数据":
            this.handleChannel.push(8);
            break;
        }
      });
      this.isReturn === '否' ? this.return = 0 : this.return = 1;
      const params = {
        UserId: this.form.userId,
        Psw: this.form.pwd,
        CompanyName: this.form.value,
        Name: this.form.name,
        Tel: this.form.tel,
        Method: "update",
        CompanyCode: this.CompanyCode,
        InOut: this.InOut,
        UserType: 2,
        RoleId: this.handleChannel.join(","),
        IsBackOrder : this.return
      };

      ChangeUser(params)
        .then(this.globelReqHandle)
        .then(({ Data, Success }) => {
          if (Success) {
            this.$message("修改成功");
            this.initTableData();
            this.currentPage = 1;
            this.dialogVisibleEdit = false;
          }
        })
        .catch(this.globelErrHandle);
    },
    //启用停用账号
    changeUserState(index, row) {
      this.dialogVisible = true;
      this.UserId = row.Id;
      if (row.IsUse == "启用") {
        this.stateMsg = '封号',
        this.IsUse = 0;
      } else {
        this.stateMsg = '解封',
        this.IsUse = 1;
      }
    },
    saveState() {
      this.dialogVisible = false;

      const params = {
        UserId: this.UserId,
        IsUse: this.IsUse
      };

      ChangeUserState(params)
        .then(this.globelReqHandle)
        .then(({ Data, Success }) => {
          if (Success) {
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
    },
    searchUser() {
      if (this.value1 == "封号") {
        this.params1 = 0;
      } else if (this.value1 == "未封号") {
        this.params1 = 1;
      }
      if (this.value2 == "系统内") {
        this.params2 = "I";
      } else if (this.value2 == "系统外") {
        this.params2 = "O";
      }
      const params = {
        Search: this.input.replace(/\s+/g,""),
        RoleName: "",
        PageIndex: 1,
        PageNum: 10,
        State: this.params1,
        Type: this.params2,
        UserType: 2
      };

      GetUserList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
        })
        .catch(this.globelErrHandle);
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
  margin-right: 0 !important;
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
