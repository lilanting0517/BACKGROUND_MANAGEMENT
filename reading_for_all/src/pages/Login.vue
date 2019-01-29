<template>
  <section class="login">
    <div class="login_wrap">
      <div class="login_con clearfix">
        <div class="login_img"></div>
        <div class="form_data">
          <el-form action="javascript:;" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="form_det">
            <el-form-item prop="name">
              <template>
                <div class="tags">用户名：</div>
                <el-input size="mini" v-model="ruleForm.name" auto-complete="off" placeholder="请输入用户名" class="searchbox_user"></el-input>
              </template>
            </el-form-item>
            <el-form-item prop="pass">
              <template>
                <div class="tags">密码：</div>
                <el-input size="mini" v-model="ruleForm.pass" type="password" placeholder="请输入密码" class="searchbox_pwd" @keyup.enter.native="submitForm('ruleForm')"></el-input>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="submitForm('ruleForm')" class="login_btn">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { LoginData } from "@/api";
import { setItem } from "@/common/js/util";
export default {
  name: "Login",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    let validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        pass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        name: [{ validator: validatePass1, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const Id = this.ruleForm.name;
          const Psw = this.ruleForm.pass;
          let data = {
            Data: {
              UserId: Id,
              Psw: Psw,
              LoginType: "Admin"
            }
          };

          LoginData(data)
            .then(res => {
              const User = {
                ...res.data
              };
              let data = {
                banner: false,
                news: false,
                all: false,
                classify: false
              };
              if (res.data.UserType == "news") {
                data = {
                  banner: false,
                  news: true,
                  all: false,
                  classify: true
                };
              } else {
                data = {
                  banner: true,
                  news: true,
                  all: true,
                  classify: true
                };
              }
              setItem("userType", data);
              setItem("User", User);
              if (res.Success) {
                let userMessage = JSON.parse(localStorage.getItem("userType"));
                if (userMessage.news) {
                  this.$message("登录成功");
                  this.$router.push({ name: "News" });
                }
                if (userMessage.all) {
                  this.$message("登录成功");
                  this.$router.push({ name: "BannerManage" });
                }
              }
            })
            .catch(err => console.log(err));
        } else {
          alert("提交失败");
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
        margin-top: 50px;
      }
      .form_data {
        position: relative;
        .form_det {
          margin-top: 30px;
          .el-form-item__content {
            left: 50%;
            width: 300px;
            margin-left: -150px !important;
          }
          .tags {
            font-size: 14px;
            color: #999999;
            line-height: 24px;
          }
          .login_btn {
            width: 300px;
            height: 32px;
            margin-top: 20px;
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
