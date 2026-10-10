<script setup lang="ts">
  import { computed, ref } from 'vue';

  import TplImageLightbox from '@/components/shared/TplImageLightbox.vue';
  import TplImageTransitionSwap from '@/components/shared/TplImageTransitionSwap.vue';
  import { useEditor } from '@/composables/useEditor';
  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';
  import { useThemeVariant } from '@/composables/useThemeVariant';
  import {
    type VariantImageMode,
    type VariantImageSection,
    useVariantImage,
    variantImagePath,
  } from '@/composables/useVariantImage';
  import { useVariantSwitchTimeline } from '@/composables/useVariantSwitchTimeline';

  const props = withDefaults(
    defineProps<{
      imageSection: string;
      alt?: string;
      sizes?: string;
      densities?: string;
      expandable?: boolean;
      expandLabel?: string;
    }>(),
    {
      alt: undefined,
      sizes: 'sm:100vw md:100vw lg:100vw xl:80vw 2xl:70vw',
      densities: 'x1 x2',
      expandable: true,
      expandLabel: undefined,
    },
  );


  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { editorId } = useEditor({ defaultEditor: 'vscode' });
  const { resolvedMode } = useResolvedColorMode();
  const { variantImageSrc } = useVariantImage();
  const { switchToken, switchStartedAt, totalDuration } = useVariantSwitchTimeline();


  const normalizedSection = computed(
    () => props.imageSection.replace(/^\/+|\/+$/g, '') as VariantImageSection,
  );
  const mode = computed<VariantImageMode>(
    () => (resolvedMode.value === 'Dark' ? 'Dark' : 'Light') as VariantImageMode,
  );
  // Raw path is used by the lightbox (full-resolution asset); the displayed
  // layers use the optimized URL that the preloader also warms.
  const rawSrc = computed(() =>
    variantImagePath(editorId.value, normalizedSection.value, variant.value, mode.value),
  );
  const displaySrc = computed(() =>
    variantImageSrc(editorId.value, normalizedSection.value, variant.value, mode.value),
  );
  const resolvedAlt = computed(
    () =>
      props.alt ??
      `Preview image for ${variant.value} variant in ${resolvedMode.value.toLowerCase()} mode.`,
  );
  const expandAriaLabel = computed(() => props.expandLabel ?? `Expand ${resolvedAlt.value}`);


  const displayVariant = computed(() =>
    variant.value
      .replace(/[A-Z]/g, (match) => ` ${match.toLowerCase()}`)
      .replace(/^./, (char) => char.toUpperCase()),
  );
  const lightboxTitle = computed(
    () => `${displayVariant.value} · ${resolvedMode.value.toLowerCase()}`,
  );


  const lightboxVisible = ref(false);


  function openLightbox() {
    if (!props.expandable) return;
    lightboxVisible.value = true;
  }


  function closeLightbox() {
    lightboxVisible.value = false;
  }

  defineExpose({ openLightbox });
</script>

<template>
  <div class="variant-mode-image-swap">
    <TplImageTransitionSwap
      :src="displaySrc"
      :alt="resolvedAlt"
      :sizes="sizes"
      :densities="densities"
      :sync-token="switchToken"
      :sync-started-at="switchStartedAt"
      :sync-duration="totalDuration"
      :expandable="expandable"
      :expand-label="expandAriaLabel"
      @expand="openLightbox"
    >
      <template #image="{ src, alt: imageAlt }">
        <slot name="image" :src="src" :alt="imageAlt">
          <img :src="src" :alt="imageAlt" class="preview-image" />
        </slot>
      </template>
    </TplImageTransitionSwap>

    <TplImageLightbox
      v-if="expandable"
      :visible="lightboxVisible"
      :src="rawSrc"
      :alt="resolvedAlt"
      :title="lightboxTitle"
      @close="closeLightbox"
    />
  </div>
</template>

<style scoped>
  .preview-image {
    display: block;
    width: 100%;
    height: 100%; /* fill the shell's fixed height */
    object-fit: cover;
    object-position: bottom left; /* show the bottom left of the image */
  }
</style>
