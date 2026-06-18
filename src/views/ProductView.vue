<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Header from '@/layout/Header.vue'
import { products } from '@/data/products'
import '@/styles/product.css'

const route = useRoute()
const product = computed(() => products.find(p => p.slug === route.params.slug))
</script>

<template>
  
  <section v-if="product" class="product-page">
    <img :src="product.image" class="product-page__bg" :alt="product.name" />
    <div class="product-page__overlay" aria-hidden="true"></div>

    <RouterLink to="/" class="product-back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      <span>back</span>
    </RouterLink>

    <div class="product-hero">
      <h1 class="product-name">{{ product.name }}</h1>
      <p class="product-tagline">{{ product.tagline }}</p>
      <p class="product-desc">{{ product.desc }}</p>
      <div class="product-badge">
        <div class="product-badge__frame">
          <span class="product-badge__text">{{ product.badge }}</span>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="product-page product-page--empty">
    <p>Product not found.</p>
    <RouterLink to="/" class="product-back">back to home</RouterLink>
  </section>
</template>
