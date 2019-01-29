// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { getItem } from "@/common/js/util.js"
import 'es6-promise/auto'
/* 自定义主题 */
import '@/common/css/element-variables.scss'
/* es6支持 */
import "babel-polyfill";
import {
  Button,
  Form,
  FormItem,
  Input,
  InputNumber,
  Table,
  TableColumn,
  Select,
  Option,
  Popover,
  Dialog,
  Breadcrumb,
  BreadcrumbItem,
  Tree,
  Icon,
  Pagination,
  Upload,
  Radio,
  RadioGroup,
  Cascader,
  DatePicker,
  Tabs,
  TabPane,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  Message,
  Loading,
} from 'element-ui'

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);
Vue.use(Popover);
Vue.use(Dialog);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Tree);
Vue.use(Icon);
Vue.use(Pagination);
Vue.use(Upload);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Cascader);
Vue.use(DatePicker);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Checkbox);
Vue.use(Loading.directive);

Vue.prototype.$message = Message;

Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  // store.commit('setLoading', true)
  const navIndex = to.meta.index;
  if (navIndex) store.commit('updateActiveNav', navIndex);
  if (to.meta.requireAuth) {
    if (getItem("User") == null) {
      next({ path: "/login" })
    }else{
      next();
    }
  }else{
    next()
  }
  // if (/\/http/.test(to.path)) {
  //   let url = to.path.split('http')[1]
  //   window.location.href = `http${url}`
  // } else if (/\/www/.test(to.path)) {
  //   let url = to.path.split('www')[1]
  //   window.location.href = `http://www${url}`
  // } else {
  //   next()
  // }
})

router.afterEach(function (to) {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 500);
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
