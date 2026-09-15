<script setup lang="ts">
  import { computed } from 'vue';

  import { EDITOR_PREVIEW_REVEAL_DURATION } from '@/composables/useEditorPreviewTiming';
  import { useImageTransitionSwap } from '@/composables/useImageTransitionSwap';

  const props = withDefaults(
    defineProps<{
      src: string;
      alt: string;
      sizes?: string;
      densities?: string;
      baseDuration?: number;
      easing?: string;
      syncToken?: number;
      syncStartedAt?: number;
      syncDuration?: number;
      expandable?: boolean;
      expandLabel?: string;
    }>(),
    {
      sizes: '100vw',
      densities: 'x1 x2',
      baseDuration: EDITOR_PREVIEW_REVEAL_DURATION,
      easing: 'easeInOutCubic',
      syncToken: 0,
      syncStartedAt: 0,
      syncDuration: EDITOR_PREVIEW_REVEAL_DURATION,
      expandable: false,
      expandLabel: 'Expand preview image',
    },
  );


  const emit = defineEmits<{ expand: [] }>();


  const source = computed(() => props.src);
  const syncToken = computed(() => props.syncToken);
  const syncStartedAt = computed(() => props.syncStartedAt);


  const { frameRef, layerSrcs, setLayerRef } = useImageTransitionSwap({
    source,
    baseDuration: computed(() => props.baseDuration),
    easing: props.easing,
    syncToken,
    syncStartedAt,
    syncDuration: computed(() => props.syncDuration),
  });
</script>

<template>
  <div ref="frameRef" class="preview-frame">
    <div :ref="(el) => setLayerRef(el, 0)" class="preview-layer">
      <slot name="image" :src="layerSrcs[0]" :alt="alt">
        <NuxtImg
          :src="layerSrcs[0]"
          :alt="alt"
          class="preview-image"
          :sizes="sizes"
          :densities="densities"
        />
      </slot>
    </div>
    <div :ref="(el) => setLayerRef(el, 1)" class="preview-layer preview-layer--top">
      <slot name="image" :src="layerSrcs[1]" :alt="alt">
        <NuxtImg
          :src="layerSrcs[1]"
          :alt="alt"
          class="preview-image"
          :sizes="sizes"
          :densities="densities"
        />
      </slot>
    </div>
    <button
      v-if="expandable"
      type="button"
      class="preview-expand"
      :aria-label="expandLabel"
      :title="expandLabel"
      @click="emit('expand')"
    >
      <span class="preview-expand-icon i-mynaui:maximize" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
  .preview-frame {
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .preview-layer {
    position: relative;
    width: 100%;
    pointer-events: none;
  }

  .preview-layer--top {
    position: absolute;
    inset: 0;
  }

  .preview-expand {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.9rem;
    height: 1.9rem;
    padding: 0;
    border: none;
    border-radius: 9999px;
    color: #ffffff;
    background-color: rgb(0 0 0 / 0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    cursor: pointer;
    touch-action: manipulation;
    opacity: 0.85;
    transition:
      opacity 180ms ease,
      background-color 180ms ease,
      transform 180ms ease;
  }

  .preview-expand:hover,
  .preview-expand:focus-visible {
    opacity: 1;
    background-color: rgb(0 0 0 / 0.6);
  }

  .preview-expand:active {
    transform: scale(0.9);
  }

  .preview-expand:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .preview-expand-icon {
    font-size: 0.95rem;
    line-height: 1;
  }

  .preview-image {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
  }
</style>
