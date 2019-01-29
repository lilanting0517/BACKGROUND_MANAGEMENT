<template>
  <div class="main">
    <h2 class="char_tit">
      <span class="dy_title">选择属性:</span>
      <el-select v-model.trim="value" placeholder="请选择" size="mini" style="width:200px;" @change="getChoosed">
        <el-option v-for="item in options" :key="item.ChannelName" :label="item.ChannelName" :value="item.ChannelName">
        </el-option>
      </el-select>
    </h2>
    <div v-show="choosed==='类型'">
      <h2 class="char_tit">
        <span class="dy_title">类型名称:</span>
        <el-input style="width:200px;margin-right:30px;" size="mini" v-model.trim="Name0"></el-input>
        <span class="dy_title">类型ID:</span>
        <el-input style="width:200px" size="mini" v-model.trim="Id0"></el-input>
        <el-button size="mini" @click="confirmAdd" type="primary">确定添加</el-button>
      </h2>
      <h2 class="char_tit">
        <span>属性列表</span>
      </h2>
      <div class="tab_wrap">
        <el-table :data="tableData0" height="500">
          <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="Id" label="类型ID" align="center"></el-table-column>
          <el-table-column prop="Name" label="类型名称" align="center"></el-table-column>
          <el-table-column prop="Operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delItem(scope.$index,scope.row)">{{scope.row.Operation}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total0" class="fr pages" @current-change="handleCurrentChange0" :current-page="currentPage0" :page-size="10">
        </el-pagination>
      </div>
    </div>
    <div v-show="choosed==='包装'">
      <h2 class="char_tit">
        <span class="dy_title">包装名称:</span>
        <el-input style="width:200px;margin-right:30px;" size="mini" v-model.trim="Name3"></el-input>
        <span class="dy_title">包装ID:</span>
        <el-input style="width:200px" size="mini" v-model.trim="Id3"></el-input>
        <el-button size="mini" @click="confirmAdd" type="primary">确定添加</el-button>
      </h2>
      <h2 class="char_tit">
        <span>属性列表</span>
      </h2>
      <div class="tab_wrap">
        <el-table :data="tableData3" height="500">
          <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="Id" label="包装ID" align="center"></el-table-column>
          <el-table-column prop="Name" label="包装名称" align="center"></el-table-column>
          <el-table-column prop="ChannelName" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delItem(scope.$index,scope.row)">{{scope.row.Operation}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total3" class="fr pages" @current-change="handleCurrentChange3" :current-page="currentPage3" :page-size="10">
        </el-pagination>
      </div>
    </div>
    <div v-show="choosed==='规格'">
      <h2 class="char_tit">
        <span class="dy_title">规格名称:</span>
        <el-input style="width:200px;margin-right:30px;" size="mini" v-model.trim="Name1"></el-input>
        <span class="dy_title">规格ID:</span>
        <el-input style="width:200px" size="mini" v-model.trim="Id1"></el-input>
        <el-button size="mini" @click="confirmAdd" type="primary">确定添加</el-button>
      </h2>
      <h2 class="char_tit">
        <span>属性列表</span>
      </h2>
      <div class="tab_wrap">
        <el-table :data="tableData1" height="500">
          <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="Id" label="规格ID" align="center"></el-table-column>
          <el-table-column prop="Name" label="规格名称" align="center"></el-table-column>
          <el-table-column prop="ChannelName" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delItem(scope.$index,scope.row)">{{scope.row.Operation}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total1" class="fr pages" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-size="10">
        </el-pagination>
      </div>
    </div>
    <div v-show="choosed==='品牌'">
      <h2 class="char_tit">
        <span class="dy_title">品牌名称:</span>
        <el-input style="width:200px;margin-right:30px;" size="mini" v-model.trim="Name2"></el-input>
        <span class="dy_title">品牌ID:</span>
        <el-input style="width:200px" size="mini" v-model.trim="Id2"></el-input>
        <el-button size="mini" @click="confirmAdd" type="primary">确定添加</el-button>
      </h2>
      <h2 class="char_tit">
        <span>属性列表</span>
      </h2>
      <div class="tab_wrap">
        <el-table :data="tableData2" height="500">
          <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="Id" label="品牌ID" align="center"></el-table-column>
          <el-table-column prop="Name" label="品牌名称" align="center"></el-table-column>
          <el-table-column prop="ChannelName" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delItem(scope.$index,scope.row)">{{scope.row.Operation}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page_wrap clearfix">
        <el-pagination background layout="prev, pager, next" :total="total2" class="fr pages" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-size="10">
        </el-pagination>
      </div>
    </div>
  </div>
</template>













<script>
import { DelPropetry, AddPropetry, GetPropetry } from "@/api";
import { globelFnHanle, globelFnHanle1 } from "@/common/js/mixin";
export default {
  name: "AttributeMatain",
  mixins: [globelFnHanle],
  data() {
    return {
      tableData0: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      Name0: "",
      Name1: "",
      Name2: "",
      Name3: "",
      Id0: "",
      Id1: "",
      Id2: "",
      Id3: "",
      total0: null,
      total1: null,
      total2: null,
      total3: null,
      currentPage0: null,
      currentPage1: null,
      currentPage2: null,
      currentPage3: null,
      changObj: {
        brandContainer: false,
        packageContainer: true,
        ggContainer: false,
        classifyContainer: false
      },
      options: [
        {
          ChannelName: "规格"
        },
        {
          ChannelName: "品牌"
        },
        {
          ChannelName: "包装"
        },
        {
          ChannelName: "类型"
        }
      ],
      tableData: [],
      value: "类型",
      PackageName: "",
      PackageId: "",
      choosed: "类型"
    };
  },
  mounted() {
    const params = {
      PageIndex: 1,
      PageNum: 10,
      Type: 0
    };
    GetPropetry(params)
      .then(this.globelFnHanle)
      .then(res => {
        this.tableData0 = res.Data;
        this.tableData0.map(x => {
          x.Operation = "删除";
        });
      })
      .catch(this.globelErrHandle);
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    getType() {
      let Type;
      switch (this.value) {
        case "类型":
          Type = 0;
          break;
        case "规格":
          Type = 1;
          break;
        case "品牌":
          Type = 2;
          break;
        case "包装":
          Type = 3;
          break;
      }
      return Type;
    },
    initData() {
      let Type = this.getType();
      const params = {
        PageIndex: 1,
        PageNum: 10,
        Type
      };
      GetPropetry(params)
        .then(this.globelFnHanle1)
        .then(res => {
          if (Type == 0) {
            this.tableData0 = res.Data;
            this.tableData0.map(x => {
              x.Operation = "删除";
            });
            this.total0 = res.Total;
          }
          if (Type == 1) {
            this.tableData1 = res.Data;
            this.tableData1.map(x => {
              x.Operation = "删除";
            });
            this.total1 = res.Total;
          }
          if (Type == 2) {
            this.tableData2 = res.Data;
            this.tableData2.map(x => {
              x.Operation = "删除";
            });
            this.total2 = res.Total;
          }
          if (Type == 3) {
            this.tableData3 = res.Data;
            this.tableData3.map(x => {
              x.Operation = "删除";
            });
            this.total3 = res.Total;
          }
        })
        .catch(this.globelErrHandle);
    },
    getObj() {},
    getChoosed(val) {
      this.choosed = val;
      this.value = val;
      let Type = this.getType();
      const params = {
        PageIndex: 1,
        PageNum: 10,
        Type
      };
      GetPropetry(params)
        .then(this.globelFnHanle1)
        .then(res => {
          if (Type == 0) {
            this.tableData0 = res.Data;
            this.tableData0.map(x => {
              x.Operation = "删除";
            });
            this.total0 = res.Total;
          }
          if (Type == 1) {
            this.tableData1 = res.Data;
            this.tableData1.map(x => {
              x.Operation = "删除";
            });
            this.total1 = res.Total;
          }
          if (Type == 2) {
            this.tableData2 = res.Data;
            this.tableData2.map(x => {
              x.Operation = "删除";
            });
            this.total2 = res.Total;
          }
          if (Type == 3) {
            this.tableData3 = res.Data;
            this.tableData3.map(x => {
              x.Operation = "删除";
            });
            this.total3 = res.Total;
          }
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange0(val) {},
    handleCurrentChange1(val) {},
    handleCurrentChange2(val) {},
    handleCurrentChange3(val) {},
    confirmAdd() {
      let Type = this.getType();
      if (Type == 0) {
        var Id = this.Id0.replace(/\s+/g,"");
        var Name = this.Name0.replace(/\s+/g,"");
      }
      if (Type == 1) {
        var Id = this.Id1;
        var Name = this.Name1;
      }
      if (Type == 2) {
        var Id = this.Id2;
        var Name = this.Name2;
      }
      if (Type == 3) {
        var Id = this.Id3;
        var Name = this.Name3;
      }
      const params = {
        Type,
        Id,
        Name
      };
      AddPropetry(params)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Success) {
            this.$message("添加成功");
            this.initData();
          }
        })
        .catch(this.globelErrHandle);
    },
    delItem(index, scope) {
      // console.log(scope);
      const params = {
        Guid: scope.Guid
      };
      DelPropetry(params)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initData();
          }
        })
        .catch(this.globelErrHandle);
    }
  }
};
</script>



<style lang="scss" scoped>
span {
  font-size: 14px;
  margin-right: 10px;
}
.center-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
</style>


