<script setup lang="ts">
import { computed } from 'vue'
import { EDITOR_PREVIEW_REVEAL_DURATION } from '@/composables/useEditorPreviewTiming'
import { useImageTransitionSwap } from '@/composables/useImageTransitionSwap'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  sizes?: string
  densities?: string
  baseDuration?: number
  easing?: string
  syncToken?: number
  syncStartedAt?: number
  syncDuration?: number
}>(), {
  sizes: '100vw',
  densities: 'x1 x2',
  baseDuration: EDITOR_PREVIEW_REVEAL_DURATION,
  easing: 'easeInOutCubic',
  syncToken: 0,
  syncStartedAt: 0,
  syncDuration: EDITOR_PREVIEW_REVEAL_DURATION,
})

const source = computed(() => props.src)
const syncToken = computed(() => props.syncToken)
const syncStartedAt = computed(() => props.syncStartedAt)

const {
  frameRef,
  layerSrcs,
  setLayerRef,
} = useImageTransitionSwap({
  source,
  baseDuration: computed(() => props.baseDuration),
  easing: props.easing,
  syncToken,
  syncStartedAt,
  syncDuration: computed(() => props.syncDuration),
})
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

.preview-image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
