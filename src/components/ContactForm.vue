<script setup>
import { reactive, ref } from 'vue'
import emailjs from '@emailjs/browser'

const form = reactive({ name: '', firstName: '', email: '', message: '' })
const errors = reactive({ name: '', firstName: '', email: '', message: '' })
const isSending = ref(false)
const showSuccess = ref(false)
const sendError = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  errors.name = form.name.trim() ? '' : 'Please enter your name.'
  errors.firstName = form.firstName.trim() ? '' : 'Please enter your first name.'
  errors.message = form.message.trim() ? '' : 'Please write a message.'

  if (!form.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  } else {
    errors.email = ''
  }

  return !errors.name && !errors.firstName && !errors.email && !errors.message
}

function clearError(field) {
  errors[field] = ''
}

async function saveToSheets(payload) {
  const url = import.meta.env.VITE_GOOGLE_SHEET_URL
  if (!url) return
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload),
  })
}

async function sendEmail() {
  sendError.value = ''
  if (!validate()) return

  isSending.value = true
  try {
    await Promise.all([
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: `${form.name} ${form.firstName}`, reply_to: form.email, message: form.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      ),
      saveToSheets({
        name: form.name,
        firstName: form.firstName,
        email: form.email,
        message: form.message,
        date: new Date().toISOString(),
      }),
    ])
    showSuccess.value = true
    Object.assign(form, { name: '', firstName: '', email: '', message: '' })
  } catch {
    sendError.value = 'Failed to send message. Please try again later.'
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <form class="contact-form" novalidate @submit.prevent="sendEmail">
    <!-- Name + First name -->
    <div class="row g-4">
      <div class="col-12 col-md-6 contact-form__group">
        <input
          v-model="form.name"
          type="text"
          :class="['contact-form__input', { 'contact-form__input--error': errors.name }]"
          placeholder="Your name"
          @input="clearError('name')"
        />
        <span v-if="errors.name" class="contact-form__field-error">{{ errors.name }}</span>
      </div>
      <div class="col-12 col-md-6 contact-form__group">
        <input
          v-model="form.firstName"
          type="text"
          :class="['contact-form__input', { 'contact-form__input--error': errors.firstName }]"
          placeholder="Your first name"
          @input="clearError('firstName')"
        />
        <span v-if="errors.firstName" class="contact-form__field-error">{{ errors.firstName }}</span>
      </div>
    </div>

    <!-- Email -->
    <div class="contact-form__group">
      <input
        v-model="form.email"
        type="email"
        :class="['contact-form__input', { 'contact-form__input--error': errors.email }]"
        placeholder="Your email address"
        @input="clearError('email')"
      />
      <span v-if="errors.email" class="contact-form__field-error">{{ errors.email }}</span>
    </div>

    <!-- Message -->
    <div class="contact-form__group">
      <textarea
        v-model="form.message"
        :class="['contact-form__textarea', { 'contact-form__input--error': errors.message }]"
        placeholder="Your message"
        rows="3"
        @input="clearError('message')"
      ></textarea>
      <span v-if="errors.message" class="contact-form__field-error">{{ errors.message }}</span>
    </div>

    <!-- Submit -->
    <div class="text-center mt-2">
      <button type="submit" class="contact-form__submit" :disabled="isSending">
        {{ isSending ? 'SENDING...' : 'SUBMIT' }}
      </button>
    </div>

    <!-- Send error -->
    <div v-if="sendError" class="contact-form__alert contact-form__alert--error">
      {{ sendError }}
    </div>
  </form>

  <!-- Success popup -->
  <Teleport to="body">
    <div v-if="showSuccess" class="popup-overlay" @click.self="showSuccess = false">
      <div class="popup-card">
        <img src="/logo/logo-beige.png" class="popup-card__logo" alt="Toaka Gasy" />
        <span class="popup-card__ornament"></span>
        <p class="popup-card__title">Message Received</p>
        <p class="popup-card__message">
          Thank you for reaching out.<br />We will be in touch soon.
        </p>
        <button class="popup-card__close" @click="showSuccess = false">CLOSE</button>
      </div>
    </div>
  </Teleport>
</template>
