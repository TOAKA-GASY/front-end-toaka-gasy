<template>
  <Transition name="age-gate">
    <div v-if="visible" class="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div class="age-gate__card">
        <img src="/img/footer-pattern.webp" class="age-gate__pattern" alt="" aria-hidden="true" />

        <img src="/logo/logo-marron.png" class="age-gate__logo" alt="Toaka Gasy" />

        <h2 id="age-gate-title" class="age-gate__title">ARE YOU OF LEGAL DRINKING AGE&nbsp;?</h2>
        <p class="age-gate__text">
          You must be of legal drinking age in your respective country to enter. By entering, you
          accept our terms of use in addition to our privacy and cookie policies. We're committed
          to stop underage drinking and encourage responsible enjoyment of our products.
        </p>

        <div class="age-gate__actions">
          <button class="age-gate__btn age-gate__btn--no" @click="onNo">NO</button>
          <button class="age-gate__btn age-gate__btn--yes" @click="onYes">YES</button>
        </div>

        <img src="/img/line-mdg2.webp" class="age-gate__line" alt="" aria-hidden="true" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)
let timer = null

onMounted(() => {
  if (sessionStorage.getItem('age-verified') === 'true') return
  timer = setTimeout(() => { visible.value = true }, 3000)
})

const onYes = () => {
  sessionStorage.setItem('age-verified', 'true')
  visible.value = false
}

const onNo = () => {
  window.location.href = 'https://www.who.int/'
}
</script>

<style scoped>
.age-gate {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: rgba(17, 12, 7, 0.55);
}

.age-gate__card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  padding: 1.5rem 2.5rem;
  text-align: center;
  color: #31271d;
  background: #F5E9DB;
  overflow: hidden;
}

.age-gate__pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.12;
  pointer-events: none;
}

.age-gate__logo {
  position: relative;
  z-index: 1;
  width: 110px;
  height: auto;
  margin-bottom: 1.75rem;
}

.age-gate__line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 48px;
  object-fit: cover;
  z-index: 1;
  opacity: 0.85;
  pointer-events: none;
}

.age-gate__title {
  position: relative;
  z-index: 1;
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-weight: 700;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.03em;
  margin-bottom: 1.5rem;
}

.age-gate__text {
  position: relative;
  z-index: 1;
  font-family: 'Simonetta', Georgia, serif;
  font-size: clamp(15px, 1.6vw, 20px);
  line-height: 1.6;
  color: #31271d;
  max-width: 540px;
  margin-bottom: 2.5rem;
}

.age-gate__actions {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.age-gate__btn {
  background: transparent;
  border: 1px solid #31271d;
  color: #31271d;
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-weight: 700;
  letter-spacing: 0.08em;
  font-size: 15px;
  padding: 0.7rem 2.4rem;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
}

.age-gate__btn:hover {
  background: #8E602B;
  color: #cfb68e;
  transform: translateY(-2px);
  border-color: transparent;
}

/* ─── Transition fluide : slide depuis la gauche ─── */
.age-gate-enter-active { transition: background 0.6s ease; }
.age-gate-leave-active { transition: background 0.5s ease; }
.age-gate-enter-from,
.age-gate-leave-to { background: rgba(17, 12, 7, 0); }

.age-gate-enter-active .age-gate__card { transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.age-gate-leave-active .age-gate__card { transition: opacity 0.5s ease, transform 0.5s ease; }
.age-gate-enter-from .age-gate__card,
.age-gate-leave-to .age-gate__card { opacity: 0; transform: translateX(-100%); }

/* ─── Responsive ─── */
@media (max-width: 767.98px) {
  .age-gate__card { width: 100%; }
}

@media (max-width: 575.98px) {
  .age-gate__logo { width: 84px; }
  .age-gate__actions { gap: 1.5rem; }
  .age-gate__btn { padding: 0.6rem 1.8rem; font-size: 14px; }
}
</style>
