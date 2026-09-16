<script setup lang="ts">
  import { computed, ref } from 'vue';

  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';

  const { editor } = useEditor({ defaultEditor: 'vscode' });


  const swapRef = ref<InstanceType<typeof TplVariantModeImageSwap> | null>(null);


  const previewAlt = computed(() => `Preview of the Tlapalli theme for ${editor.label}.`);
  const expandLabel = computed(() => `Expand ${previewAlt.value}`);


  const MAX_ROTATE_X = 4;
  const MAX_ROTATE_Y = 4;
  const TILT_SCALE = 1.03;
  const TRANSITION_TRACKING = 'transform 80ms linear';
  const TRANSITION_SETTLE = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)';


  const tiltRef = ref<HTMLElement | null>(null);
  const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(tiltRef);


  const tiltAttrs = computed(() => {
    const reducedMotion = import.meta.client
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : true;
    const scale = reducedMotion ? 1 : TILT_SCALE;
    const attrs: Record<string, string> = {
      willChange: 'transform',
      transition: isOutside.value ? TRANSITION_SETTLE : TRANSITION_TRACKING,
    };
    if (reducedMotion || isOutside.value || !elementWidth.value || !elementHeight.value) {
      return attrs;
    }
    const nx = (elementX.value / elementWidth.value) * 2 - 1;
    const ny = (elementY.value / elementHeight.value) * 2 - 1;
    attrs.transform =
      `perspective(900px) rotateX(${(-ny * MAX_ROTATE_X).toFixed(2)}deg) ` +
      `rotateY(${(nx * MAX_ROTATE_Y).toFixed(2)}deg) scale(${scale})`;
    return attrs;
  });


  function expandPreview() {
    swapRef.value?.openLightbox();
  }
</script>

<template>
  <div class="editor-preview-wrap">
    <div ref="tiltRef" class="hero-tilt" :style="tiltAttrs">
      <TplVariantModeImageSwap
        ref="swapRef"
        class="editor-preview"
        image-section="variants"
        :alt="previewAlt"
      >
        <template #image="{ src, alt }">
          <NuxtImg
            :src="src"
            :alt="alt"
            class="preview-image"
            sizes="sm:70vw md:80vw"
            densities="x1 x2"
            format="auto"
          />
        </template>
      </TplVariantModeImageSwap>
    </div>
    <button
      type="button"
      class="hero-expand"
      :aria-label="expandLabel"
      :title="expandLabel"
      @click="expandPreview"
    >
      <span class="hero-expand-icon i-mynaui:maximize" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
  .editor-preview-wrap {
    position: relative;
  }

  .hero-tilt {
    transform-style: preserve-3d;
  }

  .hero-tilt :deep(.preview-expand) {
    display: none;
  }

  .hero-expand {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    z-index: 20;
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

  .hero-expand:hover,
  .hero-expand:focus-visible {
    opacity: 1;
    background-color: rgb(0 0 0 / 0.6);
  }

  .hero-expand:active {
    transform: scale(0.9);
  }

  .hero-expand:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .hero-expand-icon {
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
