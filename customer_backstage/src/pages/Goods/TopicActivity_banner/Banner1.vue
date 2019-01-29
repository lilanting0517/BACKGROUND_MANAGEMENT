<template>
  <!-- 表格部分 -->
  <div class="tab_wrap" v-loading="loading">
    <el-table :data="data2" class="data_table" style="width: 100%" height="500" @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column type="selection" align="center">
      </el-table-column>
      <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="ImgUrl" label="缩略图" align="center" width="207px">
        <template slot-scope="scope">
          <img :src="scope.row.ImgUrl" alt="" class="img-size">
        </template>
      </el-table-column>
      <el-table-column prop="ChannelName" label="活动名称" align="center" width="150px">
      </el-table-column>
      <el-table-column prop="Time" label="活动时间" align="center" width="200px">
      </el-table-column>
      <el-table-column prop="Status" label="状态" align="center">
      </el-table-column>
      <el-table-column prop="Move" label="移动" align="center">
        <template slot-scope="scope">
          <img :src='require("../../../assets/up-2.png")' width="12px" height="14px" class="move_arrow" @click="up(scope.$index, scope.row)" style="cursor:pointer; margin-right:20px;" />
          <img :src='require("../../../assets/down-2.png")' width="12px" height="14px" class="move_arrow" @click="down(scope.$index, scope.row)" style="cursor:pointer;" />
        </template>
      </el-table-column>
      <el-table-column prop="Operation" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openModal(scope.$index,scope.row)">{{scope.row.Operation}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!data2.length" :value="allSelect" @change="handleSelectionAllChange(data2)" class="checkAll">全选</el-checkbox>
      <el-button id="" class="" size="mini" style="margin-left:15px;" @click="startItem">启用</el-button>
      <el-button id="" class="" size="mini" @click="disabledItem">禁用</el-button>
      <el-button id="" class="" size="mini" @click="deleteItemConfirm">删除</el-button>
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>
    <!-- 修改模态框 -->
    <el-dialog title="修改活动" :visible.sync="dialogTableVisible" :close-on-click-modal='false'>
      <h2 class="activForm clearfix">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="活动名称:">
            <el-input v-model.trim="form.Name" size="mini" class="fl" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="图片缩图:" prop="pics">
            <!-- <el-input size="mini" class="fl" style="width:400px; margin-right:20px;"></el-input> -->
            <el-upload class="upload-demo" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList" size="mini" :before-upload="beforeUpload" action="">
              <img :src=src alt="" class="img-size" style="margin-top:10px;margin-right: 20px;">
              <el-button size="mini">选择文件</el-button>
              <span class="suggestedSize">图片建议尺寸为1920*428</span>
            </el-upload>

          </el-form-item>
          <el-form-item label="活动时间:">
            <el-date-picker v-model.trim="form.Time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd:HH:mm:ss" @change="dateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="mini">确认</el-button>
          </el-form-item>
        </el-form>
      </h2>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :close-on-click-modal='false'
    >
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteItem()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<style>
</style>



