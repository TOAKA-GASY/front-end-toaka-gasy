<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { products } from '@/data/products'
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
  { src: '/img/toaka-gasy-red.webp',   alt: 'Toaka Gasy Red',   label: 'TOAKA 610' },
]

/* Cocktails */
const cocktails = [
  { src: '/img/cocktail.webp',  title: 'LOST ISLAND COCKTAIL',    subtitle: 'Go wild and get lost'                       },
  { src: '/img/cocktail2.webp', title: 'SUNKISSED IN MONT PASSOT', subtitle: 'Smooth rum, bright citrus, perfect balance' },
  { src: '/img/cocktail3.webp', title: 'THE MACKAY COCKTAIL',     subtitle: 'One sip to be ready for another adventure'  },
]

const onScroll = () => { scrollY.value = window.scrollY }

const showNav = computed(() => scrollY.value > window.innerHeight * 0.4)


/* Parallax images rum – subtil, différent par section */
const rumP = computed(() => {
  const s = scrollY.value
  return {
    r0: `translateY(${-s * 0.024}px)`,
    r1: `translateY(${-s * 0.018}px)`,
    r2: `translateY(${-s * 0.021}px)`,
  }
})

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

  /* Rum sections – visibilité pour animation contenu + side nav */
  rumObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const idx = parseInt(entry.target.dataset.rumIndex)
        if (!isNaN(idx)) rumVisible[idx] = entry.isIntersecting
      })
    },
    { threshold: 0.35 }
  )
  document.querySelectorAll('.or-rum[data-rum-index]').forEach(el => rumObs.observe(el))

  /* Cocktails */
  const headerEl = document.querySelector('.or-cocktails__header')
  if (headerEl) {
    cocktailObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) headerEl.classList.add('or-cocktails__header--in') },
      { threshold: 0.2 }
    )
    cocktailObs.observe(headerEl)
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
})
</script>

<template>

  <!-- ══════════════════════════════════════
       Nav – glisse vers le bas au scroll
       ══════════════════════════════════════ -->
  <nav class="or-nav" :class="{ 'or-nav--solid': showNav }" aria-hidden="true">
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
        <img src="/logo/logo-marron.png" class="or-nav__logo" alt="Toaka Gasy" />
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
        <img src="/logo/logo-marron.png" alt="Toaka Gasy" />
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
       Section 1 – Hero : logo-dore + bouteilles gauche + texte droite
       ══════════════════════════════════════ -->
  <section class="or-hero">
    <img src="/img/foil-dore2.webp" class="or-hero__bg" alt="" aria-hidden="true" />
    <div class="or-hero__overlay" aria-hidden="true"></div>

    <!-- Logo doré centré en haut -->
    <RouterLink to="/" class="or-hero__logo-wrap" :class="{ 'or-hero__logo-wrap--in': animated }">
      <img src="/logo/logo-dore.png" class="or-hero__logo" alt="Toaka Gasy" />
    </RouterLink>

    <!-- Titre + texte centrés -->
    <div class="or-hero__center" :class="{ 'or-hero__center--in': animated }">
      <h1 class="or-hero__title">OUR RUMS</h1>
      <div class="or-hero__gold-line"></div>
      <p class="or-hero__subtitle">
        Three rums. One story.<br>
        Born in the hidden valleys of Madagascar,<br>
        each expression carries the spirit of a land unlike any other.
      </p>
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
       Section 3 – Rum n° 608
       ══════════════════════════════════════ -->
  <section
    id="rum-0"
    class="or-rum"
    :class="{ 'or-rum--visible': rumVisible[0] }"
    data-rum-index="0"
  >
    <img
      :src="products[0].image"
      class="or-rum__bg"
      :alt="products[0].name"
      :style="{ transform: rumP.r0 }"
    />
    <div class="or-rum__gradient" aria-hidden="true"></div>
    <div class="or-rum__content">
      <span class="or-rum__num">N° 608</span>
      <h2 class="or-rum__name">{{ products[0].name }}</h2>
      <div class="or-rum__line"></div>
      <p class="or-rum__tagline">{{ products[0].tagline }}</p>
      <p class="or-rum__desc">{{ products[0].desc }}</p>
      <span class="or-rum__badge">{{ products[0].badge }}</span>
      <RouterLink :to="`/product/${products[0].slug}`" class="or-rum__cta">
        DISCOVER MORE
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="13 6 19 12 13 18"/>
        </svg>
      </RouterLink>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       Section 4 – Rum n° 609
       ══════════════════════════════════════ -->
  <section
    id="rum-1"
    class="or-rum"
    :class="{ 'or-rum--visible': rumVisible[1] }"
    data-rum-index="1"
  >
    <img
      :src="products[1].image"
      class="or-rum__bg"
      :alt="products[1].name"
      :style="{ transform: rumP.r1 }"
    />
    <div class="or-rum__gradient" aria-hidden="true"></div>
    <div class="or-rum__content">
      <span class="or-rum__num">N° 609</span>
      <h2 class="or-rum__name">{{ products[1].name }}</h2>
      <div class="or-rum__line"></div>
      <p class="or-rum__tagline">{{ products[1].tagline }}</p>
      <p class="or-rum__desc">{{ products[1].desc }}</p>
      <span class="or-rum__badge">{{ products[1].badge }}</span>
      <RouterLink :to="`/product/${products[1].slug}`" class="or-rum__cta">
        DISCOVER MORE
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="13 6 19 12 13 18"/>
        </svg>
      </RouterLink>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       Section 5 – Rum n° 610
       ══════════════════════════════════════ -->
  <section
    id="rum-2"
    class="or-rum"
    :class="{ 'or-rum--visible': rumVisible[2] }"
    data-rum-index="2"
  >
    <img
      :src="products[2].image"
      class="or-rum__bg"
      :alt="products[2].name"
      :style="{ transform: rumP.r2 }"
    />
    <div class="or-rum__gradient" aria-hidden="true"></div>
    <div class="or-rum__content">
      <span class="or-rum__num">N° 610</span>
      <h2 class="or-rum__name">{{ products[2].name }}</h2>
      <div class="or-rum__line"></div>
      <p class="or-rum__tagline">{{ products[2].tagline }}</p>
      <p class="or-rum__desc">{{ products[2].desc }}</p>
      <span class="or-rum__badge">{{ products[2].badge }}</span>
      <RouterLink :to="`/product/${products[2].slug}`" class="or-rum__cta">
        DISCOVER MORE
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="13 6 19 12 13 18"/>
        </svg>
      </RouterLink>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       Section 6 – Perfect Serves (cocktails)
       ══════════════════════════════════════ -->
  <section class="or-cocktails">
    <div class="or-cocktails__header">
      <h2 class="or-cocktails__title">PERFECT SERVES</h2>
      <div class="or-cocktails__line"></div>
    </div>
    <div class="or-cocktails__grid">
      <div
        v-for="(c, i) in cocktails"
        :key="i"
        class="or-cocktail-card"
        :data-card-index="i"
      >
        <img :src="c.src" class="or-cocktail-card__img" :alt="c.title" />
        <div class="or-cocktail-card__overlay" aria-hidden="true"></div>
        <div class="or-cocktail-card__content">
          <h3 class="or-cocktail-card__title">{{ c.title }}</h3>
          <p class="or-cocktail-card__sub">{{ c.subtitle }}</p>
        </div>
      </div>
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
