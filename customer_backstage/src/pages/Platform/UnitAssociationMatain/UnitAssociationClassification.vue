<template>
  <div>
    <h2 class="char_tit clearfix">
      <label for>外部用户单位名称:</label>
      <el-input
        placeholder="请输入单位名称"
        class="MarginR"
        size="mini"
        style="width:200px;"
        v-model.trim="input"
      ></el-input>
      <el-button size="mini" @click="searchCompany" type="primary">搜索</el-button>
    </h2>
    <div class="tab_wrap">
      <el-table :data="tableData" class="data_table" style="width: 100%" height="500">
        <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop="Dwmc" label="外部用户单位名称" align="center"></el-table-column>
        <el-table-column prop="Operation" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="updateAssociation(scope.$index, scope.row)">修改关联</el-button>
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
      ></el-pagination>
    </div>
    <!-- 模态框 -->
    <el-dialog title="选择该单位能够导出的商品类型" :visible.sync="dialogVisible" width="60%" class="modal" :close-on-click-modal='false'>
      <div class="modal-container">
        <div class="left-nav">
          <p>
            <a href="javascript:;" @click="changeActive($event)" :class="{active:pubClassify}">出版分类</a>
          </p>
          <p>
            <a href="javascript:;" @click="changeActive($event)" :class="{active:subClassify}">学科分类</a>
          </p>
        </div>
        <div class="right-content" v-if="isPublish" v-loading="loading">
          <div>
            <label for>分类名称:</label>
            <el-input
              placeholder="请输入出版分类名称"
              class="MarginR"
              size="mini"
              style="width:150px;"
              v-model.trim="publishInput"
            ></el-input>
            <el-button type="info" plain size="mini" @click="searchPublish(publishInput)">搜索</el-button>
          </div>
          <div style="margin-top:20px;">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
              <el-checkbox
                v-for="(item,index) in curCheckBoxList"
                :label="item.Name"
                :key="index"
              >{{item.Name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="right-content" v-if="!isPublish" v-loading="loading">
          <label for>分类名称:</label>
          <el-input
            placeholder="请输入学科分类名称"
            class="MarginR"
            size="mini"
            style="width:150px;"
            v-model.trim="subjectInput"
          ></el-input>
          <el-button type="info" plain size="mini" @click="searchSubject(subjectInput)">搜索</el-button>
          <div style="margin-top:20px;">
            <el-checkbox
              :indeterminate="isIndeterminate1"
              v-model="checkAll1"
              @change="handleCheckAllChange1"
            >全选</el-checkbox>
            <el-checkbox-group v-model="checkList1" @change="handleCheckedChange1">
              <el-checkbox
                v-for="(item,index) in curCheckBoxList1"
                :label="item.Name"
                :key="index"
              >{{item.Name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveChange" size="mini">保存</el-button>
        <el-button @click="dialogVisible = false" size="mini">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { checkAll, loadingStatus, globelFnHanle1 } from "@/common/js/mixin";
import { GetCompanyList, GetCbflList, GetXkfllList, UpdateType } from "@/api";

export default {
  name: "UnitAssociationClassification",
  data() {
    return {
      store: [],
      tableData: [],
      input: "",
      total: 0,
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      checkList: [],
      allCheckList: [],
      checkList1: [],
      pubClassify: false,
      subClassify: true,
      checkBoxLists: [],
      // 当前出版分类搜索条件下的多选数据
      curCheckBoxList: [],
      // 当前学科分类搜索条件下的多选数据
      curCheckBoxList1: [],
      subjectBoxLists: [],
      checkAll: false,
      isIndeterminate: false,
      checkAll1: false,
      isIndeterminate1: false,
      isPublish: false,
      publishInput: "",
      subjectInput: "",
      CompanyCode: ""
    };
  },
  watch: {
    radio(val) {
      if (val === "2") {
        this.isAll = false;
      } else {
        this.isAll = true;
      }
    },
    // 出版分类搜索条件改变时，更新 indeterminate 状态
    curCheckBoxList(val, oldVal) {
      const len = val.length;
      const checkLen = this.checkList.length;

      if (checkLen) {
        this.isIndeterminate = checkLen > 0 && checkLen < len;
        this.checkAll = checkLen === len;
        return false;
      }

      this.isIndeterminate = false;
      this.checkAll = false;
    },
    // 学科分类搜索条件改变时，更新 indeterminate 状态
    curCheckBoxList1(val, oldVal) {
      const len = val.length;
      const checkLen = this.checkList1.length;

      if (checkLen) {
        this.isIndeterminate1 = checkLen > 0 && checkLen < len;
        this.checkAll1 = checkLen === len;
        return false;
      }

      this.isIndeterminate1 = false;
      this.checkAll1 = false;
    }
  },
  mixins: [loadingStatus],
  created() {
    this.initTableList();
  },
  methods: {
    //分类多选框
    handleCheckAllChange(val) {
      let checkNameList = this.curCheckBoxList.map(item => {
        return item.Name;
      });
      this.checkList = val ? checkNameList : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.curCheckBoxList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.curCheckBoxList.length;
    },
    handleCheckAllChange1(val) {
      let checkNameList = this.curCheckBoxList1.map(item => {
        return item.Name;
      });
      this.checkList1 = val ? checkNameList : [];
      this.isIndeterminate1 = false;
    },
    handleCheckedChange1(value) {
      let checkedCount = value.length;
      this.checkAll1 = checkedCount === this.curCheckBoxList1.length;
      this.isIndeterminate1 =
        checkedCount > 0 && checkedCount < this.curCheckBoxList1.length;
    },
    //获取外部用户单位
    initTableList() {
      const params = {
        InOut: "O",
        Search: this.input,
        PageIndex: this.currentPage,
        PageNum: 10
      };
      GetCompanyList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;

          this.loading1 = false;
        })
        .catch(this.globelErrHandle);
    },
    //搜索
    searchCompany() {
      this.currentPage = 1;
      this.initTableList();
    },
    //序号
    indexMethod(index) {
      return index + 1;
    },
    //修改关联
    updateAssociation(index, row) {
      this.CompanyCode = row.Dwbh;
      this.getPublishList();
      this.getSubjectList();
      this.dialogVisible = true;
    },
    saveChange() {
      this.setLoading(true);
      this.updateCBFL();
      this.updateXKFL();

      var pubCheckList = [];
      var subCheckList = [];

      this.subjectBoxLists.forEach(item => {
        if(item.IsHas) {
          subCheckList.push({
            Type: 1,
            TypeValue: item.Name.replace(/\s+/g, "")
          })
        }
      });
      if (this.checkList.length === this.checkBoxLists.length) {
        pubCheckList = [
          {
            Type: 2,
            TypeValue: "全部"
          }
        ];
      } else {
        this.checkBoxLists.forEach(item => {
          if(item.IsHas) {
            pubCheckList.push({
              Type: 2,
              TypeValue: item.Name.replace(/\s+/g, "")
            });
          }
        });
      }

      const params = {
        TypeList: pubCheckList.concat(subCheckList),
        CompanyCode: this.CompanyCode
      };

      UpdateType(params)
        .then(this.globelReqHandle)
        .then(res => {
          if (res.Success) {
            this.$message("保存成功！");
            this.setLoading(false);
            this.dialogVisible = false;
          } else {
            this.$message.error("保存失败！");
            this.setLoading(false);
          }
        })
        .catch(this.globelErrHandle);
    },
    //获取分类列表
    getPublishList() {
      const params = {
        Cbfl: this.publishInput,
        CompanyCode: this.CompanyCode
      };

      GetCbflList(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.checkBoxLists = res.Data;
          this.curCheckBoxList = res.Data;

          this.total = res.Total;
          let newArr = [];
          res.Data.forEach(item => {
            if (item.IsHas) {
              newArr.push(item.Name);
            }
          });

          this.checkList = newArr;
        })
        .catch(this.globelErrHandle);
    },
    getSubjectList() {
      const params = {
        Xkfl: this.subjectInput,
        CompanyCode: this.CompanyCode
      };

      GetXkfllList(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.subjectBoxLists = res.Data;
          this.curCheckBoxList1 = res.Data;

          let newArr = [];
          res.Data.forEach(item => {
            if (item.IsHas) {
              newArr.push(item.Name);
            }
          });

          this.checkList1 = newArr;
        })
        .catch(this.globelErrHandle);
    },
    //搜索分类
    searchPublish(value) {

      const { checkBoxLists } = this;

      this.updateCBFL();
      /**
       * ------ 开始过滤数据 -------
       */
      const curCheckList = checkBoxLists.filter(item =>
        item.Name.includes(value)
      );
      const checkedList = curCheckList.filter(item => item.IsHas);

      this.checkList = checkedList.map(item => item.Name);
      this.curCheckBoxList = curCheckList;
    },
    updateCBFL() {
      // 全局所有出版分类复选数据
      const { checkBoxLists } = this;

      // 当前页出版分类数据
      const curCheckBoxList = this.curCheckBoxList;
      // 当前所有选中项
      const checkList = this.checkList;

      let isChecked;
      // 更新当前页复选数据
      this.curCheckBoxList = curCheckBoxList.map(item => {
        isChecked = checkList.includes(item.Name);

        item.IsHas = isChecked ? true : false;

        return item;
      });

      // 更新全局复选数据
      this.checkBoxLists = this.checkBoxLists.map(item => {
        let { Name } = item;
        this.curCheckBoxList.map(checkbox => {
          if (checkbox.Name === Name) item.IsHas = checkbox.IsHas;
        });

        return item;
      });
    },
    searchSubject(value) {
      const { subjectBoxLists  } = this;

      this.updateXKFL();

      /**
       * ------ 开始过滤数据 -------
       */
      const curCheckList = subjectBoxLists.filter(item =>
        item.Name.includes(value)
      );
      const checkedList = curCheckList.filter(item => item.IsHas);

      this.checkList1 = checkedList.map(item => item.Name);
      this.curCheckBoxList1 = curCheckList;
    },
    updateXKFL() {
      // 全局所有学科分类复选数据
      const { subjectBoxLists } = this;

      // 当前页学科分类数据
      const curCheckBoxList = this.curCheckBoxList1;
      // 当前所有选中项
      const checkList = this.checkList1;

      let isChecked;
      // 更新当前页复选数据
      this.curCheckBoxList1 = curCheckBoxList.map(item => {
        isChecked = checkList.includes(item.Name);

        item.IsHas = isChecked ? true : false;

        return item;
      });

      // 更新全局复选数据
      this.subjectBoxLists = this.subjectBoxLists.map(item => {
        let { Name } = item;
        this.curCheckBoxList1.map(checkbox => {
          if (checkbox.Name === Name) item.IsHas = checkbox.IsHas;
        });

        return item;
      });
    },
    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initTableList();
    },
    changeActive(e) {
      let content = e.target.innerHTML;

      switch (content) {
        case "出版分类":
          (this.subClassify = false),
            (this.pubClassify = true),
            (this.isPublish = true);
          break;
        case "学科分类":
          (this.pubClassify = false),
            (this.subClassify = true),
            (this.isPublish = false);
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
label {
  font-size: 14px;
  color: #555555;
  margin-right: 2%;
}
.MarginR {
  margin-right: 20px;
}
.modal {
  span {
    margin-right: 5%;
  }
}
.middle {
  margin-top: 30px;
}
.modal-container {
  overflow: hidden;
}
.left-nav {
  float: left;
  width: 10%;
  min-width: 100px;
  text-align: center;
  margin-right: 10px;
  a {
    display: inline-block;
    width: 56px;
    height: 40px;
    line-height: 40px;
    color: #666;
    font-size: 14px;
    text-decoration: none;
    padding-bottom: 5px;
  }
  .active {
    border-bottom: 2px solid #168ce2;
  }
}
.right-content {
  width: 85%;
  height: 450px;
  overflow-y: auto;
  padding-top: 10px;
  label {
    margin-bottom: 10px !important;
    margin-left: 0 !important;
  }
}
</style>

