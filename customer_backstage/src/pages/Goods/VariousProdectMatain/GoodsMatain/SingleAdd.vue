<template>
  <div class="main">
    <h2 class="char_tit">
      <span class="dy_title">基本信息
        <el-button
          size="mini"
          style="margin-left:20px;"
          @click="$router.go(-1);"
        >返回</el-button>
      </span>
    </h2>
    <h2 class="form_con clearfix">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="80px"
      >
        <el-form-item
          label="商品ID:"
          prop="Id"
          class="form_item"
        >
          <el-input
            placeholder="商品名称/订单号"
            class="MarginR"
            size="mini"
            style="width:150px; margin-right:50px;"
            v-model.number="form.Id"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="名称:"
          prop="Name"
          class="form_item"
        >
          <el-input
            placeholder="商品名称"
            class="MarginR"
            size="mini"
            style="width:150px; margin-right:50px;"
            v-model.trim="form.Name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="定价:"
          prop="Price"
          class="form_item"
        >
          <el-input
            placeholder="商品定价"
            class="MarginR"
            size="mini"
            style="width:150px;margin-right:50px;"
            v-model.number="form.Price"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="类型:"
          class="form_item"
        >
          <el-select
            v-model.trim="form.Type"
            placeholder="请选择"
            size="mini"
            style="width:150px;margin-right:50px;"
            @change="TypeChange"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.Name"
              :label="item.Name"
              :value="item.Name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="包装:"
          class="form_item"
        >
          <el-select
            v-model.trim="form.Brand"
            placeholder="请选择"
            size="mini"
            style="width:150px;margin-right:50px;"
            @change="BrandChange"
          >
            <el-option
              v-for="item in optionsBrand"
              :key="item.Name"
              :label="item.Name"
              :value="item.Name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="规格:"
          class="form_item"
        >
          <el-select
            v-model.trim="form.Specification"
            placeholder="请选择"
            size="mini"
            style="width:150px;margin-right:50px;"
            @change="SpecificationChange"
          >
            <el-option
              v-for="item in optionsSpecification"
              :key="item.Name"
              :label="item.Name"
              :value="item.Name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="品牌:"
          class="form_item"
        >
          <el-select
            v-model.trim="form.PackageName"
            placeholder="请选择"
            size="mini"
            style="width:150px;margin-right:50px;"
            @change="PackageNameChange"
          >
            <el-option
              v-for="item in optionsPackName"
              :key="item.Name"
              :label="item.Name"
              :value="item.Name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <span>商品介绍:</span>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model.trim="form.Summary"
        >
        </el-input>
      </div>
      <div>
        <span>封面图片信息:</span>
        <div class="clearfix"></div>
        <div class="clearfix">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess1 "
            :before-upload="beforeAvatarUpload1"
            style="float:left"
            ref='upload1'
          >
            <img
              v-if="imageUrl1"
              :src="imageUrl1"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload2"
            style="float:left"
            ref='upload2'
          >
            <img
              v-if="imageUrl2"
              :src="imageUrl2"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess3"
            :before-upload="beforeAvatarUpload3"
            style="float:left"
            ref='upload3'
          >
            <img
              v-if="imageUrl3"
              :src="imageUrl3"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess4"
            :before-upload="beforeAvatarUpload4"
            style="float:left"
            ref='upload4'
          >
            <img
              v-if="imageUrl4"
              :src="imageUrl4"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess5"
            :before-upload="beforeAvatarUpload5"
            style="float:left"
            ref='upload5'
          >
            <img
              v-if="imageUrl5"
              :src="imageUrl5"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
        </div>
        <div class="delbtn-container clearfix">
          <div
            class="btn-fa"
            v-for="(item,index) in delBtnArr"
          >
            <el-button
              size="mini"
              class="btn"
              @click.native="removePic(index)"
            >{{item}}</el-button>
          </div>
        </div>
        <div class="btn-container clearfix">
          <div
            class="btn-fa"
            v-for="(item,index) in mainArr"
          >
            <el-button
              size="mini"
              class="btn"
              @click="beMain(index)"
            >{{item}}</el-button>
          </div>
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            class="fr save-change"
            @click="confirmAdd('form')"
          >确认添加</el-button>
        </div>
      </div>
    </h2>
  </div>

