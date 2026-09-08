<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Header from '@/layout/Header.vue'
import { useLocalizedCocktails } from '@/composables/useLocalizedData'
import '@/styles/recipe.css'

const route = useRoute()
const { t } = useI18n()
const cocktails = useLocalizedCocktails()
const cocktailIndex = computed(() => cocktails.value.findIndex(c => c.slug === route.params.slug))
const cocktail = computed(() => cocktails.value[cocktailIndex.value])

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

      <RouterLink to="/our-rums" class="recipe-back" :aria-label="t('recipe.backAria')">
        <i class="fa-solid fa-arrow-left"></i>
      </RouterLink>

      <div class="recipe-hero__title">
        <h1 class="recipe-title" v-field-style="`data.cocktails.${cocktail.slug}.title`">{{ cocktail.title }}</h1>
        <p class="recipe-subtitle" v-field-style="`data.cocktails.${cocktail.slug}.subtitle`">{{ cocktail.subtitle }}</p>
      </div>
    </div>

    <div class="recipe-lower">
      <div class="recipe-lower__inner">
        <div class="recipe-block">
          <h2 class="recipe-block__heading" v-field-style="'recipe.ingredients'">{{ t('recipe.ingredients') }}</h2>
          <ul class="recipe-list">
            <li v-for="(item, i) in cocktail.ingredients" :key="i">
              <i class="fa-solid fa-martini-glass-citrus recipe-list__icon"></i>
              <span v-field-style="`data.cocktails.${cocktail.slug}.ingredients`">{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="recipe-block">
          <h2 class="recipe-block__heading" v-field-style="'recipe.method'">{{ t('recipe.method') }}</h2>
          <ol class="recipe-steps">
            <li v-for="(step, i) in cocktail.steps" :key="i" v-field-style="`data.cocktails.${cocktail.slug}.steps`">{{ step }}</li>
          </ol>
        </div>
      </div>

      <p class="recipe-enjoy" v-field-style="'recipe.enjoyResponsibly'">{{ t('recipe.enjoyResponsibly') }}</p>
    </div>
  </section>

  <section v-else class="recipe-page recipe-page--empty">
    <p v-field-style="'recipe.notFound'">{{ t('recipe.notFound') }}</p>
    <RouterLink to="/our-rums" class="recipe-back-link" v-field-style="'recipe.backLink'">{{ t('recipe.backLink') }}</RouterLink>
  </section>

</template>
