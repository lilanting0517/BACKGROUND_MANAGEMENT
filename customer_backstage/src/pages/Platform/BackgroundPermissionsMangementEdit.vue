<template>
  <div class="main">
    <h2 class="char_tit">
      管理员信息
    </h2>
    <div class="manager_detail">
      <div class="center_text">
        <el-form :inline="true" :model="form">
          <el-form-item label="管理员名称：">
            <span class="adminInfo">{{UserId}}</span>
          </el-form-item>
          <el-form-item label="管理员类型：">
            <span class="adminInfo">{{RoleName}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <h2 class="char_tit">
      选择权限
    </h2>
    <div class="clearfix">
      <div class="asside_row">
        <el-tree :data="dataGoods" show-checkbox default-expand-all node-key="id" ref="tree1" highlight-current :props="defaultProps" :default-checked-keys="treeShowData1">
        </el-tree>
      </div>
      <div class="asside_row">
        <el-tree :data="dataPlatform" show-checkbox default-expand-all node-key="id" ref="tree2" highlight-current :props="defaultProps" :default-checked-keys="treeShowData2">
        </el-tree>
      </div>
      <div class="asside_row">
        <el-tree :data="dataCustomer" show-checkbox default-expand-all node-key="id" ref="tree3" highlight-current :props="defaultProps" :default-checked-keys="treeShowData3">
        </el-tree>
      </div>
    </div>
    <div>
      <el-button type="primary" size="mini" class="fr" style="margin-right:5%;" @click="saveChange">保存</el-button>
      <el-button size="mini" class="fr" style="margin-right:2%;" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
import {
  globelFnHanle,
  globelFnHanle1,
  checkAll,
  loadingStatus
} from "@/common/js/mixin";
import { GetUserAuthorize, ChangeUserAuthorize, GetCompanyList,ChangeUser } from "@/api";
export default {
  name: "backgroundperssionmanagement",
  data() {
    return {
      activeNames: "",
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
      treeArr1: [],
      treeShowData1: [],
      treeArr2: [],
      treeShowData2: [],
      treeArr3: [],
      treeShowData3: [],
      Name: "",
      RoleName: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {
        psw:'',
        companyName:''
      },
      companyList:[],
      CompanyCode:'',
      UserId:''
    };
  },
  mixins: [globelFnHanle, globelFnHanle1],
  created() {
    this.initCompanyList();
  },
  mounted() {
    let query = this.$route.query;
    this.UserId = query.id;
    this.RoleName = query.roleName;
    let params = {
      UserId:this.UserId
    };
    this.getUserTree(params);
  },
  methods: {
    configGoods() {},
    configPlatform() {},
    configCustomer() {},
    initCompanyList() {
      const params = {
        InOut: "I"
      };

      GetCompanyList(params)
        .then(this.globelReqHandle1)
        .then(res => {
          this.companyList = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    selectCompany(item) {
      this.CompanyCode = item.Dwbh;
    },
    getUserTree(params) {
      this.treeArr1 = [];
      this.treeShowData1 = [];
      this.treeArr2 = [];
      this.treeShowData2 = [];
      this.treeArr3 = [];
      this.treeShowData3 = [];
      GetUserAuthorize(params)
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
    saveChange() {
      //保存管理员权限
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
      const params = {
        Name: this.UserId,
        Guid: GuidArr.join(",")
      };
      ChangeUserAuthorize(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("保存成功");
            this.$router.go(-1);
          }
        })
        .then(this.globelErrHandle);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.manager_detail {
  height: 100px;
  position: relative;
  background-color: #fff;
  border-bottom: #f3f3f3 2px solid;
  padding: 25px;

  .adminInfo {
    font-weight: 550;
    width: 150px;
    display: inline-block;
  }
}
.asside_row {
  width: 32%;
  float: left;
  margin-right: 1%;
  height: 530px;
  label {
    display: block;
    margin: 0 !important;
    padding-left: 10px;
  }
  .el-checkbox__inner {
    margin-right: 10px;
  }
  .el-tree-node__contentp:nth-child(1) {
    background-color: #e8f2fe !important;
  }
}
</style>
