<template>
  <div class="tree_area">
    <el-tree
      ref="nodeTree"
      :props="defaultProps"
      :data="treeData"
      node-key="Code"
      :expand-on-click-node="true"
      :default-expand-all='false'
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="nodeName">{{ data.Name }}</span>
          <span>
            <el-button size="mini" type="text" @click.stop="addCorfirm(data,node)" class="add"></el-button>
            <el-button v-if='data.Level !== 1' @click.stop="editConfirm(data, node)" size="mini" type="text"  class="edit"></el-button>
            <el-button v-if='data.Level !== 1' @click.stop="delConfirm(data)" size="mini" type="text" class="delete"></el-button>
          </span>
      </span>
    </el-tree>
    <!-- 新增 -->
    <el-dialog
      title="请输入新增分类名称"
      :visible.sync="dialogTableVisible"
      width="30%"
      :close-on-click-modal='false'
    >
      <div>
        <el-input v-model.tirm="input" placeholder="请输入分类名称" size="mini"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="text-align:left;margin-bottom:30px;" v-if='this.codeList.includes(this.Code)'>
          <div class="demonstration" style="margin-top:-20px;margin-bottom:20px;font-size:14px;">活动时间为：</div>
          <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
        <el-button @click="dialogTableVisible = false" size="mini">取消</el-button>
        <el-button type="primary" @click="addChannel" size="mini">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      title="请修改分类名称"
      :visible.sync="dialogTableChange"
      width="30%"
      :close-on-click-modal='false'
    >
      <div>
        <el-input v-model.tirm="input1" placeholder="请输入分类名称" size="mini"></el-input>
      </div>
      <div slot="footer" class="dialog-footer" >
        <div style="text-align:left;margin-bottom:30px;" v-if='this.codeList.includes(this.Code)'>
          <div class="demonstration" style="margin-top:-20px;margin-bottom:20px;font-size:14px;">活动时间为：</div>
          <el-date-picker v-model="time1" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
        <el-button @click="dialogTableChange = false" size="mini">取消</el-button>
        <el-button type="primary" @click="editChannel" size="mini">确定</el-button>
      </div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :close-on-click-modal='false'
    >
      <span>确定删除该分类吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletechannel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { GetAllChannelTree, AddChannel, DeleteChannel, ChangeChannel } from '@/api'
import { globelFnHanle1 } from "@/common/js/mixin"
import dayjs from 'dayjs';

export default {
  data() {

    return {
      treeData: [],
      codeList:[],
      defaultProps: {
        label: "label",
        children: "ChildChannel"
      },
      dialogTableVisible:false,
      deleteDialogVisible:false,
      dialogTableChange:false,
      input:'',
      input1:'',
      title:'',
      Code:'',
      EndTime:'',
      StartTime:'',
      ParentCode:'',
      time:'',
      time1:'',
      isActivity:false
    };
  },
  mixins: [globelFnHanle1],
  watch: {
    treeData(val, oldVal) {
      if (!val.length) return false;

      const subject = val.filter(item => item.Name === '主题活动');

      let queue = [];
      const opts = {
        node: subject,
        queue,
        valueName: 'Code',
        childName: 'ChildChannel'
      };
      this.traversalDF(opts);

      this.codeList = queue;
    }
  },
  methods: {
    initData() {
      GetAllChannelTree()
        .then(this.globelReqHandle1)
        .then(res => {
          this.treeData = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    addCorfirm(data, node) {
      this.input = ''
      this.time = ''
      this.ParentCode = node.parent.data.Code;
      this.Code = data.Code;
      this.dialogTableVisible = true;
    },
    delConfirm(data) {
      this.Code = data.Code;
      this.deleteDialogVisible = true;
    },
    editConfirm(data, node) {

      if(data.TimeStart !== null && data.TimeEnd !== null) {
        const timeStart = dayjs(data.TimeStart).format('YYYY-MM-DD HH:mm:ss');
        const timeEnd = dayjs(data.TimeEnd).format('YYYY-MM-DD HH:mm:ss');
        let timeRange = [timeStart, timeEnd];
        this.time1 = timeRange;
      } else {
        this.time1 = '';
      }

      this.input1 = data.Name;
      this.ParentCode = node.parent.data.Code;
      this.Code = data.Code;
      this.dialogTableChange = true;

    },
    addChannel() {
      if (this.input === "") {
        this.$message.error("频道名称不能为空");
        return false;
      }
      if (this.time === "") {
        var EndTime = "";
        var StartTime = "";
      } else {
        var EndTime = this.time[1];
        var StartTime = this.time[0];
      }
      const params = {
        Name: this.input.replace(/\s+/g,""),
        ParentCode: this.Code,
        EndTime: EndTime,
        StartTime: StartTime
      };
      //加密处理
      if (EndTime === "" || StartTime === "") {
          var params1 = params;
      } else {
          var params1 = {
            Name: this.input.replace(/\s+/g,""),
            ParentCode: this.Code,
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
          }
        })
        .catch(this.globelErrHandle);

    },
    editChannel() {
      if (this.input1 === "") {
        this.$message.error("频道名称不能为空");
        return false;
      }
      if (this.time1 === "") {
        var EndTime = "";
        var StartTime = "";
      } else {
        var EndTime = this.time1[1];
        var StartTime = this.time1[0];
      }
      const params = {
        Code: this.Code,
        Name: this.input1.replace(/\s+/g,""),
        ParentCode: this.ParentCode,
        EndTime: EndTime,
        StartTime: StartTime
      };
      //加密处理
      if (EndTime === "" || StartTime === "") {
          var params1 = params;
      } else {
          var params1 = {
            Code: this.Code,
            Name: this.input1.replace(/\s+/g,""),
            ParentCode: this.ParentCode,
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
              this.dialogTableChange = false;

            }
          })
          .catch(this.globelErrHandle);

    },
    deletechannel() {
      const params = {
        Guid: this.Code
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
    traversalDF(opts){
      const {node, queue, valueName, childName} = opts;
      const len = node.length;
      let children, params;

      for(let i = 0; i < len; i++) {
        queue.push(node[i][valueName]);
        children = node[i][childName];

        params = {
          node: children,
          queue,
          valueName,
          childName
        }

        if (children) this.traversalDF(params);
      }
    }
  },
  mounted() {
    this.initData();
  },
};
</script>
<style lang="scss">
.tree_area {
  height: 700px;
  background-color: #fff;
  padding: 20px 30px;
  .el-tree-node {
    &>.el-tree-node__content {
      line-height: 30px;
    }
  }


  .el-tree {
    &>.el-tree-node {
      margin-bottom: 15px;
    }
  }
  .custom-tree-node {
    font-size: 17px;

    &>span{
      margin-right: 50px;

    }
    .add,
    .edit,
    .delete {
      display: none;
      width: 24px;
      height: 24px;
      margin-left: 5px;
      background-size: 100% 100%;
    }
    .add {
      background-image: url("../../../../static/add.png");
    }
    .delete {
      background-image: url("../../../../static/delete.png");
    }
    .edit {
      background-image: url("../../../../static/edit.png");
    }
  }
  .el-tree-node__content:hover .add,
  .el-tree-node__content:hover .edit,
  .el-tree-node__content:hover .delete {
    display: inline-block;
  }
  .el-tree-node__content:hover .nodeName {
    color:#68c5f8;
  }
}

</style>
