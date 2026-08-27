<template>
  <AgeGate />
  <RouterView />
  <Footer />
  <LanguageSwitcher />
  <AdminRoot />
</template>

<script setup>
import Footer from '@/layout/Footer.vue'
import AgeGate from '@/layout/AgeGate.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import AdminRoot from '@/admin/AdminRoot.vue'
</script>
