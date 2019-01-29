<template>
  <div class="main">
    <!-- 标题部分 -->
    <h3 class="char_tit clearfix">
      <p class="fl banner">最新资讯管理</p>
      <el-button type="info" plain size="mini" class="fr" style="margin-right: 8px;margin-top: 8px;" @click="AddNews">新增资讯</el-button>

      <el-dialog title="新增资讯信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="图书馆名称:" :label-width="formLabelWidth" size="mini">
            <el-select v-model="value" placeholder="请选择图书馆" :disabled = "isConAdmin">
              <el-option v-for="item in libList" :key="item.index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资讯简介:" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入图片描述" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="内容缩图:" :label-width="formLabelWidth" class="labelmove">
            <el-upload class="upload-demo" action="" :before-upload="beforeUpload" :on-change="handleChange" :on-success="handleSuccess" :on-error="handleErr">
              <el-button size="mini" type="primary">选取文件...</el-button>
              <div slot="tip" class="el-upload__tip">请上传jpg/png文件，且不超过500kb</div>
              <img slot="tip" :src="src" alt="" class="uploadPic" v-show="uploadSuccess">
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="NewsSave" size="small">保存</el-button>
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
        <el-table-column prop="TITLE" label="资讯简介" header-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.Title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="IMG_URL" label="内容图" header-align="center">
          <template slot-scope="scope">
            <img width="100" height="70" :src="scope.row.Url" :alt="scope.row.TITLE">
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
            <el-button type="text" @click="updateNewsInfo(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改资讯信息" :visible.sync="dialogFormUpdate">
        <el-form :model="form">
          <el-form-item label="图书馆名称:" :label-width="formLabelWidth" size="mini">
            <el-select v-model="value" placeholder="请选择图书馆" :disabled = "isConAdmin">
              <el-option v-for="item in libList" :key="item.index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资讯简介:" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入图片描述" size="mini"></el-input>
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
          <el-button @click="dialogFormUpdate = false" size="small">取 消</el-button>
          <el-button type="primary" @click="saveUpdate" size="small">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button size="mini" style="margin-left: 8px;margin-top: 8px;" @click="confirmDelete">删除</el-button>
      <el-pagination background layout="prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="dataTotalNum" @current-change="handleCurrentPage" class="fr pages">
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" center>
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="deleteNews" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { globelFnHanle } from "@/common/js/mixin";
import {
  AddNewsInfo,
  DeleteNewsInfo,
  UpdateNews,
  GetAllNewsInfo,
  getLibyList,
  UpdateNewsSeq
} from "@/api";
import { getItem } from "@/common/js/util";
import axios from "axios";
export default {
  name: "",
  data() {
    return {
      dialogFormVisible: false,
      dialogFormUpdate: false,
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
      tableData: [],
      libList: [],
      pageIndex: 1,
      pageSize: 15,
      checked: false,
      value: "",
      multipleSelection: [],
      multipleSelectionAll: [],
      keySign: "Guid",
      fileList: [],
      dataTotalNum: 0,
      pageIndex: 1,
      pageSize: 10,
      Start: 1,
      End: 10,
      src: "",
      src1: "",
      imgsrc: "",
      imgsrc1: "",
      updateSrc: "",
      updateSrc1: "",
      updateSuccess: true,
      updateSuccess1: true,
      uploadSuccess: false,
      uploadSuccess1: false,
      updateGuid: "",
      deleteDialogVisible: false,
      isConAdmin:false
    };
  },
  computed: {
    allSelect: function() {
      return this.multipleSelection.length === this.tableData.length;
    }
  },
  watch: {
    tableData(val, oldVal) {
      this.changePageRecordData(oldVal);

      setTimeout(item => {
        this.setSelectRow();
      }, 20);
    }
  },
  mixins: [globelFnHanle],
  created() {
     if(getItem("User").UserType == "news"){
      this.value = getItem("User").LibType
      this.isConAdmin = true
    }
    // 初始化表格信息
    this.initTableData();
    this.getSelect();

  },
  methods: {
    initTableData() {
      const { Start, End } = this;
      const params = {
        Start,
        End
      };

      GetAllNewsInfo(params)
        .then(this.globelReqHandle)
        .then(([data, Success, ErrMsg, total, ErrCode]) => {
          data.map((el, index) => {
            return (el.order =
              (this.pageIndex - 1) * this.pageSize + (index + 1));
          });

          this.dataTotalNum = total;
          this.tableData = data;
        })
        .catch(this.globelErrHandle);
    },
    //获取下拉框列表
    getSelect() {
      getLibyList()
        .then(this.globelReqHandle)
        .then(([data]) => {
          this.libList = data;
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
            //"http://200.1.3.181:8008/api/News/UploatImg",
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
    /**上传图片 */
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    //增加公告
    AddNews() {
      this.dialogFormVisible = true;
      if(getItem("User").UserType == "all"){
        this.value = "";
      }
      this.form.name = "";
      this.uploadSuccess = false;
    },
    NewsSave() {
      const params = {
        data: {
          title: this.form.name,
          url: this.imgsrc,
          lib_type: this.value
        }
      };
      AddNewsInfo(params)
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
    //删除公告
    confirmDelete() {
      this.changePageRecordData(this.tableData);
      if (this.multipleSelectionAll.length == 0) {
        this.$message("还没有选择需要删除的内容哦");
        return;
      } else {
        this.deleteDialogVisible = true;
      }
    },
    deleteNews() {
      this.deleteDialogVisible = false;

      let arr = [];
      this.multipleSelectionAll.map(item => {
        arr.push(item.Guid);
      });
      arr = arr.toString();
      const params = {
        SearchContent: arr
      };

      DeleteNewsInfo(params)
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
    //修改公告
    updateNewsInfo(index, row) {
      this.dialogFormUpdate = true;
      this.form.name = row.Title;
      this.updateSrc1 = row.Url;
      this.updateGuid = row.Guid;
      this.value = row.LibType;
    },
    saveUpdate() {
      if (this.imgsrc1 === "") {
        this.imgsrc1 = this.updateSrc1;
      }
      const params = {
        data: {
          title: this.form.name,
          url: this.imgsrc1,
          lib_type: this.value,
          guid: this.updateGuid
        }
      };

      UpdateNews(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) {
            this.$message("修改成功！");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
      this.dialogFormUpdate = false;
    },
    //向上移动
    upData(index, row) {
      const params = {
        data: {
          guid: row.Guid,
          seq: "up"
        }
      };

      UpdateNewsSeq(params)
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
          guid: row.Guid,
          seq: "down"
        }
      };

      UpdateNewsSeq(params)
        .then(this.globelReqHandle)
        .then(([data, Success]) => {
          if (Success) this.initTableData();
        })
        .catch(this.globelErrHandle);
    },
    //分页
    handleCurrentPage(val) {
      this.pageIndex = val;
      const { pageSize } = this;
      this.Start = (val - 1) * pageSize + 1;
      // debugger
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
  },

  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.uploadPic {
  width: 200px;
  height: 100px;
}
</style>
