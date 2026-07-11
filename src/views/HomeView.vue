<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { products } from '@/data/products'
import EventsSection from '@/components/EventsSection.vue'
import '@/styles/home.css'

const router = useRouter()

const scrollY    = ref(0)
const menuOpen   = ref(false)
const hnS2TopVisible    = ref(false)
const hnS2BottomVisible = ref(false)
const hnS4Visible = ref(false)
const s3Visible = ref(false)
const rizVisible = ref(false)
let hnS2TopObserver = null
let hnS2BottomObserver = null
let hnS4Observer = null
let s3Observer = null
let rizObserver = null

/* ─── Scroll fluide : lecture throttlée via requestAnimationFrame ─── */
let scrollTicking = false
const onScroll = () => {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(() => {
    scrollY.value = window.scrollY
    scrollTicking = false
  })
}

const isSticky = computed(() => scrollY.value > window.innerHeight * 0.15)

const showTopBtn = computed(() => scrollY.value > window.innerHeight * 0.5)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

/* ─── Section 2B ─── */
const goToProduct = (slug) => router.push(`/product/${slug}`)
const goToStory = () => router.push('/our-story')

/* ─── Bouteilles (Section 5) ─── */
const s7Bottles = [
  { src: '/img/toaka-gasy-black.webp', alt: 'Toaka Gasy Black' },
  { src: '/img/toaka-gasy-white.webp', alt: 'Toaka Gasy White' },
  { src: '/img/toaka-gasy-red.webp',   alt: 'Toaka Gasy Red'   },
]

/* ─── Section 5 : Rizière (carousel indépendant, mêmes bouteilles) ─── */
const s5Index = ref(0)
const s5BottlePos = computed(() =>
  s7Bottles.map((_, i) => {
    const pos = (i - s5Index.value + 3) % 3
    if (pos === 0) return 's7-bottle--center'
    if (pos === 1) return 's7-bottle--right'
    return 's7-bottle--left'
  })
)
const onS5Next = () => { s5Index.value = (s5Index.value + 1) % 3 }
const onS5Prev = () => { s5Index.value = (s5Index.value + 2) % 3 }


onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  const hnS2TopEl = document.querySelector('.hn-s2-top')
  if (hnS2TopEl) {
    hnS2TopObserver = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) hnS2TopVisible.value = true },
      { threshold: 0.15 }
    )
    hnS2TopObserver.observe(hnS2TopEl)
  }

  const hnS2BottomEl = document.querySelector('.hn-s2-bottom')
  if (hnS2BottomEl) {
    hnS2BottomObserver = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) hnS2BottomVisible.value = true },
      { threshold: 0.15 }
    )
    hnS2BottomObserver.observe(hnS2BottomEl)
  }

  const hnS4El = document.querySelector('.home-new-s4')
  if (hnS4El) {
    hnS4Observer = new IntersectionObserver(
      ([e]) => { hnS4Visible.value = e.isIntersecting },
      { threshold: 0.15 }
    )
    hnS4Observer.observe(hnS4El)
  }

  const s3El = document.querySelector('.home-new-s3')
  if (s3El) {
    s3Observer = new IntersectionObserver(
      ([e]) => { s3Visible.value = e.isIntersecting },
      { threshold: 0.15 }
    )
    s3Observer.observe(s3El)
  }

  const rizEl = document.querySelector('.home-riz')
  if (rizEl) {
    rizObserver = new IntersectionObserver(
      ([e]) => { rizVisible.value = e.isIntersecting },
      { threshold: 0.15 }
    )
    rizObserver.observe(rizEl)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (hnS2TopObserver)    hnS2TopObserver.disconnect()
  if (hnS2BottomObserver) hnS2BottomObserver.disconnect()
  if (hnS4Observer)       hnS4Observer.disconnect()
  if (s3Observer)         s3Observer.disconnect()
  if (rizObserver)        rizObserver.disconnect()
})

