import Vue from 'vue'
import Router from 'vue-router'

const App = () =>
  import ("@/App.vue")
/* 首页模版 */
const Home = () =>
  import ("@/pages/Home.vue")
/* banner 管理 */
const BannerManage = () =>
  import ("@/pages/BannerManage")
const News = () =>
  import ("@/pages/News.vue")
const Permission = () =>
  import ("@/pages/Permission.vue")
const Login = () =>
  import ("@/pages/Login.vue")
const Classify = () =>
  import ("@/pages/Classify.vue")
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: {
        path: '/banner'
      },
      meta: {
        requireAuth: true
      },
      children: [{
          path: '/banner',
          name: 'BannerManage',
          component: BannerManage,
          meta: {
            requireAuth: true
          },
        },
        {
          path: '/news',
          name: 'News',
          component: News,
          meta: {
            requireAuth: true
          },
        }, {
          path: '/permission',
          name: 'Permission',
          component: Permission,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/Classify',
          name: 'Classify',
          component: Classify,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
