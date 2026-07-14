import { createRouter, createWebHistory } from 'vue-router'
import { i18n, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n'

const SITE_ORIGIN = 'https://toakagasy.com'
const OG_LOCALE = { en: 'en_US', fr: 'fr_FR', nl: 'nl_NL' }

const baseRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { locale: DEFAULT_LOCALE, titleKey: 'seo.home.title', descKey: 'seo.home.description' },
  },
  {
    path: '/our-story',
    name: 'our-story',
    component: () => import('@/views/OurStoryView.vue'),
    meta: { locale: DEFAULT_LOCALE, titleKey: 'seo.ourStory.title', descKey: 'seo.ourStory.description' },
  },
  {
    path: '/our-rums',
    name: 'our-rums',
    component: () => import('@/views/OurRumsView.vue'),
    meta: { locale: DEFAULT_LOCALE, titleKey: 'seo.ourRums.title', descKey: 'seo.ourRums.description' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { locale: DEFAULT_LOCALE, titleKey: 'seo.contact.title', descKey: 'seo.contact.description' },
  },
  {
    path: '/product/:slug',
    name: 'product',
    component: () => import('@/views/ProductView.vue'),
    meta: { locale: DEFAULT_LOCALE, titleKey: 'seo.product.title', descKey: 'seo.product.description' },
  },
  {
    path: '/recipe/:slug',
    name: 'recipe',
    component: () => import('@/views/RecipeView.vue'),
    meta: { locale: DEFAULT_LOCALE, titleKey: 'seo.recipe.title', descKey: 'seo.recipe.description' },
  },
]

/* English stays unprefixed at root (preserves currently-indexed URLs).
   French/Dutch reuse the same components under a /fr, /nl path prefix. */
const localizedRoutes = SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).flatMap((locale) =>
  baseRoutes.map((route) => ({
    ...route,
    path: `/${locale}${route.path}`,
    name: `${route.name}-${locale}`,
    meta: { ...route.meta, locale },
  })),
)

const routes = [...baseRoutes, ...localizedRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, from, savedPosition) => savedPosition || { top: 0 },
  routes,
})

function baseRouteName(name) {
  return String(name).replace(/-(fr|nl)$/, '')
}

function localizedHref(name, locale, params) {
  const targetName = locale === DEFAULT_LOCALE ? name : `${name}-${locale}`
  const { href } = router.resolve({ name: targetName, params })
  return `${SITE_ORIGIN}${href}`
}

/* Single guard covers both requirements: redirecting a first-time visitor to
   their detected/stored locale, AND keeping every existing hardcoded internal
   nav link (RouterLink to="/our-rums", etc.) locale-consistent once a user has
   switched away from English — without having to edit those links individually. */
router.beforeEach((to) => {
  if (!to.name) return
  const active = i18n.global.locale.value
  if (to.meta.locale === active) return

  const base = baseRouteName(to.name)
  const targetName = active === DEFAULT_LOCALE ? base : `${base}-${active}`
  return { name: targetName, params: to.params, query: to.query, hash: to.hash, replace: true }
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

function setLinkTag(selector, attrs) {
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))
}

router.afterEach((to) => {
  if (!to.name) return

  const locale = to.meta.locale || DEFAULT_LOCALE
  const t = i18n.global.t
  const title = to.meta.titleKey ? t(to.meta.titleKey) : 'Toaka Gasy'
  const description = to.meta.descKey ? t(to.meta.descKey) : ''

  document.title = title
  document.documentElement.lang = locale
  setMetaTag('description', false, description)
  setMetaTag('og:title', true, title)
  setMetaTag('og:description', true, description)
  setMetaTag('og:url', true, `${SITE_ORIGIN}${to.fullPath}`)
  setMetaTag('og:locale', true, OG_LOCALE[locale])

  const base = baseRouteName(to.name)
  setLinkTag('link[rel="canonical"]', { rel: 'canonical', href: localizedHref(base, locale, to.params) })
  SUPPORTED_LOCALES.forEach((loc) => {
    setLinkTag(`link[rel="alternate"][hreflang="${loc}"]`, {
      rel: 'alternate',
      hreflang: loc,
      href: localizedHref(base, loc, to.params),
    })
  })
  setLinkTag('link[rel="alternate"][hreflang="x-default"]', {
    rel: 'alternate',
    hreflang: 'x-default',
    href: localizedHref(base, DEFAULT_LOCALE, to.params),
  })
})

export default router
