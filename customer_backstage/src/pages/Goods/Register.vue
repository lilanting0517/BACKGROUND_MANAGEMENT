<template>
  <section class="login">
    <div class="login_wrap">
      <div class="login_con clearfix">
        <div class="login_img"></div>
        <div class="form_data">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm form_det">
            <el-form-item label="图书馆名称:" prop="Libname">
              <el-select placeholder="请选择活动区域" size="mini">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="登录账号:" prop="user">
              <el-input size="mini" v-model.trim="ruleForm.user" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="登录密码:" prop="pass">
              <el-input size="mini" v-model.trim="ruleForm.pass" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="submitForm('ruleForm2')">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <p></p>

      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "Register",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    let validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      ruleForm: {
        user: "",
        pass: "",
        Libname: ""
      },
      rules: {
        user: [{ validator: validatePass, trigger: "blur" }],
        pass: [{ validator: validatePass1, trigger: "blur" }],
        Libname: [{ validator: validatePass2, trigger: "click" }]
      },
      time: 3
    };
  },
  created() {
    this.$store.commit("setIsRegisterOrLogin", false);
  },
  computed: {},
  methods: {
    submitForm(formName) {
      var timer = setInterval(() => {
        this.time--;
        if (this.time == 0) {
          clearInterval(timer);
        }
      }, 1000);
      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 3000);
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
// <style lang="scss">
// body,
// html {
//   height: 100%;
// }
// .login {
//   width: 100%;
//   height: 100%;
//   background-color: #f3f3f3;

//   &::before {
//     content: "";
//     display: inline-block;
//     width: 0;
//     height: 100%;
//     vertical-align: middle;
//   }

//   .login_wrap {
//     width: 100%;
//     height: 460px;
//     display: inline-block;
//     vertical-align: middle;

//     .login_con {
//       width: 370px;
//       height: 460px;
//       border-radius: 8px;
//       background: #fff;
//       margin: 0 auto;

//       .login_img {
//         width: 150px;
//         height: 110px;
//         margin: 0 auto;
//         background-image: url("../../assets/logo_login.png");
//         background-repeat: no-repeat;
//         background-size: 100% 100%;
//         margin-top: 40px;
//       }
//       .form_data {
//         position: relative;
//         .form_det {
//           position: absolute;
//           top: 180px;
//           left: 46%;
//           transform: translate(-50%, -50%);

//           .el-form-item__label {
//             color: #999999;
//           }
//           .el-input--mini {
//             width: 240px;
//           }
//           .el-button--primary {
//             width: 240px;
//           }
//           .mt {
//             margin-top: 25px;
//           }
//           .searchbox_user {
//             width: 240px;
//             height: 32px;
//             background-color: #ffffff;
//             font-size: 14px;
//             margin-bottom: 10px;

//             .el-input__inner {
//               background: url(../../assets/pic.png) no-repeat 0 0;
//               background-position: 7px 5px;
//               padding-left: 30px;
//             }
//           }
//           .searchbox_pwd {
//             width: 240px;
//             height: 32px;
//             background-color: #ffffff;
//             font-size: 14px;
//             margin-bottom: 10px;

//             .el-input__inner {
//               background: url(../../assets/lock.png) no-repeat 0 0;
//               background-position: 7px 5px;
//               padding-left: 30px;
//             }
//           }
//           .register_btn {
//             width: 240px;
//             height: 32px;
//             background-color: #168ce2;
//             color: #ffffff;
//             margin-top: 20px;
//           }
//         }
//       }
//     }
//   }
// }
// </style>
