<script setup>
import ContactForm from '@/components/ContactForm.vue'
</script>

<template>
  <main class="contact-page">
    <!-- Background image — place your image at public/img/bg-contact.png -->
    <img
      src="/img/montagne.png"
      class="contact-page__bg"
      alt=""
      aria-hidden="true"
    />

    <div class="contact-page__overlay">
      <img src="/logo/logo-beige.png" class="contact-page__logo" alt="Toaka Gasy" />

      <!-- Under construction text -->
      <p class="contact-page__banner">UNDER CONSTRUCTION SEE YOU ON JULY 19</p>
      <p class="contact-page__subtitle">Products available sooner let's connect first</p>

      <!-- Contact form component -->
      <ContactForm />
    </div>
  </main>
</template>
