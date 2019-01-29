<template>
  <div class="main addPublic">
    <h2 class="char_tit">
      出版社信息
    </h2>
    <div class="form_container">
      <!-- <div>
        <span>出版社信息:</span>
        <el-select v-model.trim="form.Name" placeholder="请选择" size="small" style="width:30%; margin-right:20px;">
          <el-option v-for="item in options" :key="item.Bb" :label="item.Bb" :value="item.Bb">
          </el-option>
        </el-select>
        <span class="tips">注 : 出版社名称对接ERP1</span>
      </div> -->
      <div>
        <span>出版社搜索:</span>
        <el-select
          v-model.trim="value"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width:30%; margin-right:20px;margin-top:10px"
          size="small"
        >
          <el-option
            v-for="item in options1"
            :key="item.Bbbh"
            :label="item.Bb+item.Bbbh"
            :value="item.Bbbh"
          >
            <span style="float: left">{{ item.Bb }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Bbbh }}</span>
          </el-option>
        </el-select>
      </div>
      <div class="upload_area">
        <div class="clearfix file_area">
          <span style="float:left">图片缩图:&nbsp;&nbsp;&nbsp;</span>
          <el-upload
            class="upload-demo fl"
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
            <el-button size="mini">选择文件</el-button>
          </el-upload>
          <span class="word-tips">图片建议尺寸为140*50</span>
        </div>
      </div>
      <img
        :src=src
        alt=""
        class="img-size"
      >
      <div class="btn-container">
        <el-button
          size="small"
          type="primary"
          @click="onSubmit"
        >确认添加</el-button>
        <el-button
          size="small"
          @click="$router.go(-1)"
        >返回</el-button>
      </div>
    </div>

  </div>
</template>




<script>
import { url } from "@/common/js/util";
import { GetCbsList, AddDzzjcCbs, instance } from "@/api";
export default {
  name: "",
  data() {
    return {
      value: "",
      form: {
        Name: "",
        ImgUrl: ""
      },
      options: [],
      options1: [],
      fileList: [],
      value: "",
      src: "",
      loading: false
    };
  },
  mounted() {
    const params = {
      Search: ""
    };
    GetCbsList(params)
      .then(this.globelReqHandle)
      .then(res => {
        this.options = res.Data;
      })
      .catch(this.globelErrHandle);
  },
  methods: {
    handleRemove(file, fileList) {},
    handlePreview(file) {
      var reader = new FileReader();
      reader.onload = function(event) {
        var image = new Image();
        image.onload = function() {
          var width = this.width;
          var height = this.height;
        };
        image.src = event.target.result;
      };
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        const params = {
          Search: query
        };
        GetCbsList(params)
          .then(this.globelReqHandle)
          .then(res => {
            this.options1 = res.Data;
            this.loading = false;
          })
          .catch(this.globelErrHandle);
      } else {
        this.options1 = [];
      }
    },
    handleExceed(files, fileList) {
      // console.log(fileList.length);
    },
    beforeRemove(file, fileList) {},
    onSubmit() {
      this.value = this.value.replace(/\s+/g, "");
      if(this.value === '') {
        this.$message.error('请选择出版社名称');
        return false;
      }
      const params = {
        Name: this.value,
        ImgUrl: this.form.ImgUrl
      };
      AddDzzjcCbs(params)
        .then(this.globelReqHandle)
        .then(({ Data, Success }) => {
          if (Success) {
            this.options = Data;
            this.$message("添加成功");
            this.$router.go(-1);
          }
        })
        .catch(this.globelErrHandle);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    beforeUpload(file) {
      // const isJPG = file.type === "image/jpg";

      const isLt2M = file.size / 1024 / 1024 < 2;
      const isLt100k = file.size / 1024 > 100;
      // if (!isJPG) {
      //   this.$message.error("上传icon只能是 PNG 格式!");
      // }
      if (!isLt2M || !isLt100k) {
        this.$message.error("上传图片大小应在100K~1M之间!");
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        // let width = 10;
        // let height = 10;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = true;
          // let valid = img.width >= width && img.height >= height;
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
              "Manage/Good/UploadCbsImg",
              // "http://47.92.147.209:5566/Manage/Good/UploadCbsImg",
              this.param,
              config
            )
            .then(response => {
              if (!response.data.Success) {
                this.$message({
                  message: response.data.message,
                  type: "error"
                });
              }
              this.form.ImgUrl = response.data.Data.url;
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
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.addPublic {
  background-color: #fff;

  .form_container {
    padding-left: 40px;
    font-size: 0;
    div {
      line-height: 28px;
    }
    span {
      display: inline-block;
      width: 100px;
      font-size: 14px;
    }
    .word-tips {
      display: inline-block;
      font-size: 14px;
      padding-left: 10px;
      color: #b2a9a9;
      width: 200px;
    }
  }

  .upload_area {
    margin-top: 10px;
    span {
      float: left;
    }
    .file_area {
      line-height: 28px;
      margin-bottom: 20px;
    }
  }
  .btn-container {
    padding-left: 100px;
  }
  .img-size {
    width: 200px;
    height: 100px;
    margin-left: 100px;
    margin-bottom: 20px;
  }
}
</style>
