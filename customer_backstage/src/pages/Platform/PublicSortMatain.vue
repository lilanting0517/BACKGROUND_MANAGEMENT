<template>
  <div class="main">

    <h2 class="char_tit clearfix">
      <span>出版社排序列表</span>
      <el-button size="mini" style="margin-left:700px" @click="openSortDialog" type="primary">新增排序</el-button>
    </h2>

    <!-- 列表内容 -->
    <div class="tab_wrap">
      <el-table
        :data="tableData"
        class="data_table"
        style="width: 100%"
        height="500"
      >
        <el-table-column
          prop="Seq"
          label="排名"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="CbsName"
          label="出版社名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Operation"
          label="排序修改"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="updateSort(scope.$index, scope.row)"
            >修改</el-button>
            <!-- <el-button
              type="text"
              @click="deleteSort(scope.$index, scope.row)"
            >删除</el-button> -->
            <el-popover
             :ref="`popover-${scope.$index}`"
              placement="top"
              v-model="scope.row.canDel"
              trigger="click"
            >
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteSort(scope.$index, scope.row)">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        class="fr pages"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
      >
      </el-pagination>
    </div>
    <!-- 修改排序模态框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      class="modal"
      :close-on-click-modal='false'
    >
      <div class="modal_content">
        <span> 移动到：排名</span>
        <el-input-number
          v-model.trim="num"
          @change="handleChange"
          :min="1"
          label="描述文字"
          size="mini"
          style="width:100px;"
        ></el-input-number>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false"
          size="mini"
        >取消</el-button>
        <el-button
          type="primary"
          @click="saveChange"
          size="mini"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 新增排序模态框 -->
    <el-dialog
      title="新增出版社排序"
      :visible.sync="addDialogVisible"
      width="40%"
      class="modal"
      :close-on-click-modal='false'
    >
      <div class="modal_content">
        <div class="searchCon">
          <span>出版社名称：</span>
          <el-select
            v-model.trim="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            class="publisherSearch"
            size="small"
            @focus="getPublishList"
          >
            <el-option
              v-for="item in options1"
              :key="item.index"
              :label="item.Bb"
              :value="item.Bb"
              @click.native="getCbsCode(item)"
            >
            </el-option>
          </el-select>
        </div>
        <span> 移动到：排名</span>
        <el-input-number
          v-model.trim="addnum"
          @change="handleChange"
          :min="1"
          label="描述文字"
          size="mini"
          style="width:100px;"
        ></el-input-number>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="addDialogVisible = false"
          size="mini"
        >取消</el-button>
        <el-button
          type="primary"
          @click="saveAddChange"
          size="mini"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>




<script>
import { GetCbsList,addCbsSeq,getSeqCbsList,deleteSeqCbs,updateSeqCbs } from "@/api";
export default {
  data() {
    return {
      tableData: [],
      value: "",
      num: 1,
      addnum:1,
      options1: [],
      total: 30,
      currentPage: 1,
      dialogVisible: false,
      addDialogVisible:false,
      title: "人民教育出版社",
      loading: false,
      Cbsid:'',
      CbsCode:'',
      CbsName:'',
      Guid:'',
      query:''
    };
  },
  created() {
    this.initCbsList()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      const params = {
        PageIndex:this.currentPage,
        PageNum:10
      };

      getSeqCbsList(params)
       .then(this.globelReqHandle)
       .then(({ Data,Success,Total }) => {
         if(Success) {
           this.tableData = Data;
           this.total = Total;
         }
       })
    },
    search() {},
    saveChange() {},
    handleChange() {},
    //获取出版社列表
    remoteMethod(searchVal) {
        this.query = searchVal.replace(/\s+/g, "");
        this.loading = true;
        const params = {
          Search: searchVal.replace(/\s+/g, "")
        };
        GetCbsList(params)
          .then(this.globelReqHandle)
          .then(res => {
            this.options1 = res.Data;
            this.loading = false;
          })
          .catch(this.globelErrHandle);
    },
    getPublishList() {
        const params = {
          Search: this.query
        };
        GetCbsList(params)
          .then(this.globelReqHandle)
          .then(res => {
            this.options1 = res.Data;
            this.loading = false;
          })
          .catch(this.globelErrHandle);
    },
    //新增出版社排序
    openSortDialog() {
      this.addDialogVisible = true;
    },
    getCbsCode(item) {
      this.Cbsid = item.Cbsid;
    },
    saveAddChange() {
      if(this.value) {
        this.value=this.value.replace(/\s+/g,"");
        const params = {
          CbsCode:this.Cbsid,
          CbsName:this.value,
          Seq:this.addnum
        };

        addCbsSeq(params)
          .then(this.globelReqHandle)
          .then(({Success,ErrorMsg}) => {
            if (Success) {
              this.$message("添加成功");
              this.initCbsList();
            } else {
              this.$message(ErrorMsg);
            }
          })

        this.addDialogVisible = false;
      } else {
        this.$message('请选择一家出版社')
      }
    },
    //获取排序出版社列表
    initCbsList() {
      const params = {
        PageIndex:1,
        PageNum:10
      };

      getSeqCbsList(params)
       .then(this.globelReqHandle)
       .then(({ Data,Success,Total }) => {
         if(Success) {
           this.tableData = Data;
           this.total = Total;
         }
       })
    },
    //删除排序
    deleteSort(index, row) {
      const params = {
        Guid:row.Guid
      }

      deleteSeqCbs(params)
       .then(this.globelReqHandle)
       .then(({ Data,Success }) => {
         if(Success) {
           this.$message('删除成功！');
         }
       })
       setTimeout(() => {
         this.initCbsList();
       }, 500);

    },
    //修改排序
    updateSort(index, row) {
      this.dialogVisible = true;
      this.title = row.CbsName;
      this.CbsCode = row.CbsCode;
      this.CbsName = row.CbsName;
      this.Guid = row.Guid;
    },
    saveChange() {

      const params = {
        CbsCode:this.CbsCode,
        CbsName:this.CbsName,
        Seq:this.num,
        Guid:this.Guid
      }

      updateSeqCbs(params)
       .then(this.globelReqHandle)
       .then(({ Data,Success }) => {
         if(Success) {
           this.$message('修改成功！');
           this.dialogVisible = false;
         }
       })

      this.initCbsList();

    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  .searchCon {
    margin-bottom: 10px;

    .publisherSearch {
      width:30%;
      margin:10px 5px;
    }
  }

}

</style>
