<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Header from '@/layout/Header.vue'
import { useLocalizedProducts } from '@/composables/useLocalizedData'
import '@/styles/product.css'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const products = useLocalizedProducts()
const productIndex = computed(() => products.value.findIndex(p => p.slug === route.params.slug))
const product = computed(() => products.value[productIndex.value])

const goBackToRums = () => {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/our-rums')
  }
}

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
      <button type="button" class="pp-hero__back" @click="goBackToRums" :aria-label="t('product.backAria')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

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
        </div>

        <div class="pp-hero__content">
          <span class="pp-hero__kicker" v-field-style="`data.products.${product.slug}.kicker`">{{ product.kicker }}</span>
          <h1 class="pp-hero__name" v-field-style="`data.products.${product.slug}.shortName`">{{ product.shortName }}</h1>
          <p class="pp-hero__tags" v-field-style="`data.products.${product.slug}.tags`">{{ product.tags }}</p>
          <p class="pp-hero__desc" v-field-style="`data.products.${product.slug}.pageDesc`">{{ product.pageDesc }}</p>
          <p v-if="product.closing" class="pp-hero__closing" v-field-style="`data.products.${product.slug}.closing`">{{ product.closing }}</p>
        </div>
      </div>
    </div>

    <!-- ── Fiche produit : rectangle beige récapitulatif ── -->
    <div v-if="product.fiche" class="pp-fiche">
      <div class="pp-fiche__card">
        <h2 class="pp-fiche__name" v-field-style="`data.products.${product.slug}.shortName`">{{ product.shortName }}</h2>
        <p class="pp-fiche__subtitle" v-field-style="`data.products.${product.slug}.fiche.subtitle`">{{ product.fiche.subtitle }}</p>

        <div class="pp-fiche__line"></div>

        <dl class="pp-fiche__specs">
          <div class="pp-fiche__spec">
            <dt v-field-style="'product.specType'">{{ t('product.specType') }}</dt>
            <dd v-field-style="`data.products.${product.slug}.fiche.type`">{{ product.fiche.type }}</dd>
          </div>
          <div class="pp-fiche__spec">
            <dt v-field-style="'product.specVolume'">{{ t('product.specVolume') }}</dt>
            <dd v-field-style="`data.products.${product.slug}.fiche.volume`">{{ product.fiche.volume }}</dd>
          </div>
          <div class="pp-fiche__spec">
            <dt v-field-style="'product.specAbv'">{{ t('product.specAbv') }}</dt>
            <dd v-field-style="`data.products.${product.slug}.fiche.abv`">{{ product.fiche.abv }}</dd>
          </div>
          <div class="pp-fiche__spec">
            <dt v-field-style="'product.specCharacter'">{{ t('product.specCharacter') }}</dt>
            <dd v-field-style="`data.products.${product.slug}.fiche.character`">{{ product.fiche.character }}</dd>
          </div>
          <div class="pp-fiche__spec pp-fiche__spec--full">
            <dt v-field-style="'product.specIngredients'">{{ t('product.specIngredients') }}</dt>
            <dd v-field-style="`data.products.${product.slug}.fiche.ingredients`">{{ product.fiche.ingredients }}</dd>
          </div>
        </dl>

        <div class="pp-fiche__taste">
          <span class="pp-fiche__taste-label" v-field-style="'product.tasteProfile'">{{ t('product.tasteProfile') }}</span>
          <p class="pp-fiche__taste-text" v-field-style="`data.products.${product.slug}.fiche.taste`">{{ product.fiche.taste }}</p>
        </div>

        <div class="pp-details__inner pp-details__inner--bottom">
          <div v-if="product.moment" class="pp-detail">
            <h3 class="pp-detail__title" v-field-style="`data.products.${product.slug}.moment.title`">{{ product.moment.title }}</h3>
            <p class="pp-detail__text" v-field-style="`data.products.${product.slug}.moment.text`">{{ product.moment.text }}</p>
          </div>
          <div class="pp-detail">
            <h3 class="pp-detail__title" v-field-style="`data.products.${product.slug}.enjoy.title`">{{ product.enjoy.title }}</h3>
            <p class="pp-detail__text" v-field-style="`data.products.${product.slug}.enjoy.text`">{{ product.enjoy.text }}</p>
          </div>
          <div class="pp-detail">
            <h3 class="pp-detail__title" v-field-style="`data.products.${product.slug}.notes.title`">{{ product.notes.title }}</h3>
            <p class="pp-detail__text" v-field-style="`data.products.${product.slug}.notes.text`">{{ product.notes.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tagline collection ── -->
    <div class="pp-tagline">
      <h2 class="pp-tagline__title" v-field-style="'product.tagline'">{{ t('product.tagline') }}</h2>
    </div>

  </section>

  <section v-else class="pp pp--empty">
    <p v-field-style="'product.notFound'">{{ t('product.notFound') }}</p>
    <RouterLink to="/" class="pp-cta__link" v-field-style="'product.backHome'">{{ t('product.backHome') }}</RouterLink>
  </section>

</template>
