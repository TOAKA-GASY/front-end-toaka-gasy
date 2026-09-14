<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import '@/styles/our-story.css'

const { t } = useI18n()
const menuOpen = ref(false)
const scrollY  = ref(0)

/* Section "Many regions, One spirit" : carte animée des 5 régions.
   x/y : position du point en % de l'image desktop (ourstory-desk.png).
   mx/my : sa position en % de l'image mobile (ourstory-mobile.png), qui a
   un tout autre cadrage (portrait, bouteille centrée) — d'où des coordonnées
   distinctes plutôt qu'un simple recalcul des mêmes x/y. Le texte de chaque
   région est ancré par le bas, juste au-dessus de son point (cf. template),
   et grandit vers le haut. */
const regions = [
  { key: 'west',      x: 8,  y: 58, mx: 12, my: 40, delay: 0,   labelKey: 'ourStory.regionWestLabel',      bodyKey: 'ourStory.regionWestBody' },
  { key: 'north',     x: 22, y: 36, mx: 32, my: 32, delay: 120, labelKey: 'ourStory.regionNorthLabel',     bodyKey: 'ourStory.regionNorthBody' },
  { key: 'highlands', x: 34, y: 54, mx: 50, my: 24, delay: 240, labelKey: 'ourStory.regionHighlandsLabel', bodyKey: 'ourStory.regionHighlandsBody' },
  { key: 'east',      x: 66, y: 36, mx: 70, my: 30, delay: 360, labelKey: 'ourStory.regionEastLabel',      bodyKey: 'ourStory.regionEastBody' },
  { key: 'south',     x: 92, y: 52, mx: 88, my: 38, delay: 480, labelKey: 'ourStory.regionSouthLabel',     bodyKey: 'ourStory.regionSouthBody' },
]

/* Dimensions natives des deux photos : chaque carte SVG utilise ce même
   repère en pixels (viewBox) pour un tracé et des points sans aucune
   distorsion une fois le SVG étiré à la taille réelle affichée. */
const IMG_W = 2962
const IMG_H = 1361
const MOBILE_IMG_W = 1125
const MOBILE_IMG_H = 2436

/* Courbe continue en vague passant par les 5 points (Catmull-Rom convertie
   en segments de Bézier cubique) : une seule ligne fluide, au lieu de 5
   segments droits indépendants. */
function buildWavePath(points) {
  const at = (i) => points[Math.max(0, Math.min(points.length - 1, i))]
  let d = `M ${at(0).px.toFixed(1)},${at(0).py.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    const c1x = p1.px + (p2.px - p0.px) / 6
    const c1y = p1.py + (p2.py - p0.py) / 6
    const c2x = p2.px - (p3.px - p1.px) / 6
    const c2y = p2.py - (p3.py - p1.py) / 6
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.px.toFixed(1)},${p2.py.toFixed(1)}`
  }
  return d
}

const wavePoints = regions.map(r => ({ key: r.key, px: (r.x / 100) * IMG_W, py: (r.y / 100) * IMG_H }))
const wavePath = buildWavePath(wavePoints)

const mobileWavePoints = regions.map(r => ({ key: r.key, px: (r.mx / 100) * MOBILE_IMG_W, py: (r.my / 100) * MOBILE_IMG_H }))
const mobileWavePath = buildWavePath(mobileWavePoints)

const onScroll = () => { scrollY.value = window.scrollY }

/* Les animations rejouent à chaque passage (pas seulement la première fois) */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const delay = entry.target.dataset.delay || 0
      entry.target.style.transitionDelay = `${delay}ms`
      entry.target.classList.toggle('os-animate--in', entry.isIntersecting)
    })
  },
  { threshold: 0.12 }
)

