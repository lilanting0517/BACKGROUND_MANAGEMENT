<template>
  <div class="main">
    <!-- 标题部分 -->
    <h3 class="char_tit clearfix">
      <p class="fl banner">banner图管理</p>
      <el-button type="info" plain size="mini" class="fr" style="margin-right: 8px;margin-top: 8px;" @click="AddBanners">新增banner</el-button>
      <el-dialog title="新增活动信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="活动图片描述:" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入图片描述" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="内容缩图:" :label-width="formLabelWidth" class="labelmove">
            <el-upload class="upload-demo" action="" :before-upload="beforeUpload" :on-change="handleChange" :on-success="handleSuccess" :on-error="handleErr">
              <el-button size="mini" type="primary">选取文件...</el-button>
              <div slot="tip" class="el-upload__tip">请上传jpg/png文件，且不超过500kb</div>
              <img slot="tip" :src="src" alt="" class="uploadPic" v-show="uploadSuccess">
            </el-upload>
          </el-form-item>
          <el-form-item label="内容图:" :label-width="formLabelWidth" class="labelmove">
            <el-upload class="upload-demo" action="" :before-upload="beforeUpload1" :on-preview="handlePreview" :on-remove="handleRemove">
              <el-button size="mini" type="primary">选取文件...</el-button>
              <div slot="tip" class="el-upload__tip">请上传jpg/png文件，且不超过500kb</div>
              <img slot="tip" :src="src1" alt="" class="uploadPic" v-show="uploadSuccess1">
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="small">取消</el-button>
          <el-button type="primary" @click="handleSave" size="small">保存</el-button>
        </div>
      </el-dialog>
    </h3>

    <!-- 表格部分 -->
    <div class="tab_wrap">
      <el-table :data="tableData" ref="multipleTable" class="data_table" style="width: 100%" height="600" @selection-change="handleSelectionChange">
        <el-table-column type="selection" header-align="center">
        </el-table-column>
        <el-table-column prop="order" label="序号" header-align="center">
        </el-table-column>
        <el-table-column prop="TITLE" label="图片描述" header-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.TITLE}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="URL" label="内容图" header-align="center">
          <template slot-scope="scope">
            <img width="100" height="70" :src="scope.row.URL" :alt="scope.row.TITLE">
          </template>
        </el-table-column>
        <el-table-column prop="IMG_URL" label="banner图" header-align="center">
          <template slot-scope="scope">
            <img width="100" height="78" :src="scope.row.IMG_URL" :alt="scope.row.TITLE">
          </template>
        </el-table-column>
        <el-table-column prop="State" label="状态" header-align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.IS_USE === '1'">启用</span>
            <span v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="Move" label="移动" header-align="center">
          <template slot-scope="scope">
            <el-button @click="upData(scope.$index, scope.row)" circle icon="el-icon-upload2" :disabled="!(scope.$index)"></el-button>
            <el-button @click="downData(scope.$index, scope.row)" circle icon="el-icon-download" :disabled="(scope.$index==tableData.length-1)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Operation" label="操作" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="updateInfor(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="修改活动信息" :visible.sync="UpdateDialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动图片描述:" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入图片描述" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="内容缩图:" :label-width="formLabelWidth" class="labelmove">
          <el-upload class="upload-demo" action="" :before-upload="beforeUpload" :on-change="handleChange" :on-success="handleSuccess" :on-error="handleErr">
            <el-button size="mini" type="primary">选取文件...</el-button>
            <div slot="tip" class="el-upload__tip">请上传jpg/png文件，且不超过500kb</div>
            <img slot="tip" :src="updateSrc" alt="" class="uploadPic" v-show="updateSuccess">
          </el-upload>
        </el-form-item>
        <el-form-item label="内容图:" :label-width="formLabelWidth" class="labelmove">
          <el-upload class="upload-demo" action="" :before-upload="beforeUpload1" :on-preview="handlePreview" :on-remove="handleRemove">
            <el-button size="mini" type="primary">选取文件...</el-button>
            <div slot="tip" class="el-upload__tip">请上传jpg/png文件，且不超过500kb</div>
            <img slot="tip" :src="updateSrc1" alt="" class="uploadPic" v-show="updateSuccess1">
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="UpdateDialogFormVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="updateInfo" size="small">保存</el-button>
      </div>
    </el-dialog>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button size="mini" style="margin-left: 8px;margin-top: 8px;" @click="changeStateOpen">启用</el-button>
      <el-button size="mini" style="margin-left: 8px;margin-top: 8px;" @click="changeStateClose">禁用</el-button>
      <el-button size="mini" style="margin-left: 8px;margin-top: 8px;" @click="confirmDelete">删除</el-button>
      <el-pagination background layout="prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="dataTotalNum" @current-change="handleCurrentPage" class="fr pages">
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" center>
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="deleteitems" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { globelFnHanle } from "@/common/js/mixin";
import { swapItems } from "@/common/js/util";
import {
  GetAllBannerInfo,
  AddBanner,
  DeleteBanner,
  UpdateBanner,
  UpdateBanSeq,
  UpdateBanUse
} from "@/api";
import axios from "axios";

