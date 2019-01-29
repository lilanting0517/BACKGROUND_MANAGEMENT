<template>
  <div class="main">
    <!-- 标题部分 -->
    <h3 class="char_tit clearfix">
      首页热词推荐
      <el-button id="add" class="fr add_hot_word" size="small" @click="AddHotWord" type="primary">添加热词</el-button>
    </h3>
    <!-- 表格部分 -->
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" class="data_table" style="width: 100%" height="500" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center">
        </el-table-column>
        <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="Word" label="热词名称" align="center">
        </el-table-column>
        <el-table-column prop="Status" label="状态" align="center">
        </el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editWord(scope.$index,scope.row)">{{scope.row.Operation}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button id="" class="" size="mini" style="margin-left:15px;" @click="startItem">启用</el-button>
      <el-button id="" class="" size="mini" @click="disabledItem">禁用</el-button>
      <el-button id="" class="" size="mini" @click="deleteItemConfirm">删除</el-button>
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>
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

<script>
import { getItem } from "@/common/js/util";
import { DelHotWord, GetAllHotWord, ChangeIsuse, Logout } from "@/api";
import { globelFnHanle1, checkAll,loadingStatus} from "@/common/js/mixin.js";
import { mapState, mapMutations } from "vuex";
export default {
  name: "",
  data() {
    return {
      checked: false,
      tableData: [],
      multipleSelection: [],
      currentPage: null,
      total: null,
      deleteDialogVisible:false
    };
  },
  mixins: [globelFnHanle1, checkAll,loadingStatus],
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let UserId = getItem("User").UserId;
      const params = {
        UserId
      };
      GetAllHotWord(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.tableData.map(x => {
            if (x.IsUse == "1") {
              x.Status = "启用";
              x.Operation = "修改";
            } else {
              x.Status = "禁用";
              x.Operation = "修改";
            }
          });
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    indexMethod(index) {
      return index + 1;
    },
    startItem() {
      let arr = [];
      this.multipleSelection.map(x => {
        arr.push(x.Word);
      });
      let params = {
        Word: arr.join(","),
        IsUse: "1"
      };
      ChangeIsuse(params)
        .then(this.globelReqHandle)
        .then(res => {
          if(res.Success){
            this.initData();
          }else{
            this.$message.error(res.ErrorMsg);
          }

        })
        .catch(this.globelErrHandle);
    },
    disabledItem() {
      let arr = [];
      this.multipleSelection.map(x => {
        arr.push(x.Word);
      });
      let params = {
        Word: arr.join(","),
        IsUse: "0"
      };
      ChangeIsuse(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.initData();
        })
        .catch(this.globelErrHandle);
    },
    deleteItemConfirm() {
      this.deleteDialogVisible = true;
    },
    deleteItem() {
      let arr = [];
      this.multipleSelection.map(x => {
        arr.push(x.Word);
      });
      let params = {
        Word: arr.join(",")
      };
      DelHotWord(params)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initData();
            this.deleteDialogVisible = false;
          }
        })
        .catch(this.globelErrHandle);
    },
    editWord(index, scope) {
      let word = scope.Word;
      this.$router.push({ name: "editword", params: { name: word } });
    },
    AddHotWord() {

      let hotword = 0;
      this.tableData.map(item => {
        if(item.Status === '启用') {
          hotword++;
        }
      })
      hotword < 6 ? this.$router.push({ name: "addword" }) : this.$message('最多只能添加六个启用的热词哦~');

    },
    deleteHotWord(scope) {
      let word = scope.row.Num;
      let params = {
        Word: word,
        Guid: 1
      };
      DelHotWord(params)
        .then(this.globelReqHandle)
        .then(Data => {

        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.add_hot_word {

  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
</style>
