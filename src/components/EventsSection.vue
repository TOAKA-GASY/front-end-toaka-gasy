<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const events = [
  {
    title: 'SAIL GP',
    location: 'Halifax — Nova Scotia',
    desc: "First stop, first connections. In Halifax, Nova Scotia, Toaka Gasy Company team made meaningful connections and join the active community during SailGP, one of the city's most iconic and anticipated sailing events.\n\nA first step in the city where it all began!",
    date: '20 June 2026',
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
    desc: "Very honored to be part of the Sookany Trophy!\n\nWe're excited to support an event that celebrates sailing, the spirit of Diego Suarez, and Madagascar's rich maritime heritage.\nThe culture of sailing has also been one of the inspirations behind our rum. This time, we'll meet on the water for the race... and hopefully next time, we'll meet again to share a glass of our Toaka Gasy Rum \nSee you on the water!",
    date: '17 July 2026',
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
let eventAutoplay = null
const AUTOPLAY_DELAY = 6000

const restartAutoplay = () => {
  if (eventAutoplay) clearInterval(eventAutoplay)
  eventAutoplay = setInterval(() => {
    eventIndex.value = (eventIndex.value + 1) % events.length
  }, AUTOPLAY_DELAY)
}

const nextEvent = () => { eventIndex.value = (eventIndex.value + 1) % events.length; restartAutoplay() }
const prevEvent = () => { eventIndex.value = (eventIndex.value - 1 + events.length) % events.length; restartAutoplay() }
const goToEvent = (i) => { eventIndex.value = i; restartAutoplay() }

let observer = null

onMounted(() => {
  restartAutoplay()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0
          entry.target.style.transitionDelay = `${delay}ms`
          entry.target.classList.add('ev-animate--in')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  document.querySelectorAll('.ev-animate').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  if (eventAutoplay) clearInterval(eventAutoplay)
  observer?.disconnect()
})
</script>

<template>
  <section class="os-events">

    <div class="os-events__header ev-animate" data-delay="0">
      <h2 class="os-events__title">EVENTS</h2>
    </div>

    <div class="os-events__slider ev-animate" data-delay="120">
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
        <p class="os-events__date">{{ events[eventIndex].date }}</p>
      </div>
    </div>

    <div class="os-events__dots">
      <button
        v-for="(e, i) in events" :key="i"
        class="os-events__dot"
        :class="{ 'os-events__dot--active': eventIndex === i }"
        @click="goToEvent(i)"
        :aria-label="`Go to ${e.title}`"
      />
    </div>

    <!-- Galerie photo de l'événement actif : 1 grande au centre, 2 de chaque côté, zoom auto (Ken Burns) sur chaque image -->
    <div class="os-events__gallery ev-animate" data-delay="0">
      <div class="os-events__frame os-events__frame--l1">
        <img :src="events[eventIndex].images[0]" class="os-events__img" :alt="events[eventIndex].title" />
      </div>
      <div class="os-events__frame os-events__frame--l2">
        <img :src="events[eventIndex].images[1]" class="os-events__img" :alt="events[eventIndex].title" />
      </div>
      <div class="os-events__frame os-events__frame--center">
        <img :src="events[eventIndex].images[2]" class="os-events__img" :alt="events[eventIndex].title" />
      </div>
      <div class="os-events__frame os-events__frame--r1">
        <img :src="events[eventIndex].images[3]" class="os-events__img" :alt="events[eventIndex].title" />
      </div>
      <div class="os-events__frame os-events__frame--r2">
        <img :src="events[eventIndex].images[4]" class="os-events__img" :alt="events[eventIndex].title" />
      </div>
    </div>

  </section>
</template>

<style scoped>
.ev-animate {
  opacity: 0;
  transform: translateY(42px);
  transition:
    opacity  0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.ev-animate--in {
  opacity: 1;
  transform: translateY(0);
}

.os-events {
  background: #F5E9DB;
  padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem) clamp(4rem, 7vw, 6rem);
}

.os-events__header { text-align: center; margin-bottom: clamp(2rem, 4vw, 3rem); }

.os-events__title {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: clamp(36px, 4.6vw, 60px);
  letter-spacing: 0.08em;
  color: #3a2e22;
  margin: 0;
}

.os-events__slider {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 760px;
  margin: 0 auto;
}

.os-events__slide {
  text-align: center;
  flex: 1 1 auto;
  min-width: 0;
}

.os-events__index {
  display: block;
  font-family: var(--font-cinzel);
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: #3a2e22;
  opacity: 0.6;
  margin-bottom: 0.75rem;
}

.os-events__title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.85rem, 2vw, 1.5rem);
  margin: 0 0 0.4rem;
}

