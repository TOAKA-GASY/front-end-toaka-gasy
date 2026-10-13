<template>
  <LoadingScreen :visible="!appReady" />
  <AgeGate />
  <RouterView />
  <Footer />
  <LanguageSwitcher />
  <AdminRoot />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '@/layout/Footer.vue'
import AgeGate from '@/layout/AgeGate.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import AdminRoot from '@/admin/AdminRoot.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const router = useRouter()
const appReady = ref(false)

/* Images critiques du premier écran, par page d'atterrissage (nom de route
   sans le suffixe de langue — /fr, /nl, /it). Seules les pages statiques
   ont une liste dédiée ici ; product/recipe (bouteille/cocktail dynamiques)
   se contentent d'un court délai de sécurité ci-dessous. */
const CRITICAL_IMAGES = {
  home: ['/img/fond.webp', '/logo/logo-marron.webp', '/img/montagne.webp', '/img/ravinala.webp', '/img/toaka-gasy-black.webp'],
  'our-story': ['/img/bottle-story.png'],
  'our-rums': ['/img/nosy.webp', '/img/toaka-gasy-black.webp', '/img/toaka-gasy-white.webp', '/img/toaka-gasy-red.webp'],
  contact: ['/img/toaka-gasy.png'],
}

function preloadImages(srcs) {
  return Promise.all(srcs.map((src) => new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = src
  })))
}

onMounted(async () => {
  await router.isReady()
  const baseName = String(router.currentRoute.value.name || '').replace(/-(fr|nl|it)$/, '')
  const srcs = CRITICAL_IMAGES[baseName]

  /* Filet de sécurité : ne jamais laisser l'écran de chargement bloquer le
     site plus de 2.5s, même sur un réseau lent ou une image manquante. */
  const fallback = setTimeout(() => { appReady.value = true }, 2500)

  if (srcs?.length) {
    preloadImages(srcs).then(() => {
      clearTimeout(fallback)
      requestAnimationFrame(() => { appReady.value = true })
    })
  } else {
    // Page sans liste dédiée (product/recipe) : pas d'attente artificielle.
    clearTimeout(fallback)
    appReady.value = true
  }
})
</script>
