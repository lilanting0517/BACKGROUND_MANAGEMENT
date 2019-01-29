<template>
  <div class="header_wrap">
    <!-- 头部操作模块 -->
    <header>
      <nav class="clearfix">
        <div class="nav_left fl">
          <a href="javascript:;">请登录</a>
        </div>
        <div class="nav_right fr">
          <ul class="fl">
            <li class="fl">
              <a href="javascript:;">我的订单</a>
            </li>
            <li class="fl">
              <img src="../assets/logo.png" alt="" width="14" height="12"><a href="javascript:;">购物车</a>
            </li>
            <li class="fl"><a href="javascript:;">添加子帐号</a></li>
          </ul>
          <p class="fl">
            <img src="../assets/logo.png" alt="" width="14" height="12"><a href="javascript:;">客服</a>
          </p>
        </div>
      </nav>
    </header>
    <!-- 搜索模块 -->
    <div class="search_wrap">
      <h1>
        <a class="logo" href="javascript:;"></a>
      </h1>
      <!-- 搜索框部分 -->
      <div class="wrap_right">
        <div class="search_cont">
          <div class="cont_top clearfix">
            <el-autocomplete
              class="search_input fl"
              v-model="searchTxt"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
            <el-button class="btn_search fl" size="medium" type="primary">搜索</el-button>
          </div>
          <!-- 搜索历史 / 热词 -->
          <ul class="cont_bottom clearfix">
            <li class="fl"><a href="javascript:;">儿童文学</a></li>
            <li class="fl"><a href="javascript:;">文学</a></li>
            <li class="fl"><a href="javascript:;">儿童文学</a></li>
            <li class="fl"><a href="javascript:;">历史</a></li>
            <li class="fl"><a href="javascript:;">理想国爱国树</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 导航栏 -->
    <div class="nav_wrap">
      <ul class="nav clearfix">
        <li class="active fl"><a href="javascript:;">首页</a></li>
        <li class="fl"><a href="javascript:;">最新图书</a></li>
        <li class="fl"><a href="javascript:;">畅销图书</a></li>
        <li class="fl"><a href="javascript:;">主题活动</a></li>
        <li class="fl"><a href="javascript:;">重点产品</a></li>
        <li class="fl"><a href="javascript:;">大中专教材</a></li>
        <li class="fl"><a href="javascript:;">多元产品</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeadTop",
  data() {
    return {
      searchTxt: ""
    };
  },
  methods: {
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    handleSelect(item) {
      console.log(item);
    }
  }
};
</script>

<style lang="scss" scope>
@import "../common/css/_var";

.header_wrap {
  width: 100%;
  height: 40px;
  color: #999;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.3);
  header {
    width: 1200px;
    margin: 0 auto;
  }
}
header {
  nav {
    height: 40px;
    padding: 13px 0;
  }
  .nav_left {
    a {
      color: $txt_color;
    }
  }
  .nav_right {
    > ul {
      border-right: 1px solid $txt_color;
      > li {
        padding: 0 14px;
      }
    }
    > p {
      padding: 0 14px;
    }
    img,
    a {
      vertical-align: middle;
    }
    img {
      margin-right: 4px;
    }
    a {
      color: $txt_color;
    }
  }
}
/* 搜索模块 */
.search_wrap {
  width: 1200px;
  height: 130px;
  margin: 0 auto;
  h1 {
    display: inline-block;
    height: 100%;
    margin-right: 70px;
    overflow: hidden;
    &:after {
      content: "";
      display: inline-block;
      width: 0;
      height: 100%;
      vertical-align: middle;
    }
  }
  .logo {
    display: inline-block;
    width: 311px;
    height: 46px;
    vertical-align: middle;
    background: url("../assets/logo.png") no-repeat center;
    background-size: 100% 100%;
  }
  .wrap_right {
    display: inline-block;
    overflow: hidden;
    &:after {
      content: "";
      display: inline-block;
      width: 0;
      height: 130px;
      vertical-align: middle;
    }
  }
  /* 搜索框部分 */
  .search_cont {
    display: inline-block;
    vertical-align: middle;
  }
  .cont_top {
    .search_input input {
      width: 493px;
      height: 36px;
      border: 2px solid #ff2626;
      border-radius: 0;
    }
    .btn_search {
      width: 132px;
      font-size: 18px;
      padding-top: 8px;
      padding-bottom: 8px;
      border-radius: 0;
      > span {
        letter-spacing: 1.8px;
        font-weight: normal;
      }
    }
  }
  /* 搜索历史 / 热词  */
  .cont_bottom {
    padding: 10px 0;
    li:not(:first-child) {
      line-height: 16px;
      padding: 0 15px;
    }
    li:first-child {
      padding-right: 15px;
    }
    li + li {
      border-left: 1px solid $txt_color;
    }
    a {
      color: $txt_color;
    }
  }
}
/* 导航栏 */
.nav_wrap {
  width: 100%;
  height: 36px;
  background-color: $theme_color;
  .nav {
    width: 1200px;
    margin: 0 auto;
    li {
      font-size: 16px;
      line-height: 18px;
      padding: 9px 0;
      letter-spacing: 0.8px;
      cursor: pointer;
      > a {
        padding: 0 43px;
        color: #fefefe;
        border-left: 1px solid #ba0909;
      }
    }
    .active {
      background-color: #fff;
      > a {
        border-left: none;
        color: $theme_color;
        background-color: #fff;
      }
    }
    .active + li {
      > a {
        border-left: none;
      }
    }
  }
}
</style>
