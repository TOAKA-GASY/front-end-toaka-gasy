<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import '@/styles/our-story.css'

const menuOpen = ref(false)
const scrollY  = ref(0)
const animated = ref(false)

const onScroll = () => { scrollY.value = window.scrollY }

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0
        entry.target.style.transitionDelay = `${delay}ms`
        entry.target.classList.add('os-animate--in')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12 }
)

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
  requestAnimationFrame(() => setTimeout(() => { animated.value = true }, 80))
  document.querySelectorAll('.os-animate').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  observer.disconnect()
})

// Léger parallax scroll sur les bouteilles (section 1 défile hors viewport)
const p = computed(() => Math.min(1, scrollY.value / (window.innerHeight || 1)))
const parallaxWhite = computed(() => ({ transform: `translateY(${-p.value * 55}px)` }))
const parallaxBlack = computed(() => ({ transform: `translateY(${-p.value * 28}px)` }))
const parallaxRed   = computed(() => ({ transform: `translateY(${-p.value * 38}px)` }))
</script>

<template>

  <!-- Nav Header -->
  <nav class="os-nav" :class="{ 'os-nav--solid': scrollY > 50 }">
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
        <img src="/logo/logo-marron.png" class="os-nav__logo" alt="Toaka Gasy" />
      </RouterLink>
      <ul class="os-nav__links os-nav__links--right">
        <li><RouterLink to="/our-rums" class="os-nav__link" active-class="os-nav__link--active">OUR RUMS</RouterLink></li>
        <li><RouterLink to="/contact" class="os-nav__link" active-class="os-nav__link--active">CONTACT US</RouterLink></li>
      </ul>
    </div>
  </nav>

  <Transition name="osmenu">
    <div v-if="menuOpen" class="os-mobile-menu">
      <button class="os-mobile-menu__close" @click="menuOpen = false" aria-label="Fermer">
        <span></span><span></span>
      </button>
      <RouterLink to="/" class="os-mobile-menu__logo" @click="menuOpen = false">
        <img src="/logo/logo-marron.png" alt="Toaka Gasy" />
      </RouterLink>
      <nav class="os-mobile-menu__nav">
        <RouterLink to="/" class="os-mobile-menu__link" @click="menuOpen = false">HOME</RouterLink>
        <RouterLink to="/our-story" class="os-mobile-menu__link" @click="menuOpen = false">OUR STORY</RouterLink>
        <RouterLink to="/our-rums" class="os-mobile-menu__link" @click="menuOpen = false">OUR RUMS</RouterLink>
        <RouterLink to="/contact" class="os-mobile-menu__link" @click="menuOpen = false">CONTACT US</RouterLink>
      </nav>
    </div>
  </Transition>

  <!-- ══════════════════════════════════════
       Section 1 – Rizière + 3 bouteilles
       ══════════════════════════════════════ -->
  <section class="os-hero">
    <img src="/img/rizière.webp" class="os-hero__bg" alt="" />

    <div class="os-hero__bottles">

      <!-- Black – gauche -->
      <div class="os-hero__pos os-hero__pos--left">
        <div :style="parallaxBlack">
          <img
            src="/img/toaka-gasy-mainty.webp"
            class="os-hero__bottle os-hero__bottle--black"
            :class="{ 'os-hero__bottle--in': animated }"
            alt="Toaka Gasy Black"
          />
        </div>
      </div>

      <!-- White – centre -->
      <div class="os-hero__pos os-hero__pos--center">
        <div :style="parallaxWhite">
          <img
            src="/img/toaka-gasy-white.webp"
            class="os-hero__bottle os-hero__bottle--white"
            :class="{ 'os-hero__bottle--in': animated }"
            alt="Toaka Gasy White"
          />
        </div>
      </div>

      <!-- Red – droite -->
      <div class="os-hero__pos os-hero__pos--right">
        <div :style="parallaxRed">
          <img
            src="/img/toaka-gasy-red.webp"
            class="os-hero__bottle os-hero__bottle--red"
            :class="{ 'os-hero__bottle--in': animated }"
            alt="Toaka Gasy Red"
          />
        </div>
      </div>

    </div>
  </section>

  <!-- ══════════════════════════════════════
       Section 2 – Texte #74421B puis masque vidéo pleine largeur
       ══════════════════════════════════════ -->
  <section class="os-s2">

    <div class="os-s2__text-wrap os-animate" data-delay="0">
      <h2 class="os-s2__title">BORN IN THE HIDDEN VALLEYS<br>OF MADAGASCAR</h2>
    </div>

    <div class="os-s2__video-wrap os-animate" data-delay="150">
      <video class="os-s2__video" autoplay muted loop playsinline preload="none">
        <source src="/vd/mdg-video.mp4" type="video/mp4" />
      </video>
    </div>

  </section>

  <!-- ══════════════════════════════════════
       Section 3 – An Heritage of Betsileo Rum
       ══════════════════════════════════════ -->
  <section class="os-s3">

    <div class="os-s3__img-wrap os-animate" data-delay="0">
      <img src="/img/citizen.webp" class="os-s3__img" alt="Citizen" />
    </div>

    <div class="os-s3__content os-animate" data-delay="180">
      <h2 class="os-s3__title">AN HERITAGE OF<br>BETSILEO RUM</h2>
      <div class="os-s3__line"></div>
      <p class="os-s3__body">
        Born in the Betsileo mountains, Toaka Gasy carries the spirit of the Tsaranoro Valley,
        wild, iconic, and deeply rooted in southern Madagascar. Shared in everyday life,
        from celebrations to late evenings with friends.
      </p>
    </div>

  </section>

  <!-- ══════════════════════════════════════
       Section 4 – The Beginning
       ══════════════════════════════════════ -->
  <section class="os-s4">

    <div class="os-s4__content os-animate" data-delay="0">
      <h2 class="os-s4__title">THE BEGINNING</h2>
      <div class="os-s4__line"></div>
      <p class="os-s4__body">
        Our vision is to redefine the alcohol lifestyle by creating products that evoke emotion
        and bring people together. Inspired by the energy of rhythm, culture, and festivity,
        we see every bottle as a symbol of celebration.
      </p>
    </div>

    <div class="os-s4__img-wrap os-animate" data-delay="180">
      <img src="/img/cajot.webp" class="os-s4__img" alt="Cajot" />
    </div>

  </section>

  <!-- ══════════════════════════════════════
       Section 5 – Vidéo centrée
       ══════════════════════════════════════ -->
  <section class="os-s5">
    <video class="os-s5__video os-animate" data-delay="0" autoplay muted loop playsinline preload="none">
      <source src="/vd/mdg-toaka.mp4" type="video/mp4" />
    </video>
  </section>

  <!-- ══════════════════════════════════════
       Section 6 – About Us
       ══════════════════════════════════════ -->
  <section class="os-s6">

    <!-- Titre About Us -->
    <div class="os-s6__header os-animate" data-delay="0">
      <h2 class="os-s6__about-title">About Us</h2>
    </div>

    <!-- ── Narindra : nom en haut, photo gauche / bio droite alignés ── -->
    <div class="os-s6__person">
      <div class="row mb-2">
        <div class="col-12 col-md-5 offset-md-1 os-animate" data-delay="0">
          <h3 class="os-s6__name">NARINDRA RAJOSVAH</h3>
        </div>
      </div>
      <div class="row align-items-start gx-3 gy-3 gy-md-0">
        <div class="col-12 col-md-4 offset-md-1 os-animate" data-delay="0">
          <img src="/img/narindra.jpg" class="os-s6__photo" alt="Narindra Rajosvah" />
        </div>
        <div class="col-12 col-md-7 os-animate" data-delay="200">
          <p class="os-s6__bio">
            Born and raised in Madagascar, I've been surrounded by this world from a very young age.
            Coming from a family involved in alcohol distribution in Madagascar, that environment naturally became part of my story and my inspiration.
            In my 20s, I moved to Canada to study. Like many people starting over somewhere new, there was a moment where I felt completely lost and questioned what I truly wanted to build. I remember during a trip to Calgary being on a call with my best friend, who later became my co-founder. That's when I realized I wanted to create something meaningful, something connected to who I am and what I'm passionate about.
            I wanted to bring a part of my roots to North America and share a piece of Madagascar through something authentic. That idea became Toaka Gasy, inspired by traditional Betsileo rum and my heritage as part of the Betsileo ethnic group.
            For me, this is more than a product idea. It's a way to connect tradition with modernity, celebrate where I come from, and create something that tells a story across cultures.
          </p>
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

    <!-- ── Gerben : nom en haut, bio gauche / photo droite alignés ── -->
    <div class="os-s6__person os-s6__person--gerben">
      <div class="row mb-2 justify-content-end gx-3 gx-md-5 gy-0">
        <div class="col-12 col-md-4 os-animate" data-delay="200">
          <h3 class="os-s6__name os-s6__name--sm">GERBEN KRIJNEN</h3>
        </div>
      </div>
      <div class="row align-items-start justify-content-end gx-3 gx-md-5 gy-3 gy-md-0">
        <div class="col-12 col-md-8 order-2 order-md-1 text-md-end os-animate" data-delay="0">
          <p class="os-s6__bio os-s6__bio--gerben ms-md-auto">
            Born and raised in Loosdrecht, the Netherlands, I grew up surrounded by the energy of festivals music, movement, and people coming together. That world shaped me deeply.
            For 15 years, I travelled the globe working festivals. Not on stage, but behind the scenes deep in the technical side of beverages: the setups, the systems, the craft behind every pour. I witnessed firsthand what people reach for when they celebrate, when they connect, when they truly let go.
            That's where Toaka Gasy found me.
            Together with Narindra a true Malagasy woman, the living connection to the roots of this brand I co-founded Toaka Gasy. Not just to create a drink, but to carry a story. A feeling. Where my world of festivals and global stages meets her culture, her heritage, and her identity.
            Toaka Gasy is that bridge. Between two worlds, two stories, one shared vision  that the best moments in life are the ones we share.
          </p>
        </div>
        <div class="col-12 col-md-4 order-1 order-md-2 os-animate" data-delay="200">
          <img src="/img/gerben.jpg" class="os-s6__photo os-s6__photo--gerben" alt="Gerben Krijnen" />
        </div>
      </div>
    </div>

  </section>

</template>
