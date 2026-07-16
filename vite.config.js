import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'
import { fileURLToPath, URL } from 'node:url'
import { products } from './src/data/products.js'
import { cocktails } from './src/data/cocktails.js'

const dynamicRoutes = [
  '/',
  '/our-story',
  '/our-rums',
  '/contact',
  ...products.map((p) => `/product/${p.slug}`),
  ...cocktails.map((c) => `/recipe/${c.slug}`),
]

export default defineConfig({
  plugins: [
    vue(),
    Sitemap({
      hostname: 'https://toakagasy.com',
      dynamicRoutes,
      // FR temporarily deactivated (see src/i18n.js) — kept out so the sitemap
      // doesn't list /fr/* URLs the router no longer serves.
      i18n: { defaultLanguage: 'en', languages: ['en', 'nl'], strategy: 'prefix' },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})