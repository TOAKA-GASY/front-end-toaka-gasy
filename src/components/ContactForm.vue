<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import emailjs from '@emailjs/browser'

const { t } = useI18n()
const form = reactive({ name: '', firstName: '', email: '', message: '' })
const errors = reactive({ name: '', firstName: '', email: '', message: '' })
const isSending = ref(false)
const showSuccess = ref(false)
const sendError = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  errors.name = form.name.trim() ? '' : t('contactForm.errorName')
  errors.firstName = form.firstName.trim() ? '' : t('contactForm.errorFirstName')
  errors.message = form.message.trim() ? '' : t('contactForm.errorMessage')

  if (!form.email.trim()) {
    errors.email = t('contactForm.errorEmailRequired')
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = t('contactForm.errorEmailInvalid')
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
    sendError.value = t('contactForm.errorGeneric')
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
          :placeholder="t('contactForm.namePlaceholder')"
          @input="clearError('name')"
        />
        <span v-if="errors.name" class="contact-form__field-error">{{ errors.name }}</span>
      </div>
      <div class="col-12 col-md-6 contact-form__group">
        <input
          v-model="form.firstName"
          type="text"
          :class="['contact-form__input', { 'contact-form__input--error': errors.firstName }]"
          :placeholder="t('contactForm.firstNamePlaceholder')"
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
        :placeholder="t('contactForm.emailPlaceholder')"
        @input="clearError('email')"
      />
      <span v-if="errors.email" class="contact-form__field-error">{{ errors.email }}</span>
    </div>

    <!-- Message -->
    <div class="contact-form__group">
      <textarea
        v-model="form.message"
        :class="['contact-form__textarea', { 'contact-form__input--error': errors.message }]"
        :placeholder="t('contactForm.messagePlaceholder')"
        rows="3"
        @input="clearError('message')"
      ></textarea>
      <span v-if="errors.message" class="contact-form__field-error">{{ errors.message }}</span>
    </div>

    <!-- Submit -->
    <div class="text-center mt-2">
      <button type="submit" class="contact-form__submit" :disabled="isSending">
        {{ isSending ? t('contactForm.sending') : t('contactForm.submit') }}
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
        <img src="/logo/logo-beige.webp" class="popup-card__logo" alt="Toaka Gasy" />
        <span class="popup-card__ornament"></span>
        <p class="popup-card__title">{{ t('contactForm.popupTitle') }}</p>
        <p class="popup-card__message">
          {{ t('contactForm.popupLine1') }}<br />{{ t('contactForm.popupLine2') }}
        </p>
        <button class="popup-card__close" @click="showSuccess = false">{{ t('contactForm.close') }}</button>
      </div>
    </div>
  </Teleport>
</template>
