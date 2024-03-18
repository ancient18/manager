import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import store from '@/store'

Vue.use(VueRouter)

if (localStorage.getItem('token')) {
  store.dispatch('getMenuList');
}

const routes = [
  {
    path: '/',
    redirect: '/login',
    component: LoginView
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },

  //为routes添加
  {
    path: '/',
    redirect: '/home',
    //下面这两个页面按照层级自行创建
    component: () => import('@/layout/layout.vue'),
    children: [
      {
        meta: {
          title: '首页'
        },
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomeView.vue')
      }
    ]
  },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to);
  let token = localStorage.getItem('token');
  if (to.path === '/login' && token) {
    // console.log(from.path, to.path);
    next('/home');

  } else {
    // console.log(from.path, to.path);
    next();
  }
})



export default router
