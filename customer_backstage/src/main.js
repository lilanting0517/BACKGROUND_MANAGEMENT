// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import App from './App'
import router from './router'
import store from "./store"
// import 'jquery'
// import 'signalr'
import { getItem } from "@/common/js/util.js"
/* 自定义主题 */
import '@/common/css/element-variables.scss'
/* es6支持 */
import "babel-polyfill";
import {
  Autocomplete,
  Button,
  Input,
  InputNumber,
  pagination,
  Checkbox,
  CheckboxGroup,
  Table,
  TableColumn,
  Select,
  Option,
  Dialog,
  DatePicker,
  Collapse,
  CollapseItem,
  Tree,
  Form,
  Message,
  FormItem,
  Upload,
  Loading,
  TimePicker,
  Tabs,
  TabPane,
  Col,
  Popover,
  Radio,
  Tooltip,
  Badge,
  Cascader,
  Icon
} from 'element-ui'

Vue.use(Autocomplete)
Vue.use(Button)
Vue.use(Input)
Vue.use(pagination)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tree)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Upload)
Vue.use(TimePicker)
Vue.use(Col)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Loading.directive)
Vue.use(Popover)
Vue.use(Radio)
Vue.use(Tooltip)
Vue.use(Badge)
Vue.use(Cascader)
Vue.use(Icon)


Vue.prototype.$message = Message;
import { emoji } from './emojiUtils/emoji.js'
Vue.prototype.emoji = emoji;
Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  const isLogin = to.name === 'Login';
  if (!isLogin) {
    store.commit('setIsRegisterOrLogin', true)
  }
  const menu = getItem("menu");
  //路由检测
  let checkBoolean = false;
  if (menu != undefined) {
    let routerName = to.name;
    let asideSet = [...menu.goods, ...menu.platform, ...menu.customer]
    //拦截处理
    for (let i = 0; i < asideSet.length; i++) {
      if (routerName === asideSet[i].name && asideSet[i].title === "") {
        checkBoolean = true;
      }
    }
  }
  store.commit('setLoading', true)
  const navIndex = to.meta.index;
  if (navIndex) store.commit('updateActiveNav', navIndex);

  if (to.meta.requireAuth) {
    if (getItem("User") == null) {
      next({ path: "/login" })
    }
  }
  if (/\/http/.test(to.path)) {
    let url = to
      .path
      .split('http')[1]
    window.location.href = `http${url}`

  } else if (/\/www/.test(to.path)) {
    let url = to
      .path
      .split('www')[1]
    window.location.href = `http://www${url}`
  } else if (checkBoolean) {
    Message({
      message: "没有权限哦",
      type: 'warning'
    });
    //隐藏头部
    // store.state.isRegisterOrLogin = false;
    setTimeout(() => {
      router.go(-1);
    }, 1000);
  }
  else {
    next()
  }

})

router.afterEach(function (to) {
  // setTimeout(() => {
  //   store.commit('setLoading', false)
  // }, 5000);
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
