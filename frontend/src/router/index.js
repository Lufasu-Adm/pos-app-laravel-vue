import { createRouter, createWebHistory } from 'vue-router'
// ▼▼▼ Ganti import HomeView dengan PosView ▼▼▼
import PosView from '../views/PosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // ▼▼▼ Ubah bagian ini ▼▼▼
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
    }
  ]
})

export default router