// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/'],
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NUXT_DEVTOOLS !== 'false' },

  site: {
    url: process.env.NUXT_SITE_URL || 'https://tlapalli.ackzell.dev',
    name: 'Tlapalli - VSCode Theme',
    description:
      'Tlah-PAH-lee means color in Náhuatl. Monochromatic theme with colored variations. Inspired by minerals found in Mexico',
  },

  sitemap: {
    // Build-time sitemap generation; removes runtime sitemap code from server bundle.
    zeroRuntime: true,
  },

  app: {
    head: {
      title: 'Tlapalli - VSCode Theme',
      meta: [
        {
          name: 'description',
          content:
            'Tlah-PAH-lee means color in Náhuatl. Monochromatic theme with colored variations. Inspired by minerals found in Mexico',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Tlapalli - VSCode Theme' },
        { property: 'og:title', content: 'Tlapalli - VSCode Theme' },
        {
          property: 'og:description',
          content:
            'Tlah-PAH-lee means color in Náhuatl. Monochromatic theme with colored variations. Inspired by minerals found in Mexico',
        },
        {
          property: 'og:image',
          content: 'https://tlapalli.ackzell.dev/images/og/og.png',
        },
        {
          property: 'og:image:alt',
          content: 'VSCode screenshot with dark variations of Tlapalli theme',
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Tlapalli - VSCode Theme' },
        {
          name: 'twitter:description',
          content:
            'Tlah-PAH-lee means color in Náhuatl. Monochromatic theme with colored variations. Inspired by minerals found in Mexico',
        },
        {
          name: 'twitter:image',
          content: 'https://tlapalli.ackzell.dev/images/og/og.png',
        },
      ],
      script: [
        {
          key: 'randomuuid-polyfill',
          innerHTML:
            "(function(){var g=typeof globalThis!=='undefined'?globalThis:window;var c=g.crypto||(g.crypto={});if(typeof c.randomUUID==='function')return;function m(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(ch){var r=Math.random()*16|0;var v=ch==='x'?r:(r&0x3)|0x8;return v.toString(16);});}function u(){if(typeof c.getRandomValues!=='function')return m();var b=new Uint8Array(16);c.getRandomValues(b);b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;var h=Array.prototype.map.call(b,function(x){return x.toString(16).padStart(2,'0');});return h.slice(0,4).join('')+'-'+h.slice(4,6).join('')+'-'+h.slice(6,8).join('')+'-'+h.slice(8,10).join('')+'-'+h.slice(10,16).join('');}try{Object.defineProperty(c,'randomUUID',{configurable:true,value:u});}catch(_){c.randomUUID=u;}})();",
          type: 'text/javascript',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon/favicon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon/favicon-96x96.png',
          sizes: '96x96',
        },
        {
          rel: 'shortcut icon',
          href: '/favicon/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicon/apple-touch-icon.png',
        },
        {
          rel: 'manifest',
          href: '/favicon/site.webmanifest',
        },
      ],
    },
  },

  colorMode: {
    preference: 'system',
    storageKey: 'tpl-color-mode',
    classSuffix: '',
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
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@unocss/nuxt',
    '@vue-gsap-flip/nuxt',
    '@vueuse/nuxt',
  ],

  image: {
    provider: 'none',
  },

  vite: {
    optimizeDeps: {
      include: ['web-haptics/vue'],
    },
  },
});
