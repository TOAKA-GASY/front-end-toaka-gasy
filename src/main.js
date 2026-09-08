import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n, initialLocale } from './i18n'
import { fieldStyleDirective } from './styles/textStyles'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './styles/main.css'

document.documentElement.lang = initialLocale

createApp(App)
  .directive('field-style', fieldStyleDirective)
  .use(router)
  .use(i18n)
  .mount('#app')
