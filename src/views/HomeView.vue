<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { products } from '@/data/products'
import '@/styles/home.css'

const router = useRouter()

const scrollY    = ref(0)
const menuOpen   = ref(false)
const s2Visible  = ref(false)
const sRumVisible = ref(false)
const s46Index  = ref(0)
const s46Max    = ref(3)
const s7Index   = ref(0)
let observer    = null
let sRumObserver = null
let s46Observer = null
let s46Timer    = null

const onScroll = () => { scrollY.value = window.scrollY }

const isSticky = computed(() => scrollY.value > window.innerHeight * 0.8)

const showTopBtn = computed(() => scrollY.value > window.innerHeight * 0.5)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

/* ─── Section 4 ─── */
const goToProduct = (slug) => router.push(`/product/${slug}`)
const scrollToRums = () => document.getElementById('section-rums')?.scrollIntoView({ behavior: 'smooth' })

/* ─── Section 4+6 combinée ─── */
const cocktails = [
  { src: '/img/cocktail.png',  title: 'LOST ISLAND COCKTAIL',   subtitle: 'Go wild and get lost' },
  { src: '/img/cocktail2.png', title: 'SUNKISSED IN MONT PASSO', subtitle: 'Smooth rum, bright citrus, perfect balance' },
  { src: '/img/cocktail3.png', title: 'THE MACKAY COCKTAIL',    subtitle: 'One sip to be ready for another adventure' },
]

const isSlideActive = (pos) => {
  const perPage = 6 - s46Max.value
  return s46Index.value <= pos && pos < s46Index.value + perPage
}

const updateS46Max = () => {
  const prev = s46Max.value
  s46Max.value = window.innerWidth <= 767 ? 5 : 3
  if (prev !== s46Max.value) s46Index.value = 0
}

const s46StartTimer = () => {
  if (!s46Timer) s46Timer = setInterval(() => {
    s46Index.value = s46Index.value < s46Max.value ? s46Index.value + 1 : 0
  }, 5000)
}
const s46StopTimer = () => {
  if (s46Timer) { clearInterval(s46Timer); s46Timer = null }
}
const onS46Next = () => {
  if (s46Index.value < s46Max.value) s46Index.value++
  s46StopTimer(); s46StartTimer()
}
const onS46Prev = () => {
  if (s46Index.value > 0) s46Index.value--
  s46StopTimer(); s46StartTimer()
}

/* ─── Section 7 ─── */
const s7Bottles = [
  { src: '/img/toaka-gasy-black.png', alt: 'Toaka Gasy Black' },
  { src: '/img/toaka-gasy-white.png', alt: 'Toaka Gasy White' },
  { src: '/img/toaka-gasy-red.png',   alt: 'Toaka Gasy Red'   },
]
const s7BottlePos = computed(() =>
  s7Bottles.map((_, i) => {
    const pos = (i - s7Index.value + 3) % 3
    if (pos === 0) return 's7-bottle--center'
    if (pos === 1) return 's7-bottle--right'
    return 's7-bottle--left'
  })
)
const onS7Next = () => { s7Index.value = (s7Index.value + 1) % 3 }
const onS7Prev = () => { s7Index.value = (s7Index.value + 2) % 3 }


onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  const s2El = document.querySelector('.home-s2')
  if (s2El) {
    observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) s2Visible.value = true },
      { threshold: 0.15 }
    )
    observer.observe(s2El)
  }

  const sRumEl = document.querySelector('.home-s-rum')
  if (sRumEl) {
    sRumObserver = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) sRumVisible.value = true },
      { threshold: 0.15 }
    )
    sRumObserver.observe(sRumEl)
  }

  updateS46Max()
  window.addEventListener('resize', updateS46Max, { passive: true })

  const s46El = document.querySelector('.home-s46')
  if (s46El) {
    s46Observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) s46StartTimer()
        else s46StopTimer()
      },
      { threshold: 0.3 }
    )
    s46Observer.observe(s46El)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateS46Max)
  if (observer)     observer.disconnect()
  if (sRumObserver) sRumObserver.disconnect()
  if (s46Observer)  s46Observer.disconnect()
  s46StopTimer()
})

const parallax = computed(() => {
  const s = scrollY.value
  return {
    bottle:   `translateX(-50%) translateY(${-s * 0.04}px)`,
    ravinala: `translateX(${-s * 0.1}px)`,
  }
})


</script>