export default {
  name: "BannerManage",
  data() {
    return {
      dialogFormVisible: false,
      UpdateDialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      fileList: [],
      tableData: [],
      checked: false,
      multipleSelection: [],
      multipleSelectionAll: [],
      keySign: "GUID",
      imgsrc: "",
      imgsrc1: "",
      src: "",
      src1: "",
      uploadSuccess: false,
      uploadSuccess1: false,
      updateSuccess: true,
      updateSuccess1: true,
      Operation: "",
      updateSrc: "",
      updateSrc1: "",
      dataTotalNum: 0,
      pageIndex: 1,
      pageSize: 10,
      Start: 1,
      End: 10,
      updateGuid: "",
      deleteDialogVisible: false
    };
  },
  computed: {
    allSelect: function() {
      return this.multipleSelection.length === this.tableData.length;
    }
  },
  mixins: [globelFnHanle],
  created() {
    // 初始化 banner 表格信息
    this.initTableData();
  },
  watch: {
    tableData(val, oldVal) {
      this.changePageRecordData(oldVal);

      setTimeout(item => {
        this.setSelectRow();
      }, 20);
    }
  },
  methods: {
    initTableData() {
      const { Start, End } = this;
      const params = {
        Start,
        End
      };

      GetAllBannerInfo(params)
        .then(this.globelReqHandle)
        .then(([data, Success, ErrMsg, total, ErrCode]) => {
          const self = this;

          data.map((el, index) => {
            const GUID = el.GUID;
            const { multipleSelectionAll } = self;

            for (let i = 0; i < multipleSelectionAll.length; i++) {
              if (multipleSelectionAll[i].GUID === GUID) {
                self.multipleSelectionAll[i].IS_USE = el.IS_USE;
              }
            }

            return (el.order =
              (self.pageIndex - 1) * self.pageSize + (index + 1));
          });
          
          this.dataTotalNum = total;

          this.tableData = data;
        })
        .catch(this.globelErrHandle);
    },
    /**上传图片之前 */
    beforeUpload(file) {
      // this.setLoading(true);
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLtSize = file.size / 1024 / 1024 < 0.5;

      if (!isJPG && !isPNG) {
        this.$message.error("上传图片必须是JPG/PNG 格式!");
      }
      if (!isLtSize) {
        this.$message.error("上传头像图片大小不能超过 500KB!");
      }
      if ((isJPG || isPNG) && isLtSize) {
        var windowURL = window.URL || window.webkitURL;
        this.src = windowURL.createObjectURL(file);
        this.updateSrc = windowURL.createObjectURL(file);
        this.uploadSuccess = true;
        //重新写一个表单上传的方法
        this.param = new FormData();
        this.param.append("file", file, file.name);
        let config = {
          "Content-Type": "multipart/form-data"
        };
        let var_this = this;
        axios
          .post(
            //"http://200.1.3.181:8008/api/Banner/UploatImg",
            "http://opqmyd.etjbooks.com.cn/api/Banner/UploatImg",
            this.param,
            config
          )
          .then(res => {
            if (!res.data.Success) {
              var_this.$message({
                message: res.data.message,
                type: "error"
              });
            }
            this.imgsrc = res.data.data.url;
          })
          .catch(function(error) {
            console.log(error);
          });

        return false;
      }
    },
    beforeUpload1(file) {
      // this.setLoading(true);
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLtSize = file.size / 1024 / 1024 < 0.5;

      if (!isJPG && !isPNG) {
        this.$message.error("上传图片必须是JPG/PNG 格式!");
      }
      if (!isLtSize) {
        this.$message.error("上传头像图片大小不能超过 500KB!");
      }
      if ((isJPG || isPNG) && isLtSize) {
        var windowURL = window.URL || window.webkitURL;
        this.src1 = windowURL.createObjectURL(file);
        this.updateSrc1 = windowURL.createObjectURL(file);
        this.uploadSuccess1 = true;
        //重新写一个表单上传的方法
        this.param = new FormData();
        this.param.append("file", file, file.name);
        let config = {
          "Content-Type": "multipart/form-data"
        };
        let var_this = this;
        axios
          .post(
            //"http://200.1.3.181:8008/api/Banner/UploatImg",
             "http://opqmyd.etjbooks.com.cn/api/Banner/UploatImg",
            this.param,
            config
          )
          .then(res => {
            if (!res.data.Success) {
              var_this.$message({
                message: res.data.message,
                type: "error"
              });
            }

            this.imgsrc1 = res.data.data.url;
          })
          .catch(function(error) {
            console.log(error);
          });
        return false;
      }
    },
    handleChange(file, fileList) {
      if (fileList.length) {
        this.fileList = fileList.slice(-1);
      }
    },
    handleSuccess(res, file, fileList) {
      let { Results, Msg, Obj, Code } = res;
      let loop, onceMore, loopNum, timer, index;
      setTimeout(() => {
        // this.setLoading(false);
      }, 500);

      if (Code !== 200) {
        this.$message(Msg);
        return false;
      }

      const curIndex = this.tableData.length + 1;
      Results.map((el, index) => {
        el.order = index + curIndex;
      });
      this.tableData.push(...Results);
      // this.setLoading(false);
      this.$message(Msg);

      if (Obj) window.open(`${Api.downloadUrl}/${Obj}`);
    },
    handleErr(err, file, fileList) {
      // this.setLoading(false);
      console.log(err);
    },
    editGoods(row) {
      console.log(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 上传文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // 全选框
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
    //增加banner
    AddBanners() {
      this.dialogFormVisible = true;
      this.form.name = "";
      this.uploadSuccess = false;
      this.uploadSuccess1 = false;
    },
    handleSave() {
      const params = {
        data: {
          title: this.form.name,
          url: this.imgsrc,
          img_url: this.imgsrc1
        }
      };
      AddBanner(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) {
            this.$message("新增成功！");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);

      this.dialogFormVisible = false;
    },
    //删除banner
    confirmDelete() {
      this.changePageRecordData(this.tableData);
      if (this.multipleSelectionAll.length == 0) {
        this.$message("还没有选择需要删除的内容哦");
        return;
      } else {
        this.deleteDialogVisible = true;
      }
    },
    deleteitems() {
      this.deleteDialogVisible = false;

      let arr = [];
      this.multipleSelectionAll.map(item => {
        arr.push(item.GUID);
      });
      arr = arr.toString();
      const params = {
        SearchContent: arr
      };
      DeleteBanner(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) {
            this.$message("删除成功！");
            this.Start = 1;
            this.End = 10;
            this.pageIndex = 1;
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
    },
    //更新banner
    updateInfor(index, row) {
      this.UpdateDialogFormVisible = true;
      this.form.name = row.TITLE;
      this.updateSrc = row.URL;
      this.updateSrc1 = row.IMG_URL;
      this.updateGuid = row.GUID;
    },
    updateInfo() {
      if (this.imgsrc === "") {
        this.imgsrc = this.updateSrc;
      }
      if (this.imgsrc1 === "") {
        this.imgsrc1 = this.updateSrc1;
      }
      const params = {
        data: {
          title: this.form.name,
          url: this.imgsrc,
          img_url: this.imgsrc1,
          guid: this.updateGuid
        }
      };
      UpdateBanner(params)
        .then(this.globelReqHandle)
        .then(([data, success]) => {
          if (success) {
            this.$message("修改成功！");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
      this.UpdateDialogFormVisible = false;
    },
    //向上移动
    upData(index, row) {
      const params = {
        data: {
          guid: row.GUID,
          seq: "up"
        }
      };

      UpdateBanSeq(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) this.initTableData();
        })
        .catch(this.globelErrHandle);
      this.UpdateDialogFormVisible = false;
    },
    //向下移动
    downData(index, row) {
      const params = {
        data: {
          guid: row.GUID,
          seq: "down"
        }
      };

      UpdateBanSeq(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) this.initTableData();
        })
        .catch(this.globelErrHandle);
      this.UpdateDialogFormVisible = false;
    },
    //启用
    changeStateOpen() {
      this.changePageRecordData(this.tableData);

      if (this.multipleSelectionAll.length == 0) {
        this.$message("还没有选择需要启用的信息哦");
        return;
      }
      let arr = [];
      this.multipleSelectionAll.map(item => {
        arr.push(item.GUID);
      });
      arr = arr.toString();
      const params = {
        data: {
          guid: arr,
          type: 1
        }
      };

      UpdateBanUse(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) {
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
      this.UpdateDialogFormVisible = false;
    },
    //禁用
    changeStateClose() {
      this.changePageRecordData(this.tableData);

      if (this.multipleSelectionAll.length == 0) {
        this.$message("还没有选择需要禁用的信息哦");
        return;
      }
      let arr = [];
      this.multipleSelectionAll.map(item => {
        arr.push(item.GUID);
      });
      arr = arr.toString();
      const params = {
        data: {
          guid: arr,
          type: 0
        }
      };

      UpdateBanUse(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) {
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
      this.UpdateDialogFormVisible = false;
    },
    //分页
    handleCurrentPage(val) {
      this.pageIndex = val;
      const { pageSize } = this;
      this.Start = (val - 1) * pageSize + 1;

      this.End = val * pageSize;

      this.initTableData();
    },
    //设置选中方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      //标识当前行的唯一键名称
      let idKey = this.keySign;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      //遍历选中
      this.$refs.multipleTable.clearSelection();
      for (let i = 0; i < selectAllIds.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (selectAllIds[i].indexOf(this.tableData[j][idKey]) >= 0) {
            this.$refs.multipleTable.toggleRowSelection(
              this.tableData[j],
              true
            );
          }
        }
      }
    },
    // 记忆选择核心方法
    changePageRecordData(oldVal) {
      // 标识当前行的唯一键的名称
      let idKey = this.keySign;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      oldVal.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.uploadPic {
  width: 200px;
  height: 100px;
}
</style>
