<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Header from '@/layout/Header.vue'
import { cocktails } from '@/data/cocktails'
import '@/styles/recipe.css'

const route = useRoute()
const cocktailIndex = computed(() => cocktails.findIndex(c => c.slug === route.params.slug))
const cocktail = computed(() => cocktails[cocktailIndex.value])

watchEffect(() => {
  if (cocktail.value) {
    document.title = `${cocktail.value.title} Recipe | Toaka Gasy`
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', `How to make the ${cocktail.value.title}: ${cocktail.value.subtitle}.`)
  }
})
</script>

<template>

  <Header />

  <section v-if="cocktail" class="recipe-page" :class="`recipe-page--${cocktailIndex}`">

    <div class="recipe-hero">
      <img :src="cocktail.src" class="recipe-hero__bg" :alt="cocktail.title" />
      <div class="recipe-hero__overlay" aria-hidden="true"></div>

      <RouterLink to="/our-rums" class="recipe-back" aria-label="Back to Perfect Serves">
        <i class="fa-solid fa-arrow-left"></i>
      </RouterLink>

      <div class="recipe-hero__title">
        <h1 class="recipe-title">{{ cocktail.title }}</h1>
        <p class="recipe-subtitle">{{ cocktail.subtitle }}</p>
      </div>
    </div>

    <div class="recipe-lower">
      <div class="recipe-lower__inner">
        <div class="recipe-block">
          <h2 class="recipe-block__heading">Ingredients</h2>
          <ul class="recipe-list">
            <li v-for="(item, i) in cocktail.ingredients" :key="i">
              <i class="fa-solid fa-martini-glass-citrus recipe-list__icon"></i>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="recipe-block">
          <h2 class="recipe-block__heading">Method</h2>
          <ol class="recipe-steps">
            <li v-for="(step, i) in cocktail.steps" :key="i">{{ step }}</li>
          </ol>
        </div>
      </div>

      <p class="recipe-enjoy">Enjoy Responsibly</p>
    </div>
  </section>

  <section v-else class="recipe-page recipe-page--empty">
    <p>Recipe not found.</p>
    <RouterLink to="/our-rums" class="recipe-back-link">back to perfect serves</RouterLink>
  </section>

</template>