/* Un seul mouvement, sur un seul scroll : ravinala et bouteille suivent la même progression */
const parallax = computed(() => {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const progress = Math.min(scrollY.value / vh, 1)
  return {
    bottle:   `translateX(-50%) translateY(${progress * 90}px)`,
    ravinala: `translateX(${-progress * 110}px)`,
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
        <img src="/logo/logo-marron.webp" class="hero-hd__logo" alt="Toaka Gasy" />
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
        <img src="/logo/logo-marron.webp" alt="Toaka Gasy" />
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
    <h1 class="visually-hidden">Toaka Gasy — Authentic Malagasy Rum Crafted in the Betsileo Tradition</h1>
    <div class="home-sticky">
      <div class="home-sticky__bg-clip">
        <img src="/img/fond.webp" class="home-bg" alt="" aria-hidden="true" />
        <div class="scene-pos scene-pos--ravinala" :style="{ transform: parallax.ravinala }">
          <img src="/img/ravinala.webp" alt="" aria-hidden="true" />
        </div>
        <img src="/img/montagne.webp" class="home-mountain" alt="" aria-hidden="true" />
      </div>
      <section class="home-scene" aria-label="Scène Toaka Gasy">
        <div class="scene-pos scene-pos--bottle" :style="{ transform: parallax.bottle }">
          <img src="/img/toaka-gasy-black.webp" alt="Toaka Gasy" />
          <div class="bottle-shadow" aria-hidden="true"></div>
        </div>
      </section>
    </div>
  </div>

  <!-- Sections 2 + 4 combinées : fond unique fond-sec2-3.webp + grain + dégradé, 300vh -->
  <div class="home-new-wrap">

    <!-- Section 2 : Inspiration + Nova (200vh) -->
    <section class="home-new-s2">

      <!-- 2A : The Rum of Celebration -->
      <div class="hn-s2-top" :class="{ 'hn-s2-top--visible': hnS2TopVisible }">
        <div class="hn-s2-content">
          <span class="hn-s2-eyebrow">THE INSPIRATION</span>
          <h2 class="hn-s2-title">The Rum of Celebration</h2>
          <p class="hn-s2-text">
            In Betsileo Ethnies, in the South of Madagascar, rum is more than a drink.<br>
            It's a symbol of togetherness, a pleasure of celebration, a joy of hospitality.<br>
            Our rum is inspired by this culture and shaped by our journey, made to be shared with the world.
          </p>
          <button class="hn-s2-cta" @click="goToStory">
            <span>DISCOVER OUR STORY</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 2B : Introducing Nova -->
      <div class="hn-s2-bottom" :class="{ 'hn-s2-bottom--visible': hnS2BottomVisible }">
        <div class="hn-s2b-bottle">
          <img src="/img/toaka-gasy-black.webp" alt="Toaka Gasy" />
          <div class="hn-s2b-bottle__shadow" aria-hidden="true"></div>
        </div>
        <div class="hn-s2b-content">
          <span class="hn-s2-eyebrow">INTRODUCING</span>
          <h2 class="hn-s2b-title">NOVA</h2>
          <p class="hn-s2-text">
            Amber Rum Born in Nova Scotia, shaped by the spirit of the Maritimes. An amber rum that celebrates all sweet beginning
          </p>
          <button class="hn-s2-cta" @click="goToProduct(products[0].slug)">
            <span>DISCOVER NOVA</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>

    </section>

    <!-- Section 4 : Why We Exist -->
    <section class="home-new-s4" :class="{ 'home-new-s4--visible': hnS4Visible }">
      <div class="hn-s4-content">
        <span class="hn-s2-eyebrow">WHY WE EXIST</span>
        <h2 class="hn-s4-title">Rum Crafted With Purpose</h2>
        <p class="hn-s4-text">From Madagascar to the world, rum has always brought us together!</p>
      </div>
      <div class="hn-s4-images">
        <img src="/img/cajot1.webp" class="hn-s4-img" alt="Rum aging in oak barrels" loading="lazy" />
        <img src="/img/cajot2.webp" class="hn-s4-img" alt="Tasting the rum" loading="lazy" />
        <img src="/img/cajot3.webp" class="hn-s4-img" alt="Rum tasting experience" loading="lazy" />
      </div>
    </section>

  </div>

  <!-- Section 5 : Rizière + bouteilles animées -->
  <section class="home-riz">
    <img src="/img/rizière.webp" class="home-riz__bg" alt="" aria-hidden="true" />

    <div class="riz-heading" :class="{ 'riz-heading--visible': rizVisible }">
      <span class="hn-s2-eyebrow">OUR COLLECTION</span>
      <h2 class="riz-title">EACH BOTTLE TELLS A STORY</h2>
    </div>

    <div class="home-riz__bottles">
      <div
        v-for="(bottle, i) in s7Bottles"
        :key="`riz-${bottle.src}`"
        class="s7-bottle"
        :class="s5BottlePos[i]"
      >
        <img :src="bottle.src" :alt="bottle.alt" />
        <div class="s7-bottle__shadow" aria-hidden="true"></div>
      </div>
    </div>

    <button class="s57-nav s57-nav--left" @click="onS5Prev" aria-label="Bouteille précédente">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="44,22 28,37 44,52" stroke="currentColor" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="s57-nav s57-nav--right" @click="onS5Next" aria-label="Bouteille suivante">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="30,22 46,37 30,52" stroke="currentColor" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="s57-dots">
      <button
        v-for="i in 3" :key="i"
        class="s7-dot"
        :class="{ 's7-dot--active': s5Index === i - 1 }"
        @click="s5Index = i - 1"
        :aria-label="`Bouteille ${i}`"
      />
    </div>
  </section>

  <!-- Section 3 : Lifestyle -->
  <section class="home-new-s3" :class="{ 'home-new-s3--visible': s3Visible }">
    <img src="/img/lifestyle1.webp" class="s3-img" alt="Lifestyle 1" loading="lazy" />
    <img src="/img/lifestyle2.webp" class="s3-img" alt="Lifestyle 2" loading="lazy" />
    <img src="/img/lifestyle3.webp" class="s3-img" alt="Lifestyle 3" loading="lazy" />
  </section>

  <!-- Section : Women drink + vidéo (remplacée par la section Events) -->
  <!--
  <section class="home-s57">
    <div class="s57-zone-top">
      <img src="/img/women-drink2.webp" class="s57-top" alt="" aria-hidden="true" loading="lazy" />
      <video class="s57-video" autoplay muted loop playsinline preload="none">
        <source src="/vd/rum-video.mp4" type="video/mp4" />
      </video>
      <p class="s57-tagline">
        Amber Rum Born in Nova Scotia,<br>
        shaped by the spirit of the Maritimes. An amber rum that celebrates all sweet beginning
      </p>
    </div>
  </section>
  -->

  <!-- Section : Events -->
  <EventsSection />

  <!-- Section : Follow Us -->
  <section class="home-follow">
    <p class="home-follow__subtitle">Follow us on social media for upcoming events</p>
    <div class="home-follow__social">
      <a href="https://www.instagram.com/toakagasy.company" class="home-follow__link" target="_blank" rel="noopener" aria-label="Instagram">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4.5"/>
          <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none"/>
        </svg>
      </a>
      <a href="https://www.linkedin.com/in/toaka-gasy-company-79298140b/" class="home-follow__link" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a href="https://toakagasy.com" class="home-follow__link" target="_blank" rel="noopener" aria-label="Site web">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12a15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </a>
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
