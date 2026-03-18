// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NUXT_DEVTOOLS !== 'false' },

  app: {
    head: {
      script: [
        {
          key: 'randomuuid-polyfill',
          innerHTML: "(function(){var g=typeof globalThis!=='undefined'?globalThis:window;var c=g.crypto||(g.crypto={});if(typeof c.randomUUID==='function')return;function m(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(ch){var r=Math.random()*16|0;var v=ch==='x'?r:(r&0x3)|0x8;return v.toString(16);});}function u(){if(typeof c.getRandomValues!=='function')return m();var b=new Uint8Array(16);c.getRandomValues(b);b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;var h=Array.prototype.map.call(b,function(x){return x.toString(16).padStart(2,'0');});return h.slice(0,4).join('')+'-'+h.slice(4,6).join('')+'-'+h.slice(6,8).join('')+'-'+h.slice(8,10).join('')+'-'+h.slice(10,16).join('');}try{Object.defineProperty(c,'randomUUID',{configurable:true,value:u});}catch(_){c.randomUUID=u;}})();",
          type: 'text/javascript',
        },
      ],
    },
  },

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