.os-events__name {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: clamp(24px, 3vw, 38px);
  color: #3a2e22;
  letter-spacing: 0.06em;
  margin: 0;
}

.os-events__location {
  font-family: var(--font-cinzel);
  font-weight: 400;
  font-size: clamp(13px, 1.1vw, 16px);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #3a2e22;
  opacity: 0.7;
  margin: 0 0 1.1rem;
}

.os-events__desc {
  font-family: var(--font-simonetta);
  font-size: clamp(14px, 1.1vw, 17px);
  color: #3a2e22;
  line-height: 1.75;
  max-width: 520px;
  margin: 0 auto;
  white-space: pre-line;
}

.os-events__date {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: clamp(11px, 0.95vw, 13px);
  color: #C9A050;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 1rem 0 0;
}

.os-events__nav {
  flex: 0 0 auto;
  background: transparent;
  border: 1px solid rgba(105, 67, 29, 0.35);
  border-radius: 50%;
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  color: #69431D;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;
}
.os-events__nav:hover { background: rgba(105, 67, 29, 0.1); transform: scale(1.06); }

.os-events__dots {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin: 2rem 0 clamp(4.5rem, 9vw, 7rem);
}

.os-events__dot {
  width: 8px; height: 8px; border-radius: 50%;
  border: none;
  background: rgba(105, 67, 29, 0.3);
  cursor: pointer;
  padding: 0;
  transition: background 0.3s ease, transform 0.3s ease;
}
.os-events__dot--active { background: #69431D; transform: scale(1.3); }

/* ─── Galerie photo : colonne gauche (cadre en haut / cadre en bas),
   grand cadre au centre, colonne droite (cadre en haut / cadre en bas).
   Les cadres latéraux débordent volontairement au-dessus et en dessous du
   cadre central (plus grands que sa hauteur), pour un effet collage.
   Au survol, le cadre s'agrandit légèrement en overlay au-dessus de ses voisins. ─── */
.os-events__gallery {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  height: clamp(360px, 48vh, 540px);
  max-width: 1400px;
  margin: 0 auto;
}

/* ─── Cadre : porte la taille et masque le débordement du zoom ─── */
.os-events__frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.os-events__frame:hover {
  transform: scale(1.1);
  z-index: 5;
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.38);
}

.os-events__frame--l1     { grid-column: 1; grid-row: 1; align-self: end;   height: 132%; }
.os-events__frame--l2     { grid-column: 1; grid-row: 2; align-self: start; height: 132%; }
.os-events__frame--center { grid-column: 2; grid-row: 1 / span 2; }
.os-events__frame--r1     { grid-column: 3; grid-row: 1; align-self: end;   height: 132%; }
.os-events__frame--r2     { grid-column: 3; grid-row: 2; align-self: start; height: 132%; }

/* ─── Image : recouvre le cadre ─── */
.os-events__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ─── Responsive ─── */
@media (max-width: 767.98px) {
  .os-events__title-row { gap: 0.75rem; }
  .os-events__nav { width: 32px; height: 32px; }

  .os-events__gallery {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* Rangée 2 (cadre central) sizée pile à sa propre hauteur (170px) plutôt
       qu'un grid-auto-rows uniforme : sinon le cadre central déborde de sa
       rangée (130px) et chevauche les cadres du dessous. */
    grid-template-rows: 130px 170px 130px;
    height: auto;
    gap: 0.5rem;
  }
  .os-events__frame        { width: 100%; height: 100%; align-self: stretch; }
  .os-events__frame--l1     { grid-column: 1; grid-row: 1; }
  .os-events__frame--l2     { grid-column: 2; grid-row: 1; }
  .os-events__frame--center { grid-column: 1 / 3; grid-row: 2; }
  .os-events__frame--r1     { grid-column: 1; grid-row: 3; }
  .os-events__frame--r2     { grid-column: 2; grid-row: 3; }
}

/* ─── Mobile / tablette en paysage : la grille empilée est trop petite et rogne les photos.
   On repasse en rangée unique (comme le desktop), avec une hauteur basée sur le vh disponible. ─── */
@media (max-width: 1300px) and (orientation: landscape) {
  .os-events__gallery {
    display: flex;
    align-items: stretch;
    height: clamp(150px, 34vh, 240px);
    gap: 0.6rem;
  }
  .os-events__frame        { flex: 1 1 0; width: 100%; height: 100%; align-self: auto; }
  .os-events__frame--center { flex: 1.6 1 0; }
}
</style>
