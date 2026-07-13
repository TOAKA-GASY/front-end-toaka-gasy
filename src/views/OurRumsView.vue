<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { products } from '@/data/products'
import { cocktails } from '@/data/cocktails'
import '@/styles/our-rums.css'

const menuOpen  = ref(false)
const scrollY   = ref(0)
const animated  = ref(false)

/* Visibilité par section rum (pour animation contenu + side nav active) */

const rumVisible = reactive([false, false, false])
const showSideNav = computed(() => rumVisible.some(v => v))
const activeRum   = computed(() => {
  const idx = rumVisible.lastIndexOf(true)
  return idx >= 0 ? idx : 0
})

/* Side nav : 3 bouteilles Toaka */
const sideBottles = [
  { src: '/img/toaka-gasy-black.webp', alt: 'Toaka Gasy Black', label: 'TOAKA NOVA' },
  { src: '/img/toaka-gasy-white.webp', alt: 'Toaka Gasy White', label: 'TOAKA VAZA' },
  { src: '/img/toaka-gasy-red.webp',   alt: 'Toaka Gasy Red',   label: 'TOAKA SÔMA' },
]

const onScroll = () => { scrollY.value = window.scrollY }

/* Parallax léger des 3 bouteilles du hero (section 1) */
const heroP = computed(() => Math.min(1, scrollY.value / (window.innerHeight || 1)))
const parallaxWhite = computed(() => ({ transform: `translateY(${-heroP.value * 55}px)` }))
const parallaxBlack = computed(() => ({ transform: `translateY(${-heroP.value * 28}px)` }))
const parallaxRed   = computed(() => ({ transform: `translateY(${-heroP.value * 38}px)` }))

/* Visibilité section "Our Collection" (intro + 3 rums) */
const orColTopVisible = ref(false)
const introVisible    = reactive([false, false, false])
let orColTopObs = null
let introObs    = null

/* Bouteille présentée pour chaque rum (Nova → Vaza → Soma) */
const introBottles = [
  '/img/toaka-gasy-black.webp',
  '/img/toaka-gasy-white.webp',
  '/img/toaka-gasy-red.webp',
]

/* Image de fond centrée pour chaque rum (Nova → Vaza → Soma) */
const introBgImages = [
  '/img/nova-image.webp',
  '/img/vaza-image.webp',
  '/img/soma-image.webp',
]

/* Scroll vers une section rum */
const scrollToRum = (index) => {
  document.getElementById(`rum-${index}`)?.scrollIntoView({ behavior: 'smooth' })
}

const showTopBtn = computed(() => scrollY.value > window.innerHeight * 0.5)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

let rumObs      = null
let cocktailObs = null

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
  requestAnimationFrame(() => setTimeout(() => { animated.value = true }, 80))

  /* Rums (Our Collection) – visibilité pour side nav actif */
  rumObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const idx = parseInt(entry.target.dataset.introIndex)
        if (!isNaN(idx)) rumVisible[idx] = entry.isIntersecting
      })
    },
    { threshold: 0.35 }
  )
  document.querySelectorAll('.or-col-intro[data-intro-index]').forEach(el => rumObs.observe(el))

  /* Our Collection */
  const orColTopEl = document.querySelector('.or-col-top')
  if (orColTopEl) {
    orColTopObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) orColTopVisible.value = true },
      { threshold: 0.15 }
    )
    orColTopObs.observe(orColTopEl)
  }
  introObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const idx = parseInt(entry.target.dataset.introIndex)
        if (entry.isIntersecting && !isNaN(idx)) {
          introVisible[idx] = true
          introObs.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )
  document.querySelectorAll('.or-col-intro[data-intro-index]').forEach(el => introObs.observe(el))

  /* Cocktails + Recipes (headers partagent la même classe) */
  const headerEls = document.querySelectorAll('.or-cocktails__header')
  if (headerEls.length) {
    cocktailObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('or-cocktails__header--in')
            cocktailObs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    headerEls.forEach(el => cocktailObs.observe(el))
  }
  const cardEls = document.querySelectorAll('.or-cocktail-card')
  const cardObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const i = parseInt(entry.target.dataset.cardIndex)
        if (entry.isIntersecting && !isNaN(i)) {
          setTimeout(() => entry.target.classList.add('or-cocktail-card--in'), i * 110)
          cardObs.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )
  cardEls.forEach(el => cardObs.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  rumObs?.disconnect()
  cocktailObs?.disconnect()
  orColTopObs?.disconnect()
  introObs?.disconnect()
})
</script>

