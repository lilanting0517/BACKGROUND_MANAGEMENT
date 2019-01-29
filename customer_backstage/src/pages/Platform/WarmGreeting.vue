<template>
  <div class="main">
    <h2 class="char_tit clearfix">
      <span>问候语管理</span>
    </h2>
    <div class="tab_wrap greetingword">
      <label for="">问候语:</label>
      <el-input v-model.trim="warmGreeting" placeholder="请输入问候语(0-15个字符)" size="mini" style="width:30%;" :disabled="!isChange"></el-input>
      <el-button type="primary" size="mini" @click="edit">修改</el-button>
      <el-button type="primary" size="mini" @click="save"   v-show="isChange">保存</el-button>
      <el-button type="primary" size="mini" @click="cancel" v-show="isChange">取消</el-button>
    </div>
  </div>
</template>

<script>
import { GetHelloWord,ChangeHelloWord } from '@/api'
import { getItem } from '@/common/js/util'
export default {
  data() {
    return {
      warmGreeting: "",
      warmGreetingCopy:"",
      isChange:false
    }
  },
  created(){
    this.initWarmGreeting();
  },
  methods: {
    initWarmGreeting() {
      const params = {
        UserId:getItem("User").UserId
      };

      GetHelloWord(params)
       .then(this.globelReqHandle)
       .then(res => {
         if(res.Success) {
          this.warmGreeting = res.Data;
         }

       })
       .catch(err => {
         this.$message('出错啦');
       })
    },
    edit() {
      this.isChange=true;
      this.warmGreetingCopy=this.warmGreeting;
    },
    save() {
      this.isChange=false;
      const params = {
        Word:this.warmGreeting.replace(/\s+/g,"")
      };

      ChangeHelloWord(params)
        .then(this.globelReqHandle)
        .then(res => {
          if(res.Success) {
            this.$message('保存成功！')
          } else {
            this.$message('修改失败')
          }
        })
        .catch(err => {
          this.$message('出错啦！')
        })
    },
    cancel(){
      this.isChange=false;
      this.warmGreeting=this.warmGreetingCopy;
    }
  }
};
</script>
<style>
  .greetingword {
    height: auto;
    min-height: 760px;
    line-height: 100px;
    padding-left:30px;
  }
</style>
