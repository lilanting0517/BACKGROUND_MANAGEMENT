<template>
  <div class="head_bar">
    <header>
      <div class="head_wrap clearfix">
        <a
          @click="toWhere"
          class="logo_wrap fl"
          href="javascript:;"
        >
          <h1 class="main_title"></h1>
        </a>
        <nav-menu
          class="head_left fl"
          :defaultActive="activeNav"
        >
          <menu-item
            :index="index1"
            :first="first1"
            @click="$router.push({name:name1})"
            v-if="hasGoodsFunction"
          >
            <a href="javascript:;">商品管理</a>
          </menu-item>
          <menu-item
            :index="index2"
            :first="first2"
            @click="$router.push({name: name2})"
            v-if="hasPlatformFunction"
          >
            <a href="javascript:;">平台管理</a>
          </menu-item>
          <menu-item
            :index="index3"
            :first="first3"
            @click="$router.push({name:name3})"
            v-if="hasCustomerFunction"
          >
            <a href="javascript:;">客服管理</a>
          </menu-item>
        </nav-menu>
        <ul
          class="head_right fr"
          @mouseleave="hideDialog"
        >
          <li
            class="fl"
            @mouseover="showSlide"
          >
            <span>您好 <span class="userName">{{userName}}</span>，欢迎登录大客户后台管理系统</span>
          </li>
          <li
            class="fl login_out"
            @click="logOut"
          >退出登录</li>
          <ul
            class="slide_area clearfix"
            v-show="isLogout"
          >
            <li>
              <span>账号：{{userName}}</span>
              <span
                class="fr changePwd"
                @click="changePwd"
              >修改密码</span>
            </li>
            <li>
              <span :title='CompanyName'>单位：{{CompanyName}}</span>
            </li>
          </ul>
        </ul>
      </div>
    </header>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal='false'
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
      >
        <el-form-item
          label="用户名称："
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            size="mini"
            style="width:80%;"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="请输入当前密码："
          prop="oldPwd"
        >
          <el-input
            ref="curPw"
            :type="showPwd"
            v-model="ruleForm.oldPwd"
            autocomplete="off"
            size="mini"
            style="width:80%;"
          ></el-input>
          <i :class="eyeShow"  @click="changePwdState('curPw')"></i>
        </el-form-item>
        <el-form-item
          label="请输入新密码："
          prop="pass"
        >
          <el-input
            ref="newPw"
            :type="showPwd1"
            v-model="ruleForm.pass"
            autocomplete="off"
            size="mini"
            style="width:80%;"
          ></el-input>
          <i :class="eyeShow1"  @click="changePwdState('newPw')"></i>
        </el-form-item>
        <el-form-item
          label="再次确认密码："
          prop="checkPass"
        >
          <el-input
            ref="cerPw"
            :type="showPwd2"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            size="mini"
            style="width:80%;"
          ></el-input>
          <i :class="eyeShow2"  @click="changePwdState('cerPw')"></i>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            size="small"
          >确定</el-button>
          <el-button @click="dialogVisible = false" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import bus from "@/bus";
