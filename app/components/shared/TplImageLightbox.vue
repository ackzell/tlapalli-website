<script setup lang="ts">
  import { computed } from 'vue';
  import VueEasyLightbox from 'vue-easy-lightbox';

  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';
  import { useThemeVariant } from '@/composables/useThemeVariant';
  import { themePalette } from '@/models/variants';

  const props = defineProps<{
    visible: boolean;
    src: string;
    alt?: string;
    title?: string;
  }>();


  const emit = defineEmits<{ close: [] }>();


  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();


  const image = computed(() => [
    {
      src: props.src,
      alt: props.alt ?? '',
      ...(props.title ? { title: props.title } : {}),
    },
  ]);


  const lightboxVars = computed(() => {
    const mode = resolvedMode.value.toLowerCase() as 'light' | 'dark';
    const ui = themePalette[variant.value][mode].ui;
    return {
      '--tpl-lightbox-overlay': `${ui.bg}e0`,
      '--tpl-lightbox-img-bg': ui.bg,
      '--tpl-lightbox-img-shadow':
        mode === 'dark'
          ? '0 12px 48px rgb(0 0 0 / 0.5)'
          : '0 12px 48px rgb(0 0 0 / 0.16)',
    };
  });


  useHead(() => ({
    style: [
      {
        key: 'tpl-image-lightbox-vars',
        innerHTML: `:root { ${Object.entries(lightboxVars.value)
          .map(([name, value]) => `${name}: ${value};`)
          .join(' ')} }`,
      },
    ],
  }));


  function onHide() {
    emit('close');
  }
</script>

<template>
  <ClientOnly>
    <VueEasyLightbox
      :visible="visible"
      :imgs="image"
      :index="0"
      teleport="body"
      scroll-disabled
      mask-closable
      :zoom-scale="0.18"
      :max-zoom="4"
      @hide="onHide"
    />
  </ClientOnly>
</template>

<style>
  .vel-modal.vel-modal {
    background: var(--tpl-lightbox-overlay, rgba(0, 0, 0, 0.55));
    backdrop-filter: blur(14px) saturate(1.2);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
  }

  .vel-img {
    background-color: var(--tpl-lightbox-img-bg, #000000) !important;
    box-shadow: var(--tpl-lightbox-img-shadow, 0 5px 20px 2px rgb(0 0 0 / 0.7)) !important;
  }
</style>
