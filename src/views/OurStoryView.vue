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

// Parallax scroll sur la bouteille : descend légèrement vers le masque au scroll
const p = computed(() => Math.min(1, scrollY.value / (window.innerHeight || 1)))
const parallaxRed = computed(() => ({ transform: `translateY(${p.value * 70}px)` }))

/* ─── Events ─── */
const events = [
  {
    title: 'SAIL GP',
    location: 'Halifax — Nova Scotia',
    desc: "Toaka Gasy joined the world's fastest sailing circuit for a weekend of speed, spray and celebration on the Halifax waterfront, sharing Malagasy rum with sailing fans from around the globe.",
    images: [
      '/img/gp1.webp',
      '/img/gp2.webp',
      '/img/gp3.webp',
      '/img/gp4.webp',
      '/img/gp5.webp',
    ],
  },
  {
    title: 'SOOKANY TROPHY',
    location: 'Diego Suarez — Madagascar',
    desc: 'Back home in the north of Madagascar, we poured Toaka Gasy at the Sookany Trophy, honouring local sailors and the coastal traditions that first inspired our rum.',
    images: [
      '/img/s1.webp',
      '/img/s2.webp',
      '/img/s3.webp',
      '/img/s4.webp',
      '/img/s5.webp',
    ],
  },
]
const eventIndex = ref(0)
const nextEvent = () => { eventIndex.value = (eventIndex.value + 1) % events.length }
const prevEvent = () => { eventIndex.value = (eventIndex.value - 1 + events.length) % events.length }
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
       Section 1 – Fond + bouteille Toaka Mena
       ══════════════════════════════════════ -->
  <section class="os-hero">
    <h1 class="visually-hidden">Our Story — The Heritage Behind Toaka Gasy Rum</h1>
    <img src="/img/fond-sec2-3.webp" class="os-hero__bg" alt="" />

    <div class="os-hero__title" aria-hidden="true">
      <span class="os-hero__title-word os-hero__title-word--left">Our</span>
      <span class="os-hero__title-word os-hero__title-word--right">Story</span>
    </div>

    <div class="os-hero__bottles">
      <!-- Mena (rouge) – centre, descend légèrement sur le début du masque -->
      <div class="os-hero__pos os-hero__pos--center">
        <div :style="parallaxRed">
          <img
            src="/img/toaka-gasy-red.webp"
            class="os-hero__bottle os-hero__bottle--mena"
            :class="{ 'os-hero__bottle--in': animated }"
            alt="Toaka Gasy Mena"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       Section 2 – Masque paper-mask.svg + texte + récit familial
       ══════════════════════════════════════ -->
  <section class="os-s2">

    <div class="os-s2__mask-wrap os-animate" data-delay="0">
      <video class="os-s2__video" autoplay muted loop playsinline preload="none">
        <source src="/vd/mdg-video.mp4" type="video/mp4" />
      </video>
    </div>

    <h2 class="os-s2__title os-animate" data-delay="100">A tradition, honoured.</h2>

    <div class="os-s2__story os-animate" data-delay="150">
      <p>It all started in 1980, when my mother began working at a Sino-Malagasy winery in Ambalavao Tsienimparihy, Madagascar. That's where she discovered the world of wine and spirits and learned the business from the ground up.</p>
      <p>In 1989, she started her own wholesale business, supplying wine to bars across Antananarivo.</p>
      <p>A few years later, in 1992, she expanded into rum. More than 30 years later, she is still doing what she loves.</p>
      <p>I grew up surrounded by bottles, customers, and stories. Spirits weren't just something we sold, they were part of our family's everyday life. Watching my mother work hard and build her business showed me what dedication and perseverance look like.</p>
      <p>Today, I'm proud to continue what she started.</p>
      <p>With Toaka Gasy, my goal is to bring a piece of Madagascar to North America. Every bottle reflects where I come from, the values I grew up with, and the passion that has been passed down through my family.</p>
      <p>This isn't just about making rum. It's about sharing our story, our culture, and the spirit of Madagascar with the world.</p>
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
          <img src="/img/narindra.webp" class="os-s6__photo" alt="Narindra Rajosvah" />
        </div>
        <div class="col-12 col-md-7 os-animate" data-delay="200">
          <p class="os-s6__bio">
            Born and raised in Madagascar, I've been surrounded by this world from a very young age.
            Coming from a family involved in alcohol distribution in Madagascar, that environment naturally became part of my story and my inspiration.
            In my 20s, I moved to Canada to study. Like many people starting over somewhere new, there was a moment where I felt completely lost and questioned what I truly wanted to build. I remember during a trip to Calgary being on a call with my best friend, who later became my co-founder. That's when I realized I wanted to create something meaningful, something connected to who I am and what I'm passionate about.
            I wanted to bring a part of my roots to North America and share a piece of Madagascar through something authentic. That idea became Toaka Gasy, inspired by traditional Betsileo rum and my heritage as part of the Betsileo ethnic group.
            For me, this is more than a product idea. It's a way to connect tradition with modernity, celebrate where I come from, and create something that tells a story across cultures.
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
          <p class="os-s6__signature os-animate" data-delay="120">Gerben Krijnen</p>
        </div>
        <div class="col-12 col-md-4 order-1 order-md-2 os-animate" data-delay="200">
          <img src="/img/gerben.webp" class="os-s6__photo os-s6__photo--gerben" alt="Gerben Krijnen" />
        </div>
      </div>
    </div>

  </section>

  <!-- ══════════════════════════════════════
       Section 7 – Events
       ══════════════════════════════════════ -->
  <section class="os-events">

    <div class="os-events__header os-animate" data-delay="0">
      <h2 class="os-events__title">EVENTS</h2>
    </div>

    <div class="os-events__slider os-animate" data-delay="120">
      <div class="os-events__slide">
        <span class="os-events__index">0{{ eventIndex + 1 }} / 0{{ events.length }}</span>
        <div class="os-events__title-row">
          <button class="os-events__nav os-events__nav--prev" @click="prevEvent" aria-label="Previous event">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h3 class="os-events__name">{{ events[eventIndex].title }}</h3>
          <button class="os-events__nav os-events__nav--next" @click="nextEvent" aria-label="Next event">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        <p class="os-events__location">{{ events[eventIndex].location }}</p>
        <p class="os-events__desc">{{ events[eventIndex].desc }}</p>
      </div>
    </div>

    <div class="os-events__dots">
      <button
        v-for="(e, i) in events" :key="i"
        class="os-events__dot"
        :class="{ 'os-events__dot--active': eventIndex === i }"
        @click="eventIndex = i"
        :aria-label="`Go to ${e.title}`"
      />
    </div>

    <!-- Galerie photo de l'événement actif : 1 grande au centre, 2 de chaque côté -->
    <div class="os-events__gallery os-animate" data-delay="0">
      <img :src="events[eventIndex].images[0]" class="os-events__img os-events__img--l1" :alt="events[eventIndex].title" />
      <img :src="events[eventIndex].images[1]" class="os-events__img os-events__img--l2" :alt="events[eventIndex].title" />
      <img :src="events[eventIndex].images[2]" class="os-events__img os-events__img--center" :alt="events[eventIndex].title" />
      <img :src="events[eventIndex].images[3]" class="os-events__img os-events__img--r1" :alt="events[eventIndex].title" />
      <img :src="events[eventIndex].images[4]" class="os-events__img os-events__img--r2" :alt="events[eventIndex].title" />
    </div>

  </section>

</template>
