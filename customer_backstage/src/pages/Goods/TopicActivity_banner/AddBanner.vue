<template>
  <div class="main addBanner">
    <h2 class="char_tit clearfix">
      活动信息
    </h2>
    <h2 class="activForm clearfix">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="活动名称:">
          <el-input
            v-model.trim="form.Name"
            size="mini"
            class="fl"
            style="width:400px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="图片缩图:"
          prop="pics"
          class="upload_pic"
        >
          <el-upload
            class="upload-demo"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            size="mini"
            :before-upload="beforeUpload"
            action=""
          >
            <el-button size="mini">选择文件</el-button><span class="word-tips">图片建议尺寸为{{tips}}</span>
          </el-upload>
        </el-form-item>
        <el-form-item class="upload_pic">
          <img
            :src="src"
            alt=""
            class="img-size"
          >
        </el-form-item>
        <el-form-item label="活动时间:">
          <el-date-picker
            v-model.trim="form.Time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            @change="dateChange"
            value-format="yyyy-MM-dd:HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            size="mini"
          >确认</el-button>
          <el-button
            @click="$router.go(-1)"
            size="mini"
          >返回</el-button>
        </el-form-item>
      </el-form>
    </h2>
  </div>
</template>
<script>
import moment from "moment";
import { AddAct, instance } from "@/api";
import { globelFnHanle1 } from "@/common/js/mixin";
export default {
  name: "",
  data() {
    return {
      value: "",
      form: {
        Name: "",
        Startime: "",
        EndTime: "",
        ImgUrl: "",
        Time: ""
      },
      from: "",
      tips: "1920*428",
      options: [],
      tableData: [
        {
          order: "100001",
          bookName: "22",
          ISBN: "53546",
          price: "1900",
          operation: "修改"
        }
      ],
      fileList: [],
      param: null,
      src: "",
      value1: "",
      value2: ""
    };
  },
  mounted() {
    this.from = this.$route.params.from;
    switch (this.from) {
      case "banner1":
        this.from = "1";
        this.tips = "1920*428";
        break;
      case "banner2":
        this.from = "2";
        this.tips = "1200*90";
        break;
      case "banner3":
        this.from = "3";
        this.tips = "732*321";
    }
  },
  mixins: [globelFnHanle1],
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeUpload(file) {
      // const isJPG = file.type === "image/png";
      const isLt3M = file.size / 1024 / 1024 < 3;
      const isLt300k = file.size / 1024 > 300;
      // if (!isJPG) {
      //   this.$message.error("上传banner只能是 PNG 格式!");
      // }
      if (!isLt3M || !isLt300k) {
        this.$message.error("上传图片大小应在300K~3M之间!");
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        // let width = 100;
        // let height = 100;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          // let valid = img.width >= width && img.height >= height;
          let valid = true;
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
            .post(
              "Manage/Activity/UploadImg",
              // "http://47.92.147.209:5566/Manage/Activity/UploadImg",
              this.param,
              config
            )
            .then(response => {
              if (!response.data.Success) {
                this.$message({
                  message: response.data.ErrorMsg,
                  type: "error"
                });
                this.form.ImgUrl = "错误的图片格式";
              } else {
                this.form.ImgUrl = response.data.Data.url;
              }
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
    beforeRemove(file, fileList) {},
    onSubmit() {
      if (
        this.form.Name == "" ||
        this.form.ImgUrl == "" ||
        this.form.Time == null
      ) {
        this.$message.error("活动名称、活动时间、活动banner为必填项、不能为空");
        return false;
      }
      if (this.form.ImgUrl === "错误的图片格式") {
        this.$message.error(this.form.ImgUrl);
        return false;
      }
      this.form.Time[0] = this.form.Time[0].split("");
      this.form.Time[0][10] = "";
      this.form.Time[0] = this.form.Time[0].join("");

      this.form.Time[1] = this.form.Time[1].split("");
      this.form.Time[1][10] = "";
      this.form.Time[1] = this.form.Time[1].join("");
      const params2 = {
        Name: this.form.Name.replace(/\s+/g, ""),
        ImgUrl: this.form.ImgUrl,
        StartTime: this.form.Time[0],
        EndTime: this.form.Time[1],
        Position: this.from,
        IsUse: "1"
      };
      this.form.Time[0] =
        this.form.Time[0].substr(0, 10) +
        " " +
        this.form.Time[0].substr(10, this.form.Time[0].length - 10);
      this.form.Time[1] =
        this.form.Time[1].substr(0, 10) +
        " " +
        this.form.Time[1].substr(10, this.form.Time[1].length - 10);
      const params = {
        Name: this.form.Name.replace(/\s+/g, ""),
        ImgUrl: this.form.ImgUrl,
        StartTime: this.form.Time[0],
        EndTime: this.form.Time[1],
        Position: this.from,
        IsUse: "1"
      };
      AddAct(params, params2)
        .then(this.globelReqHandle1)
        .then(res => {
          // console.log(res);
          if (res.Success) {
            this.$message("新增成功");
            this.$router.go(-1);
          }
        })
        .catch(this.globelErrHandle);
      // console.log(params);
    },
    dateChange(val) {
      // console.log(val);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.addBanner {
  background-color: #fff;

  .upload_pic {
    margin-bottom: 5px !important;
  }
  label {
    font-size: 14px;
    color: #555555;
  }
  .MarginR {
    margin-right: 30px;
  }
  .activForm {
    padding: 20px 30px 0 30px;
    margin-bottom: 5px;
    font-size: 16px;
    line-height: 44px;
    box-sizing: border-box;
    position: relative;
  }
  .goodsInfo {
    width: 200px;
    margin-right: 15px;
  }
  .img-size {
    width: 200px;
    height: 100px;
  }
  .word-tips {
    font-size: 14px;
    padding-left: 10px;
    color: #b2a9a9;
  }
}
</style>
