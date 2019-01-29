<template>
  <div class="main">
    <div class="tab">
      <div style="width:980px">
        <ul style="width:980px">
          <li v-for="(item,index) in arr" class="first-level">
            <el-button type="primary" size="mini">{{item.Name}}</el-button>
            <ul>
              <li v-for="(detail,idx) in item.ChildChannel" class="item-btn">
                <el-button plain size="mini" :title="detail.Name" @click="editItem(index,idx)">{{detail.Name}}</el-button>
                <a href="javascript:;" @click="delItemConfirm(index,idx)">×</a>
              </li>
              <li>
                <el-button plain style="font-size:26px;line-height:26px;" size="mini" @click="addItem(index)"> + </el-button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogTableVisible" width="30%" :close-on-click-modal='false'>
      <div>
        <el-input v-model.tirm="twoLevelName" placeholder="请输入二级模块名称" size="mini"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="text-align:left;margin-bottom:30px;" v-if="title==='主题活动新增二级模块' || title.substr(0, 4)==='修改主题'">
          <div class="demonstration" style="margin-top:-20px;margin-bottom:20px;font-size:14px;">活动时间为：</div>
          <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
        <el-button @click="dialogTableVisible = false" size="mini">取消</el-button>
        <el-button type="primary" @click="saveState" size="mini">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :close-on-click-modal='false'
    >
      <span>确定删除该频道吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { globelFnHanle1 } from "@/common/js/mixin";
import { GetChannelTree } from "@/api/index";
import { AddChannel, ChangeChannel, DeleteChannel } from "@/api/index";
export default {
  name: "ChannelBarMatain",
  data() {
    return {
      title: "新增首页二级模块",
      time: "",
      code: null,
      arr: [
      ],
      firstLevel: 0,
      indexChange: 0,
      idxChange: 0,
      twoLevelName: "",
      dialogTableVisible: false,
      deleteDialogVisible:false,
      index:0,
      idx:0
    };
  },
  mixins: [globelFnHanle1],
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      GetChannelTree()
        .then(this.globelReqHandle1)
        .then(res => {
          this.arr = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    saveState() {
      if (this.twoLevelName === "") {
        this.$message.error("二级模块名称不能为空");
        return false;
      }
      if (this.time === "") {
        var EndTime = "";
        var StartTime = "";
      } else {
        var EndTime = this.time[1];
        var StartTime = this.time[0];
      }
      if (this.title.substr(0, 2) === "修改") {
        const params = {
          Code: this.arr[this.indexChange].ChildChannel[this.idxChange].Code,
          Name: this.twoLevelName.replace(/\s+/g,""),
          ParentCode: this.arr[this.indexChange].Code,
          EndTime,
          StartTime
        };
        //加密处理
        if (EndTime === "" || StartTime === "") {
          var params1 = params;
        } else {
          var params1 = {
            Code: this.arr[this.indexChange].ChildChannel[this.idxChange].Code,
            Name: this.twoLevelName.replace(/\s+/g,""),
            ParentCode: this.arr[this.indexChange].Code,
            EndTime: EndTime.replace(" ", ""),
            StartTime: StartTime.replace(" ", "")
          };
        }
        ChangeChannel(params, params1)
          .then(this.globelReqHandle1)
          .then(res => {
            if (res.Success) {
              this.$message("修改成功");
              this.initData();
              this.dialogTableVisible = false;
              //重置时间
              this.time="";
            }
          })
          .catch(this.globelErrHandle);
      } else {
        const params = {
          Name: this.twoLevelName.replace(/\s+/g,""),
          ParentCode: this.arr[this.firstLevel].Code,
          EndTime,
          StartTime
        };
        //加密处理
        if (EndTime === "" || StartTime === "") {
          var params1 = params;
        } else {
          var params1 = {
            Name: this.twoLevelName.replace(/\s+/g,""),
            ParentCode: this.arr[this.firstLevel].Code,
            EndTime: EndTime.replace(" ", ""),
            StartTime: StartTime.replace(" ", "")
          };
        }
        AddChannel(params, params1)
          .then(this.globelReqHandle1)
          .then(res => {
            if (res.Success) {
              this.$message("添加成功");
              this.initData();
              this.dialogTableVisible = false;
              //重置时间
              this.time = "";
            }
          })
          .catch(this.globelErrHandle);
      }
    },
    editItem(index, idx) {
      this.indexChange = index;
      this.idxChange = idx;
      this.dialogTableVisible = true;
      this.twoLevelName = this.arr[index].ChildChannel[idx].Name;
      this.title = `修改${this.arr[index].Name}二级模块`;
      if (this.twoLevelName === "") {
        this.$message.error("二级模块名称不能为空");
        return false;
      }
      if (this.time === "") {
        var EndTime = "";
        var StartTime = "";
      } else {
        var EndTime = this.time[1];
        var StartTime = this.time[0];
      }
    },
    delItemConfirm(index, idx) {
      this.index = index;
      this.idx = idx;
      this.deleteDialogVisible = true;
    },
    delItem() {
      const params = {
        Guid: this.arr[this.index].ChildChannel[this.idx].Code
      };
      DeleteChannel(params)
        .then(this.globelReqHandle1)
        .then(res => {
          if (res.Success) {
            this.$message("删除成功");
            this.initData();
            this.deleteDialogVisible = false;
          }
        })
        .catch(this.globelErrHandle);
    },
    addItem(index) {
      this.twoLevelName="";
      this.firstLevel = index;
      this.dialogTableVisible = true;
      this.title = `${this.arr[index].Name}新增二级模块`;
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../../common/css/mixin/_text_overflow";
.tab {
  div {
    float: left;
    width: 100px;
    height: 100px;
    margin-left: 10px;
    text-align: center;
    .el-button {
      width: 100px !important;
      height: 50px !important;
      margin-top: 10px !important;
      margin-left: 0 !important;
      @include text-overflow;
      span {
        width: 70px !important;
      }
    }
  }
  .first-level {
    float: left;
    margin-right: 20px;
  }
  .item-btn {
    position: relative;
    a {
      position: absolute;
      top: 12px;
      right: 7px;
      text-decoration: none;
      font-size: 16px;
      color: #606266;
    }
    a:hover {
      color: red;
    }
  }
}
</style>


