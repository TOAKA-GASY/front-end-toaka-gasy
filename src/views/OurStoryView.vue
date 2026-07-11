<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import EventsSection from '@/components/EventsSection.vue'
import '@/styles/our-story.css'

const menuOpen = ref(false)
const scrollY  = ref(0)

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
  document.querySelectorAll('.os-animate').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  observer.disconnect()
})

// Parallax scroll sur la bouteille : descend légèrement vers le masque au scroll
const p = computed(() => Math.min(1, scrollY.value / (window.innerHeight || 1)))
const parallaxRed = computed(() => ({ transform: `translateY(${p.value * 70}px)` }))
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
        <img src="/logo/logo-marron.webp" class="os-nav__logo" alt="Toaka Gasy" />
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
        <img src="/logo/logo-marron.webp" alt="Toaka Gasy" />
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
       Section 1 – Fond + vidéo masquée + bouteille Toaka Mena
       ══════════════════════════════════════ -->
  <section class="os-hero">
    <h1 class="visually-hidden">Our Story — The Heritage Behind Toaka Gasy Rum</h1>

    <div class="os-hero__mask-wrap os-animate" data-delay="0">
      <video class="os-hero__video" autoplay muted loop playsinline preload="none">
        <source src="/vd/mdg-video.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="os-hero__bottles">
      <!-- Mena (rouge) – centrée, en bas du hero -->
      <div class="os-hero__pos os-hero__pos--center">
        <div :style="parallaxRed">
          <img
            src="/img/toaka-gasy-red.webp"
            class="os-hero__bottle os-hero__bottle--mena os-animate"
            data-delay="100"
            alt="Toaka Gasy Mena"
          />
        </div>
      </div>
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
        We are Toaka Gasy Company, a rum house founded by Malagasy and Dutch associates<br /><br />
        Crafted in the Netherlands, our rum carries Madagascar's spirit of celebration made to bring people together.
      </p>
      <p class="os-s4__body">
        Our vision is to redefine the alcohol lifestyle <br /> by creating products that evoke emotion
        and bring people together. Inspired by the energy of rhythm, culture, and festivity,
        we see every bottle as a symbol of celebration.
      </p>
    </div>

    <div class="os-s4__img-wrap os-animate" data-delay="180">
      <img src="/img/cajot2-story.webp" class="os-s4__img" alt="Cajot" />
    </div>

  </section>

  <!-- ══════════════════════════════════════
       Section 4b – Behind the Legend
       ══════════════════════════════════════ -->
  <section class="os-s4 os-s4--legend">

    <div class="os-s4__content os-animate" data-delay="0">
      <span class="os-s4__eyebrow">FROM THE FOUNDERS</span>
      <h2 class="os-s4__title os-s4__title--big">BEHIND THE LEGEND</h2>
      <div class="os-s4__line"></div>
      <p class="os-s4__body">
        Across Madagascar, rum has always been part of every tradition. It's called toaka gasy, often made in far places where wild nature gives it its finest taste. The one that inspired us most comes from the south, in the hidden valleys of Betsileo's ethnie, a special rum that has carried Betsileo celebration for generations. A symbol of unity and hospitality, it's poured to welcome a guest, to bless a marriage, to bring people together at the moments that matter most.
      </p>
      <p class="os-s4__body">
        So we crafted a bottle to honor it, to show the world how rum can be enjoyed: as a spirit of togetherness and a drink of celebration. Because for us, the best moments in life are the ones we celebrate together.
      </p>
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

    <!-- ── Narindra : photo gauche / bio droite, signature seule (pas de nom) ── -->
    <div class="os-s6__person">
      <div class="row align-items-start gx-3 gy-3 gy-md-0">
        <div class="col-12 col-md-4 offset-md-1 os-animate" data-delay="0">
          <img src="/img/narindra.webp" class="os-s6__photo" alt="Narindra Rajosvah" />
        </div>
        <div class="col-12 col-md-7 os-animate" data-delay="200">
          <p class="os-s6__bio">
            It all started in 1980, when my mother began working at a Sino-Malagasy winery in Ambalavao Tsienimparihy, Madagascar. That's where she discovered the world of wine and spirits and learned the business from the ground up.
            In 1989, she started her own wholesale business, supplying wine to bars across Antananarivo.
            A few years later, in 1992, she expanded into rum. More than 30 years later, she is still doing what she loves.
            I grew up surrounded by bottles, customers, and stories. Spirits weren't just something we sold, they were part of our family's everyday life. Watching my mother work hard and build her business showed me what dedication and perseverance look like.
            Today, I'm proud to continue what she started.
            With Toaka Gasy, my goal is to bring a piece of Madagascar to North America. Every bottle reflects where I come from, the values I grew up with, and the passion that has been passed down through my family.
            This isn't just about making rum. It's about sharing our story, our culture, and the spirit of Madagascar with the world.
          </p>
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
          <p class="os-s6__bio os-s6__bio--gerben ms-md-auto">
            Dutch by birth, I come from Loosdrecht, in the Netherlands, where festivals, music, movement, and people from all over the world shaped my early world. That energy stayed with me. It taught me that the best moments in life aren't planned—they're lived.
            For over 15 years, I travelled the world working in festivals. Not on stage, but behind the scenes—on the technical side of beverages, setups, and the systems that make large celebrations run smoothly. I learned what people reach for in those moments: what they drink when they're happy, free, and fully present.
            Over time, I realized it was never just about drinks. It was about connection.
            That's where Toaka Gasy found me.
            Not as a project, but as a purpose. A bridge between global festivals and movement, and Malagasy culture, heritage, and identity.
            Toaka Gasy lives in that space between those worlds.
            At its core, it carries one simple truth: the best moments in life are the ones we share.
          </p>
          <p class="os-s6__signature os-animate" data-delay="120">Gerben Krijnen</p>
        </div>
        <div class="col-12 col-md-4 order-1 order-md-2 os-animate" data-delay="200">
          <img src="/img/gerben.webp" class="os-s6__photo os-s6__photo--gerben" alt="Gerben Krijnen" />
        </div>
      </div>
    </div>

    <!-- ── Nathalie : photo gauche / bio droite, signature seule (pas de nom) ── -->
    <div class="os-s6__person">
      <div class="row align-items-start gx-3 gy-3 gy-md-0">
        <div class="col-12 col-md-4 offset-md-1 os-animate" data-delay="0">
          <img src="/img/nathalie.webp" class="os-s6__photo" alt="Nathalie Manantsara" />
        </div>
        <div class="col-12 col-md-7 os-animate" data-delay="200">
          <p class="os-s6__bio">
            Born and raised in Madagascar, I've been surrounded by this world from a very young age. Coming from a family involved in alcohol distribution in Madagascar, that environment naturally became part of my story and my inspiration.
            In my 20s, I moved to Canada to study. Like many people starting over somewhere new, there was a moment where I felt completely lost and questioned what I truly wanted to build. I remember during a trip to Calgary being on a call with my best friend, who later became my co-founder. That's when I realized I wanted to create something meaningful, something connected to who I am and what I'm passionate about.
            I wanted to bring a part of my roots to North America and share a piece of Madagascar through something authentic. That idea became Toaka Gasy, inspired by traditional Betsileo rum and my heritage as part of the Betsileo ethnic group.
            For me, this is more than a product idea. It's a way to connect tradition with modernity, celebrate where I come from, and create something that tells a story across cultures.
          </p>
          <p class="os-s6__signature os-animate" data-delay="120">Nathalie Manantsara</p>
        </div>
      </div>
    </div>

  </section>

  <!-- ══════════════════════════════════════
       Section 7 – Events
       ══════════════════════════════════════ -->
  <EventsSection />

</template>