/* Proverbe : effet machine à écrire, lettre par lettre, à chaque passage */
const proverbText = "Ny betsileo tsa mora mamo fa ny toaka ro mahery!"
const proverbLetters = proverbText.split('').map(ch => (ch === ' ' ? ' ' : ch))
const proverbVisible = ref(false)
let proverbObserver = null

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.querySelectorAll('.os-animate').forEach(el => observer.observe(el))

  const proverbEl = document.querySelector('.os-legend__proverb')
  if (proverbEl) {
    proverbObserver = new IntersectionObserver(
      ([entry]) => { proverbVisible.value = entry.isIntersecting },
      { threshold: 0.4 }
    )
    proverbObserver.observe(proverbEl)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  observer.disconnect()
  proverbObserver?.disconnect()
})
</script>

<template>

  <!-- Nav Header -->
  <nav class="os-nav" :class="{ 'os-nav--solid': scrollY > 50 }">
    <button class="os-nav__toggler" @click="menuOpen = true" :aria-label="t('nav.openMenu')">
      <span class="os-nav__bar"></span>
      <span class="os-nav__bar"></span>
      <span class="os-nav__bar"></span>
    </button>
    <div class="os-nav__inner">
      <ul class="os-nav__links os-nav__links--left">
        <li><RouterLink to="/" class="os-nav__link" active-class="os-nav__link--active" v-field-style="'nav.home'">{{ t('nav.home') }}</RouterLink></li>
        <li><RouterLink to="/our-story" class="os-nav__link" active-class="os-nav__link--active" v-field-style="'nav.ourStory'">{{ t('nav.ourStory') }}</RouterLink></li>
      </ul>
      <RouterLink to="/" class="os-nav__logo-wrap">
        <img src="/logo/logo-marron.webp" class="os-nav__logo" alt="Toaka Gasy" />
      </RouterLink>
      <ul class="os-nav__links os-nav__links--right">
        <li><RouterLink to="/our-rums" class="os-nav__link" active-class="os-nav__link--active" v-field-style="'nav.ourRums'">{{ t('nav.ourRums') }}</RouterLink></li>
        <li><RouterLink to="/contact" class="os-nav__link" active-class="os-nav__link--active" v-field-style="'nav.contact'">{{ t('nav.contact') }}</RouterLink></li>
      </ul>
    </div>
  </nav>

  <Transition name="osmenu">
    <div v-if="menuOpen" class="os-mobile-menu">
      <button class="os-mobile-menu__close" @click="menuOpen = false" :aria-label="t('nav.close')">
        <span></span><span></span>
      </button>
      <RouterLink to="/" class="os-mobile-menu__logo" @click="menuOpen = false">
        <img src="/logo/logo-marron.webp" alt="Toaka Gasy" />
      </RouterLink>
      <nav class="os-mobile-menu__nav">
        <RouterLink to="/" class="os-mobile-menu__link" @click="menuOpen = false" v-field-style="'nav.home'">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/our-story" class="os-mobile-menu__link" @click="menuOpen = false" v-field-style="'nav.ourStory'">{{ t('nav.ourStory') }}</RouterLink>
        <RouterLink to="/our-rums" class="os-mobile-menu__link" @click="menuOpen = false" v-field-style="'nav.ourRums'">{{ t('nav.ourRums') }}</RouterLink>
        <RouterLink to="/contact" class="os-mobile-menu__link" @click="menuOpen = false" v-field-style="'nav.contact'">{{ t('nav.contact') }}</RouterLink>
      </nav>
    </div>
  </Transition>

  <!-- ══════════════════════════════════════
       Section – Many Regions, One Spirit (carte animée des régions)
       ══════════════════════════════════════ -->
  <section class="os-regions">
    <h1 class="visually-hidden">{{ t('ourStory.hiddenH1') }}</h1>

    <picture class="os-regions__bg-wrap">
      <source media="(max-width: 767.98px)" srcset="/img/ourstory-mobile.png" />
      <img src="/img/ourstory-desk.png" class="os-regions__bg" alt="" aria-hidden="true" />
    </picture>

    <!-- Ligne continue en vague reliant les 5 régions, + un point par région
         (deux tracés : cadrage desktop paysage / cadrage mobile portrait,
         basculés en CSS selon la largeur d'écran) -->
    <svg
      class="os-regions__wave os-regions__wave--desktop os-animate"
      data-delay="150"
      viewBox="0 0 2962 1361"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path :d="wavePath" class="os-regions__wave-path" />
      <circle
        v-for="pt in wavePoints" :key="`halo-${pt.key}`"
        class="os-regions__wave-dot-halo" :cx="pt.px" :cy="pt.py" r="28"
      />
      <circle
        v-for="pt in wavePoints" :key="`dot-${pt.key}`"
        class="os-regions__wave-dot" :cx="pt.px" :cy="pt.py" r="12"
      />
    </svg>

    <svg
      class="os-regions__wave os-regions__wave--mobile os-animate"
      data-delay="150"
      viewBox="0 0 1125 2436"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path :d="mobileWavePath" class="os-regions__wave-path" />
      <circle
        v-for="pt in mobileWavePoints" :key="`mhalo-${pt.key}`"
        class="os-regions__wave-dot-halo" :cx="pt.px" :cy="pt.py" r="14"
      />
      <circle
        v-for="pt in mobileWavePoints" :key="`mdot-${pt.key}`"
        class="os-regions__wave-dot" :cx="pt.px" :cy="pt.py" r="6"
      />
    </svg>

    <div class="os-regions__points">
      <div
        v-for="region in regions"
        :key="region.key"
        class="os-regions__point os-animate"
        :style="{
          '--pt-left': region.x + '%',
          '--pt-bottom': `calc(${100 - region.y}% + 20px)`,
          '--pt-left-m': region.mx + '%',
          '--pt-bottom-m': `calc(${100 - region.my}% + 20px)`,
        }"
        :data-delay="region.delay"
      >
        <div class="os-regions__point-text">
          <span class="os-regions__point-label" v-field-style="region.labelKey">{{ t(region.labelKey) }}</span>
          <p class="os-regions__point-body" v-field-style="region.bodyKey">{{ t(region.bodyKey) }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       Section – MADAGASCAR / Many regions. One spirit.
       ══════════════════════════════════════ -->
  <section class="os-regions-intro os-animate" data-delay="0">
    <span class="os-regions-intro__eyebrow" v-field-style="'ourStory.regionsEyebrow'">{{ t('ourStory.regionsEyebrow') }}</span>
    <h2 class="os-regions-intro__title">
      <span v-field-style="'ourStory.regionsTitleLine1'">{{ t('ourStory.regionsTitleLine1') }}</span><br />
      <span v-field-style="'ourStory.regionsTitleLine2'">{{ t('ourStory.regionsTitleLine2') }}</span>
    </h2>
    <p class="os-regions-intro__body" v-field-style="'ourStory.regionsBody'">{{ t('ourStory.regionsBody') }}</p>
  </section>

  <!-- ══════════════════════════════════════
       Section 2 – The Rum of Celebration (vidéo masquée + Behind the Legend)
       ══════════════════════════════════════ -->
  <section class="os-legend">

    <div class="os-legend__video-wrap os-animate" data-delay="0">
      <video class="os-legend__video" autoplay muted loop playsinline preload="none">
        <source src="/vd/mdg-video2.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="os-legend__inner">
      <div class="os-legend__visual">
        <div class="os-legend__bottle-pos os-animate" data-delay="0">
          <img src="/img/toaka-gasy-red.webp" class="os-legend__bottle" :alt="t('ourStory.bottleAlt')" />
        </div>
      </div>

      <div class="os-legend__content os-animate" data-delay="150">
        <h2 class="os-s4__title os-legend__title"><span v-field-style="'ourStory.legendTitleLine1'">{{ t('ourStory.legendTitleLine1') }}</span><br /><span v-field-style="'ourStory.legendTitleLine2'">{{ t('ourStory.legendTitleLine2') }}</span></h2>
        <p class="os-legend__body" v-field-style="'ourStory.legendBody1'">{{ t('ourStory.legendBody1') }}</p>
        <p class="os-legend__body" v-field-style="'ourStory.legendBody2'">{{ t('ourStory.legendBody2') }}</p>
      </div>
    </div>

    <p class="os-legend__proverb">
      <span
        v-for="(letter, i) in proverbLetters"
        :key="i"
        class="os-letter"
        :class="{ 'os-letter--in': proverbVisible, 'os-letter--space': letter === ' ' }"
        :style="{ transitionDelay: `${i * 28}ms` }"
      >{{ letter }}</span>
    </p>

  </section>

  <!-- ══════════════════════════════════════
       Section 3 – About Us
       ══════════════════════════════════════ -->
  <section class="os-s4">

    <div class="os-s4__content os-animate" data-delay="0">
      <h2 class="os-s4__title" v-field-style="'ourStory.aboutTitle'">{{ t('ourStory.aboutTitle') }}</h2>
      <div class="os-s4__line"></div>
      <p class="os-s4__body os-s4__body--compact" v-field-style="'ourStory.aboutBody'">{{ t('ourStory.aboutBody') }}</p>
    </div>

    <div class="os-s4__img-wrap os-animate" data-delay="180">
      <img src="/img/cajot2-story.webp" class="os-s4__img" :alt="t('ourStory.aboutImgAlt')" />
    </div>

  </section>


  <!-- ══════════════════════════════════════
       Section 6 – Founders
       ══════════════════════════════════════ -->
  <section class="os-s6">

    <!-- ── Narindra : photo gauche / bio droite, signature seule (pas de nom) ── -->
    <div class="os-s6__person">
      <div class="row align-items-start gx-3 gy-3 gy-md-0">
        <div class="col-12 col-md-4 offset-md-1 os-animate" data-delay="0">
          <img src="/img/narindra.webp" class="os-s6__photo" :alt="t('ourStory.narindraPhotoAlt')" />
        </div>
        <div class="col-12 col-md-7 os-animate" data-delay="200">
          <p class="os-s6__bio" v-field-style="'ourStory.narindraBio'">{{ t('ourStory.narindraBio') }}</p>
          <p class="os-s6__signature os-animate" data-delay="120">Narindra Rajosvah</p>
        </div>
      </div>
    </div>

    <!-- ── Citation centrale avec image de fond ── -->
    <!-- <div class="os-s6__quote">
      <img src="/img/Rectangle.png" class="os-s6__quote-bg" alt="" />
      <div class="os-s6__quote-inner os-animate" data-delay="0">
        <p class="os-s6__quote-line">Pour out the first shot</p>
        <p class="os-s6__quote-line">for what you believe in</p>
      </div>
    </div> -->

    <!-- ── Gerben : bio gauche / photo droite, signature seule (pas de nom) ── -->
    <div class="os-s6__person os-s6__person--gerben">
      <div class="row align-items-start justify-content-end gx-3 gx-md-5 gy-3 gy-md-0">
        <div class="col-12 col-md-8 order-2 order-md-1 text-md-end os-animate" data-delay="0">
          <p class="os-s6__bio os-s6__bio--gerben ms-md-auto" v-field-style="'ourStory.gerbenBio'">{{ t('ourStory.gerbenBio') }}</p>
          <p class="os-s6__signature os-animate" data-delay="120">Gerben Krijnen</p>
        </div>
        <div class="col-12 col-md-4 order-1 order-md-2 os-animate" data-delay="200">
          <img src="/img/gerben.webp" class="os-s6__photo os-s6__photo--gerben" :alt="t('ourStory.gerbenPhotoAlt')" />
        </div>
      </div>
    </div>

    <!-- ── Nathalie : photo gauche / bio droite, signature seule (pas de nom) ── -->
    <div class="os-s6__person">
      <div class="row align-items-start gx-3 gy-3 gy-md-0">
        <div class="col-12 col-md-4 offset-md-1 os-animate" data-delay="0">
          <img src="/img/nathalie.webp" class="os-s6__photo" :alt="t('ourStory.nathaliePhotoAlt')" />
        </div>
        <div class="col-12 col-md-7 os-animate" data-delay="200">
          <p class="os-s6__bio" v-field-style="'ourStory.nathalieBio'">{{ t('ourStory.nathalieBio') }}</p>
          <p class="os-s6__signature os-animate" data-delay="120">Nathalie Manantsara</p>
        </div>
      </div>
    </div>

  </section>

</template>
