import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
// eslint-disable-next-line standard/object-curly-even-spacing
import { Message} from 'element-ui'
Vue.use(Router)

const router = new Router({
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
        },
        {
          path: '/rights',
          name: 'right',
          component: () => import('@/components/rights/Right')
        },
        {
          path: '/roles',
          name: 'roles',
          component: () => import('@/components/rights/Role')
        },
        {
          path: '/goods',
          name: 'goods',
          component: () => import('@/components/goodsList/GoodsList')
        },
        {
          path: '/goodsAdd',
          name: 'goodsAdd',
          component: () => import('@/components/goodsList/goodsAdd/GoodsAdd')
        }
      ]
    }
  ],
  mode: 'history'
})

// 在路由配置生效之前，统一判断token,
// 路由首位 在路由配置生效之前
// 路由/导航 守卫
// from  -> 当前的路由配置
router.beforeEach((to, from, next) => {
  // to 是将要去往路由的路由配置信息
  console.log(to)
  // 在其他操作完毕过后，必须调用next()，继续执行，让路由生效
  // 如果要去的是登录 直接next()
  if (to.path === '/login') {
    next()
  } else {
    // 如果要去的不是登录
    // 判断token
    const token = localStorage.getItem('token')
    if (!token) {
      // eslint-disable-next-line no-undef
      Message.warning('token失效，已跳转到登录页')
      router.push({name: 'login'})
      return
    }
    next()
  }
})

export default router
