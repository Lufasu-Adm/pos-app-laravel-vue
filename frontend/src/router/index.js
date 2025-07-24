import { createRouter, createWebHistory } from 'vue-router'
import PosView from '../views/PosView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pos',
      component: PosView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/admin/products',
      name: 'product-management',
      component: () => import('../views/ProductManagement.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    }, // <-- KOMA YANG HILANG ADA DI SINI
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue')
    }
  ]
})

export default router