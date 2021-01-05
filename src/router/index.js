import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/welcome.vue'
import Users from '../components/user/User.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login", component: Login
  },
  {
    path: "/home", component: Home,
    redirect: "/welcome",
    children: [
      {
        path: '/welcome', name: "Welcome", component: welcome
      },
      {
        path: '/users', name: 'User', component: Users
      },
      {
        path: '/rights', name: 'Rights', component: Rights
      }, {
        path: '/roles', name: 'Roles', component: Roles
      },
      {
        path: '/categories', name: 'Categories', component: Cate
      },
      {
        path: '/params', name: 'Params', component: Params
      },

    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
