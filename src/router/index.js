import { createRouter, createWebHistory } from 'vue-router'

const SITE_NAME = 'Toaka Gasy'
const DEFAULT_DESCRIPTION =
  'Toaka Gasy is an authentic Malagasy rum inspired by Betsileo tradition in Madagascar — bold, bright, and made to be shared.'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, from, savedPosition) => savedPosition || { top: 0 },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: `${SITE_NAME} | Rum of celebration`,
        description: DEFAULT_DESCRIPTION,
      },
    },
    {
      path: '/our-story',
      name: 'our-story',
      component: () => import('@/views/OurStoryView.vue'),
      meta: {
        title: `Our Story | ${SITE_NAME}`,
        description:
          'From a family wine business in Ambalavao to Toaka Gasy: discover the heritage, the people, and the Betsileo tradition behind our Malagasy rum.',
      },
    },
    {
      path: '/our-rums',
      name: 'our-rums',
      component: () => import('@/views/OurRumsView.vue'),
      meta: {
        title: `Our Rums | ${SITE_NAME} Collection`,
        description:
          'Explore the Toaka Gasy rum collection — Nova, Vaza, and Sôma — plus perfect serves and cocktail recipes inspired by Madagascar.',
      },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: {
        title: `Contact Us | ${SITE_NAME}`,
        description:
          'Get in touch with Toaka Gasy for questions, partnerships, or press inquiries about our authentic Malagasy rum.',
      },
    },
    {
      path: '/product/:slug',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
      meta: {
        title: `${SITE_NAME} Rum | Product Details`,
        description: DEFAULT_DESCRIPTION,
      },
    },
    {
      path: '/recipe/:slug',
      name: 'recipe',
      component: () => import('@/views/RecipeView.vue'),
      meta: {
        title: `Cocktail Recipe | ${SITE_NAME}`,
        description: 'Discover how to make signature Toaka Gasy rum cocktails, step by step.',
      },
    },
  ],
})

function setMetaTag(name, property, content) {
  const attr = property ? 'property' : 'name'
  const key = property || name
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

router.afterEach((to) => {
  const title = to.meta.title || SITE_NAME
  const description = to.meta.description || DEFAULT_DESCRIPTION
  document.title = title
  setMetaTag('description', false, description)
  setMetaTag('og:title', true, title)
  setMetaTag('og:description', true, description)
  setMetaTag('og:url', true, window.location.href)
})

export default router