<script>
import moment from "moment";
import { swapItems, removeItem } from "@/common/js/util";
import { loadingStatus } from "@/common/js/mixin";
import { mapState, mapMutations } from "vuex";
import { IsUse, Delete, instance } from "@/api";
import {
  GetMainPageActivity,
  MoveUp,
  MoveDown,
  ChangeAct,
  GetList
} from "@/api";
export default {
  name: "BannerManage",
  data() {
    return {
      tableData: [],
      checked: false,
      multipleSelection: [],
      data2: [],
      form: {
        Name: "",
        Time: "",
        ImgUrl: "",
        ImgUrlCopy: "",
        Guid: "",
        Time: ""
      },
      dialogTableVisible: false,
      fileList: [],
      src: "",
      total: null,
      currentPage: 1,
      deleteDialogVisible:false
    };
  },
  mounted() {
    this.initData();
  },
  mixins: [loadingStatus],
  methods: {
    initData() {
      const params = {
        PageIndex: 1,
        PageNum: 100
      };
      this.tableData = [];
      GetList(params)
        .then(this.globelReqHandle)
        .then(res => {
          res.Data.filter(x => {
            if (x.Position === "1") {
              this.tableData.push(x);
            }
          });
          let data = [];
          for (let i = 0; i < this.tableData.length; i++) {
            data.push(this.tableData[i].Data);
          }
          let data2 = [];
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
              data[i][j].Activity.Operation = "修改";
              data[i][j].Activity.Time =
                data[i][j].Activity.TimeStart +
                " 至 " +
                data[i][j].Activity.TimeEnd;
              if (data[i][j].Activity.IsUse == "1") {
                data[i][j].Activity.Status = "启用";
              } else {
                data[i][j].Activity.Status = "禁用";
              }
              data2.push(data[i][j].Activity);
            }
          }
          this.data2 = data2;
          this.total = data2.length;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      const params = {
        PageIndex: this.currentPage,
        PageNum: 100
      };
      this.tableData = [];
      GetList(params)
        .then(this.globelReqHandle)
        .then(res => {
          res.Data.filter(x => {
            if (x.Position === "1") {
              this.tableData.push(x);
            }
          });
          //console.log(this.tableData);
          let data = [];
          for (let i = 0; i < this.tableData.length; i++) {
            data.push(this.tableData[i].Data);
          }
          //console.log(data);
          let data2 = [];
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
              data[i][j].Activity.Operation = "修改";
              data[i][j].Activity.Time =
                data[i][j].Activity.TimeStart +
                "-" +
                data[i][j].Activity.TimeEnd;
              if (data[i][j].Activity.IsUse == "1") {
                data[i][j].Activity.Status = "启用";
              } else {
                data[i][j].Activity.Status = "禁用";
              }
              data2.push(data[i][j].Activity);
            }
          }
          this.data2 = data2;
        })
        .catch(this.globelErrHandle);
    },
    indexMethod(index) {
      return index + 1;
    },
    startItem() {
      if (this.multipleSelection.length == 0) {
        this.$message("亲，您勾选条目了吗？");
      } else {
        let data = [];
        this.multipleSelection.map(x => {
          data.push(x.Guid);
        });
        let Guid = data.join(",");
        const params = {
          Guid: Guid,
          IsUse: "1"
        };
        IsUse(params)
          .then(this.globelReqHandle)
          .then(({ Success }) => {
            if (Success) {
              this.$message("启用成功");
              this.initData();
            }
          })
          .catch(this.globelErrHandle);
      }
    },
    disabledItem() {
      if (this.multipleSelection.length == 0) {
        this.$message("亲，您勾选条目了吗？");
      } else {
        let data = [];
        this.multipleSelection.map(x => {
          data.push(x.Guid);
        });
        let Guid = data.join(",");
        const params = {
          Guid: Guid,
          IsUse: "0"
        };
        IsUse(params)
          .then(this.globelReqHandle)
          .then(res => {
            if (res.Success) {
              this.$message("禁用成功");
              this.initData();
            }
            // console.log(res);
          })
          .catch(this.globelErrHandle);
      }
    },
    deleteItemConfirm() {
      this.deleteDialogVisible = true;
    },
    deleteItem() {
      if (this.multipleSelection.length == 0) {
        this.$message("亲，您勾选条目了吗？");
      } else {
        let data = [];
        this.multipleSelection.map(x => {
          data.push(x.Guid);
        });
        let Guid = data.join(",");
        const params = {
          Guid: Guid
        };
        Delete(params)
          .then(this.globelReqHandle)
          .then(res => {
            if (res.Success) {
              this.$message("删除成功");
              this.initData();
              this.deleteDialogVisible = false;
            }
          })
          .catch(this.globelErrHandle);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatTime(arr) {
      arr[0] = arr[0].split('-');
      arr[1] = arr[1].split('-');
      this.firarray = arr[0].map(item => item * 1)
      this.secarray = arr[1].map(item => item * 1)
      this.firarray[1] =  this.firarray[1] - 1;
      this.secarray[1] = this.secarray[1] - 1;
    },
    openModal(index, scope) {
      let arr = scope.Time.split("至");
      this.formatTime(arr);
      this.dialogTableVisible = true;
      this.form.Name = scope.ChannelName;
      this.form.Guid = scope.Guid;
      this.form.Time = [new Date(...this.firarray), new Date(...this.secarray)];
      this.src = scope.ImgUrl;
      this.form.ImgUrl = scope.ImgUrl;
    },
    up(index, row) {
      const params = {
        Guid: row.Guid
      };
      if (index == 0) {
        this.$message("已经是第一条了哦！！");
      } else {
        let newArr = [];
        if (this.data2.length > 1 && index !== 0) {
          MoveUp(params)
            .then(this.globelReqHandle)
            .then(res => {
              if (res.Success) {
                this.$message("上移成功");
                //  newArr = swapItems(this.data2, index, index - 1);
                this.initData();
              }
            })
            .catch(this.globelErrHandle);
        }

        // this.data2.map((el, index) => {
        //   return (el.order =
        //     (this.pageIndex - 1) * this.pageSize + (index + 1));
        // });
      }
    },
    down(index, row) {
      const params = {
        Guid: row.Guid
      };
      if (index == this.data2.length - 1) {
        this.$message("已经是最后一条了哦！！");
      } else {
        let newArr = [];
        if (this.data2.length > 1 && index !== this.data2.length - 1) {
          MoveDown(params)
            .then(this.globelReqHandle)
            .then(res => {
              if (res.Success) {
                this.$message("下移成功");
                // newArr = swapItems(this.data2, index, index + 1);
                this.initData();
              }
            })
            .catch(this.globelErrHandle);
        }

        // this.tableData.map((el, index) => {
        //   return (el.order =
        //     (this.pageIndex - 1) * this.pageSize + (index + 1));
        // });
      }
    },
    // 全选框
    handleSelectionAllChange(data2) {
      const isChecked = !this.allSelect;
      if (data2) {
        data2.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, isChecked);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
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
      this.form.ImgUrlCopy = "";
      // const isJPG = file.type === "image/png";
      // if (!isJPG) {
      //   this.$message.error("上传icon只能是 PNG 格式!");
      // }
      const isLt3M = file.size / 1024 / 1024 < 3;
      const isLt300k = file.size / 1024 > 300;
      if (!isLt3M || !isLt300k) {
        this.$message.error("上传图片大小应在300K~3M之间!");
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        // let width = 10;
        // let height = 10;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          // let valid = img.width >= width && img.height >= height;
          let valid=true
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
                this.form.ImgUrlCopy = this.form.ImgUrl;
                this.form.ImgUrl = "";
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
    dateChange(val) {},
    beforeRemove(file, fileList) {},
    onSubmit() {
      //兼容firefox
      if(typeof(this.form.Time[0]) === 'object') {
        this.form.Time[0] = moment(this.form.Time[0]);
        this.form.Time[1] = moment(this.form.Time[1]);
      }

      this.form.Time[0] = this.form.Time[0].split("");
      this.form.Time[0][10] = "";
      this.form.Time[0] = this.form.Time[0].join("");

      this.form.Time[1] = this.form.Time[1].split("");
      this.form.Time[1][10] = "";
      this.form.Time[1] = this.form.Time[1].join("");

      const params2 = {
        Name: this.form.Name,
        ImgUrl: this.form.ImgUrl,
        StartTime: this.form.Time[0],
        EndTime: this.form.Time[1],
        Position: "1",
        IsUse: "1",
        Guid: this.form.Guid
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
        Name: this.form.Name,
        ImgUrl: this.form.ImgUrl,
        StartTime: this.form.Time[0],
        EndTime: this.form.Time[1],
        Position: "1",
        IsUse: "1",
        Guid: this.form.Guid
      };
      ChangeAct(params, params2)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("修改成功");
            this.dialogTableVisible = false;
            this.initData();
          } else {
             this.$message.error("请传入正确的图片格式");
             this.dialogTableVisible=false;
            //图片格式不正确处理
            if (this.form.ImgUrlCopy !== "") {
              this.form.ImgUrl = this.form.ImgUrlCopy;
            }
          }
        })
        .catch(this.globelErrHandle);
    }
  },
  ...mapMutations(["setLoading", "setIsRegisterOrLogin"]),
  computed: {
    allSelect: function() {
      return this.multipleSelection.length === this.data2.length;
    },
    ...mapState(["loading", "isRegisterOrLogin"])
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.img-size {
  width: 200px;
  height: 100px;
}
.suggestedSize {
  font-size: 12px;
  color: #b2a9a9;
}
</style>

