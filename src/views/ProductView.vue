<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Header from '@/layout/Header.vue'
import { products } from '@/data/products'
import '@/styles/product.css'

const route = useRoute()
const productIndex = computed(() => products.findIndex(p => p.slug === route.params.slug))
const product = computed(() => products[productIndex.value])

watchEffect(() => {
  if (product.value) {
    document.title = `${product.value.shortName} | Toaka Gasy Rum`
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', product.value.pageDesc)
  }
})
</script>

<template>

  <Header />

  <section v-if="product" class="pp">

    <!-- ── Hero : fond bleu/beige + image de fond + bouteille + texte ── -->
    <div class="pp-hero">
      <img
        :src="product.bgImage"
        class="pp-hero__bgimg"
        :class="{ 'pp-hero__bgimg--full': productIndex > 0 }"
        alt=""
        aria-hidden="true"
      />

      <div class="pp-hero__inner">
        <div class="pp-hero__bottle">
          <img :src="product.bottle" :alt="product.shortName" />
          <div class="pp-hero__shadow" aria-hidden="true"></div>
        </div>

        <div class="pp-hero__content">
          <span class="pp-hero__kicker">{{ product.kicker }}</span>
          <h1 class="pp-hero__name">{{ product.shortName }}</h1>
          <p class="pp-hero__spec">{{ product.spec }}</p>
          <p class="pp-hero__tags">{{ product.tags }}</p>
          <p class="pp-hero__desc">{{ product.pageDesc }}</p>
          <p v-if="product.closing" class="pp-hero__closing">{{ product.closing }}</p>
        </div>
      </div>
    </div>

    <!-- ── Tagline collection ── -->
    <div class="pp-tagline">
      <h2 class="pp-tagline__title">One spirit,<br>many ways to celebrate.</h2>
      <p class="pp-tagline__text">
        One rum to start the night. Two aged expressions to savour.
        All amber, all made to be shared.
      </p>
    </div>

    <!-- ── Détails : the moment / how to enjoy / notes ── -->
    <div class="pp-details">
      <div class="pp-details__inner">
        <div v-if="product.moment" class="pp-detail">
          <h3 class="pp-detail__title">{{ product.moment.title }}</h3>
          <p class="pp-detail__text">{{ product.moment.text }}</p>
        </div>
        <div class="pp-detail">
          <h3 class="pp-detail__title">{{ product.enjoy.title }}</h3>
          <p class="pp-detail__text">{{ product.enjoy.text }}</p>
        </div>
        <div class="pp-detail">
          <h3 class="pp-detail__title">{{ product.notes.title }}</h3>
          <p class="pp-detail__text">{{ product.notes.text }}</p>
        </div>
      </div>
    </div>

  </section>

  <section v-else class="pp pp--empty">
    <p>Product not found.</p>
    <RouterLink to="/" class="pp-cta__link">back to home</RouterLink>
  </section>

</template>
