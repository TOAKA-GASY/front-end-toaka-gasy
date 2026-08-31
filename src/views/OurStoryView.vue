<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import '@/styles/our-story.css'

const { t } = useI18n()
const menuOpen = ref(false)
const scrollY  = ref(0)

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
        <li><RouterLink to="/" class="os-nav__link" active-class="os-nav__link--active">{{ t('nav.home') }}</RouterLink></li>
        <li><RouterLink to="/our-story" class="os-nav__link" active-class="os-nav__link--active">{{ t('nav.ourStory') }}</RouterLink></li>
      </ul>
      <RouterLink to="/" class="os-nav__logo-wrap">
        <img src="/logo/logo-marron.webp" class="os-nav__logo" alt="Toaka Gasy" />
      </RouterLink>
      <ul class="os-nav__links os-nav__links--right">
        <li><RouterLink to="/our-rums" class="os-nav__link" active-class="os-nav__link--active">{{ t('nav.ourRums') }}</RouterLink></li>
        <li><RouterLink to="/contact" class="os-nav__link" active-class="os-nav__link--active">{{ t('nav.contact') }}</RouterLink></li>
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
        <RouterLink to="/" class="os-mobile-menu__link" @click="menuOpen = false">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/our-story" class="os-mobile-menu__link" @click="menuOpen = false">{{ t('nav.ourStory') }}</RouterLink>
        <RouterLink to="/our-rums" class="os-mobile-menu__link" @click="menuOpen = false">{{ t('nav.ourRums') }}</RouterLink>
        <RouterLink to="/contact" class="os-mobile-menu__link" @click="menuOpen = false">{{ t('nav.contact') }}</RouterLink>
      </nav>
    </div>
  </Transition>

  <!-- ══════════════════════════════════════
       Section 1 – The Story Of / Madagascar's Wildest Rum
       ══════════════════════════════════════ -->
  <section class="os-hero">
    <h1 class="visually-hidden">{{ t('ourStory.hiddenH1') }}</h1>

    <div class="os-hero__inner">
      <div class="os-hero__text os-animate" data-delay="0">
        <span class="os-hero__kicker">{{ t('ourStory.heroKicker') }}</span>
        <h2 class="os-hero__title">{{ t('ourStory.heroTitleLine1') }}<br />{{ t('ourStory.heroTitleLine2') }}</h2>
        <p class="os-hero__body">{{ t('ourStory.heroBody') }}</p>
      </div>

      <div class="os-hero__visual os-animate" data-delay="150">
        <img src="/img/bottle-story.png" class="os-hero__img" :alt="t('ourStory.heroImgAlt')" />
        <div class="os-brush" aria-hidden="true">
          <span class="os-brush__stroke"></span>
          <span class="os-brush__stroke"></span>
          <span class="os-brush__stroke"></span>
          <span class="os-brush__stroke"></span>
          <span class="os-brush__stroke"></span>
          <span class="os-brush__stroke"></span>
        </div>
      </div>
    </div>
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
          <div class="os-legend__bottle-shadow" aria-hidden="true"></div>
        </div>
      </div>

      <div class="os-legend__content os-animate" data-delay="150">
        <img src="/img/lemurien.png" class="os-legend__lemur os-animate" data-delay="0" alt="" aria-hidden="true" />
        <h2 class="os-s4__title os-legend__title">{{ t('ourStory.legendTitleLine1') }}<br />{{ t('ourStory.legendTitleLine2') }}</h2>
        <p class="os-legend__body">{{ t('ourStory.legendBody1') }}</p>
        <p class="os-legend__body">{{ t('ourStory.legendBody2') }}</p>
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
      <h2 class="os-s4__title">{{ t('ourStory.aboutTitle') }}</h2>
      <div class="os-s4__line"></div>
      <p class="os-s4__body os-s4__body--compact">{{ t('ourStory.aboutBody') }}</p>
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
          <p class="os-s6__bio">{{ t('ourStory.narindraBio') }}</p>
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
          <p class="os-s6__bio os-s6__bio--gerben ms-md-auto">{{ t('ourStory.gerbenBio') }}</p>
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
          <p class="os-s6__bio">{{ t('ourStory.nathalieBio') }}</p>
          <p class="os-s6__signature os-animate" data-delay="120">Nathalie Manantsara</p>
        </div>
      </div>
    </div>

  </section>

</template>
