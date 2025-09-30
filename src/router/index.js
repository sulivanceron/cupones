// src/router/index.js
import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
    scrollBehavior(to, from, savedPosition) {
      // restaura scroll al hacer back/forward
      if (savedPosition) return savedPosition
      // si hay hash (#ancla), deja que el navegador se posicione
      if (to.hash) return { el: to.hash }
      // por defecto, arriba
      return { left: 0, top: 0 }
    },
  })

  Router.beforeEach((to, from, next) => {
    // localStorage no existe en SSR
    const isClient = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
    const authed = isClient && !!localStorage.getItem('auth_token')

    const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth)
    const guestOnly = to.matched.some((r) => r.meta?.guest)

    // Evita loop si ya estás en login
    const goingToLogin = to.name === 'login'

    if (requiresAuth && !authed) {
      // guarda a dónde querías ir
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    if (guestOnly && authed && !goingToLogin) {
      // p.ej. no dejar ir a /login si ya hay sesión
      return next({ name: 'demos-dos' })
    }

    return next()
  })

  return Router
})
