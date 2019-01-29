<template>
  <div class="head_bar">
    <header>
      <div class="head_wrap clearfix">
        <a class="logo_wrap fl" href="javascript:;">
          <h1 class="main_title"></h1>
        </a>
        <ul class="head_right fr">
          <li class="fl">
            <img :src="src" alt="" class="user">
          </li>
          <li class="fl">
            <span>超级管理员/账号</span>
          </li>
          <li class="fl">
            <span @click="handleLogout" class="user_logout">退出</span>
          </li>
        </ul>
      </div>
    </header>
  </div>
</template>
<script>
export default {
  name: "HeadTop",
  data() {
    return {
      src: "http://200.1.3.238/images/user.png"
    };
  },
  methods: {
    handleLogout() {
      // removeItem("User");

      this.$router.push({ name: "Login" });
    }
  }
};
</script>
<style lang="scss">
.head_bar {
  header {
    position: fixed;
    z-index: 1000;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 8.7px 0.3px rgba(153, 179, 193, 0.26);

    .head_wrap {
      width: 1200px;
      height: 60px;
      margin: 0 auto;
      background-color: #ffffff;
      // box-shadow: 0 0 8.7px 0.3px rgba(153,179,193,0.26);

      .logo_wrap {
        width: 200px;
        height: 60px;

        .main_title {
          position: relative;
          top: 50%;
          right: 0;
          bottom: 0;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          width: 139px;
          height: 36px;
          background-image: url(../assets/logo.png);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }

      .head_right {
        height: 100%;
        padding-top: 16px;
        li {
          margin-right: 8px;
        }
        .user {
          display: inline-block;
          width: 28px;
          height: 28px;
          -webkit-transform: none !important;
          -ms-transform: none !important;
          transform: none !important;
          // background-image: url(../assets/user.png);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        span {
          display: inline-block;
          font-size: 14px;
          vertical-align: middle;
          line-height: 28px;
          color: #999;
        }
      }
    }
    .user_logout {
      cursor: pointer;
    }
  }
}
</style>

