<template>
  <footer class="site-footer">
    <img src="/img/foil-dore2.png" class="footer-foil" alt="" aria-hidden="true" />
    <img src="/img/footer-pattern.png" class="footer-pattern" alt="" aria-hidden="true" />

    <div class="footer-inner">

      <!-- Logo -->
      <div class="footer-logo">
        <img src="/logo/logo-icon.png" alt="Toaka Gasy" />
      </div>

      <!-- Newsletter -->
      <div class="footer-newsletter">
        <p class="footer-newsletter__heading">join our community</p>
        <form class="footer-newsletter__form" @submit.prevent>
          <input
            class="footer-newsletter__input"
            type="email"
            placeholder="enter your email"
            aria-label="Votre adresse email"
          />
          <button class="footer-newsletter__btn" type="submit">continue</button>
        </form>
      </div>

      <!-- Social -->
      <div class="footer-social">
        <a href="https://instagram.com/tokagasy" class="footer-social__link" target="_blank" rel="noopener" aria-label="Instagram">
          <svg class="footer-social__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4.5"/>
            <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none"/>
          </svg>
          <span>@tokagasy</span>
        </a>
        <a href="https://tokagasy.com" class="footer-social__link" target="_blank" rel="noopener" aria-label="Site web">
          <svg class="footer-social__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12a15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span>tokagasy.com</span>
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
