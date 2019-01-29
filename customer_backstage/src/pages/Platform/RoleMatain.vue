<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      <span>角色维护</span>
      <el-button size="mini" style="margin-left:780px" @click="addUserOpen" type="primary">新增角色</el-button>
    </h2>
    <!-- <h2 class="char_tit clearfix">
      <label for="">角色名称:</label>
      <el-input placeholder="" class="MarginR" size="mini" style="width:200px;"></el-input>
      <el-button type="info" plain size="mini" @click="searchRole">查询</el-button>
    </h2> -->
    <!-- 表格部分 -->
    <div class="tab_wrap" v-loading="loading">
      <el-table :data="tableData" class="data_table" style="width: 100%" height="500" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center">
        </el-table-column>
        <el-table-column label="序号" align="center" width="80px" type="index" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="Name" label="角色名称" align="center">
        </el-table-column>
        <el-table-column prop="Operation" label="权限" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="changeUserOpen(scope.$index,scope.row)">{{scope.row.Operation}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页部分 -->
    <div class="page_wrap clearfix">
      <el-checkbox :disabled="!tableData.length" :value="allSelect" @change="handleSelectionAllChange(tableData)" class="checkAll">全选</el-checkbox>
      <el-button size="mini" style="margin-left:15px;" @click.native="deleteDialogVisible = true">删除</el-button>
      <el-pagination background layout="prev, pager, next" :total="total" class="fr pages" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10">
      </el-pagination>
    </div>
    <!-- 模态框新增-->
    <el-dialog :title="handleName" :visible.sync="dialogVisibleAdd" width="50%" class="add_user" :close-on-click-modal='false'>
      <div>
        <span>角色名称:</span>
        <el-input placeholder="请输入账号信息" v-model.trim="addObject.Name" class="modal_input" size="mini"></el-input>
        <p class="choose_permisson">选择权限</p>
        <div class="clearfix">
          <div class="asside_row">
            <el-tree :data="dataGoods" show-checkbox default-expand-all node-key="id" ref="tree1" highlight-current :props="defaultProps1" :default-checked-keys="treeShowData1">
            </el-tree>
          </div>
          <div class="asside_row">
            <el-tree :data="dataPlatform" show-checkbox default-expand-all node-key="id" ref="tree2" highlight-current :props="defaultProps2" :default-checked-keys="treeShowData2">
            </el-tree>
          </div>
          <div class="asside_row">
            <el-tree :data="dataCustomer" show-checkbox default-expand-all node-key="id" ref="tree3" highlight-current :props="defaultProps3" :default-checked-keys="treeShowData3">
            </el-tree>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addUser" size="mini">确 定</el-button>
      </div>
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
        <el-button type="primary" @click="delRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { globelFnHanle1, checkAll } from "@/common/js/mixin";
import { loadingStatus } from "@/common/js/mixin";
import bus from "@/bus";
import {
  GetAllRoleInfo,
  AddRole,
  GetRoleFuncList,
  ChangeRoleFun,
  DelRole
} from "@/api";

export default {
  name: "",
  data() {
    return {
      tableData: [],
      pageIndex: 1,
      pageSize: 15,
      total: null,
      currentPage: null,
      treeArr1: [],
      treeShowData1: [],
      treeArr2: [],
      treeShowData2: [],
      treeArr3: [],
      treeShowData3: [],
      multipleSelection: [],
      dataGoods: [
        {
          id: 1,
          label: "商品管理",
          children: [
            {
              id: 2,
              label: "首页配置",
              children: [
                {
                  id: 5,
                  label: "主题活动banner图",
                  FunctionCode: "ZTHDBNT",
                  FunctionGuid: "25B168B4834B47309D3D33211ECAED9B"
                },
                {
                  id: 6,
                  label: "热词推荐管理",
                  FunctionCode: "RCTJGL",
                  FunctionGuid: "7072A0FB4CDD46A6A49F065203868B78"
                },
                {
                  id: 7,
                  label: "最新图书（首页）",
                  FunctionCode: "ZXTSSY",
                  FunctionGuid: "670A3AC1FB824F1F940B9E474AC857BA"
                },
                {
                  id: 8,
                  label: "畅销图书（首页)",
                  FunctionCode: "CXTSSY",
                  FunctionGuid: "6213463581C3439A81D3686040A76652"
                },
                {
                  id: 9,
                  label: "重点产品（首页）",
                  FunctionCode: "ZDCPSY",
                  FunctionGuid: "82FA698A9AC44EFB938A132942206AB0"
                },
                {
                  id: 10,
                  label: "大中专教材（首页）",
                  FunctionCode: "DZZJCSY",
                  FunctionGuid: "77231B49724A4433AB5BD59D2CC4F6B9"
                },
                {
                  id: 11,
                  label: "多元产品(首页)",
                  FunctionCode: "DYCCSY",
                  FunctionGuid: "B4359E9E2D424E47BC2D6A5741A969E9"
                }
              ]
            },
            {
              id: 3,
              label: "商品信息表",
              children: [
                {
                  id: 12,
                  label: "商品列表",
                  FunctionCode: "SPXXB",
                  FunctionGuid: "7BD71B47AA0C4C43831637DBC4334FC7"
                }
              ]
            },
            {
              id: 4,
              label: "频道维护",
              children: [
                {
                  id: 13,
                  label: "大中专教材出版社维护",
                  FunctionCode: "DZZJCCBSWH",
                  FunctionGuid: "4005CE396DA945BD8379210FA99A313F"
                },
                {
                  id: 14,
                  label: "大中专教材最新图书维护",
                  FunctionCode: "DZZJCZXTSWH",
                  FunctionGuid: "FFD473A016014948B6AD5D44A1833F34"
                },
                {
                  id: 15,
                  label: "大中专教材商品排序",
                  FunctionCode: "DZZJCSPPX",
                  FunctionGuid: "DC444D0660DA40E7875BA487FE93BAF2"
                },
                {
                  id: 16,
                  label: "畅销图书排序",
                  FunctionCode: "CXTSSPPX",
                  FunctionGuid: "B04F05215ACC4874875B17A23DFA6B85"
                },
                {
                  id: 17,
                  label: "重点产品排序",
                  FunctionCode: "ZDCPSPPX",
                  FunctionGuid: "AB5F8AB5C62B43BDA7AD04BC61C75D66"
                },
                {
                  id: 18,
                  label: "多元产品排序",
                  FunctionCode: "DYCPSPPX",
                  FunctionGuid: "C9F16E3D85984A8EBCE4E346DF19F779"
                },
                {
                  id: 19,
                  label: "最新图书排序",
                  FunctionCode: "ZXTSSPPX",
                  FunctionGuid: "F1C2BD0866054164BA72E8267CE4605F"
                },
                {
                  id: 20,
                  label: "采访数据排序",
                  FunctionCode: "CFSJSPPX",
                  FunctionGuid: "B681B6C55FDC4C32B15D5DB4173FB6B7"
                }
              ]
            }
          ]
        }
      ],
      dataPlatform: [
        {
          id: 1,
          label: "平台管理",
          children: [
            {
              id: 2,
              label: "用户管理",
              children:[
                {
                  id: 5,
                  label: "用户信息管理",
                  FunctionCode: "YHXXGL",
                  FunctionGuid: "AD6D1000A420498EB882D1F4BF50FC6C"
                },
                {
                  id: 6,
                  label: "角色维护",
                  FunctionCode: "JSWH",
                  FunctionGuid: "1D25D7D44ABC4C15BC8B963BA4312991"
                },
                {
                  id: 7,
                  label: "后台用户权限管理",
                  FunctionCode: "HTQXGL",
                  FunctionGuid: "0909B028DD3A4D70898F6C7B5C4187D9"
                },
                {
                  id: 8,
                  label: "单位关联维护",
                  FunctionCode: "DWGLWH",
                  FunctionGuid: "FA4A94DBDE9040EB8B025664AC1AD4B3"
                }
              ]
            },
            {
              id: 3,
              label: "功能管理",
              children:[
                {
                  id: 9,
                  label: "区域业务员维护",
                  FunctionCode: "QYYWYWW",
                  FunctionGuid: "DF4B253FB88B4660964078ED47D794D1"
                },
                {
                  id: 10,
                  label: "问候语管理",
                  FunctionCode: "WHYGL",
                  FunctionGuid: "3F0C8D2F56734E9BA60A0C8A4948165B"
                },
                {
                  id: 11,
                  label: "出版社排序",
                  FunctionCode: "CBSPX",
                  FunctionGuid: "96BE6A4466A84058AF0797BCF4148C79"
                },
                {
                  id: 12,
                  label: "二级频道管理",
                  FunctionCode: "EJPDGL",
                  FunctionGuid: "C857205CAEE3496B9FB4D6DE8D29F4E5"
                },
                {
                  id: 13,
                  label: "馆藏数据推荐上传管理",
                  FunctionCode: "GCSJTJSCGL",
                  FunctionGuid: "2555B17333714A3D8E8AE5C6D0B0E485"
                }
              ]
            },
            {
              id: 4,
              label: "订单信息",
              children:[
                {
                  id: 14,
                  label: "订单详情",
                  FunctionCode: "DDXQ",
                  FunctionGuid: "0C77F00895FD490AA8BFBCE76AC12D20"
                }
              ]
            }
          ]
        }
      ],
      dataCustomer: [
        {
          id: 1,
          label: "客服管理",
          children: [
            {
              id: 2,
              label: "客服管理",
              children: [
                {
                  label: "最新图书客服",
                  id: 4,
                  FunctionCode: "ZXTSPDKF",
                  FunctionGuid: "98A5FC3ACDBD40FBB7194361046A73E0"
                },
                {
                  label: "重点产品客服",
                  id: 5,
                  FunctionCode: "ZDCPPDKF",
                  FunctionGuid: "E061782EDB624EE19E67D8E290C115CE"
                },
                {
                  label: "主题活动客服",
                  id: 6,
                  FunctionCode: "ZTHDPDKF",
                  FunctionGuid: "75EB4A475C134E48B763933CF3F2C13B"
                },
                {
                  label: "畅销图书客服",
                  id: 7,
                  FunctionCode: "CXTSPDKF",
                  FunctionGuid: "D8E069974C094E43A774819D310F8C4B"
                },
                {
                  label: "大中专教材客服",
                  id: 8,
                  FunctionCode: "DZZJCPDKF",
                  FunctionGuid: "0FA90DD3A14648579A7D5576BC468F43"
                },
                {
                  label: "多元产品客服",
                  id: 9,
                  FunctionCode: "DYCPPDKF",
                  FunctionGuid: "630C363EBBB74DC7A11B3532AE875415"
                }
              ]
            },
            {
              id: 3,
              label: "客户购物车信息",
              children: [
                {
                  label: "客户购物车信息",
                  id: 10,
                  FunctionCode: "KHGWCXX",
                  FunctionGuid: "A46A330C091D42EFA6164A870500672E"
                }
              ]
            }
          ]
        }
      ],
      defaultProps1: {
        children: "children",
        label: "label"
      },
      defaultProps2: {
        children: "children",
        label: "label"
      },
      defaultProps3: {
        children: "children",
        label: "label"
      },
      newUser: "",
      dialogVisibleAdd: false,
      handleName: "新增角色",
      addObject: {
        Name: "",
        Guid: ""
      },
      paramas: null,
      deleteDialogVisible:false
    };
  },
  created() {
    // 初始化表格信息
    this.initTableData();
  },
  mixins: [globelFnHanle1, checkAll, loadingStatus],
  methods: {
    addUserOpen() {
      this.dialogVisibleAdd = true;
      this.handleName = "新增角色";
      this.addObject.Name = "";
      this.$nextTick(() => {
        this.$refs.tree1.setCheckedKeys([]);
        this.$refs.tree2.setCheckedKeys([]);
        this.$refs.tree3.setCheckedKeys([]);
      });
    },
    searchRole() {},
    getUserTree(params) {
      this.treeArr1 = [];
      this.treeShowData1 = [];
      this.treeArr2 = [];
      this.treeShowData2 = [];
      this.treeArr3 = [];
      this.treeShowData3 = [];
      GetRoleFuncList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          let arr1 = [];
          res.Data.map(x => {
            if (
              x.ParentName === "频道维护" ||
              x.ParentName === "首页配置" ||
              x.ParentName === "商品管理"
            ) {
              if (x.IsHas === "1") {
                arr1.push(x);
              }
            }
          });
          this.treeArr1 = arr1;
          for (var i = 0; i < this.treeArr1.length; i++) {
            for (var j = 0; j < this.dataGoods[0].children.length; j++) {
              for (
                var k = 0;
                k < this.dataGoods[0].children[j].children.length;
                k++
              ) {
                if (
                  this.treeArr1[i].FunctionGuid ===
                  this.dataGoods[0].children[j].children[k].FunctionGuid
                ) {
                  this.treeShowData1.push(
                    this.dataGoods[0].children[j].children[k].id
                  );
                }
              }
            }
          }
          this.$refs.tree1.setCheckedKeys(this.treeShowData1);
          let arr2 = [];
          res.Data.map(x => {
            if (x.ParentName === "用户管理" || x.ParentName === "功能管理" || x.ParentName === "订单信息") {
              if (x.IsHas === "1") {
                arr2.push(x);
              }
            }
          });
          this.treeArr2 = arr2;
          for (var i = 0; i < this.treeArr2.length; i++) {
            for (var j = 0; j < this.dataPlatform[0].children.length; j++) {
              for (
                var k = 0;
                k < this.dataPlatform[0].children[j].children.length;
                k++
              ) {
                if (
                  this.treeArr2[i].FunctionGuid ===
                  this.dataPlatform[0].children[j].children[k].FunctionGuid
                ) {
                  this.treeShowData2.push(this.dataPlatform[0].children[j].children[k].id);
                }
              }

            }
          }
          this.$refs.tree2.setCheckedKeys(this.treeShowData2);
          let arr3 = [];
          res.Data.map(x => {
            if (
              x.ParentName === "客服管理" ||
              x.ParentName === "客户购物信息"
            ) {
              if (x.IsHas === "1") {
                arr3.push(x);
              }
            }
          });
          this.treeArr3 = arr3;
          for (var i = 0; i < this.treeArr3.length; i++) {
            for (var j = 0; j < this.dataCustomer[0].children.length; j++) {
              for (
                var k = 0;
                k < this.dataCustomer[0].children[j].children.length;
                k++
              ) {
                if (
                  this.treeArr3[i].FunctionGuid ===
                  this.dataCustomer[0].children[j].children[k].FunctionGuid
                ) {
                  this.treeShowData3.push(
                    this.dataCustomer[0].children[j].children[k].id
                  );
                }
              }
            }
          }
          this.$refs.tree3.setCheckedKeys(this.treeShowData3);
        })
        .catch(this.globelErrHandle);
    },
    changeUserOpen(index, scope) {
      this.dialogVisibleAdd = true;
      this.handleName = "修改权限";
      this.addObject.Name = scope.Name;
      let paramas = {
        RoleId: scope.Code
      };
      this.paramas = {
        Id: scope.Code
      };
      this.getUserTree(paramas);
    },
    delRole() {
      let arr = [];
      this.multipleSelection.map(x => {
        arr.push(x.Code);
      });
      const params = {
        RoleId: arr.join(",")
      };
      DelRole(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initTableData();
            this.deleteDialogVisible = false;
          }
        })
        .catch(this.globelErrHandle);
    },
    addUser() {
      let arr = [
        ...this.$refs.tree1.getCheckedNodes(),
        ...this.$refs.tree2.getCheckedNodes(),
        ...this.$refs.tree3.getCheckedNodes()
      ];
      let GuidArr = [];
      arr.map(x => {
        GuidArr.push(x.FunctionGuid);
      });
      for (let i = GuidArr.length - 1; i >= 0; i--) {
        if (GuidArr[i] == undefined) {
          GuidArr.splice(i, 1);
        }
      }
      if (this.handleName == "新增角色") {
        const params = {
          Name: this.addObject.Name.replace(/\s+/g,""),
          Guid: GuidArr.join(",")
        };
        if (this.addObject.Name == "") {
          this.$message.error("角色名称不能为空");
          return false;
        }
        AddRole(params)
          .then(this.globelReqHandle1)
          .then(res => {
            if (res.Success) {
              this.$message("新增成功");
              this.initTableData();
              this.dialogVisibleAdd = false;
            }
          })
          .then(this.globelErrHandle);
      } else {
        const paramas = {
          Name: this.addObject.Name.replace(/\s+/g,""),
          Id: this.paramas.Id,
          Guid: GuidArr.join(",")
        };
        if (this.addObject.Name == "") {
          this.$message.error("角色名称不能为空");
          return false;
        }

        ChangeRoleFun(paramas)
          .then(this.globelReqHandle1)
          .then(res => {
            if (res.Success) {
              this.$message("修改成功");
              this.initTableData();
              this.dialogVisibleAdd = false;

              //派发权限改变事件到headerTop组件
              bus.$emit("headerChange", "change");
            }
          })
          .catch(this.globelErrHandle);
      }
    },
    indexMethod(index) {
      return index + 1;
    },
    initTableData() {
      const params = {
        RoleId: ""
      };
      GetAllRoleInfo(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.tableData = res.Data;
          this.tableData.map(x => {
            x.Operation = "修改";
          });
          this.total = res.Total;
          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>
<style lang="scss" scoped>
label {
  font-size: 14px;
  color: #555555;
}
.add_user {
  span {
    display: inline-block;
    width: 80px;
    margin-right: 20px;
  }
  .modal_input {
    width: 200px;
  }
}

.MarginR {
  margin-right: 20px;
}
.asside_row {
  width: 250px;
  float: left;
  margin-right: 1%;
  height: 530px;
  margin-top: 30px;
  label {
    display: block;
    margin: 0 !important;
    padding-left: 10px;
  }
}
.choose_permisson {
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}
</style>

