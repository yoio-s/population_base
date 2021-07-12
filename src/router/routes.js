export default [
  {
    path: '/loginRkk',
    name: 'loginRkk',
    component: () => import('views/login/rkk.vue'),
  },
  {
    path: '/loginJjk',
    name: 'loginJjk',
    component: () => import('views/login/jjk.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/registerRkk',
    name: 'registerRkk',
    component: () => import('views/register/rkk'),
  },
  {
    path: '/registerJjk',
    name: 'registerJjk',
    component: () => import('views/register/jjk'),
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('views/editor/index'),
  }
]
