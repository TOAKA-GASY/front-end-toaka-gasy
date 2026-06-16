<template>
  <nav class="header" :style="bgColor ? { backgroundColor: bgColor } : {}">
    <div class="header__container">

      <!-- Phone only: hamburger + logo centered -->
      <button class="header__toggler" @click="menuOpen = true" aria-label="Ouvrir le menu">
        <span class="header__bar"></span>
        <span class="header__bar"></span>
        <span class="header__bar"></span>
      </button>

      <RouterLink to="/" class="header__brand-mobile">
        <img src="/logo/logo-marron.png" class="header__logo-mobile" alt="Toaka Gasy" />
      </RouterLink>

      <!-- Desktop: 3-column grid -->
      <div class="header__grid">
        <ul class="header__nav header__nav--left">
          <li>
            <RouterLink to="/" class="header__link" active-class="header__link--active">HOME</RouterLink>
          </li>
          <li>
            <RouterLink to="/our-story" class="header__link" active-class="header__link--active">OUR STORY</RouterLink>
          </li>
        </ul>

        <RouterLink to="/" class="header__logo-center">
          <img src="/logo/logo-marron.png" class="header__logo" alt="Toaka Gasy" />
        </RouterLink>

        <ul class="header__nav header__nav--right">
          <li>
            <RouterLink to="/our-rums" class="header__link" active-class="header__link--active">OUR RUMS</RouterLink>
          </li>
          <li>
            <RouterLink to="/contact" class="header__link" active-class="header__link--active">CONTACT US</RouterLink>
          </li>
        </ul>
      </div>

    </div>
  </nav>

  <!-- Full-page mobile menu overlay -->
  <Transition name="menu-slide">
    <div v-if="menuOpen" class="mobile-menu">
      <button class="mobile-menu__close" @click="menuOpen = false" aria-label="Fermer le menu">
        <span></span>
        <span></span>
      </button>

      <RouterLink to="/" class="mobile-menu__logo" @click="menuOpen = false">
        <img src="/logo/logo-marron.png" alt="Toaka Gasy" />
      </RouterLink>

      <nav class="mobile-menu__nav">
        <RouterLink to="/" class="mobile-menu__link" @click="menuOpen = false">HOME</RouterLink>
        <RouterLink to="/our-story" class="mobile-menu__link" @click="menuOpen = false">OUR STORY</RouterLink>
        <RouterLink to="/our-rums" class="mobile-menu__link" @click="menuOpen = false">OUR RUMS</RouterLink>
        <RouterLink to="/contact" class="mobile-menu__link" @click="menuOpen = false">CONTACT US</RouterLink>
      </nav>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  bgColor: { type: String, default: '' },
})

const menuOpen = ref(false)
</script>

<style scoped>
/* ─── Header ─── */
.header {
  background: transparent;
  position: relative;
  z-index: 50;
  padding: 2rem 0 0.75rem;
  transition: background-color 0.4s ease;
}

.header__container {
  width: 100%;
  padding: 0 4rem;
  display: flex;
  align-items: center;
  position: relative;
}

/* ─── Desktop grid (3 columns) ─── */
.header__grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
}

.header__logo-center {
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__logo {
  height: clamp(44px, 10vh, 72px);
  width: auto;
  object-fit: contain;
}

/* ─── Nav lists ─── */
.header__nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 4rem;
  align-items: center;
}

.header__nav--left {
  justify-content: flex-end;
  padding-right: 2.5rem;
}

.header__nav--right {
  justify-content: flex-start;
  padding-left: 2.5rem;
}

/* ─── Links ─── */
.header__link {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: clamp(0.75rem, 1vw, 1rem);
  color: var(--color-dark);
  letter-spacing: 0.1em;
  padding: 0.4rem 0.6rem;
  display: block;
  white-space: nowrap;
  transition: opacity var(--transition);
}

.header__link:hover,
.header__link--active {
  opacity: 0.5;
}

/* ─── Hamburger (phone only, hidden on desktop) ─── */
.header__toggler {
  display: none;
  border: none;
  background: transparent;
  flex-direction: column;
  gap: 6px;
  padding: 0.35rem;
  cursor: pointer;
  z-index: 2;
}

.header__bar {
  display: block;
  width: 32px;
  height: 2px;
  background: var(--color-dark);
  border-radius: 2px;
}

/* ─── Mobile logo (phone only, hidden on desktop) ─── */
.header__brand-mobile {
  display: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header__logo-mobile {
  height: clamp(32px, 5vh, 48px);
  width: auto;
  object-fit: contain;
}

/* ─── Grand écran (Bootstrap xxl) ─── */
@media (min-width: 1400px) {
  .header__logo {
    height: clamp(72px, 7vh, 100px);
  }

  .header__nav {
    gap: clamp(4rem, 5vw, 7rem);
  }

  .header__link {
    font-size: clamp(1rem, 1.1vw, 1.3rem);
  }
}

/* ─── Phone breakpoint ─── */
@media (max-width: 767.98px) {
  .header {
    padding: 1.5rem 0 0.75rem;
  }

  .header__toggler {
    display: flex;
  }

  .header__brand-mobile {
    display: flex;
  }

  .header__grid {
    display: none;
  }
}

/* ─── Full-page mobile menu overlay ─── */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--color-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
}

.mobile-menu__close {
  position: absolute;
  top: 1.75rem;
  right: 1.75rem;
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  cursor: pointer;
  padding: 0;
}

.mobile-menu__close span {
  display: block;
  position: absolute;
  width: 28px;
  height: 2px;
  background: var(--color-beige);
  border-radius: 2px;
  top: 50%;
  left: 50%;
}

.mobile-menu__close span:first-child {
  transform: translate(-50%, -50%) rotate(45deg);
}

.mobile-menu__close span:last-child {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.mobile-menu__logo img {
  height: 72px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.mobile-menu__link {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: 1.6rem;
  letter-spacing: 0.12em;
  color: var(--color-beige);
  transition: opacity var(--transition);
}

.mobile-menu__link:hover {
  opacity: 0.6;
}

/* ─── Overlay transition ─── */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
