<template>
  <AgeGate />
  <RouterView />
  <Footer />
  <LanguageSwitcher />
</template>

<script setup>
import Footer from '@/layout/Footer.vue'
import AgeGate from '@/layout/AgeGate.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>
