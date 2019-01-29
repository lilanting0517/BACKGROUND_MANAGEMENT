<template>
  <div class="main">
    <aside class="dialog-box">
      <div>
        <h3 class="dialog-title">消息列表</h3>
        <div class="dialog-history">
          <ul class="chatList">
            <li
              class="clearfix"
              v-for="(item,index) in dialogArr"
              @click="changeDetail(index)"
              :class="{active: index == num}"
            >
              <div class="img-container fl">
                <img
                  src="../../../static/user.png"
                  alt=""
                  class="user-img fl"
                >
                <p class="dialog-content fl">
                  <span class="fl user-name">{{item.UserId}}</span>
                  <span class="fl user_company">{{item.CompanyName}}</span>
                  <span class="fr dialog-time">{{item.SendTime}}</span>
                </p>
                <p class="dialog-content-bottom fl">
                  <el-badge
                    :is-dot='item.IsFinish != 0'
                    class="badge"
                  >{{item.Content}}</el-badge>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </aside>
    <aside class="dialog-detail">
      <div>
        <h3 class="dialog-title">
          内容
          <!-- <el-button size="mini" class="fr" @click.native="urge">催办</el-button> -->
        </h3>
        <h3 class="dkh-title">
          大客户平台客服人员为您服务
        </h3>
        <div
          class="dialog-area clearfix"
          id="dialog-area"
          v-loading="loading"
        >
          <p
            style="text-align:center;"
            @click="loadMore"
          ><a
              href="javascript:void(0)"
              style="color:#ccc;"
            >{{loadingText}}</a></p>
          <ul>
            <li
              v-for="(item,index) in data"
              :key="index"
            >
              <p class="time">{{item.time}}</p>
              <div class="left-say clearfix">
                <span
                  class="user-name"
                  v-if="item.FromUser===userCurrent"
                >{{item.FromUser}}</span>
                <img
                  src="../../../static/user.png"
                  alt=""
                  class="fl"
                  v-if="item.FromUser===userCurrent"
                >
                <b
                  class="left"
                  v-if="item.FromUser===userCurrent "
                ></b>
                <p
                  v-html="emoji(item.Content)"
                  class="fl message-detail"
                  v-if="item.FromUser===userCurrent"
                  :title="item.Time"
                ></p>
                <!-- <p v-html="emoji(item.content)" class="fl message-detail" v-if="item.FromUser===userCurrent && item.imgNum!='0-3'"></p> -->
                <!-- <img :src=item.src alt="" v-if='item.imgNum=="0-3" ' class="dialog-pic-left"> -->
              </div>
              <div class="right-say clearfix">
                <span
                  class="customer-name"
                  v-if="!(item.FromUser===userCurrent)"
                >{{item.FromUser}}</span>
                <p
                  v-html="emoji(item.Content)"
                  class="fr message-detail"
                  v-if="!(item.FromUser===userCurrent)"
                  :title="item.Time"
                ></p>
                <!-- <p v-html="emoji(item.content)" class="fr message-detail" v-if="item.num ==1 && item.imgNum!='1-3'"></p> -->
                <!-- <img :src=item.src alt="" v-if='item.imgNum=="1-3" ' class="dialog-pic-right"> -->
              </div>
            </li>
          </ul>
        </div>
        <div class="input-area">
          <div class="function-bar">
            <b
              class="emoji-function"
              @click="showEmoji = !showEmoji"
            ></b>
            <!--   -->
            <!-- 表情 -->
            <transition
              name="el-fade-in-linear"
              mode=""
            >
              <div
                class="emoji-box"
                v-if="showEmoji"
              >
                <a
                  class="icon-close"
                  @click="showEmoji = false"
                >
                  <img src="../../assets/close.png" />
                </a>
                <vue-emoji @select="selectEmoji">
                </vue-emoji>
                <span class="pop-arrow arrow"></span>
              </div>
            </transition>
          </div>
          <div>
            <el-input
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
              v-model="textarea"
              @keyup.enter.native="submit"
            >
            </el-input>
            <el-button
              type="primary"
              size="medium"
              class="fr"
              style="margin-top:20px"
              @click="submit"
            >发送</el-button>
          </div>
        </div>
      </div>
    </aside>
    <el-dialog
      title="转送消息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <h3 style="text-align:center;">
        <span>客服频道：</span>
        <el-select
          v-model="value"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </h3>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="centerDialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible1"
      width="30%"
      center
    >
      <h3 style="text-align:center;">
        催办成功
      </h3>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="centerDialogVisible1 = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vueEmoji from "@/components/emoji.vue";
