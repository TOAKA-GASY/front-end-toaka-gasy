<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ContactForm from '@/components/ContactForm.vue'
import '@/styles/contact.css'

const { t } = useI18n()
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
    <button class="ct-nav__toggler" @click="menuOpen = true" :aria-label="t('nav.openMenu')">
      <span class="ct-nav__bar"></span>
      <span class="ct-nav__bar"></span>
      <span class="ct-nav__bar"></span>
    </button>
    <div class="ct-nav__inner">
      <ul class="ct-nav__links ct-nav__links--left">
        <li><RouterLink to="/" class="ct-nav__link" active-class="ct-nav__link--active">{{ t('nav.home') }}</RouterLink></li>
        <li><RouterLink to="/our-story" class="ct-nav__link" active-class="ct-nav__link--active">{{ t('nav.ourStory') }}</RouterLink></li>
      </ul>
      <RouterLink to="/" class="ct-nav__logo-wrap">
        <img src="/logo/logo-marron.webp" class="ct-nav__logo" alt="Toaka Gasy" />
      </RouterLink>
      <ul class="ct-nav__links ct-nav__links--right">
        <li><RouterLink to="/our-rums" class="ct-nav__link" active-class="ct-nav__link--active">{{ t('nav.ourRums') }}</RouterLink></li>
        <li><RouterLink to="/contact" class="ct-nav__link" active-class="ct-nav__link--active">{{ t('nav.contact') }}</RouterLink></li>
      </ul>
    </div>
  </nav>

  <!-- Mobile menu -->
  <Transition name="ctmenu">
    <div v-if="menuOpen" class="ct-mobile-menu">
      <button class="ct-mobile-menu__close" @click="menuOpen = false" :aria-label="t('nav.close')">
        <span></span><span></span>
      </button>
      <RouterLink to="/" class="ct-mobile-menu__logo" @click="menuOpen = false">
        <img src="/logo/logo-marron.webp" alt="Toaka Gasy" />
      </RouterLink>
      <nav class="ct-mobile-menu__nav">
        <RouterLink to="/" class="ct-mobile-menu__link" @click="menuOpen = false">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/our-story" class="ct-mobile-menu__link" @click="menuOpen = false">{{ t('nav.ourStory') }}</RouterLink>
        <RouterLink to="/our-rums" class="ct-mobile-menu__link" @click="menuOpen = false">{{ t('nav.ourRums') }}</RouterLink>
        <RouterLink to="/contact" class="ct-mobile-menu__link" @click="menuOpen = false">{{ t('nav.contact') }}</RouterLink>
      </nav>
    </div>
  </Transition>

  <!-- Section : Fond f3e6d8 + formulaire, centré -->
  <section class="ct-form-section">
    <div class="ct-form-section__grid">
      <div class="ct-form-section__inner">
        <img src="/logo/logo-marron.webp" class="ct-form-section__logo" alt="Toaka Gasy" />
        <h1 class="ct-form-section__title">{{ t('contact.title') }}</h1>
        <p class="ct-form-section__subtitle">{{ t('contact.subtitleLine1') }}<br>{{ t('contact.subtitleLine2') }}</p>
        <ContactForm />
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
        <p class="ct-founders__address">{{ t('contact.founderNarindraAddress') }}</p>
      </div>
      <div class="ct-founders__sep" aria-hidden="true"></div>
      <div class="ct-founders__col">
        <h3 class="ct-founders__name">GERBEN KRIJNEN</h3>
        <a class="ct-founders__link" href="mailto:gerben@toakagasy.com">gerben@toakagasy.com</a>
        <a class="ct-founders__link" href="tel:+310615851268">+31 (0) 6 1585 1268</a>
        <p class="ct-founders__address">{{ t('contact.founderGerbenAddress') }}</p>
      </div>
    </div>
  </section>

</template>
