import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/our-story',
      name: 'our-story',
      component: () => import('@/views/OurStoryView.vue'),
    },
    {
      path: '/our-rums',
      name: 'our-rums',
      component: () => import('@/views/OurRumsView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/product/:slug',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
    },
  ],
})

export default router
