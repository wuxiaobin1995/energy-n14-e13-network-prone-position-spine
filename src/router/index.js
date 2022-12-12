/*
 * @Author      : Mr.bin
 * @Date        : 2022-10-15 17:00:42
 * @LastEditTime: 2022-12-12 21:35:24
 * @Description : 路由
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  /*
   * 前面加"/"表示绝对路径，不加"/"表示相对路径
   * 一般嵌套路由中的子路由不需要加"/"，它会在父路由后自动加上"/子路由"
   * 比如父 "/father"，子 "child"，要想访问子路由，跳转链接需要写成 "/father/child"
   */

  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout'),
    redirect: '/home',
    children: [
      // 首页
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home'),
        meta: ['首页']
      },
      // 用户
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user'),
        meta: ['用户']
      },
      // 用户注册
      {
        path: 'user-register',
        name: 'user-register',
        component: () => import('@/views/user-register'),
        meta: ['用户注册']
      },
      // 用户信息修改
      {
        path: 'user-edit',
        name: 'user-edit',
        component: () => import('@/views/user-edit'),
        meta: ['用户信息修改']
      },
      // 设置医院名称
      {
        path: 'set-hospital',
        name: 'set-hospital',
        component: () => import('@/views/set/set-hospital'),
        meta: ['设置医院名称']
      },
      // 设备信息
      {
        path: 'facility-info',
        name: 'facility-info',
        component: () => import('@/views/set/facility-info'),
        meta: ['设备信息']
      },
      // 开发者
      {
        path: 'set-developer',
        name: 'set-developer',
        component: () => import('@/views/set/set-developer'),
        meta: ['开发者']
      },
      // 游戏
      {
        path: 'game',
        name: 'game',
        component: () => import('@/views/game'),
        meta: ['游戏']
      },

      /* 测试模式 */
      // 骨盆灵活度测试-动作展示
      {
        path: 'test-flexibility-show',
        name: 'test-flexibility-show',
        component: () => import('@/views/test-mode/flexibility/show'),
        meta: ['骨盆灵活度测试-动作展示']
      },
      // 骨盆灵活度测试-内核心是什么
      {
        path: 'test-flexibility-what',
        name: 'test-flexibility-what',
        component: () => import('@/views/test-mode/flexibility/what'),
        meta: ['骨盆灵活度测试-内核心是什么']
      },
      // 骨盆灵活度测试-内核心训练的好处
      {
        path: 'test-flexibility-why',
        name: 'test-flexibility-why',
        component: () => import('@/views/test-mode/flexibility/why'),
        meta: ['骨盆灵活度测试-内核心训练的好处']
      },
      // 骨盆灵活度测试-测量页面
      {
        path: 'test-flexibility-measure',
        name: 'test-flexibility-measure',
        component: () => import('@/views/test-mode/flexibility/measure'),
        meta: ['骨盆灵活度测试-测量页面']
      },

      /* 训练模式 */
      // 训练项目选择
      {
        path: 'train-select',
        name: 'train-select',
        component: () => import('@/views/train-mode'),
        meta: ['训练项目选择'],
        redirect: '/train-select/core-activation-set',
        children: [
          // 内核心激活训练-参数设置
          {
            path: 'core-activation-set',
            name: 'core-activation-set',
            component: () => import('@/views/train-mode/core-activation/set'),
            meta: ['内核心激活训练-参数设置']
          },
          // 活动度改善训练-参数设置
          {
            path: 'activity-improvement-set',
            name: 'activity-improvement-set',
            component: () =>
              import('@/views/train-mode/activity-improvement/set'),
            meta: ['活动度改善训练-参数设置']
          },
          // 腹式呼吸训练-参数设置
          {
            path: 'abdominal-respiration-set',
            name: 'abdominal-respiration-set',
            component: () =>
              import('@/views/train-mode/abdominal-respiration/set'),
            meta: ['腹式呼吸训练-参数设置']
          },
          // 静态训练-参数设置
          {
            path: 'static-set',
            name: 'static-set',
            component: () => import('@/views/train-mode/static/set'),
            meta: ['静态训练-参数设置']
          },
          // 动态训练-参数设置
          {
            path: 'dynamic-set',
            name: 'dynamic-set',
            component: () => import('@/views/train-mode/dynamic/set'),
            meta: ['动态训练-参数设置']
          }
        ]
      },
      // 内核心激活训练-具体测量
      {
        path: 'core-activation-measure',
        name: 'core-activation-measure',
        component: () => import('@/views/train-mode/core-activation/measure'),
        meta: ['内核心激活训练-测量页面']
      },
      // 活动度改善训练-具体测量
      {
        path: 'activity-improvement-measure',
        name: 'activity-improvement-measure',
        component: () =>
          import('@/views/train-mode/activity-improvement/measure'),
        meta: ['活动度改善训练-测量页面']
      },
      // 腹式呼吸训练-具体测量
      {
        path: 'abdominal-respiration-measure',
        name: 'abdominal-respiration-measure',
        component: () =>
          import('@/views/train-mode/abdominal-respiration/measure'),
        meta: ['腹式呼吸训练-测量页面']
      },
      // 静态训练-具体测量
      {
        path: 'static-measure',
        name: 'static-measure',
        component: () => import('@/views/train-mode/static/measure'),
        meta: ['静态训练-测量页面']
      },
      // 动态训练-具体测量
      {
        path: 'dynamic-measure',
        name: 'dynamic-measure',
        component: () => import('@/views/train-mode/dynamic/measure'),
        meta: ['动态训练-测量页面']
      }
    ]
  },

  /* 测试报告 */
  // 骨盆灵活度测试-导出PDF
  {
    path: '/test-flexibility-pdf',
    name: 'test-flexibility-pdf',
    component: () => import('@/views/test-mode/flexibility/pdf'),
    meta: ['骨盆灵活度测试-导出PDF']
  },

  /* 训练报告 */
  // 活动度改善训练-导出PDF
  {
    path: '/train-activity-improvement-pdf',
    name: 'train-activity-improvement-pdf',
    component: () => import('@/views/train-mode/activity-improvement/pdf'),
    meta: ['活动度改善训练-导出PDF']
  },
  // 腹式呼吸训练-导出PDF
  {
    path: '/train-abdominal-respiration-pdf',
    name: 'train-abdominal-respiration-pdf',
    component: () => import('@/views/train-mode/abdominal-respiration/pdf'),
    meta: ['腹式呼吸训练-导出PDF']
  },
  // 静态训练-导出PDF
  {
    path: '/train-static-pdf',
    name: 'train-static-pdf',
    component: () => import('@/views/train-mode/static/pdf'),
    meta: ['静态训练-导出PDF']
  },
  // 动态训练-导出PDF
  {
    path: '/train-dynamic-pdf',
    name: 'train-dynamic-pdf',
    component: () => import('@/views/train-mode/dynamic/pdf'),
    meta: ['动态训练-导出PDF']
  },

  {
    path: '/refresh',
    name: 'refresh',
    component: () => import('@/views/refresh')
  },

  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes,
  /* 自定义路由切换时页面如何滚动 */
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 } // 回到顶部
  }
})

export default router
