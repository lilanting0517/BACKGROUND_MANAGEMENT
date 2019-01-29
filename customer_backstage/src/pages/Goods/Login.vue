<template>
  <section class="login">
    <div class="login_wrap clearfix">
      <div class="login_pic fl"></div>
      <div class="login_con fl">

        <div class="login_img"></div>
        <div class="form_data">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="90px"
            class="form_det"
          >
            <el-form-item
              prop="name"
              label="用户名："
              class="tags"
            >
              <el-input
                size="mini"
                v-model.trim="ruleForm.name"
                auto-complete="off"
                class="searchbox_user"
                placeholder="请输入用户名"
                @keyup.native.13="handleKeyupAccount($event)"
                style="width:250px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="pass"
              label="密码："
              class="tags"
            >
              <el-input
                type="password"
                size="mini"
                v-model.trim="ruleForm.pass"
                auto-complete="off"
                class="searchbox_pwd"
                placeholder="请输入密码"
                @keyup.native.13="handleKeyupPassword($event)"
                ref="password"
                style="width:250px;"
              ></el-input>
            </el-form-item>
            <el-form-item class="verifycon clearfix">
              <div class="verifycode">
                <label class="verifylabel">验证码：</label>
                <el-input
                  v-model.trim="ruleForm.VerCode"
                  placeholder="请输入验证码"
                  size="mini"
                  style="width:190px;"
                  @keyup.native.13="handleKeyup($event)"
                  ref="verify"
                ></el-input>
                <img
                  :src="verifyImg"
                  @click="changeImg"

                />
                <!-- <a
                  class="change_img"
                  @click="changeImg"
                  href="javascript:;"
                >看不清楚换一张</a> -->
              </div>
            </el-form-item>
            <el-form-item>
              <div class="login_botton">
                <el-button
                  type="primary"
                  size="mini"
                  class="login_btn"
                  @click="submitForm('ruleForm')"
                >登录</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>

      </div>
    </div>
  </section>