<template>

  <!-- Hero Header : grand logo centré → sticky nav au scroll -->
  <div class="hero-hd" :class="{ 'hero-hd--sticky': isSticky }">
    <!-- Hamburger (mobile only) -->
    <button class="hero-hd__toggler" @click="menuOpen = true" aria-label="Ouvrir le menu">
      <span class="hero-hd__bar"></span>
      <span class="hero-hd__bar"></span>
      <span class="hero-hd__bar"></span>
    </button>

    <div class="hero-hd__inner">
      <ul class="hero-hd__nav hero-hd__nav--left">
        <li><RouterLink to="/" class="hero-hd__link" active-class="hero-hd__link--active">HOME</RouterLink></li>
        <li><RouterLink to="/our-story" class="hero-hd__link" active-class="hero-hd__link--active">OUR STORY</RouterLink></li>
      </ul>
      <RouterLink to="/" class="hero-hd__logo-wrap">
        <img src="/logo/logo-marron.png" class="hero-hd__logo" alt="Toaka Gasy" />
      </RouterLink>
      <ul class="hero-hd__nav hero-hd__nav--right">
        <li><RouterLink to="/our-rums" class="hero-hd__link" active-class="hero-hd__link--active">OUR RUMS</RouterLink></li>
        <li><RouterLink to="/contact" class="hero-hd__link" active-class="hero-hd__link--active">CONTACT US</RouterLink></li>
      </ul>
    </div>
  </div>

  <!-- Mobile menu overlay -->
  <Transition name="hmenu">
    <div v-if="menuOpen" class="hero-mobile-menu">
      <button class="hero-mobile-menu__close" @click="menuOpen = false" aria-label="Fermer">
        <span></span><span></span>
      </button>
      <RouterLink to="/" class="hero-mobile-menu__logo" @click="menuOpen = false">
        <img src="/logo/logo-marron.png" alt="Toaka Gasy" />
      </RouterLink>
      <nav class="hero-mobile-menu__nav">
        <RouterLink to="/" class="hero-mobile-menu__link" @click="menuOpen = false">HOME</RouterLink>
        <RouterLink to="/our-story" class="hero-mobile-menu__link" @click="menuOpen = false">OUR STORY</RouterLink>
        <RouterLink to="/our-rums" class="hero-mobile-menu__link" @click="menuOpen = false">OUR RUMS</RouterLink>
        <RouterLink to="/contact" class="hero-mobile-menu__link" @click="menuOpen = false">CONTACT US</RouterLink>
      </nav>
    </div>
  </Transition>

  <!-- Section 1 : parallax sticky -->
  <div class="home-page">
    <div class="home-sticky">
      <img src="/img/fond.png" class="home-bg" alt="" aria-hidden="true" />
      <div class="scene-pos scene-pos--ravinala" :style="{ transform: parallax.ravinala }">
        <img src="/img/ravinala.png" alt="" aria-hidden="true" />
      </div>
      <img src="/img/montagne.png" class="home-mountain" alt="" aria-hidden="true" />
      <section class="home-scene" aria-label="Scène Toaka Gasy">
        <div class="scene-pos scene-pos--bottle" :style="{ transform: parallax.bottle }">
          <img src="/img/toaka-gasy-mainty.png" alt="Toaka Gasy" />
        </div>
        <div class="bottle-shadow" aria-hidden="true"></div>
      </section>
    </div>
  </div>

  <!-- Section 2 : The Rum of Celebration -->
  <section class="home-s2" :class="{ 'home-s2--visible': s2Visible }">
    <div class="s2-rect">
      <img src="/img/rizière.png" class="s2-rect__bg" alt="" aria-hidden="true" />
      <div class="s2-rect__overlay" aria-hidden="true"></div>
      <h2 class="s2-title">THE RUM OF CELEBRATION</h2>
      <button class="s2-cta" @click="scrollToRums">
        <span>DISCOVER MORE</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </div>
  </section>

  <!-- Section 3 : Lifestyle -->
  <section class="home-s3">
    <img src="/img/lifestyle1.jpg" class="s3-img" alt="Lifestyle 1" loading="lazy" />
    <img src="/img/lifestyle2.jpg" class="s3-img" alt="Lifestyle 2" loading="lazy" />
    <img src="/img/lifestyle3.jpg" class="s3-img" alt="Lifestyle 3" loading="lazy" />
  </section>

  <!-- Section Explore Our Rum -->
  <section class="home-s-rum" :class="{ 'home-s-rum--visible': sRumVisible }">
    <div class="s2-rect">
      <img src="/img/cocotier.png" class="s2-rect__bg" alt="" aria-hidden="true" />
      <div class="s2-rect__overlay" aria-hidden="true"></div>
      <h2 class="s2-title">EXPLORE OUR RUM</h2>
      <button class="s2-cta" @click="scrollToRums">
        <span>DISCOVER MORE</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </div>
  </section>

  <!-- Section combinée : Rums + Cocktails alternés (slider 3 visible) -->
  <section id="section-rums" class="home-s46">
    <div class="s46-track" :style="{ transform: `translateX(-${s46Index * (100 / (6 - s46Max))}%)` }">

      <!-- Rum 1 -->
      <button class="s46-slide s46-slide--rum" @click="goToProduct(products[0].slug)" :aria-label="`Découvrir ${products[0].name}`">
        <img :src="products[0].image" class="s4-panel__img" :alt="products[0].name" />
        <div class="s4-panel__overlay" aria-hidden="true"></div>
        <div class="s4-panel__content">
          <h2 class="s4-panel__title">{{ products[0].name }}</h2>
          <p class="s4-panel__tagline">{{ products[0].tagline }}</p>
          <span class="s4-panel__cta"><span>DISCOVER MORE</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
      </button>

      <!-- Cocktail 1 -->
      <div class="s46-slide s46-slide--cocktail" :class="{ 's46-active': isSlideActive(1) }">
        <img :src="cocktails[0].src" class="s6-slide__bg" alt="Cocktail" />
        <div class="s6-gradient" aria-hidden="true"></div>
        <div class="s6-content">
          <h2 class="s6-title">{{ cocktails[0].title }}</h2>
          <p class="s6-subtitle">{{ cocktails[0].subtitle }}</p>
        </div>
      </div>

      <!-- Rum 2 -->
      <button class="s46-slide s46-slide--rum" @click="goToProduct(products[1].slug)" :aria-label="`Découvrir ${products[1].name}`">
        <img :src="products[1].image" class="s4-panel__img" :alt="products[1].name" />
        <div class="s4-panel__overlay" aria-hidden="true"></div>
        <div class="s4-panel__content">
          <h2 class="s4-panel__title">{{ products[1].name }}</h2>
          <p class="s4-panel__tagline">{{ products[1].tagline }}</p>
          <span class="s4-panel__cta"><span>DISCOVER MORE</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
      </button>

      <!-- Cocktail 2 -->
      <div class="s46-slide s46-slide--cocktail" :class="{ 's46-active': isSlideActive(3) }">
        <img :src="cocktails[1].src" class="s6-slide__bg" alt="Cocktail 2" />
        <div class="s6-gradient" aria-hidden="true"></div>
        <div class="s6-content">
          <h2 class="s6-title">{{ cocktails[1].title }}</h2>
          <p class="s6-subtitle">{{ cocktails[1].subtitle }}</p>
        </div>
      </div>

      <!-- Rum 3 -->
      <button class="s46-slide s46-slide--rum" @click="goToProduct(products[2].slug)" :aria-label="`Découvrir ${products[2].name}`">
        <img :src="products[2].image" class="s4-panel__img" :alt="products[2].name" />
        <div class="s4-panel__overlay" aria-hidden="true"></div>
        <div class="s4-panel__content">
          <h2 class="s4-panel__title">{{ products[2].name }}</h2>
          <p class="s4-panel__tagline">{{ products[2].tagline }}</p>
          <span class="s4-panel__cta"><span>DISCOVER MORE</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
      </button>

      <!-- Cocktail 3 -->
      <div class="s46-slide s46-slide--cocktail" :class="{ 's46-active': isSlideActive(5) }">
        <img :src="cocktails[2].src" class="s6-slide__bg" alt="Cocktail 3" />
        <div class="s6-gradient" aria-hidden="true"></div>
        <div class="s6-content">
          <h2 class="s6-title">{{ cocktails[2].title }}</h2>
          <p class="s6-subtitle">{{ cocktails[2].subtitle }}</p>
        </div>
      </div>

    </div>

    <!-- Chevron gauche -->
    <button v-if="s46Index > 0" class="s46-nav s46-nav--left" @click="onS46Prev" aria-label="Précédent">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="44,22 28,37 44,52" stroke="#ECD8C4" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Chevron droit -->
    <button v-if="s46Index < s46Max" class="s46-nav s46-nav--right" @click="onS46Next" aria-label="Suivant">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="30,22 46,37 30,52" stroke="currentColor" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </section>

  <!-- Section 5+7 : Women drink → Foil doré + Bouteilles (seamless) -->
  <section class="home-s57">

    <!-- Zone haute : women-drink pleine hauteur -->
    <div class="s57-zone-top">
      <img src="/img/women-drink2.png" class="s57-top" alt="" aria-hidden="true" loading="lazy" />
      <video class="s57-video" autoplay muted loop playsinline preload="none">
        <source src="/vd/rum-video.mp4" type="video/mp4" />
      </video>
      <p class="s57-tagline">
        More than a rum it's a vibe, a celebration,<br>
        an heritage and a tradition...
      </p>
    </div>

    <!-- Zone basse : foil doré pleine hauteur + bouteilles -->
    <div class="s57-zone-bottom">
      <img src="/img/foil-dore2.png" class="s57-bottom" alt="" aria-hidden="true" loading="lazy" />

      <div class="s57-bottles">
        <div
          v-for="(bottle, i) in s7Bottles"
          :key="bottle.src"
          class="s7-bottle"
          :class="s7BottlePos[i]"
        >
          <img :src="bottle.src" :alt="bottle.alt" />
        </div>
      </div>

      <button class="s57-nav s57-nav--left" @click="onS7Prev" aria-label="Bouteille précédente">
        <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
          <polyline points="44,22 28,37 44,52" stroke="currentColor" stroke-width="4"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="s57-nav s57-nav--right" @click="onS7Next" aria-label="Bouteille suivante">
        <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
          <polyline points="30,22 46,37 30,52" stroke="currentColor" stroke-width="4"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="s57-dots">
        <button
          v-for="i in 3" :key="i"
          class="s7-dot"
          :class="{ 's7-dot--active': s7Index === i - 1 }"
          @click="s7Index = i - 1"
          :aria-label="`Bouteille ${i}`"
        />
      </div>
    </div>

  </section>

  <!-- Back to top -->
  <Transition name="btt">
    <button
      v-if="showTopBtn"
      class="back-to-top"
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
