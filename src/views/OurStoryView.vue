<script setup>
import { ref } from 'vue'
import '@/styles/our-story.css'

const menuOpen = ref(false)
</script>

<template>

  <!-- Nav Header (toujours visible) -->
  <nav class="os-nav">
    <button class="os-nav__toggler" @click="menuOpen = true" aria-label="Ouvrir le menu">
      <span class="os-nav__bar"></span>
      <span class="os-nav__bar"></span>
      <span class="os-nav__bar"></span>
    </button>
    <div class="os-nav__inner">
      <ul class="os-nav__links os-nav__links--left">
        <li><RouterLink to="/" class="os-nav__link" active-class="os-nav__link--active">HOME</RouterLink></li>
        <li><RouterLink to="/our-story" class="os-nav__link" active-class="os-nav__link--active">OUR STORY</RouterLink></li>
      </ul>
      <RouterLink to="/" class="os-nav__logo-wrap">
        <img src="/logo/logo-dore.png" class="os-nav__logo" alt="Toaka Gasy" />
      </RouterLink>
      <ul class="os-nav__links os-nav__links--right">
        <li><RouterLink to="/our-rums" class="os-nav__link" active-class="os-nav__link--active">OUR RUMS</RouterLink></li>
        <li><RouterLink to="/contact" class="os-nav__link" active-class="os-nav__link--active">CONTACT US</RouterLink></li>
      </ul>
    </div>
  </nav>

  <!-- Mobile menu -->
  <Transition name="osmenu">
    <div v-if="menuOpen" class="os-mobile-menu">
      <button class="os-mobile-menu__close" @click="menuOpen = false" aria-label="Fermer">
        <span></span><span></span>
      </button>
      <RouterLink to="/" class="os-mobile-menu__logo" @click="menuOpen = false">
        <img src="/logo/logo-dore.png" alt="Toaka Gasy" />
      </RouterLink>
      <nav class="os-mobile-menu__nav">
        <RouterLink to="/" class="os-mobile-menu__link" @click="menuOpen = false">HOME</RouterLink>
        <RouterLink to="/our-story" class="os-mobile-menu__link" @click="menuOpen = false">OUR STORY</RouterLink>
        <RouterLink to="/our-rums" class="os-mobile-menu__link" @click="menuOpen = false">OUR RUMS</RouterLink>
        <RouterLink to="/contact" class="os-mobile-menu__link" @click="menuOpen = false">CONTACT US</RouterLink>
      </nav>
    </div>
  </Transition>

  <!-- Section 1 : Hero -->
  <section class="os-hero">

    <!-- Gauche : texte -->
    <div class="os-hero__left">
      <span class="os-hero__the">the</span>
      <h1 class="os-hero__title">Malagasy Rum</h1>
      <span class="os-hero__heritage">heritage</span>
      <p class="os-hero__sub">A story between tradition and festivity</p>
    </div>

    <!-- Droite : images -->
    <div class="os-hero__right">
      <img src="/img/mdg.png" class="os-hero__mdg" alt="Madagascar" />
      <img src="/img/toaka-gasy-black.png" class="os-hero__bottle" alt="Toaka Gasy Black" />
    </div>

  </section>

  <!-- Section 2 : The Origin -->
  <section class="os-origin">

    <!-- Left : exposition photo -->
    <div class="os-origin__left">
      <img src="/img/toaka-exposition1.png" class="os-origin__expo" alt="Toaka Gasy exposition" />
    </div>

    <!-- Right : text -->
    <div class="os-origin__right">
      <span class="os-origin__label">Our Vision</span>
      <h2 class="os-origin__title">THE ORIGIN</h2>
      <div class="os-origin__line"></div>
      <p class="os-origin__text">
        our vision is to redefine the alcohol lifestyle by creating products that spark emotion
        and bring people together. inspired by the energy of rythm, culture, and festvity.
        We see every bottle as a symbol of celebration.
      </p>
    </div>

    <!-- Bottom : golden MDG line -->
    <img src="/img/line-mdg.png" class="os-origin__mdg-line" alt="" aria-hidden="true" />

  </section>

</template>
