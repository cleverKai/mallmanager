import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/components/home/Home'),
      children: [
        {
          path: '/users',
          name: 'users',
          component: () => import('@/components/users/Users')
        }
      ]
    }
  ],
  mode: 'history'
})
