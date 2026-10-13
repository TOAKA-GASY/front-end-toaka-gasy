<script setup>
import '@/styles/loading-screen.css'

defineProps({
  visible: { type: Boolean, default: true },
})
</script>

<template>
  <Transition name="loading-screen-fade">
    <div v-if="visible" class="loading-screen" role="status" aria-live="polite" aria-label="Loading">
      <img src="/logo/logo-marron.webp" class="loading-screen__logo" alt="" aria-hidden="true" />
      <div class="loading-screen__dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>
  </Transition>
</template>