</template>
<script>
import bus from "@/bus";
import { mapMutations, mapState } from "vuex";
import { globelFnHanle } from "@/common/js/mixin.js";
import { setItem, getItem } from "@/common/js/util";
import { Login, fetchVerifyImg, GetFuncList, Logout } from "@/api";
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
        name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        pass: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        VerCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      },
      verifyImg: "",
      VerId: "",
      asideOne: [
        {
          title: "首页配置",
          name: "indexconfig"
        },
        {
          title: "",
          name: "banner1",
          seq: 3
        },
        {
          title: "",
          name: "indexhotword",
          seq: 4
        },
        {
          title: "",
          name: "latestbooks",
          seq: 5
        },
        {
          title: "",
          name: "goodSellingBooks",
          seq: 6
        },
        {
          title: "",
          name: "importantprodect",
          seq: 7
        },
        {
          title: "",
          name: "largemiddlematerial",
          seq: 8
        },
        {
          title: "",
          name: "creativeproducts",
          seq: 9
        },
        {
          title: "商品管理",
          name: "goodsmanage"
        },
        {
          title: "",
          name: "goodslist",
          seq: 11
        },
        {
          title: "频道商品维护",
          name: "channelmatain"
        },

        {
          title: "",
          name: "largemiddlepublicmatain",
          seq: 13
        },
        {
          title: "",
          name: "university",
          seq: 14
        },
        {
          title: "",
          name: "largemiddlesort",
          seq: 15
        },
        {
          title: "",
          name: "goodsellingbooksmatain",
          seq: 16
        },
        {
          title: "",
          name: "importantprodectmatain",
          seq: 17
        },
        {
          title: "",
          name: "latestprodectmatain",
          seq: 18
        },
        {
          title: "",
          name: "variousprodectmatain",
          seq: 19
        },
        {
          title: "",
          name: "interviewdata",
          seq: 20
        }
      ],
      asideTwo: [
        {
          title: "用户管理",
          name: ""
        },
        {
          title: "",
          name: "usermanagement",
          seq: 42
        },
        {
          title: "",
          name: "rolematain",
          seq: 43
        },
        {
          title: "",
          name: "backgroundpermissionsmangement",
          seq: 44
        },
        {
          title: "",
          name: "unitassociationmatain",
          seq: 45
        },
        {
          title:'功能管理',
          name:''
        },
        {
          title: "",
          name: "brandbusinessmatain",
          seq: 47
        },
        {
          title: "",
          name: "warmgreeting",
          seq: 48
        },
        {
          title: "",
          name: "publicsortmatain",
          seq: 49
        },
        {
          title: "",
          name: "channebarmatain",
          seq: 50
        },
        {
          title: "",
          name: "collectiondatamatain",
          seq: 51
        },
        {
          title:'订单信息',
          name:''
        },
        {
          title: "",
          name: "orderdetail",
          seq: 53
        }
      ],
      asideThree: [
        {
          title: "客服管理",
          name: ""
        },
        {
          title: "",
          name: "latestbookscustom",
          seq: 62
        },
        {
          title: "",
          name: "importantprodectcustom",
          seq: 63
        },
        {
          title: "",
          name: "topicactivitycustom",
          seq: 64
        },
        {
          title: "",
          name: "goodsellingbookscustom",
          seq: 65
        },
        {
          title: "",
          name: "largemiddlematerialcustom",
          seq: 66
        },
        {
          title: "",
          name: "variousprodectcustom",
          seq: 67
        },
        {
          title: "客户购物信息",
          name: ""
        },
        {
          title: "",
          name: "customershopcarmessage",
          seq: 69
        }
      ]
    };
  },
  mixins: [globelFnHanle],
  created() {
    this.$store.commit("setIsRegisterOrLogin", false);
    fetchVerifyImg()
      .then(res => {
        this.verifyImg = res.data.Data.Img;
        this.VerId = res.data.Data.VerId;
      })
      .catch(this.globelErrHandle);
  },
  mounted() {
    if (getItem("User") != null) {
      bus.$emit("login", "success");
      this.$router.push({ name: "banner" + getItem("bannerPosition") });
      this.$store.commit("setIsRegisterOrLogin", true);
    }
  },
  methods: {
    ...mapMutations(["setLoading", "updateActiveNav"]),
    handleKeyupAccount(event) {
      this.$refs.password.focus();
    },
    handleKeyupPassword(event) {
      this.$refs.verify.focus();
    },
    handleKeyup(event) {
      const { name, pass } = this.ruleForm;
      if (!name || !pass) return false;
      this.submitForm("ruleForm");
    },
    submitForm(formName) {
      let isGoOn = false;
      this.$refs[formName].validate(valid => {
        if (valid) isGoOn = true;
      });

      if (!isGoOn) return false;

      const { name, pass, VerCode } = this.ruleForm;
      const { VerId } = this;
      let params = {
        Data: {
          Id: name,
          Psw: pass,
          LoginType: "admin",
          VerId,
          VerCode
        }
      };
      Login(params)
        .then(this.globelReqHandle)
        .then(Data => {
          setItem("User", Data);
          setTimeout(() => {
            bus.$emit("login", "success");
            // this.$message("登录成功");
            this.$store.commit("setIsRegisterOrLogin", true);
            this.getUserFunction();
          }, 1000);
        })
        .catch(this.globelErrHandle);
    },
    getUserFunction() {
      // this.logOut();
      const params = {
        UserId: getItem("User").UserId
      };
      //得到左侧导航栏最小id值
      let goodsIdArr = [];
      let platformIdArr = [];
      let customerIdArr = [];
      //头部权限处理
      GetFuncList(params)
        .then(this.globelReqHanle)
        .then(res => {
          //返回的权限排序
          var list = res.Data.sort(function(a, b) {
            return a.Id - b.Id;
          });
          let minId = list[0].Id;
          let arrFunction = [
            ...this.asideOne,
            ...this.asideTwo,
            ...this.asideThree
          ];
          for (let i = 0; i < arrFunction.length; i++) {

            if (minId === arrFunction[i].seq) {

              this.$router.push({ name: arrFunction[i].name });

              if (minId < 21) {
                this.updateActiveNav("1-" + (minId - 1));
              } else if (minId < 52) {
                this.updateActiveNav("2-" + (minId - 40));
              } else {
                this.updateActiveNav("3-" + (minId - 60));
              }
            }
          }
        })
        .catch(this.globelErrHandle);
    },
    changeImg() {
      fetchVerifyImg()
        .then(res => {
          this.verifyImg = res.data.Data.Img;
          this.VerId = res.data.Data.VerId;
        })
        .catch(this.globelErrHandle);
    }
  },
  computed: {
    ...mapState(["loading", "activeNav"])
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
    text-align: center;
  background-color: #deeefc;
  // background-image: url(../../assets/invalid-name.png);

  &::before {
    content: "";
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
  }

  .login_wrap {
    display: inline-block;
    height: 460px;
    margin: 0 auto;
    vertical-align: middle;

    .login_pic {
      background: url(../../assets/invalid-name.png) no-repeat 0 0;
      width: 500px;
      height: 460px;
      margin-right: 50px;
    }
    .login_con {
      width: 370px;
      height: 460px;
      border-radius: 8px;
      background: #fff;
      margin-left: 50px;

      .login_img {
        width: 254px;
        height: 67px;
        margin: 0 auto;
        background-image: url(../../assets/logo_login.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-top: 50px;
      }
      .form_data {
        position: relative;
        .form_det {
          .tags {
            font-size: 14px;
            color: #999999;
            line-height: 24px;
            margin: 10px;
            position: relative;
            height: 55px;

            .el-form-item__content {
              height: 40px !important;
            }
          }
          .searchbox_user {
            width: 200px;
            height: 32px;
            background-color: #ffffff;
            font-size: 14px;
            margin-bottom: 10px;

            .el-input__inner {
              background: url(../../assets/pic.png) no-repeat 0 0;
              background-position: 7px 5px;
              padding-left: 30px;
            }
          }
          .searchbox_pwd {
            width: 200px;
            height: 32px;
            background-color: #ffffff;
            font-size: 14px;
            margin-bottom: 10px;

            .el-input__inner {
              background: url(../../assets/lock.png) no-repeat 0 0;
              background-position: 7px 5px;
              padding-left: 30px;
            }
          }
          .login_botton {
            .login_btn {
              position: absolute;
              width: 310px;
              height: 32px;
              color: #ffffff;
              left: -20%;
              margin-top: 30%;
            }
          }
          .verifycon {
            position: relative;

            .verifycode {
              position: absolute;
              top:2%;
              left: -20%;

              .verifylabel {
                margin-right: 10px;
                color: #606266;
              }
              img {
                display: inline-block;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
  }
}
.login-verify {
  margin-top: 30px;
  width: 300px;
  margin-left: 35px;
  line-height: 28px;
  height: 70px;
  div,
  img {
    float: left;
  }
  .change_img {
    font-size: 14px;

    color: #999999;
  }
  img {
    width: 56px;
    height: 25px;
  }
  img,
  .change_img {
    margin-left: 10px;
    cursor: pointer;
  }
}
.btn_container {
  text-align: center;
  z-index: 99999;
}
</style>
