<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from '@/layout/Header.vue'
import '@/styles/home.css'

const scrollY   = ref(0)
const s2Visible = ref(false)
const s3Visible = ref(false)
const s3Index   = ref(0)
const s4Index   = ref(0)
const s6Index   = ref(0)
const s7Index   = ref(0)
let observer   = null
let s3Observer = null
let s3Timer    = null
let s4Observer = null
let s4Timer    = null
let s6Observer = null
let s6Timer    = null

const onScroll = () => { scrollY.value = window.scrollY }

const showTopBtn = computed(() => scrollY.value > window.innerHeight * 0.5)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

/* ─── Section 3 ─── */
const s3StartTimer = () => {
  if (!s3Timer) s3Timer = setInterval(() => {
    s3Index.value = (s3Index.value + 1) % 2
  }, 6000)
}
const s3StopTimer = () => {
  if (s3Timer) { clearInterval(s3Timer); s3Timer = null }
}
const onChevronClick = () => {
  s3Index.value = (s3Index.value + 1) % 2
  s3StopTimer()
  s3StartTimer()
}

/* ─── Section 4 ─── */
const s4StartTimer = () => {
  if (!s4Timer) s4Timer = setInterval(() => {
    if (s4Index.value < 2) s4Index.value++
    else s4StopTimer()
  }, 5000)
}
const s4StopTimer = () => {
  if (s4Timer) { clearInterval(s4Timer); s4Timer = null }
}
const onS4Chevron = () => {
  if (s4Index.value < 2) s4Index.value++
  s4StopTimer()
  s4StartTimer()
}
const onS4Back = () => {
  if (s4Index.value > 0) s4Index.value--
  s4StopTimer()
  s4StartTimer()
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

/* ─── Section 6 ─── */
const s6StartTimer = () => {
  if (!s6Timer) s6Timer = setInterval(() => {
    if (s6Index.value < 2) s6Index.value++
    else s6StopTimer()
  }, 5000)
}
const s6StopTimer = () => {
  if (s6Timer) { clearInterval(s6Timer); s6Timer = null }
}
const onS6Chevron = () => {
  if (s6Index.value < 2) s6Index.value++
  s6StopTimer()
  s6StartTimer()
}
const onS6Back = () => {
  if (s6Index.value > 0) s6Index.value--
  s6StopTimer()
  s6StartTimer()
}

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

  const s3El = document.querySelector('.home-s3')
  if (s3El) {
    s3Observer = new IntersectionObserver(
      ([e]) => {
        s3Visible.value = e.isIntersecting
        if (e.isIntersecting) s3StartTimer()
        else s3StopTimer()
      },
      { threshold: 0.4 }
    )
    s3Observer.observe(s3El)
  }

  const s4El = document.querySelector('.home-s4')
  if (s4El) {
    s4Observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) s4StartTimer()
        else s4StopTimer()
      },
      { threshold: 0.4 }
    )
    s4Observer.observe(s4El)
  }

  const s6El = document.querySelector('.home-s6')
  if (s6El) {
    s6Observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) s6StartTimer()
        else s6StopTimer()
      },
      { threshold: 0.4 }
    )
    s6Observer.observe(s6El)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer)   observer.disconnect()
  if (s3Observer) s3Observer.disconnect()
  if (s4Observer) s4Observer.disconnect()
  if (s6Observer) s6Observer.disconnect()
  s3StopTimer()
  s4StopTimer()
  s6StopTimer()
})

const parallax = computed(() => {
  const s = scrollY.value
  return {
    m1:       `translateX(${s * 0.08}px)`,
    bottle:   `translateX(-50%)`,
    ravinala: `translateX(${-s * 0.1}px)`,
  }
})

const s2Scale = computed(() => {
  const vh = window.innerHeight
  const t  = Math.max(0, Math.min(1, (scrollY.value - vh) / vh))
  return 1.15 - 0.22 * t
})

/* ─── Parallax overlay section 3 ─── */
const s3OverlayY = computed(() => {
  scrollY.value // reactive dependency
  const el = document.querySelector('.home-s3')
  if (!el) return 0
  return el.getBoundingClientRect().top * 0.32
})
</script>

