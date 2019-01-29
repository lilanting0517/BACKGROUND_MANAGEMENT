<template>
  <div class="goodsMatain">
    <h2 class="char_tit">
      <span class="dy_title">添加商品</span>
      <el-button size="mini" style="margin-left:3%;" @click="batchImport" class="fr center-btn" type="primary">批量导入</el-button>
      <el-button size="mini" style="margin-left:3%;" @click="addItem" class="fr center-btn right-btn" type="primary">单个添加</el-button>
    </h2>
    <h2 class="char_tit clearfix">
      <span>商品查询:</span>
      <el-input placeholder="商品名称/订单号" class="MarginR" size="mini" style="width:150px; margin-right:50px;" v-model.trim="searchForm.Search"></el-input>
      <span>商品类型:</span>
      <!-- <el-input placeholder="类型ID/类型名称" class="MarginR" size="mini" style="width:150px;margin-right:50px;"></el-input> -->
      <el-select v-model.trim="value" placeholder="类型ID/类型名称" size="mini" @change="typeChange">
        <el-option v-for="item in optionsType" :key="item.Name" :label="item.Name" :value="item.Name">
        </el-option>
      </el-select>
      <span>是否已上架:</span>
      <el-select v-model.trim="value1" placeholder="请选择" size="mini" @change="statusChange">
        <el-option v-for="item in options" :key="item.ChannelName" :label="item.ChannelName" :value="item.ChannelName">
        </el-option>
      </el-select>
      <el-button size="mini" @click="search" class="fr center-btn" type="primary">搜索</el-button>
    </h2>
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" height="500">
        <el-table-column prop="Seq" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="Id" label="商品ID" align="center">
        </el-table-column>
        <el-table-column prop="Name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="Price" label="定价" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Price ? (scope.row.Price * 1).toFixed(2) : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="TypeId" label="类型ID" align="center"></el-table-column>
        <el-table-column prop="Type" label="商品类型" align="center"></el-table-column>
        <el-table-column prop="SpecificationId" label="规格ID" align="center"></el-table-column>
        <el-table-column prop="Specification" label="规格" align="center"></el-table-column>
        <el-table-column prop="BrandId" label="包装ID" align="center"></el-table-column>
        <el-table-column prop="Brand" label="包装" align="center"></el-table-column>
        <el-table-column prop="Summary" label="商品介绍" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip placement="top" effect="light">
              <div slot="content" style="max-width:200px">{{scope.row.Summary}}</div>
              <div>
                {{scope.row.Summary}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="IsUse" label="上架状态" align="center"></el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="sJ(scope.$index,scope.row)" :disabled="scope.row.IsUse==='已上架'">上架</el-button>
            <el-button type="text" size="small" @click="xJ(scope.$index,scope.row)" :disabled="scope.row.IsUse==='已下架'">下架</el-button>
            <el-button type="text" size="small" @click="delItem(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="changeSeq" label="排列修改" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="changeSeq(scope.$index,scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_wrap clearfix">
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>
    <!-- 模态框修改-->
    <el-dialog title="" :visible.sync="dialogVisibleMove" width="20%" class="add_user" :close-on-click-modal='false'>
      <h3 class="modal_title">将商品: {{Name}} </h3>
      <div class="modal_content" style="margin-top:10px;">
        <span> 移动到：序列</span>
        <el-input-number v-model.trim="num" @change="handleChange" :min="1" label="描述文字" size="mini" style="width:100px;"></el-input-number>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMove = false" size="mini">取消</el-button>
        <el-button type="primary" @click="updateListSeq()" size="mini" style="width:21%;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>






<script>
import {
  SearchMultiGoods,
  ChangeState,
  ChangeGoods,
  GetPropetry,
  ChangeSeq
} from "@/api";
import {
  loadingStatus,
  globelFnHanle,
  globelFnHanle1
} from "@/common/js/mixin";
export default {
  name: "GoodsMatain",
  data() {
    return {
      options: [
        {
          ChannelName: "全部"
        },
        {
          ChannelName: "上架"
        },
        {
          ChannelName: "下架"
        }
      ],
      optionsType: [],
      tableData: [],
      num: "",
      dialogVisibleMove: false,
      value: "",
      value1: "",
      total: 0,
      Name: "",
      currentPage: 1,
      searchForm: {
        Search: "",
        ShowAll: 2,
        TypeId: ""
      },
      params: null,
      issj: false,
      isxj: false
    };
  },
  mixins: [loadingStatus, globelFnHanle],
  mounted() {
    this.initData();
    this.initList();
  },
  methods: {
    initData() {
      this.setLoading(true);
      const params = {
        Search: "",
        PageIndex: this.currentPage,
        PageNum: 10,
        PriceStart: "",
        PriceEnd: "",
        ShowAll: 2,
        TypeId: ""
      };
      SearchMultiGoods(params)
        .then(this.globelFnHanle)
        .then(res => {
          this.setLoading(false);
          this.tableData = res.Data;
          this.total = res.Total;
          this.tableData.map(x => {
            x.IsUse = x.IsUse === "0" ? "已下架" : "已上架";
          });
        })
        .catch(this.globelErrHandle);
    },
    initList() {
      const params = { PageIndex: 1, PageNum: 10000, Type: 0 };
      GetPropetry(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.optionsType = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    handleChange(val) {},
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },
    batchImport() {
      this.$router.push({ name: "ImportBatch" });
    },
    addItem() {
      this.$router.push({ name: "SingleAdd" });
    },
    sJ(index, scope) {
      console.log(scope);
      const params = {
        Guid: scope.Guid,
        State: 1
      };
      ChangeState(params)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Success) {
            this.$message("上架成功");
            this.initData();
          }
        })
        .catch(this.globelErrHandle);
    },
    xJ(index, scope) {
      const params = {
        Guid: scope.Guid,
        State: 0
      };
      ChangeState(params)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Success) {
            this.$message("下架成功");
            this.initData();
          }
        })
        .catch(this.globelErrHandle);
    },
    delItem(index, scope) {
      const params = {
        BrandId: "",
        BrandName: "",
        SpecificationId: "",
        SpecificationName: "",
        Id: "",
        Name: "",
        Img: "",
        PackageId: "",
        PackageName: "",
        Price: "",
        Summary: "",
        TypeId: "",
        TypeName: "",
        Method: "delete",
        Guid: scope.Guid
      };
      ChangeGoods(params)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initData();
          }
        })
        .catch(this.globelErrHandle);
    },
    statusChange(val) {
      switch (val) {
        case "全部":
          this.searchForm.ShowAll = 2;
          break;
        case "上架":
          this.searchForm.ShowAll = 1;
          break;
        case "下架":
          this.searchForm.ShowAll = 0;
          break;
      }
    },
    typeChange(val) {
      this.optionsType.map(x => {
        if (x.Name === val) {
          this.searchForm.TypeId = x.Id;
        }
      });
    },
    search() {
      const params = {
        Search: this.searchForm.Search.replace(/\s+/g,""),
        PageIndex: this.currentPage,
        PageNum: 10,
        PriceStart: "",
        PriceEnd: "",
        ShowAll: this.searchForm.ShowAll,
        TypeId: this.searchForm.TypeId
      };
      SearchMultiGoods(params)
        .then(this.globelFnHanle)
        .then(res => {
          this.tableData = res.Data;
          this.total = res.Total;
          this.tableData.map(x => {
            x.IsUse = x.IsUse === "0" ? "已下架" : "已上架";
          });
        })
        .catch(this.globelErrHandle);
    },
    changeSeq(index, scope) {
      this.dialogVisibleMove = true;
      this.Name = scope.Name;
      const params = {
        Seq: this.num,
        GoodsId: scope.Id,
        ChannelCode: "6",
        methods: "update"
      };
      this.params = params;
    },
    updateListSeq() {
      const params = {
        Seq: this.num,
        GoodsId: this.params.GoodsId,
        ChannelCode: "6",
        Type: "3",
        Method: "update"
      };
      ChangeSeq(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("修改成功");
            this.dialogVisibleMove = false;
            this.initData();
          }
        })
        .catch(this.globelErrHandle);
    }
  }
};
</script>






<style lang="scss">
.goodsMatain {
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
  .right-btn {
    right: 110px;
  }
  .el-table .cell {
    max-height: 95px !important;
  }
}

</style>
