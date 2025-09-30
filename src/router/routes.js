export default [
  // Login envuelto en BlankLayout (para que QPage tenga QLayout)
  // routes.js
  // routes.js
  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { guest: true },
      },
    ],
  },

  // Cupones (protegida) dentro del MainLayout
  {
    path: '/demos-dos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'demos-dos',
        component: () => import('pages/DemosDos.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  { path: '/', redirect: '/demos-dos' },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
]
