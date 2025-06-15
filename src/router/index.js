import { createRouter, createWebHistory } from 'vue-router'
import TransactionsPage from '@/views/TransactionsPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import ReferencesPage from '@/views/ReferencesPage.vue'

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/',
    name: 'TransactionsPage',
    component: TransactionsPage,
  },
  {
    path: '/references',
    name: 'ReferencesPage',
    component: ReferencesPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
