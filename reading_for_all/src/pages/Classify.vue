<template>
  <div class="main">
    <!-- 表单部分 -->
    <h3 class="char_tit clearfix">
      <p class="fl banner">馆藏图书类型维护</p>
    </h3>
    <div class="form_wrap">
      <div>
        <label for="">新增类型名称：</label>
        <el-input v-model="oneTypename" size="mini" placeholder="请输入新增类型名称"></el-input>
        <el-button type="info" plain size="mini" @click="addOneType">新增一级类型</el-button>
      </div>
      <div>
        <label for="">新增二级类型名称：</label>
        <el-select v-model="value" placeholder="请选择所属一级类型" size="mini">
          <el-option v-for="(item,index) in options" :key="item.index" :label="item.Name" :value="item.Name" @click.native="selectOneType(item,index)">
          </el-option>
        </el-select>
        <el-input v-model="twoTypename" size="mini" class="second" placeholder="请输入二级类型名称"></el-input>
        <el-button type="info" plain size="mini" @click="addTwoType">新增二级类型</el-button>
      </div>

    </div>
    <!-- 表格部分 -->
    <h3 class="char_tit clearfix">
      <p class="fl banner">类型信息</p>
    </h3>
    <div class="tab_wrap">
      <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%;" height="550">
        <el-table-column prop="ParentName" label="一级类型" header-align="center">
        </el-table-column>
        <el-table-column prop="Name" label="二级类型" header-align="center">
        </el-table-column>
        <el-table-column prop="Operation" label="操作(一级类型)" header-align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteOneType(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Operation" label="操作(二级类型)" header-align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteTwoType(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 删除一级分类 -->
      <el-dialog title="提示" :visible.sync="deleteOneDialog" width="30%" center>
        <span>确定删除此一级分类吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteOneDialog = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="deleteOneBookType" size="mini">确 定</el-button>
        </span>
      </el-dialog>
       <!-- 删除二级分类 -->
      <el-dialog title="提示" :visible.sync="deleteTwoDialog" width="30%" center>
        <span>确定删除此二级分类吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteTwoDialog = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="deleteTwoBookType" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <!-- <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="dataTotalNum" @current-change="handleCurrentPage" class="fr pages">
      </el-pagination> -->
    </div>
  </div>
</template>
<script>
import { GetFatherBookType, AddBookType, GetBookType,DelBookType } from "@/api";
export default {
  name: "",
  data() {
    return {
      tableData: [],
      pageSize: 10,
      dataTotalNum: 100,
      labelPosition: "right",
      value: "",
      options: [],
      oneTypename: "",
      twoTypename: "",
      Guid: "",
      nameList: null,
      deleteOneDialog:false,
      deleteTwoDialog:false,
      ParentGuid:'',
      Guid:''
    };
  },
  created() {
    this.initFatherBookType();
    this.initTableData();
  },
  methods: {
    handleCurrentPage() {},
    confirmDelete() {},
    handleSelectionAllChange() {},

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const { nameList } = this;
      let firstClass = "";
      let item = null;
      let itemIndex = 0;
      let num = 0;

      if (columnIndex === 0 || columnIndex === 2) {
        firstClass = row.ParentName;
        item = nameList[firstClass];
        itemIndex = item.index;
        num = item.num;

        if (rowIndex === itemIndex) {
          return [num, 1];
        }

        return [0, 0];
      }
    },
    //获取用户一级分类下拉框列表内容
    initFatherBookType() {
      GetFatherBookType()
        .then(this.globelReqHandle)
        .then(res => {
          this.options = res.data;
        })
        .catch(this.globelErrHandle);
    },
    //添加一级分类
    addOneType() {
      const params = {
        Data: {
          TypeName: this.oneTypename
          // FatherGuid:''
        }
      };

      AddBookType(params)
        .then(this.globelReqHandle)
        .then(res => {

          if (res.Success) {
            this.$message("添加成功");
            this.oneTypename = "";
            this.initFatherBookType();
          }
        })
        .catch(this.globelErrHandle);
    },
    //添加二级分类
    selectOneType(item, index) {
      this.Guid = item.Guid;
    },
    addTwoType() {
      const params = {
        Data: {
          TypeName: this.twoTypename,
          FatherGuid: this.Guid
        }
      };

      AddBookType(params)
        .then(this.globelReqHandle)
        .then(res => {

          if (res.Success) {
            this.$message("添加成功");
            this.twoTypename = "";
            this.value = "";
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
    },
    //获取列表数据
    initTableData() {
      GetBookType()
        .then(this.globelReqHandle)
        .then(res => {
          let names = {};

          for (let i = 0; i < res.data.length; i++) {
            var key = res.data[i].ParentName;

            if (!(key in names)) {
              names[key] = null;
            }
          }

          /* 一级内容聚合 */
          let results = [];
          for (key in names) {
            for (let k = 0; k < res.data.length; k++) {
              if (key === res.data[k].ParentName) {
                results.push(res.data[k]);
              }
            }
          }

          /* 拿到数据后计算一级分类的 index、num 值 */
          let name = "";
          let nameObj = {};
          let item = null;

          for (let j = 0; j < results.length; j++) {
            key = results[j].ParentName;

            if (key in nameObj) {
              nameObj[key].num++;
            } else {
              nameObj[key] = {};
              nameObj[key].index = j;
              nameObj[key].num = 1;
            }
          }

          this.nameList = nameObj;
          this.tableData = results;
        })
        .catch(this.globelErrHandle);
    },
    //删除一级分类
    deleteOneType(index, row) {
      this.deleteOneDialog = true;
      this.ParentGuid = row.ParentGuid;
    },
    deleteOneBookType() {
      const params = {
        Data: {
          Guid:this.ParentGuid
        }
      };

      DelBookType(params)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
       this.deleteOneDialog = false;
    },
    //删除二级分类
    deleteTwoType(index, row) {
      this.deleteTwoDialog = true;
      this.Guid = row.Guid;
    },
    deleteTwoBookType() {
      const params = {
        Data: {
          Guid:this.Guid
        }
      };

      DelBookType(params)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initTableData();
          }
        })
        .catch(this.globelErrHandle);
       this.deleteTwoDialog = false;
    }
  }
};
</script>
<style lang="scss">
.form_wrap {
  font-size: 14px;
  background-color: #fff;
  padding: 28px 25px;
  margin-bottom: 5px;
  label {
    width: 140px;
    text-align: right;
    display: inline-block;
    color: #555555;
    font-size: 14px;
    margin-bottom: 25px;
    text-align: left;
  }
  .el-input:nth-of-type(1) {
    width: 350px;
  }
  .el-input:nth-of-type(2) {
    width: 175px;
  }
  .el-select {
    width: 170px;
  }
  .el-select > .el-input {
    width: 170px;
  }
}
</style>
