<template>
  <section class="login">
    <div class="login_wrap">
      <div class="login_con clearfix">
        <div class="login_img"></div>
        <div class="form_data">

          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm form_det">
            <el-form-item prop="" class="tags">
              <template>
                <div class="labels">图书馆名称:</div>
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域" size="mini">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item prop="user" class="tags">
              <template>
                <div class="labels">登录账号：</div>
                <el-input size="mini" v-model="ruleForm.user" auto-complete="off" class="searchbox_user" placeholder="请输入账号"></el-input>
              </template>
            </el-form-item>
            <el-form-item prop="pass" class="tags">
              <template>
                <div class="labels">登录密码：</div>
                <el-input size="mini" v-model="ruleForm.pass" type="password" class="searchbox_pwd" placeholder="请输入密码"></el-input>
              </template>
            </el-form-item>
            <el-form-item class="loginBtn">
              <el-button type="primary" size="mini" @click="submitForm('ruleForm')" class="register_btn">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
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

    return {
      value: "",
      ruleForm: {
        user: "",
        pass: "",
        region: ""
      },
      rules: {
        user: [{ validator: validatePass, trigger: "blur" }],
        pass: [{ validator: validatePass1, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;

  &::before {
    content: "";
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
  }

  .login_wrap {
    width: 100%;
    height: 460px;
    display: inline-block;
    vertical-align: middle;

    .login_con {
      width: 370px;
      height: 460px;
      border-radius: 8px;
      background: #fff;
      margin: 0 auto;

      .login_img {
        width: 150px;
        height: 110px;
        margin: 0 auto;
        background-image: url("../assets/logo_login.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-top: 33px;
      }
      .form_data {
        position: relative;
        .form_det {
          margin-top: 10px;
          .el-form-item__content {
            left: 50%;
            width: 300px;
            margin-left: -150px !important;
          }
          .tags {
            font-size: 14px;
            color: #999999;
            line-height: 24px;
            margin: 10px;
          }
          .labels {
            height: 30px;
          }
          .register_btn {
            width: 300px;
            height: 32px;
            margin-top: 10px;
          }
          .searchbox_user {
            .el-input__inner {
              background: url(../assets/pic.png) no-repeat 0 0;
              background-position: 7px 5px;
              padding-left: 30px;
            }
          }
          .searchbox_pwd {
            .el-input__inner {
              background: url(../assets/lock.png) no-repeat 0 0;
              background-position: 7px 5px;
              padding-left: 30px;
            }
          }
        }
      }
    }
  }
}
</style>
