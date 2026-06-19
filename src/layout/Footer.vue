<template>
  <footer class="site-footer">
    <img src="/img/foil-dore2.webp" class="footer-foil" alt="" aria-hidden="true" />
    <img src="/img/footer-pattern.webp" class="footer-pattern" alt="" aria-hidden="true" />

    <div class="footer-inner">

      <!-- Logo -->
      <div class="footer-logo">
        <img src="/logo/logo-icon.png" alt="Toaka Gasy" />
      </div>

      <!-- Newsletter -->
      <div class="footer-newsletter">
        <p class="footer-newsletter__heading">join our community</p>
        <form class="footer-newsletter__form" @submit.prevent="sendWelcome">
          <input
            v-model="newsletterEmail"
            class="footer-newsletter__input"
            type="email"
            placeholder="enter your email"
            aria-label="Votre adresse email"
            :disabled="newsletterSending || newsletterDone"
          />
          <button class="footer-newsletter__btn" type="submit" :disabled="newsletterSending || newsletterDone">
            {{ newsletterSending ? '...' : newsletterDone ? '✓' : 'continue' }}
          </button>
        </form>
        <p v-if="newsletterError" class="footer-newsletter__msg footer-newsletter__msg--error">{{ newsletterError }}</p>
      </div>

      <!-- Popup de bienvenue -->
      <Teleport to="body">
        <Transition name="footer-popup">
          <div v-if="newsletterDone" class="fn-popup-overlay" @click.self="newsletterDone = false">
            <div class="fn-popup-card">
              <img src="/logo/logo-icon.png" class="fn-popup__logo" alt="Toaka Gasy" />
              <span class="fn-popup__ornament"></span>
              <p class="fn-popup__title">Welcome to the Community</p>
              <p class="fn-popup__message">
                You're in.<br />
                We have sent you a welcome email.<br />
                <em>Born in the Hidden Valleys of Madagascar.</em>
              </p>
              <button class="fn-popup__close" @click="newsletterDone = false">CLOSE</button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Social -->
      <div class="footer-social">
        <a href="https://www.instagram.com/toakagasy.company" class="footer-social__link" target="_blank" rel="noopener" aria-label="Instagram">
          <svg class="footer-social__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4.5"/>
            <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none"/>
          </svg>
          <span>@toakagasy.company</span>
        </a>
        <a href="https://www.linkedin.com/in/toaka-gasy-company-79298140b/" class="footer-social__link" target="_blank" rel="noopener" aria-label="LinkedIn">
          <svg class="footer-social__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>Toaka Gasy Company</span>
        </a>
        <a href="https://toakagasy.com" class="footer-social__link" target="_blank" rel="noopener" aria-label="Site web">
          <svg class="footer-social__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12a15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span>toakagasy.com</span>
        </a>
      </div>

      <!-- Divider -->
      <div class="footer-divider" aria-hidden="true"></div>

      <!-- Link columns -->
      <nav class="footer-links" aria-label="Liens footer">
        <div class="footer-col">
          <p class="footer-col__heading">Privacy &amp; Terms</p>
          <ul>
            <li><a href="#" class="footer-col__link">Returns &amp; Exchanges</a></li>
            <li><a href="#" class="footer-col__link">Customer Support</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col__heading">Read</p>
          <ul>
            <li><RouterLink to="/contact" class="footer-col__link">Contact Us</RouterLink></li>
            <li><a href="#" class="footer-col__link">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col__heading">Collaborate</p>
          <ul>
            <li><a href="#" class="footer-col__link">Become a Partner</a></li>
            <li><a href="#" class="footer-col__link">Influence With Us</a></li>
          </ul>
        </div>
      </nav>

    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

const newsletterEmail = ref('')
const newsletterSending = ref(false)
const newsletterDone = ref(false)
const newsletterError = ref('')

async function saveToSheetsCommunity(email) {
  const url = import.meta.env.VITE_GOOGLE_SHEET_URL_COMMUNITY
  if (!url) return
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ email, date: new Date().toISOString() }),
  })
}

async function sendWelcome() {
  newsletterError.value = ''
  const email = newsletterEmail.value.trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newsletterError.value = 'Please enter a valid email address.'
    return
  }

  newsletterSending.value = true
  try {
    await Promise.all([
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID_COMMUNITY,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_COMMUNITY,
        { to_email: email, to_name: email },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      ),
      saveToSheetsCommunity(email),
    ])
    newsletterDone.value = true
    newsletterEmail.value = ''
  } catch {
    newsletterError.value = 'Something went wrong. Please try again.'
  } finally {
    newsletterSending.value = false
  }
}
</script>

<style scoped>
.site-footer {
  position: relative;
  background: #5B3615;
  overflow: hidden;
  padding: 4rem 0 3rem;
}