<template>
  <!-- Section 1 : parallax sticky -->
  <div class="home-page">
    <div class="home-sticky">
      <img src="/img/fond-montagne.png" class="home-bg" alt="" aria-hidden="true" />
      <Header />
      <section class="home-scene" aria-label="Scène Toaka Gasy">
        <div class="scene-pos scene-pos--m1" :style="{ transform: parallax.m1 }">
          <img src="/img/montagne.png" alt="" aria-hidden="true" />
        </div>
        <div class="scene-pos scene-pos--bottle" :style="{ transform: parallax.bottle }">
          <img src="/img/toaka-gasy-mainty.png" alt="Toaka Gasy" />
        </div>
        <div class="scene-pos scene-pos--ravinala" :style="{ transform: parallax.ravinala }">
          <img src="/img/ravinala.png" alt="" aria-hidden="true" />
        </div>
      </section>
    </div>
  </div>

  <!-- Section 2 : Explore our rums -->
  <section class="home-s2" :class="{ 'home-s2--visible': s2Visible }">
    <div class="s2-image" :style="{ transform: `scale(${s2Scale})` }">
      <img src="/img/toaka-gasy.png" alt="Toaka Gasy" />
    </div>
    <div class="s2-content">
      <h2 class="s2-title">explore our rums</h2>
      <RouterLink to="/our-rums" class="s2-cta">
        <span class="s2-cta__text">view more</span>
        <span class="s2-cta__line" aria-hidden="true"></span>
      </RouterLink>
    </div>
  </section>

  <!-- Section 3 : The spirit of Madagascar -->
  <section class="home-s3" :class="{ 'home-s3--visible': s3Visible }">

    <div class="s3-track" :style="{ transform: `translateX(-${s3Index * 100}%)` }">

      <!-- Slide 1 : rizière -->
      <div class="s3-slide" :class="{ 's3-slide--active': s3Index === 0 }">
        <img src="/img/rizière.png" class="s3-slide__bg" alt="" aria-hidden="true" />
        <div
          class="s3-overlay"
          :style="{ transform: `translateY(${s3OverlayY}px)` }"
          aria-hidden="true"
        ></div>
        <div class="s3-content">
          <h2 class="s3-title">the spirit of madagascar</h2>
          <p class="s3-subtitle">A refined expression of the rich betsileo rum heritage from southern island</p>
        </div>
      </div>

      <!-- Slide 2 : cocotier -->
      <div class="s3-slide" :class="{ 's3-slide--active': s3Index === 1 }">
        <img src="/img/cocotier.png" class="s3-slide__bg" alt="" aria-hidden="true" />
        <div
          class="s3-overlay"
          :style="{ transform: `translateY(${s3OverlayY}px)` }"
          aria-hidden="true"
        ></div>
        <div class="s3-content">
          <h2 class="s3-title s3-title--lg">BETSILEO TRADITIONAL RUM</h2>
          <p class="s3-subtitle s3-subtitle--lg">Discover the origin and traditions of our Betsileo Rum, inspired by MADAGASCAR</p>
        </div>
      </div>

    </div>

    <!-- Chevron -->
    <button class="s3-nav" @click="onChevronClick" aria-label="Slide suivant">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="30,22 46,37 30,52" stroke="#3A2E22" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dots -->
    <div class="s3-dots">
      <button
        v-for="i in 2" :key="i"
        class="s3-dot"
        :class="{ 's3-dot--active': s3Index === i - 1 }"
        @click="s3Index = i - 1"
        :aria-label="`Slide ${i}`"
      />
    </div>

  </section>

  <!-- Section 4 : Our Rums product slides -->
  <section class="home-s4">

    <div class="s4-track" :style="{ transform: `translateX(-${s4Index * 100}%)` }">

      <!-- Slide 1 : Toaka-1 — texte GAUCHE -->
      <div class="s4-slide" :class="{ 's4-slide--active': s4Index === 0 }">
        <img src="/img/toaka-1.png" class="s4-slide__bg" alt="Toaka n°608" />
        <div class="s4-content s4-content--left">
          <h2 class="s4-name">TOAKA n° 608</h2>
          <p class="s4-tagline">Best Sipped with Sun</p>
          <p class="s4-desc">An iconic rum crafted from Caribbean sugar cane, Madagascar vanilla, and Canadian maple syrup.</p>
          <div class="s4-badge">
            <div class="s4-badge__frame">
              <span class="s4-badge__text">sooner available</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 2 : Toaka2 — texte GAUCHE -->
      <div class="s4-slide" :class="{ 's4-slide--active': s4Index === 1 }">
        <img src="/img/toaka-2.png" class="s4-slide__bg" alt="Toaka n°609" />
        <div class="s4-content s4-content--left">
          <h2 class="s4-name">TOAKA n° 609</h2>
          <p class="s4-tagline">Born from the Island</p>
          <p class="s4-desc">A smooth aged rum with tropical fruit notes and the warmth of authentic Malagasy spices.</p>
          <div class="s4-badge">
            <div class="s4-badge__frame">
              <span class="s4-badge__text">sooner available</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 3 : Toaka3 — texte GAUCHE -->
      <div class="s4-slide" :class="{ 's4-slide--active': s4Index === 2 }">
        <img src="/img/toaka-3.png" class="s4-slide__bg" alt="Toaka n°610" />
        <div class="s4-content s4-content--left">
          <h2 class="s4-name">TOAKA n° 610</h2>
          <p class="s4-tagline">Crafted for the Bold</p>
          <p class="s4-desc">A rich full-bodied rum with deep caramel, aged oak, and pure Madagascar vanilla heritage.</p>
          <div class="s4-badge">
            <div class="s4-badge__frame">
              <span class="s4-badge__text">sooner available</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Chevron gauche (slides 2 et 3) -->
    <button v-if="s4Index > 0" class="s4-nav s4-nav--left" @click="onS4Back" aria-label="Slide précédent">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="44,22 28,37 44,52" stroke="#ECD8C4" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Chevron droit (slides 1 et 2 seulement) -->
    <button v-if="s4Index < 2" class="s4-nav s4-nav--right" @click="onS4Chevron" aria-label="Slide suivant">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="30,22 46,37 30,52" stroke="#ECD8C4" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dots -->
    <div class="s4-dots">
      <button
        v-for="i in 3" :key="i"
        class="s4-dot"
        :class="{ 's4-dot--active': s4Index === i - 1 }"
        @click="s4Index = i - 1"
        :aria-label="`Slide ${i}`"
      />
    </div>

  </section>

  <!-- Section 5 : Women drink + vidéo superposée -->
  <section class="home-s5">
    <img src="/img/women-drink.png" class="s5-bg" alt="" aria-hidden="true" />
    <video class="s5-video" autoplay muted loop playsinline>
      <source src="/vd/rum-video.mp4" type="video/mp4" />
    </video>
  </section>

   <!-- Section 6 : Cocktails slider -->
  <section class="home-s6">

    <div class="s6-track" :style="{ transform: `translateX(-${s6Index * 100}%)` }">

      <!-- Slide 1 -->
      <div class="s6-slide" :class="{ 's6-slide--active': s6Index === 0 }">
        <img src="/img/cocktail.png" class="s6-slide__bg" alt="Cocktail Toaka" />
        <div class="s6-gradient" aria-hidden="true"></div>
        <div class="s6-content">
          <h2 class="s6-title">LOST ISLAND COCKTAIL</h2>
          <p class="s6-subtitle">Go wild and get lost</p>
        </div>
      </div>

      <!-- Slide 2 -->
      <div class="s6-slide" :class="{ 's6-slide--active': s6Index === 1 }">
        <img src="/img/cocktail2.png" class="s6-slide__bg" alt="Cocktail Tropical" />
        <div class="s6-gradient" aria-hidden="true"></div>
        <div class="s6-content">
          <h2 class="s6-title">SUNKISSED AT MONTPASSO</h2>
          <p class="s6-subtitle">Smooth rum, bright citrus, perfect balance</p>
        </div>
      </div>

      <!-- Slide 3 -->
      <div class="s6-slide" :class="{ 's6-slide--active': s6Index === 2 }">
        <img src="/img/cocktail3.png" class="s6-slide__bg" alt="Cocktail Signature" />
        <div class="s6-gradient" aria-hidden="true"></div>
        <div class="s6-content">
          <h2 class="s6-title">THE MACKAY  COCKTAIL </h2>
          <p class="s6-subtitle">One sip to be ready for an other adventure</p>
        </div>
      </div>

    </div>

    <!-- Chevron gauche -->
    <button v-if="s6Index > 0" class="s6-nav s6-nav--left" @click="onS6Back" aria-label="Slide précédent">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="44,22 28,37 44,52" stroke="#ECD8C4" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Chevron droit -->
    <button v-if="s6Index < 2" class="s6-nav s6-nav--right" @click="onS6Chevron" aria-label="Slide suivant">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="30,22 46,37 30,52" stroke="#ECD8C4" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dots -->
    <div class="s6-dots">
      <button
        v-for="i in 3" :key="i"
        class="s6-dot"
        :class="{ 's6-dot--active': s6Index === i - 1 }"
        @click="s6Index = i - 1"
        :aria-label="`Slide ${i}`"
      />
    </div>

  </section>

  <!-- Section 7 : Manifeste + 3 produits -->
  <section class="home-s7">
    <img src="/img/montagne-opacity.png" class="s7-bg" alt="" aria-hidden="true" />

    <div class="s7-headline">
      <span class="s7-headline__line">Pour out the first shot</span>
      <span class="s7-headline__line">for what you believe in</span>
    </div>


    <div class="s7-bottles">
      <div
        v-for="(bottle, i) in s7Bottles"
        :key="bottle.src"
        class="s7-bottle"
        :class="s7BottlePos[i]"
      >
        <img :src="bottle.src" :alt="bottle.alt" />
      </div>
    </div>

    <!-- Chevrons -->
    <button class="s7-nav s7-nav--left" @click="onS7Prev" aria-label="Bouteille précédente">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="44,22 28,37 44,52" stroke="#ECD8C4" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="s7-nav s7-nav--right" @click="onS7Next" aria-label="Bouteille suivante">
      <svg width="32" height="32" viewBox="0 0 74 74" fill="none">
        <polyline points="30,22 46,37 30,52" stroke="#ECD8C4" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dots -->
    <div class="s7-dots">
      <button
        v-for="i in 3" :key="i"
        class="s7-dot"
        :class="{ 's7-dot--active': s7Index === i - 1 }"
        @click="s7Index = i - 1"
        :aria-label="`Bouteille ${i}`"
      />
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
