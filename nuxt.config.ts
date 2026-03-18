// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NUXT_DEVTOOLS !== 'false' },


  colorMode: {
    preference: 'system',
    storageKey: 'tpl-color-mode',
    classSuffix: ''
  },

  modules: [
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@hypernym/nuxt-anime',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/eslint-module',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@unocss/nuxt',
    '@vue-gsap-flip/nuxt',
    '@vueuse/nuxt'
  ]
})