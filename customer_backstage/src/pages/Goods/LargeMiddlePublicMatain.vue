<template>
  <div class="main">
    <h2 class="char_tit">
      <span class="cx_title">大中专出版社维护</span>
      <el-button size="small" class="fr add_btn" @click="addPublic" type="primary">新增</el-button>
    </h2>
    <!-- 表格部分 -->
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" class="data_table" style="width: 100%" height="600" @selection-change="handleSelectionChange" ref="multipleTable">
        <!-- <el-table-column type="selection" align="center">
        </el-table-column> -->
        <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="Picdisc" label="出版社缩图" align="center" width="207px">
          <template slot-scope="scope">
            <img :src="scope.row.ImgUrl" alt="" class="img-size">
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="出版社名称" align="center">
        </el-table-column>
        <el-table-column prop="Move" label="移动" align="center">
          <template slot-scope="scope">
            <img :src='require("../../assets/up-2.png")' width="12px" height="14px" class="move_arrow" @click="up(scope.$index, scope.row)" style="cursor:pointer; margin-right:20px;" />
            <img :src='require("../../assets/down-2.png")' width="12px" height="14px" class="move_arrow" @click="down(scope.$index, scope.row)" style="cursor:pointer;" />
          </template>
        </el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openModal(scope.$index,scope.row)">{{scope.row.Operation[0]}}</el-button>
            <!-- <el-button type="text" size="small" @click="delItem(scope.$index,scope.row)">删除</el-button> -->
            <el-popover
             :ref="`popover-${scope.$index}`"
              placement="top"
              v-model="scope.row.canDel"
              trigger="click"
            >
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="delItem(scope.$index, scope.row)">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改模态框 -->
      <el-dialog title="出版社信息" :visible.sync="dialogTableVisible" :close-on-click-modal='false'>
        <h2 class="activForm clearfix">
          <el-form ref="form" :model="form" label-width="90px">
            <el-form-item label="出版社搜索:">
              <el-select v-model.trim="value" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading" size="small">
                <el-option v-for="item in options1" :key="item.Bb" :label="item.Bb" :value="item.Bb">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片缩图:" prop="pics">
              <!-- <el-input size="mini" class="fl" style="width:400px; margin-right:20px;"></el-input> -->
              <el-upload class="upload-demo" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList" size="mini" :before-upload="beforeUpload" action="">
                <el-button size="mini">选择文件</el-button><span class="word-tips">图片建议尺寸为140*50</span>
              </el-upload>
              <img :src=src alt="" class="img-size" style="margin-top:10px">
            </el-form-item>
          </el-form>
        </h2>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false" size="small">取消</el-button>
          <el-button type="primary" size="small" @click="saveUpdate">确定修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<style>
</style>



<script>
import { swapItems } from "@/common/js/util";
import {
  instance,
  GetDzzjcCbs,
  DelDzzcbs,
  DzzMoveUp,
  DzzMoveDown,
  GetCbsList
} from "@/api";
import { loadingStatus } from "@/common/js/mixin";
export default {
  name: "BannerManage",
  data() {
    return {
      tableData: [],
      checked: false,
      dialogTableVisible: false,
      multipleSelection: [],
      fileList: [],
      options1: [],
      form: {
        Name: "",
        Guid: "",
        ImgUrl: ""
      },
      src: "",
      value: "",
      popvisible:false
    };
  },
  mixins: [loadingStatus],
  mounted() {
    this.initData();

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
    initData() {
      const params = {};
      GetDzzjcCbs(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.tableData = res.Data;
          this.tableData.map(item => {
            item.Operation = ["修改", "删除"];
            item.canDel = false;
          });
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionAllChange(tableData) {
      const isChecked = !this.allSelect;
      if (tableData) {
        tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, isChecked);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    addPublic() {
      this.$router.push({ name: "addpublic" });
    },
    indexMethod(index) {
      return index + 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    openModal(index, scope) {
      this.dialogTableVisible = true;
      this.value = scope.Name;
      this.src = scope.ImgUrl;
    },
    delItem(index, scope) {
      const params = {
        Guid: scope.Guid
      };
      DelDzzcbs(params)
        .then(this.globelReqHandle)
        .then(({ Success }) => {
          if (Success) {
            this.$message("删除成功");
            this.initData();
          }
        })
        .catch(this.globelErrHandle);
    },
    up(index, row) {
      if (index == 0) {
        this.$message("已经是第一条了哦！！");
      } else {
        const params = {
          Guid: row.Guid
        };
        let newArr = [];
        if (this.tableData.length > 1 && index !== 0) {
          DzzMoveUp(params)
            .then(this.globelReqHandle)
            .then(({ Success }) => {
              if (Success) {
                this.$message("上移成功");
                newArr = swapItems(this.tableData, index, index - 1);
                this.initData();
              }
            })
            .catch(this.globelErrHandle);
        }
        this.tableData.map((el, index) => {
          return (el.order =
            (this.pageIndex - 1) * this.pageSize + (index + 1));
        });
      }
    },
    down(index, row) {
      if (index == this.tableData.length - 1) {
        this.$message("已经是最后一条了哦！！");
      } else {
        const params = {
          Guid: row.Guid
        };
        let newArr = [];
        if (this.tableData.length > 1 && index !== this.tableData.length - 1) {
          DzzMoveDown(params)
            .then(this.globelReqHandle)
            .then(({ Success }) => {
              if (Success) {
                this.$message("下移成功");
                newArr = swapItems(this.tableData, index, index - 1);
                this.initData();
              }
            })
            .catch(this.globelErrHandle);
        }
        this.tableData.map((el, index) => {
          return (el.order =
            (this.pageIndex - 1) * this.pageSize + (index + 1));
        });
      }
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
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
    },
    beforeRemove(file, fileList) {},
    saveUpdate() {
      this.dialogTableVisible = false;
    },
  },
  computed: {
    allSelect: function() {
      return this.multipleSelection.length === this.tableData.length;
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only1 -->
<style lang="scss" scoped>
.add_btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
.img-size {
  width: 200px !important;
  height: 100px !important;
}
.word-tips {
  font-size: 14px;
  padding-left: 10px;
  color: #b2a9a9;
}
</style>