/* ─── Foil doré : texture zoomée très basse opacité ─── */
.footer-foil {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.8);
  opacity: 0.07;
  pointer-events: none;
  z-index: 0;
}

/* ─── Background pattern ─── */
.footer-pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
}

/* ─── Inner wrapper ─── */
.footer-inner {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 6vw, 5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

/* ─── Logo ─── */
.footer-logo img {
  height: clamp(100px, 10vh, 150px);
  width: auto;
  object-fit: contain;
}

/* ─── Newsletter ─── */
.footer-newsletter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 560px;
}

.footer-newsletter__heading {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 28px);
  color: #ECD8C4;
  letter-spacing: 0.05em;
  text-align: center;
}

.footer-newsletter__form {
  display: flex;
  width: 100%;
  border: 1px solid rgba(236, 216, 196, 0.35);
}

.footer-newsletter__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.85rem 1.25rem;
  font-family: var(--font-simonetta);
  font-size: clamp(13px, 1.2vw, 16px);
  color: #ECD8C4;
  letter-spacing: 0.05em;
}

.footer-newsletter__input::placeholder {
  color: rgba(236, 216, 196, 0.45);
}

.footer-newsletter__btn {
  background: transparent;
  border: none;
  border-left: 1px solid rgba(236, 216, 196, 0.35);
  padding: 0.85rem 1.5rem;
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: clamp(11px, 1vw, 14px);
  color: #ECD8C4;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;
  white-space: nowrap;
}

.footer-newsletter__btn:hover {
  background: rgba(236, 216, 196, 0.1);
}

.footer-newsletter__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.footer-newsletter__msg {
  font-family: var(--font-simonetta);
  font-size: clamp(12px, 1.1vw, 14px);
  font-style: italic;
  text-align: center;
  margin-top: 0.5rem;
}

.footer-newsletter__msg--error { color: #ffb3ba; }

/* ─── Popup bienvenue ─── */
.fn-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 10, 2, 0.6);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.fn-popup-card {
  background: #f3e6d8;
  border: 1px solid #a86b33;
  outline: 3px solid #f3e6d8;
  outline-offset: -8px;
  border-radius: 4px;
  padding: 2.5rem 2rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 12px 48px rgba(30, 10, 2, 0.4);
}

.fn-popup__logo {
  width: 64px;
  height: auto;
  margin-bottom: 1.25rem;
}

.fn-popup__ornament {
  display: block;
  width: 50px;
  height: 1px;
  background: #a86b33;
  margin: 0 auto 1.25rem;
}

.fn-popup__title {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: 1rem;
  color: #3a2e22;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.fn-popup__message {
  font-family: var(--font-simonetta);
  font-size: 1rem;
  color: #69431D;
  line-height: 1.75;
  margin-bottom: 1.75rem;
}

.fn-popup__close {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: #f3e6d8;
  background: #3a2e22;
  border: none;
  border-radius: 50px;
  padding: 0.55rem 2.25rem;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;
}

.fn-popup__close:hover {
  background: #574232;
  transform: translateY(-1px);
}

/* ─── Transition popup ─── */
.footer-popup-enter-active,
.footer-popup-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.footer-popup-enter-from,
.footer-popup-leave-to     { opacity: 0; transform: scale(0.92) translateY(10px); }

/* ─── Social ─── */
.footer-social {
  display: flex;
  gap: 2.5rem;
}

.footer-social__link {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: rgba(236, 216, 196, 0.65);
  text-decoration: none;
  font-family: var(--font-simonetta);
  font-size: clamp(13px, 1.1vw, 15px);
  letter-spacing: 0.06em;
  transition: color 0.25s ease;
}

.footer-social__link:hover {
  color: #ECD8C4;
}

.footer-social__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ─── Divider ─── */
.footer-divider {
  width: 100%;
  height: 1px;
  background: rgba(236, 216, 196, 0.15);
}

/* ─── Link columns ─── */
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 4rem;
  width: 100%;
  max-width: 700px;
  text-align: center;
}

.footer-col__heading {
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: clamp(10px, 0.9vw, 13px);
  color: #ECD8C4;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 0.9rem;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.footer-col__link {
  font-family: var(--font-simonetta);
  font-size: clamp(12px, 1vw, 14px);
  color: rgba(236, 216, 196, 0.55);
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: color 0.25s ease;
  white-space: nowrap;
}

.footer-col__link:hover {
  color: #ECD8C4;
}

/* ─── Responsive ─── */
@media (max-width: 767.98px) {
  .footer-links {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem 1.5rem;
    text-align: center;
  }
}

@media (max-width: 575.98px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-social {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
}
</style>