<template>

  <!-- ══════════════════════════════════════
       Nav – visible dès le chargement
       ══════════════════════════════════════ -->
  <nav class="or-nav or-nav--solid" aria-hidden="true">
    <button class="or-nav__toggler" @click="menuOpen = true" aria-label="Ouvrir le menu">
      <span class="or-nav__bar"></span>
      <span class="or-nav__bar"></span>
      <span class="or-nav__bar"></span>
    </button>
    <div class="or-nav__inner">
      <ul class="or-nav__links or-nav__links--left">
        <li><RouterLink to="/"          class="or-nav__link" active-class="or-nav__link--active">HOME</RouterLink></li>
        <li><RouterLink to="/our-story" class="or-nav__link" active-class="or-nav__link--active">OUR STORY</RouterLink></li>
      </ul>
      <RouterLink to="/" class="or-nav__logo-wrap">
        <img src="/logo/logo-marron.webp" class="or-nav__logo" alt="Toaka Gasy" />
      </RouterLink>
      <ul class="or-nav__links or-nav__links--right">
        <li><RouterLink to="/our-rums" class="or-nav__link" active-class="or-nav__link--active">OUR RUMS</RouterLink></li>
        <li><RouterLink to="/contact"  class="or-nav__link" active-class="or-nav__link--active">CONTACT US</RouterLink></li>
      </ul>
    </div>
  </nav>

  <!-- Mobile menu -->
  <Transition name="ormenu">
    <div v-if="menuOpen" class="or-mobile-menu">
      <button class="or-mobile-menu__close" @click="menuOpen = false" aria-label="Fermer">
        <span></span><span></span>
      </button>
      <RouterLink to="/" class="or-mobile-menu__logo" @click="menuOpen = false">
        <img src="/logo/logo-marron.webp" alt="Toaka Gasy" />
      </RouterLink>
      <nav class="or-mobile-menu__nav">
        <RouterLink to="/"          class="or-mobile-menu__link" @click="menuOpen = false">HOME</RouterLink>
        <RouterLink to="/our-story" class="or-mobile-menu__link" @click="menuOpen = false">OUR STORY</RouterLink>
        <RouterLink to="/our-rums"  class="or-mobile-menu__link" @click="menuOpen = false">OUR RUMS</RouterLink>
        <RouterLink to="/contact"   class="or-mobile-menu__link" @click="menuOpen = false">CONTACT US</RouterLink>
      </nav>
    </div>
  </Transition>

  <!-- ══════════════════════════════════════
       Section 1 – Hero : nosy.webp (filtre beige) + 3 bouteilles flottantes
       ══════════════════════════════════════ -->
  <section class="or-hero">
    <h1 class="visually-hidden">Our Rums — Toaka Gasy Collection: Nova, Vaza &amp; Sôma</h1>
    <img
      src="/img/nosy.webp"
      class="or-hero__bg"
      :class="{ 'or-hero__bg--in': animated }"
      alt=""
      aria-hidden="true"
    />
    <div class="or-hero__beige" aria-hidden="true"></div>

    <div class="or-hero__bottles">

      <!-- Black – gauche -->
      <div class="or-hero__pos or-hero__pos--left">
        <div :style="parallaxBlack">
          <img
            src="/img/toaka-gasy-black.webp"
            class="or-hero__bottle or-hero__bottle--black"
            :class="{ 'or-hero__bottle--in': animated }"
            alt="Toaka Gasy Black"
          />
        </div>
      </div>

      <!-- White – centre -->
      <div class="or-hero__pos or-hero__pos--center">
        <div :style="parallaxWhite">
          <img
            src="/img/toaka-gasy-white.webp"
            class="or-hero__bottle or-hero__bottle--white"
            :class="{ 'or-hero__bottle--in': animated }"
            alt="Toaka Gasy White"
          />
        </div>
      </div>

      <!-- Red – droite -->
      <div class="or-hero__pos or-hero__pos--right">
        <div :style="parallaxRed">
          <img
            src="/img/toaka-gasy-red.webp"
            class="or-hero__bottle or-hero__bottle--red"
            :class="{ 'or-hero__bottle--in': animated }"
            alt="Toaka Gasy Red"
          />
        </div>
      </div>

    </div>
  </section>

  <!-- ══════════════════════════════════════
       Section 2 – Our Collection : gradient bleu/beige + grain (400vh)
       Intro + présentation séquentielle des 3 rums
       ══════════════════════════════════════ -->
  <section class="or-collection">

    <!-- 2A : Many ways to celebrate + bateau -->
    <div class="or-col-top" :class="{ 'or-col-top--visible': orColTopVisible }">
      <div class="or-col-top__content">
        <span class="or-col-eyebrow">OUR COLLECTION</span>
        <h2 class="or-col-top__title">MANY WAYS<br>TO CELEBRATE</h2>
      </div>
    </div>

    <!-- 2B-D : Introduction séquentielle des 3 rums – Nova → Vaza → Soma -->
    <div
      v-for="(p, i) in products"
      :key="p.slug"
      :id="`rum-${i}`"
      class="or-col-intro"
      :class="[
        `or-col-intro--${i}`,
        i % 2 === 1 ? 'or-col-intro--reverse' : '',
        { 'or-col-intro--visible': introVisible[i] }
      ]"
      :data-intro-index="i"
    >
      <img
        :src="introBgImages[i]"
        class="or-col-intro__bgimg"
        :class="{ 'or-col-intro__bgimg--bw': i > 0 }"
        alt=""
        aria-hidden="true"
      />
      <div class="or-col-intro__content">
        <h2 class="or-col-intro__title">{{ p.name }}</h2>
        <p class="or-col-intro__tagline">{{ p.tagline }}</p>
        <p class="or-col-intro__desc">{{ p.desc }}</p>
        <span class="or-col-intro__badge">{{ p.badge }}</span>
        <RouterLink :to="`/product/${p.slug}`" class="or-col-intro__cta">
          DISCOVER MORE
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="13 6 19 12 13 18"/>
          </svg>
        </RouterLink>
      </div>
      <div class="or-col-intro__bottle">
        <img :src="introBottles[i]" :alt="p.name" />
        <div class="or-col-intro__shadow" aria-hidden="true"></div>
      </div>
    </div>

  </section>

  <!-- ══════════════════════════════════════
       Side nav – fixe droite, visible dans la zone rums
       ══════════════════════════════════════ -->
  <Transition name="or-sidenav">
    <div v-if="showSideNav" class="or-side-nav" role="navigation" aria-label="Naviguer entre les rums">
      <template v-for="(b, i) in sideBottles" :key="i">
        <button
          class="or-side-nav__item"
          :class="{ 'or-side-nav__item--active': activeRum === i }"
          @click="scrollToRum(i)"
          :aria-label="`Aller à ${b.label}`"
        >
          <img :src="b.src" class="or-side-nav__bottle" :alt="b.alt" />
          <span class="or-side-nav__label">{{ b.label }}</span>
        </button>
        <div v-if="i < 2" class="or-side-nav__sep" aria-hidden="true"></div>
      </template>
    </div>
  </Transition>

  <!-- ══════════════════════════════════════
       Section 3 – Perfect Serves (cocktails)
       ══════════════════════════════════════ -->
  <section class="or-cocktails">
    <div class="or-cocktails__header">
      <h2 class="or-cocktails__title">PERFECT SERVES</h2>
      <div class="or-cocktails__line"></div>
      <p class="or-cocktails__desc">Three signature ways to enjoy Toaka Gasy, crafted for every mood and occasion.</p>
    </div>
    <div class="or-cocktails__grid">
      <RouterLink
        v-for="(c, i) in cocktails"
        :key="i"
        :to="`/recipe/${c.slug}`"
        class="or-cocktail-card"
        :data-card-index="i"
      >
        <img :src="c.src" class="or-cocktail-card__img" :alt="c.title" />
        <div class="or-cocktail-card__overlay" aria-hidden="true"></div>
        <div class="or-cocktail-card__content">
          <h3 class="or-cocktail-card__title">{{ c.title }}</h3>
          <p class="or-cocktail-card__sub">{{ c.subtitle }}</p>
        </div>
        <div class="or-cocktail-card__hover" aria-hidden="true">
          <span>VIEW RECIPE</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="13 6 19 12 13 18"/>
          </svg>
        </div>
      </RouterLink>
    </div>
  </section>

  <!-- Back to top -->
  <Transition name="or-btt">
    <button
      v-if="showTopBtn"
      class="or-back-to-top"
      @click="scrollToTop"
      aria-label="Remonter en haut"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </Transition>

</template>
