<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ContactForm from '@/components/ContactForm.vue'
import '@/styles/contact.css'

const menuOpen = ref(false)
const scrollY = ref(0)
const onScroll = () => { scrollY.value = window.scrollY }

const mapVisible = ref(false)
let mapObserver = null

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })

  const mapEl = document.querySelector('.ct-map__card')
  if (mapEl) {
    mapObserver = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) mapVisible.value = true },
      { threshold: 0.2 }
    )
    mapObserver.observe(mapEl)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  mapObserver?.disconnect()
})
</script>

<template>

  <!-- Nav Header – rectangle f3e6d8, même style que Our Story -->
  <nav class="ct-nav">
    <button class="ct-nav__toggler" @click="menuOpen = true" aria-label="Ouvrir le menu">
      <span class="ct-nav__bar"></span>
      <span class="ct-nav__bar"></span>
      <span class="ct-nav__bar"></span>
    </button>
    <div class="ct-nav__inner">
      <ul class="ct-nav__links ct-nav__links--left">
        <li><RouterLink to="/" class="ct-nav__link" active-class="ct-nav__link--active">HOME</RouterLink></li>
        <li><RouterLink to="/our-story" class="ct-nav__link" active-class="ct-nav__link--active">OUR STORY</RouterLink></li>
      </ul>
      <RouterLink to="/" class="ct-nav__logo-wrap">
        <img src="/logo/logo-marron.webp" class="ct-nav__logo" alt="Toaka Gasy" />
      </RouterLink>
      <ul class="ct-nav__links ct-nav__links--right">
        <li><RouterLink to="/our-rums" class="ct-nav__link" active-class="ct-nav__link--active">OUR RUMS</RouterLink></li>
        <li><RouterLink to="/contact" class="ct-nav__link" active-class="ct-nav__link--active">CONTACT US</RouterLink></li>
      </ul>
    </div>
  </nav>

  <!-- Mobile menu -->
  <Transition name="ctmenu">
    <div v-if="menuOpen" class="ct-mobile-menu">
      <button class="ct-mobile-menu__close" @click="menuOpen = false" aria-label="Fermer">
        <span></span><span></span>
      </button>
      <RouterLink to="/" class="ct-mobile-menu__logo" @click="menuOpen = false">
        <img src="/logo/logo-marron.webp" alt="Toaka Gasy" />
      </RouterLink>
      <nav class="ct-mobile-menu__nav">
        <RouterLink to="/" class="ct-mobile-menu__link" @click="menuOpen = false">HOME</RouterLink>
        <RouterLink to="/our-story" class="ct-mobile-menu__link" @click="menuOpen = false">OUR STORY</RouterLink>
        <RouterLink to="/our-rums" class="ct-mobile-menu__link" @click="menuOpen = false">OUR RUMS</RouterLink>
        <RouterLink to="/contact" class="ct-mobile-menu__link" @click="menuOpen = false">CONTACT US</RouterLink>
      </nav>
    </div>
  </Transition>

  <!-- Section 1 : Vidéo plein écran -->
  <section class="ct-hero">
    <video class="ct-hero__video" autoplay muted loop playsinline>
      <source src="/vd/rum-video.mp4" type="video/mp4" />
    </video>
  </section>

  <!-- Section 2 : Fond f3e6d8 + formulaire + map -->
  <section class="ct-form-section">
    <div class="ct-form-section__grid">

      <div class="ct-form-section__inner">
        <img src="/logo/logo-marron.webp" class="ct-form-section__logo" alt="Toaka Gasy" />
        <h1 class="ct-form-section__title">CONTACT US</h1>
        <p class="ct-form-section__subtitle">For partnerships, distribution, press, or select inquiries,<br>please contact us. Product details and pricing are shared upon request.</p>
        <ContactForm />
      </div>

      <!-- Map : carte marron, détails beige, deux icônes qui arrivent en animation (Narindra – Halifax / Gerben – Loosdrecht) -->
      <div class="ct-map">
        <div class="ct-map__card" :class="{ 'ct-map__card--visible': mapVisible }">
          <svg class="ct-map__compass" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="1"/>
            <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" stroke-width="0.75"/>
            <path d="M50 6 L50 94 M6 50 L94 50 M17 17 L83 83 M17 83 L83 17" stroke="currentColor" stroke-width="0.5"/>
            <path d="M50 14 L56 50 L50 86 L44 50 Z" fill="currentColor"/>
            <text x="50" y="10" text-anchor="middle" font-size="9" fill="currentColor" font-family="serif">N</text>
          </svg>

          <a
            class="ct-map__pin ct-map__pin--a"
            style="left: 13.75%; top: 75%;"
            href="https://www.google.com/maps/search/?api=1&query=44.6540986,-63.5964908"
            target="_blank" rel="noopener"
            aria-label="Narindra Rajosvah — Halifax, Nova Scotia"
          >
            <svg class="ct-map__pin-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.4 6.3 11.6 6.57 11.86a1.3 1.3 0 0 0 1.86 0c.27-.26 6.57-6.46 6.57-11.86C19.5 5.36 16.14 2 12 2zm0 10.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5z"/>
            </svg>
            <span class="ct-map__pin-label">Narindra<br>Halifax, NS</span>
          </a>

          <a
            class="ct-map__pin ct-map__pin--b"
            style="left: 86.25%; top: 27.5%;"
            href="https://www.google.com/maps/search/?api=1&query=52.2067203,5.0827792"
            target="_blank" rel="noopener"
            aria-label="Gerben Krijnen — Loosdrecht, Netherlands"
          >
            <svg class="ct-map__pin-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.4 6.3 11.6 6.57 11.86a1.3 1.3 0 0 0 1.86 0c.27-.26 6.57-6.46 6.57-11.86C19.5 5.36 16.14 2 12 2zm0 10.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5z"/>
            </svg>
            <span class="ct-map__pin-label">Gerben<br>Loosdrecht, NL</span>
          </a>
        </div>
      </div>

    </div>
  </section>

  <!-- Section 3 : Fondateurs – rectangle marron -->
  <section class="ct-founders">
    <div class="ct-founders__inner">
      <div class="ct-founders__col">
        <h3 class="ct-founders__name">NARINDRA RAJOSVAH</h3>
        <a class="ct-founders__link" href="mailto:narindra@toakagasy.com">narindra@toakagasy.com</a>
        <a class="ct-founders__link" href="tel:+15142429517">+1 514 242 9517</a>
        <p class="ct-founders__address">2621 Clifton Street, Halifax NS, CA</p>
      </div>
      <div class="ct-founders__sep" aria-hidden="true"></div>
      <div class="ct-founders__col">
        <h3 class="ct-founders__name">GERBEN KRIJNEN</h3>
        <a class="ct-founders__link" href="mailto:gerben@toakagasy.com">gerben@toakagasy.com</a>
        <a class="ct-founders__link" href="tel:+130615851268">+13 (0) 6 1585 1268</a>
        <p class="ct-founders__address">Oud Loosdrechtse dijk 187, 1231 VW Loosdrecht, Netherlands</p>
      </div>
    </div>
  </section>

</template>