import { mapState, mapMutations } from "vuex";
import { removeItem, getItem, setItem } from "@/common/js/util.js";
import NavMenu from "./nav/Menu";
import MenuItem from "./nav/MenuItem";
import { Logout, GetFuncList, ChangeUserPsd } from "@/api";
import { globelFnHanle } from "@/common/js/mixin";
export default {
  name: "HeadTop",
  data() {
    var validatePwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      index1: "",
      index2: "",
      index3: "",
      first1: null,
      first2: null,
      first3: null,
      name1: "",
      name2: "",
      name3: "",
      hasGoodsFunction: true,
      hasPlatformFunction: true,
      hasCustomerFunction: true,
      src: "./static/user.png",
      isLogout: false,
      userName: "",
      CompanyName: "",
      dialogVisible: false,
      ruleForm: {
        name:'',
        oldPwd:'',
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPwd: [{ validator: validatePwd, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      showPwd:'password',
      eyeShow:'eyeClose',
      showPwd1:'password',
      eyeShow1:'eyeClose',
      showPwd2:'password',
      eyeShow2:'eyeClose'
    };
  },
  mixins: [globelFnHanle],
  components: { NavMenu, MenuItem },
  computed: {
    ...mapState(["loading", "activeNav"])
  },
  created() {
    this.ruleForm.name = getItem("User").UserName;
  },
  mounted() {
    //本地存储存储成功之后再执行初始化头部导航方法
    bus.$on("successBack", data => {
      this.initHeader();
    });

    //  this.userName = getItem("User").UserName;
    if (getItem("User") != null) {
      this.userName = getItem("User").UserName;
      this.CompanyName = getItem("User").CompanyName;
    }

    //检测登录成功之后获取本地存储user信息
    bus.$on("login", data => {
      this.userName = getItem("User").UserName;
    });

    //检测权限修改之后header变化情况,然后重新登录
    bus.$on("headerChange", data => {
      this.initHeader();
      //若为自己则刷新当前页面
      // this.$router.go(0);
      // setTimeout(()=>{
      //   this.$message("权限修改成功，请重新登录");
      //   this.logOut();
      // },1000)
    });
  },
  methods: {
    ...mapMutations(["setLoading", "updateActiveNav"]),
    initHeader() {
      // this.logOut();
      const params = {
        UserId: getItem("User").UserId
      };
      //检测头部是否存在权限
      let checkGoodsArr = [];
      let checkPlatformArr = [];
      let checkCustomerArr = [];
      //得到左侧导航栏最小id值
      let goodsIdArr = [];
      let platformIdArr = [];
      let customerIdArr = [];
      //头部权限处理
      GetFuncList(params)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Data.length == 0) {
            this.$message.error("没有权限哦，请联系超级管理员");
          }

          //返回的权限排序
          var list = res.Data.sort(function(a, b) {
            return a.Id - b.Id;
          });

          res.Data.map(x => {
            const parent = x.ParentName;
            if (/频道维护|商品管理|首页配置/.test(parent)) {
              checkGoodsArr.push(true);
              //如果第一列有权限，得到对应id数组
              goodsIdArr.push(x.Id);
            }
            if (/用户管理|功能管理|订单信息/.test(parent)) {
              checkPlatformArr.push(true);
              //如果第二列有权限，得到对应id数组
              platformIdArr.push(x.Id);
            }
            if (/客服管理|客户购物信息/.test(parent)) {
              checkCustomerArr.push(true);
              //如果第二列有权限，得到对应id数组
              customerIdArr.push(x.Id);
            }
          });

          const menu = getItem("menu");
          const goods = menu.goods;
          const platform = menu.platform;
          const customer = menu.customer;
          //一系列if得到左侧最小id值
          if (goodsIdArr.length) {
            //取出id值去左侧导航找它的路由名字
            let idx = Math.min.apply(null, goodsIdArr);
            this.name1 = goods[idx - 2].name;
            this.first1 = idx - 1;
            this.index1 = "1-" + this.first1;
          }
          if (platformIdArr.length) {
            let idx = Math.min.apply(null, platformIdArr);
            this.name2 = platform[idx - 41].name;
            this.first2 = idx - 40;
            this.index2 = "2-" + this.first2;
          }
          if (customerIdArr.length) {
            let idx = Math.min.apply(null, customerIdArr);
            this.name3 = customer[idx - 61].name;
            this.first3 = idx - 60;
            this.index3 = "3-" + this.first3;
          }

          //一系列if判断头部导航功能是否显示
          if (checkGoodsArr.indexOf(true) == -1) {
            this.hasGoodsFunction = false;
          } else {
            this.hasGoodsFunction = true;
          }
          if (checkPlatformArr.indexOf(true) == -1) {
            this.hasPlatformFunction = false;
          } else {
            this.hasPlatformFunction = true;
          }
          if (checkCustomerArr.indexOf(true) == -1) {
            this.hasCustomerFunction = false;
          } else {
            this.hasCustomerFunction = true;
          }
        })
        .catch(this.globelErrHandle);
    },
    showSlide() {
      this.isLogout = true;
    },
    toWhere() {
      // if (this.name1 == "" && this.name2 !== "") {
      //   this.$router.push({ name: this.name2 });
      //   return false;
      // }
      // if (this.name1 == "" && this.name2 == "") {
      //   this.$router.push({ name: this.name3 });
      //   return false;
      // }
      // this.$router.push({ name: this.name1 });
    },
    hideDialog() {
      this.isLogout = false;
    },
    logOut() {
      const params = {
        Id: getItem("User").UserId
      };
      Logout(params)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Success) {
            //设置导航为第一个待修改
            // setItem("activeNav", "1-8");
            //删除不需要的本地存储信息
            removeItem("User");
            //左侧导航加载记录移除
            removeItem("num");
            //清除用户权限记录
            removeItem("menu");
            //清除导航记录
            removeItem("activeNav");
            this.$router.push({ name: "Login" });
          }
        })
        .catch(this.globelErrHandle);
    },
    changePwd() {
      this.dialogVisible = true;
    },
    //密码明文显示
    changePwdState(refName) {
      if(refName === 'curPw') {

        this.$refs[refName].type === 'text' ? this.showPwd = 'password' : this.showPwd = 'text';
        this.eyeShow === 'eye' ? this.eyeShow = 'eyeClose' : this.eyeShow = 'eye';

      } else if(refName === 'newPw') {

        this.$refs[refName].type === 'text' ? this.showPwd1 = 'password' : this.showPwd1 = 'text';
        this.eyeShow1 === 'eye' ? this.eyeShow1 = 'eyeClose' : this.eyeShow1 = 'eye';

      } else {

        this.$refs[refName].type === 'text' ? this.showPwd2 = 'password' : this.showPwd2 = 'text';
        this.eyeShow2 === 'eye' ? this.eyeShow2 = 'eyeClose' : this.eyeShow2 = 'eye';

      }

    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const params = {
            UserId: getItem("User").UserId,
            NewPsw: this.ruleForm.pass,
            OldPsw: this.ruleForm.oldPwd
          }

          ChangeUserPsd(params)
            .then(this.globelFnHanle)
            .then(({ Success, ErrorMsg}) => {
              if(Success) {
                this.$message('修改成功,请重新登录！');
                setTimeout(() => {
                  this.logOut();
                },1000)
              } else {
                this.$message.error(ErrorMsg);
              }
            })
            .catch(this.globelErrHandle)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  beforeRouteLeave(to, from, next) {},

};
</script>
<style lang="scss" scoped>
.head_bar {
  header {
    position: fixed;
    z-index: 100;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 8.7px 0.3px rgba(153, 179, 193, 0.26);

    .head_wrap {
      width: 1200px;
      height: 60px;
      margin: 0 auto;
      background-color: #ffffff;
      // box-shadow: 0 0 8.7px 0 rgba(153, 179, 193, 0.26);

      .logo_wrap {
        width: 200px;
        height: 60px;

        .main_title {
          position: relative;
          top: 50%;
          right: 0;
          bottom: 0;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          width: 168px;
          height: 25px;
          background-image: url(../../static/newLogo.jpg);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }
      .head_left {
        height: 100%;
        position: relative;

        li {
          height: 100%;
          float: left;
          a {
            height: 100%;
            display: inline-block;
            font-size: 16px;
            line-height: 60px;
            margin-left: 60px;
            color: #555;
          }
          a:hover {
            text-decoration: none;
          }
        }
        li.active {
          color: #168ce2;
          .bottom_border {
            display: block;
          }
          a {
            border-bottom: 2px solid #168ce2;
          }
        }
        .bottom_border {
          width: 75px;
          height: 2px;
          background-color: #168ce2;
          position: absolute;
          bottom: 0;
          left: 53px;
          display: none;
        }
        .position_one {
          left: 179px;
        }
        .position_two {
          left: 303px;
        }
      }
      .head_right {
        height: 100%;
        position: relative;
        li {
          margin-right: 8px;
          height: 100%;
          line-height: 60px;
        }
        .user {
          display: inline-block;
          width: 28px;
          height: 28px;
          -webkit-transform: none !important;
          -ms-transform: none !important;
          transform: none !important;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          vertical-align: middle;
          cursor: pointer;
        }
        .login_out {
          color: #999;
          margin-left: 10px;
          cursor: pointer;
        }
        .login_out:hover {
          color: #68bff6;
        }
        span {
          display: inline-block;
          font-size: 14px;
          vertical-align: middle;
          line-height: 28px;
          color: #999;
          height: 60px;
          line-height: 60px;
          cursor: pointer;

          .userName {
            color: #68bff6;
          }
        }
        .slide_area {
          background: #fff;
          position: absolute;
          z-index: 99;
          top: 100%;
          left: 50%;
          width: 360px;
          max-height: 300px;
          padding: 0 10px 20px 10px;
          border: solid 1px #e9f1f3;
          background-color: #fff;
          overflow: hidden;
          box-shadow: 0 0 6px 0 rgba(58, 120, 190, 0.08);
          -webkit-transform: translateX(-50%);
          -ms-transform: translateX(-50%);
          transform: translateX(-50%);

          li {
            float: left;
            width: 100%;
            height: 40px;
          }
          .changePwd {
            color: #68bff6;
            cursor: pointer;
          }
        }
      }
    }
  }
  .eye {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    background-size: 100% 100%;
    background-image: url("../../static/eye.png");
    vertical-align: middle;
    cursor: pointer;
  }
  .eyeClose {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    background-size: 100% 100%;
    background-image: url("../../static/eye-close.png");
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>

