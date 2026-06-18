<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ContactForm from '@/components/ContactForm.vue'
import '@/styles/contact.css'

const menuOpen = ref(false)
const scrollY = ref(0)
const onScroll = () => { scrollY.value = window.scrollY }

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
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
        <img src="/logo/logo-marron.png" class="ct-nav__logo" alt="Toaka Gasy" />
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
        <img src="/logo/logo-marron.png" alt="Toaka Gasy" />
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

  <!-- Section 2 : Fond f3e6d8 + formulaire -->
  <section class="ct-form-section">
    <div class="ct-form-section__inner">
      <img src="/logo/logo-marron.png" class="ct-form-section__logo" alt="Toaka Gasy" />
      <h1 class="ct-form-section__title">CONTACT US</h1>
      <p class="ct-form-section__subtitle">For partnerships, distribution, press, or select inquiries,<br>please contact us. Product details and pricing are shared upon request.</p>
      <ContactForm />
    </div>
  </section>

</template>