</template>

<script>
import { GetPropetry, instance, ChangeGoods } from "@/api";
import { globelFnHanle, globelFnHanle1 } from "@/common/js/mixin";
export default {
  data() {
    return {
      form: {
        Id: "",
        Name: "",
        Price: "",
        Type: "",
        TypeId: "",
        Brand: "",
        BrandId: "",
        Specification: "",
        SpecificationId: "",
        PackageName: "",
        PackageId: "",
        Summary: ""
      },
      delBtnArr: ["删除", "删除", "删除", "删除", "删除"],
      mainArr: ["设为主图", "设为主图", "设为主图", "设为主图", "设为主图"],
      imageUrl1: "",
      imageUrl2: "",
      imageUrl3: "",
      imageUrl4: "",
      imageUrl5: "",
      imgUrlArr: [],
      textarea: "",
      value: "",
      optionsType: [],
      optionsBrand: [],
      optionsSpecification: [],
      optionsPackName: [],
      rules: {
        Id: [
          { required: true, message: "商品Id不能为空", trigger: "blur" },
          { type: "number", message: "商品Id必须为数字", trigger: "blur" }
        ],
        Name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        Price: [
          { required: true, message: "商品定价不能为空", trigger: "blur" },
          { type: "number", message: "商品价格请填写数字", trigger: "blur" }
        ]
      }
    };
  },
  mixins: [globelFnHanle],
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      const params0 = { PageIndex: 1, PageNum: 10000, Type: 0 };
      const params1 = { PageIndex: 1, PageNum: 10000, Type: 1 };
      const params2 = { PageIndex: 1, PageNum: 10000, Type: 2 };
      const params3 = { PageIndex: 1, PageNum: 10000, Type: 3 };
      GetPropetry(params0)
        .then(this.globelFnHanle)
        .then(res => {
          this.optionsType = res.Data;
        })
        .catch(this.globelErrHandle);
      GetPropetry(params1)
        .then(this.globelFnHanle)
        .then(res => {
          this.optionsSpecification = res.Data;
        })
        .catch(this.globelErrHandle);
      GetPropetry(params2)
        .then(this.globelFnHanle)
        .then(res => {
          this.optionsPackName = res.Data;
        })
        .catch(this.globelErrHandle);
      GetPropetry(params3)
        .then(this.globelFnHanle)
        .then(res => {
          this.optionsBrand = res.Data;
          // console.log(this.optionsBrand);
        })
        .catch(this.globelErrHandle);
    },
    TypeChange(val) {
      this.form.Type = val;
      this.optionsType.map(x => {
        if (x.Name === val) {
          this.form.TypeId = x.Id;
        }
      });
    },
    BrandChange(val) {
      this.form.Brand = val;
      this.optionsBrand.map(x => {
        if (x.Name === val) {
          this.form.BrandId = x.Id;
        }
      });
    },
    SpecificationChange(val) {
      this.form.Specification = val;
      this.optionsSpecification.map(x => {
        if (x.Name === val) {
          this.form.SpecificationId = x.Id;
        }
      });
    },
    PackageNameChange(val) {
      this.form.PackageName = val;
      this.optionsPackName.map(x => {
        if (x.Name === val) {
          this.form.PackageId = x.Id;
        }
      });
    },
    handleAvatarSuccess1(res, file) {
      this.imageUrl1 = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess2(res, file) {
      this.imageUrl2 = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess3(res, file) {
      this.imageUrl3 = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess4(res, file) {
      this.imageUrl4 = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess5(res, file) {
      this.imageUrl5 = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload1(file) {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 PNG 或 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传icon大小不能超过 2MB!");
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 10;
        let height = 10;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src = windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.param = new FormData();
          this.param.append("file", file, file.name);
          let config = {
            "Content-Type": "multipart/form-data"
          };
          let var_this = this;
          instance
            .post("Manage/MultiGoods/UploadGoodsImg", this.param, config)
            .then(response => {
              if (!response.data.Success) {
                this.$message({
                  message: response.data.ErrorMsg,
                  type: "error"
                });
              }
              this.imageUrl1 = response.data.Data.url;
              this.imgUrlArr.push(this.imageUrl1);
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        () => {
          this.$message.error("上传的icon必须是等于或大于100*100!");
          return false;
        }
      );
      // return isJPG && isLt2M && isSize;
      return Promise.reject();
    },
    beforeAvatarUpload2(file) {
      console.log(file.type);
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 PNG 或 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 10;
        let height = 10;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src = windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.param = new FormData();
          this.param.append("file", file, file.name);
          let config = {
            "Content-Type": "multipart/form-data"
          };
          let var_this = this;
          instance
            .post("Manage/MultiGoods/UploadGoodsImg", this.param, config)
            .then(response => {
              if (!response.data.Success) {
                this.$message({
                  message: response.data.ErrorMsg,
                  type: "error"
                });
              }
              this.imageUrl2 = response.data.Data.url;
              this.imgUrlArr.push(this.imageUrl2);
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        () => {
          this.$message.error("上传的icon必须是等于或大于100*100!");
          return false;
        }
      );
      // return isJPG && isLt2M && isSize;
      return Promise.reject();
    },
    beforeAvatarUpload3(file) {
      console.log(file);
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 PNG 或 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传icon大小不能超过 2MB!");
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 10;
        let height = 10;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src = windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.param = new FormData();
          this.param.append("file", file, file.name);
          let config = {
            "Content-Type": "multipart/form-data"
          };
          let var_this = this;
          instance
            .post("Manage/MultiGoods/UploadGoodsImg", this.param, config)
            .then(response => {
              if (!response.data.Success) {
                this.$message({
                  message: response.data.ErrorMsg,
                  type: "error"
                });
              }
              this.imageUrl3 = response.data.Data.url;
              this.imgUrlArr.push(this.imageUrl3);
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        () => {
          this.$message.error("上传的icon必须是等于或大于100*100!");
          return false;
        }
      );
      // return isJPG && isLt2M && isSize;
      return Promise.reject();
    },
    beforeAvatarUpload4(file) {
      console.log(file);
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 PNG 或 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传icon大小不能超过 2MB!");
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 10;
        let height = 10;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src = windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.param = new FormData();
          this.param.append("file", file, file.name);
          let config = {
            "Content-Type": "multipart/form-data"
          };
          let var_this = this;
          instance
            .post("Manage/MultiGoods/UploadGoodsImg", this.param, config)
            .then(response => {
              if (!response.data.Success) {
                this.$message({
                  message: response.data.ErrorMsg,
                  type: "error"
                });
              }
              this.imageUrl4 = response.data.Data.url;
              this.imgUrlArr.push(this.imageUrl4);
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        () => {
          this.$message.error("上传的icon必须是等于或大于100*100!");
          return false;
        }
      );
      // return isJPG && isLt2M && isSize;
      return Promise.reject();
    },
    beforeAvatarUpload5(file) {
      console.log(file);
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 PNG 或 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传icon大小不能超过 2MB!");
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 10;
        let height = 10;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src = windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.param = new FormData();
          this.param.append("file", file, file.name);
          let config = {
            "Content-Type": "multipart/form-data"
          };
          let var_this = this;
          instance
            .post("Manage/MultiGoods/UploadGoodsImg", this.param, config)
            .then(response => {
              if (!response.data.Success) {
                this.$message({
                  message: response.data.ErrorMsg,
                  type: "error"
                });
              }
              this.imageUrl5 = response.data.Data.url;
              this.imgUrlArr.push(this.imageUrl5);
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        () => {
          this.$message.error("上传的icon必须是等于或大于100*100!");
          return false;
        }
      );
      // return isJPG && isLt2M && isSize;
      // return Promise.reject();
    },
    removeFromArr(url) {
      for (let i = 0; i < this.imgUrlArr.length; i++) {
        if (url === this.imgUrlArr[i]) {
          this.imgUrlArr.splice(i, 1);
        }
      }
    },
    removePic(index) {
      switch (index + 1) {
        case 1:
          this.$refs.upload1.clearFiles();
          this.removeFromArr(this.imageUrl1);
          this.imageUrl1 = "";
          break;
        case 2:
          this.$refs.upload2.clearFiles();
          this.removeFromArr(this.imageUrl2);
          this.imageUrl2 = "";
          break;
        case 3:
          this.$refs.upload3.clearFiles();
          this.removeFromArr(this.imageUrl3);
          this.imageUrl3 = "";
          break;
        case 4:
          this.$refs.upload4.clearFiles();
          this.removeFromArr(this.imageUrl4);
          this.imageUrl4 = "";
          break;
        case 5:
          this.$refs.upload5.clearFiles();
          this.removeFromArr(this.imageUrl5);
          this.imageUrl5 = "";
          break;
      }
    },
    beMain(index) {
      switch (index + 1) {
        case 1:
          if (this.imageUrl1 === "") {
            this.$message("请上传图片");
          } else {
            this.imgUrlArr.unshift(this.imageUrl1);
          }
          break;
        case 2:
          if (this.imageUrl2 === "") {
            this.$message("请上传图片");
          } else {
            this.imgUrlArr.unshift(this.imageUrl2);
          }
          break;
        case 3:
          if (this.imageUrl3 === "") {
            this.$message("请上传图片");
          } else {
            this.imgUrlArr.unshift(this.imageUrl3);
          }
          break;
        case 4:
          if (this.imageUrl4 === "") {
            this.$message("请上传图片");
          } else {
            this.imgUrlArr.unshift(this.imageUrl4);
          }
          break;
        case 5:
          if (this.imageUrl5 === "") {
            this.$message("请上传图片");
          } else {
            this.imgUrlArr.unshift(this.imageUrl5);
          }
          break;
      }
      //set 去重
      this.imgUrlArr = [...new Set(this.imgUrlArr)];
    },
    confirmAdd(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const params = {
            BrandId: this.form.BrandId,
            BrandName: this.form.Brand,
            SpecificationId: this.form.SpecificationId,
            SpecificationName: this.form.Specification,
            Id: this.form.Id,
            Name: this.form.Name,
            Img: this.imgUrlArr.join(","),
            PackageId: this.form.PackageId,
            PackageName: this.form.PackageName,
            Price: this.form.Price,
            Summary: this.form.Summary,
            TypeId: this.form.TypeId,
            TypeName: this.form.Type,
            Method: "add",
            Guid: ""
          };
          //添加多元产品
          ChangeGoods(params)
            .then(this.globelFnHanle)
            .then(res => {
              if (res.Success) {
                this.$message("添加成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.ErrorMsg);
              }
            })
            .catch(this.globelErrHandle);
        } else {
          this.$message.error("请将信息填写完整正确！");
          return false;
        }
      });
    }
  }
};
</script>




<style lang="scss" scoped>
span {
  display: inline-block;
  font-size: 14px;
  margin-right: 10px;
}
.center-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
.right-btn {
  right: 110px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.delbtn-container {
  margin-top: 50px;
  .btn-fa {
    float: left;
    width: 178px;
    text-align: center;
  }
}
.btn-container {
  .btn-fa {
    float: left;
    width: 178px;
    text-align: center;
  }
}
.save-change {
  margin: 10px;
}
.form_con {
  padding: 0 10px 0 33px;
  margin-bottom: 5px;
  background-color: #fff;
  font-size: 16px;
  line-height: 44px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;

  .form_item {
    display: inline-block;
  }
}
</style>