import { emoji, createIcon } from "@/emojiUtils/emoji";
import { GetChatHistory, SendMessage, AdminGetDetail } from "@/api";
import { globelFnHanle } from "@/common/js/mixin";
export default {
  name: "",
  data() {
    return {
      showEmoji: false,
      fileList: [],
      value: "",
      options: [
        {
          value: "最新图书客服",
          Type: 1
        },
        {
          value: "畅销图书客服",
          Type: 2
        },
        {
          value: "主题活动客服",
          Type: 3
        },
        {
          value: "重点产品客服",
          Type: 4
        },
        {
          value: "大中专教材客服",
          Type: 5
        },
        {
          value: "多元产品客服",
          Type: 6
        }
      ],
      textarea: "",
      icon: "",
      content: "",
      loading: true,
      centerDialogVisible: false,
      centerDialogVisible1: false,
      data: [],
      dialogArr: [],
      dialogGuid: "",
      userCurrent: "",
      num: 0,
      currentPageIndex: 1,
      loadingText: "加载更多",
      src: ""
    };
  },
  mixins: [globelFnHanle],
  components: {
    vueEmoji
  },
  mounted() {
    this.scrollBottom();

    this.getChatList();

    this.timer = setInterval(() => {
      const arg = {
        Guid: this.dialogGuid,
        PageIndex: 1,
        PageNum: 5,
        NewTime: this.data[this.data.length - 1].Time
      };

      AdminGetDetail(arg)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Data != []) {
            res.Data.map(item => {
              this.data.push(item);
            });
            this.loading = false;
          } else {
            return false;
          }
        })
        .catch(this.globelErrHandle);
    }, 300000);
  },
  methods: {
    getChatList() {
      const params = {
        Type: 2,
        PageIndex: 1,
        PageNum: 15
      };
      GetChatHistory(params)
        .then(this.globelFnHanle)
        .then(res => {
          if (!res.Data.length) {
            this.data = [];
            this.loading = false;
            return false;
          } else {
            this.dialogArr = res.Data;
            this.dialogGuid = this.dialogArr[0].Guid;
            this.userCurrent = this.dialogArr[0].UserId;
            const arg = {
              Guid: this.dialogGuid,
              PageIndex: 1,
              PageNum: 5
            };
            this.getChatDetail(arg);
          }
        })
        .catch(this.globelErrHandle);
    },
    getChatDetail(arg) {
      AdminGetDetail(arg)
        .then(this.globelFnHanle)
        .then(res => {
          if (res.Data != []) {
            this.data = res.Data;
            this.loading = false;
          } else {
            return false;
          }
        })
        .catch(this.globelErrHandle);
    },
    scrollBottom() {
      this.$nextTick(function() {
        var div = document.getElementById("dialog-area");
        div.scrollTop = div.scrollHeight;
      });
    },
    // 选择表情
    selectEmoji(code) {
      this.showEmoji = false;
      this.textarea += code;
    },
    submit() {
      const params = {
        Guid: this.dialogGuid,
        Message: this.textarea.replace(/\s+/g, "")
      };
      SendMessage(params)
        .then(this.globelFnHanle)
        .then(res => {
          console.log(res);
          if (res.Success) {
            const arg = {
              Guid: this.dialogGuid,
              PageIndex: 1,
              PageNum: 5,
              NewTime: this.data[this.data.length - 1].Time
            };

            AdminGetDetail(arg)
              .then(this.globelFnHanle)
              .then(res => {
                if (res.Data != []) {
                  res.Data.map(item => {
                    this.data.push(item);
                  });
                  this.loading = false;
                } else {
                  return false;
                }
              })
              .catch(this.globelErrHandle);
          }
        })
        .catch(this.globelErrHandle);
      this.textarea = "";
      this.scrollBottom();
    },
    turnMessage() {
      this.centerDialogVisible = true;
    },
    urge() {
      this.centerDialogVisible1 = true;
    },
    changeDetail(index) {
      //切换列表需要初始化的数据
      this.num = index;
      this.loadingText = "加载更多";
      this.currentPageIndex = 1;
      this.loading = true;
      this.dialogGuid = this.dialogArr[index].Guid;
      this.userCurrent = this.dialogArr[index].UserId;
      const arg = {
        Guid: this.dialogGuid,
        PageIndex: 1,
        PageNum: 5
      };
      AdminGetDetail(arg)
        .then(this.globelFnHanle)
        .then(res => {
          this.data = res.Data;
          this.loading = false;
        })
        .catch(this.globelErrHandle);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      // this.$message.warning(
      //   `当前限制选择 3 个文件，本次选择了 ${
      //     files.length
      //   } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      // );
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传icon大小不能超过 2MB!");
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 10;
        let height = 10;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src = windowURL.createObjectURL(file);
          this.data.push({
            content: "",
            num: "1",
            src: this.src,
            imgNum: "1-3"
          });
          this.scrollBottom();
          //重新写一个表单上传的方法
          this.param = new FormData();
          this.param.append("file", file, file.name);
          let config = {
            "Content-Type": "multipart/form-data"
          };
          let var_this = this;
          // axios
          //   .post(
          //     "http://200.1.3.234:5566/api/Manage/Activity/UploadImg",
          //     this.param,
          //     config
          //   )
          //   .then(response => {
          //     if (!response.data.Success) {
          //       this.$message({
          //         message: response.data.message,
          //         type: "error"
          //       });
          //     }
          //     this.form.ImgUrl = response.data.Data.url;
          //   })
          //   .catch(function(error) {
          //     console.log(error);
          //   });
        },
        () => {
          this.$message.error("上传的icon必须是等于或大于100*100!");
          return false;
        }
      );
      return Promise.reject();
    },
    loadMore() {
      this.currentPageIndex++;
      const arg = {
        Guid: this.dialogGuid,
        PageIndex: this.currentPageIndex,
        PageNum: 5,
        OldTime:this.data[0].Time
      };
      AdminGetDetail(arg)
        .then(this.globelFnHanle)
        .then(res => {
          if (!res.Data.length) {
            this.loading = false;
            this.loadingText = "没有更多内容了";
            return false;
          } else {
            this.data = [...res.Data, ...this.data];
          }
        })
        .catch(this.globelErrHandle);
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/mixin/_text_overflow";
@import "../../common/css/mixin/_scroll_style";
.dialog-box {
  height: 760px;
  box-sizing: border-box;
  width: 350px;
  float: left;
  overflow-y: auto;
  margin-right: 5px;
  @include scroll-style;
  .dialog-title {
    padding: 10px;
    height: 44px;
    line-height: 24px;
    font-size: 14px;
    color: #ccc;
    background-color: #fff;
  }
  .dialog-history {
    .chatList {
      background-color: #fff;
    }
    li {
      height: 68px;
      display: flex;
      align-items: center;
      padding: 4px;
      cursor: pointer;
      border-bottom: 1px solid #ccc;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
      .img-container {
        vertical-align: middle;
        img {
          width: 36px;
          height: 36px;
          margin-right: 2px;
        }
        .dialog-content {
          width: 290px;
          padding-right: 5px;
          padding-left: 5px;
          .user-name {
            color: #555;
            font-size: 14px;
          }
          .dialog-time {
            color: #ccc;
            font-size: 12px;
          }
          .user_company {
            color: #685959;
            font-size: 12px;
            margin-left: 5px;
            width: 100px;
            overflow: hidden;
          }
        }
        .dialog-content-bottom {
          width: 290px;
          padding-right: 5px;
          padding-left: 5px;
          font-size: 14px;
          color: #999;
          margin-top: 9px;
          @include text-overflow;

          .badge {
            vertical-align: sub !important;
          }
        }
      }
    }
    li.active {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
.dialog-detail {
  box-sizing: border-box;
  width: 600px;
  height: 960px;
  float: left;
  overflow-y: auto;
  .dialog-title {
    padding: 10px;
    height: 44px;
    line-height: 24px;
    font-size: 14px;
    color: #ccc;
    background-color: #fff;
  }
  .dkh-title {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    width: 600px;
    color: #ccc;
    text-align: center;
  }
  .dialog-area {
    padding: 20px;
    height: 500px;
    overflow-y: auto;
    background-color: #fff;
    @include scroll-style;
    li {
      position: relative;
      .time {
        font-size: 12px;
        text-align: center;
        color: #999;
      }
    }
    .left-say {
      position: relative;
      img {
        margin-right: 10px;
      }
      .user-name {
        position: absolute;
        left: 50px;
        top: 6px;
        color: #999;
        font-size: 10px;
      }
      .dialog-pic-left {
        margin-top: 10px;
        max-width: 500px;
      }
      .left {
        display: block;
        width: 0;
        height: 0;
        border-width: 8px 8px 8px 0;
        border-style: solid;
        border-color: transparent #f8f8f8 transparent transparent; /*透明 透明 透明 黄*/
        position: absolute;
        top: 26px;
        left: 32px;
      }
      .message-detail {
        background-color: #f8f8f8;
        padding: 10px;
        max-width: 500px;
        margin-top: 20px;
        line-height: 25px;
        border-radius: 10px;
        letter-spacing: 1px;
      }
    }
    .right-say {
      position: relative;
      img {
        margin-left: 10px;
      }
      .customer-name {
        color: #999;
        position: absolute;
        right: 5px;
        top: 2px;
        font-size: 10px;
      }
      .dialog-pic-right {
        float: right;
        margin-top: 20px;
        max-width: 500px;
      }
      .right {
        display: block;
        width: 0;
        height: 0;
        border-width: 8px 0 8px 8px;
        border-style: solid;
        border-color: transparent transparent transparent #dceefb; /*透明 透明 透明 黄*/
        position: absolute;
        top: 24px;
        right: 34px;
      }
      .message-detail {
        background-color: #dceefb;
        padding: 10px;
        max-width: 500px;
        margin-top: 20px;
        line-height: 25px;
        border-radius: 10px;
        letter-spacing: 1px;
      }
    }
  }
  .input-area {
    .function-bar {
      height: 44px;
      padding-left: 20px;
      display: flex;
      align-items: center;
      position: relative;
      b {
        float: left;
        width: 22px;
        height: 22px;
        cursor: pointer;
      }
      .emoji-function {
        background: url(../../assets/invalid-name@3x.png);
        background-size: 100% 100%;
        margin-right: 20px;
      }
      .pic {
        width: 22px;
        height: 22px;
        border: none;
        background: url(../../assets/invalid-pic@3x.png);
        background-size: 100% 100%;
      }
    }
    .emoji-box {
      position: absolute;
      z-index: 10;
      left: 20px;
      top: 30px;
      box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
      background: #fff;
      .icon-close {
        width: 18px;
        height: 18px;
        display: block;
        position: absolute;
        right: 18px;
        top: 16px;
        z-index: 10;
        cursor: pointer;
        & img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>

