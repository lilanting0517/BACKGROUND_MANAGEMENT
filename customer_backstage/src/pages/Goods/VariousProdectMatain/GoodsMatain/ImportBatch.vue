<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      批量上传
    </h2>
    <h2 class="activForm clearfix">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="上传商品信息:" prop="pics">
          <el-input v-model.trim="form.name" size="mini" class="fl" style="width:36%; margin-right:20px;"></el-input>
          <el-upload class="upload-demo" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList" size="mini" :before-upload="beforeUpload" action="">
            <el-button size="mini">选择excel文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini" style="width:112px;">确认</el-button>
          <el-button size="mini" style="width:112px;" @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </h2>
  </div>
</template>
<script>
import { instance } from "@/api";
export default {
  name: "",
  data() {
    return {
      value: "",
      word: "",
      form: {
        name: "",
        pics: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
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
      tableData: [
        {
          order: "100001",
          bookName: "22",
          ISBN: "53546",
          price: "1900",
          operation: "修改"
        }
      ],
      fileList: []
    };
  },
  created() {
    this.word = this.$route.params.word;
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
    handleExceed(files, fileList) {
      console.log(fileList.length);
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
    },
    onSubmit() {
      console.log("submit!");
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    beforeUpload(file) {
      this.param = new FormData();
      this.param.append("file", file, file.name);
      // let headers = {
      //   "Content-Type": "multipart/form-data",
      //    HotWord: "小清新3"
      // };
      instance
        .post(
          // "http://47.92.147.209:5566/Manage/HotWord/ImportGoods",
          "Manage/HotWord/ImportGoods",
          this.param,
          {
            headers: {
              HotWord: encodeURI(this.word)
            }
          }
        )
        .then(res => {
          let reg = /[;；]/g;
          if (!res.data.Success) {
            this.$message({
              message: res.data.ErrorMsg.replace(reg,"$&\r\n"),
              type: "error"
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      return false;
    }
  },
  components: {}
};
</script>

<style lang="scss">
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
  background-color: #fff;
  font-size: 16px;
  line-height: 44px;
  box-sizing: border-box;
  position: relative;
}
.goodsInfo {
  width: 200px;
  margin-right: 15px;
}
.el-message--error{
  // min-width: 100px !important;
  // width:100px !important;
}
</style>
