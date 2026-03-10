<script setup lang="ts">
import type { ComponentPublicInstance, Ref } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EDITOR_PREVIEW_REVEAL_DURATION } from '@/composables/useEditorPreviewTiming'
import { useThemeVariant } from '@/composables/useThemeVariant'

const { $anime } = useNuxtApp()
const colorMode = useColorMode()
const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })

const previewSrc = computed(() => {
  const mode = colorMode.value === 'light' ? 'Light' : 'Dark'
  return `images/variants/${variant.value}${mode}.png`
})

const previewAlt = computed(() =>
  `Preview of the Tlapalli VSCode theme in ${variant.value} variant and ${colorMode.value} mode.`,
)

// Collapsed diamond in the center — visually nothing
const CLIP_HIDDEN = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)'

const layerSrcs = ref<[string, string]>([previewSrc.value, previewSrc.value])
const activeLayer = ref<0 | 1>(0)
const frameRef = ref<HTMLElement | null>(null)
const layerRefs: [Ref<HTMLElement | null>, Ref<HTMLElement | null>] = [
  ref<HTMLElement | null>(null),
  ref<HTMLElement | null>(null),
]
let swapToken = 0

const setLayerRef = (element: Element | ComponentPublicInstance | null, index: 0 | 1) => {
  const resolved = element instanceof Element
    ? element
    : (element && '$el' in element ? element.$el as Element : null)
  layerRefs[index].value = resolved as HTMLElement | null
}

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve()
    img.onerror = () => resolve()
  })

const waitForLayerImage = async (index: 0 | 1) => {
  await nextTick()
  const layer = layerRefs[index].value
  if (!layer) return
  const img = layer.querySelector('img') as HTMLImageElement | null
  if (!img) return
  if (img.complete && img.naturalWidth > 0) return
  await new Promise<void>((resolve) => {
    const done = () => resolve()
    img.addEventListener('load', done, { once: true })
    img.addEventListener('error', done, { once: true })
  })
}

const animateSwap = (incomingIndex: 0 | 1) => {
  const frame = frameRef.value
  const incomingLayer = layerRefs[incomingIndex].value
  if (!frame || !incomingLayer) return

  const incomingImage = incomingLayer.querySelector('img') as HTMLImageElement | null
  if (!incomingImage) return

  const currentHeight = Number.parseFloat(frame.style.height) || frame.getBoundingClientRect().height
  const nextHeight = incomingImage.getBoundingClientRect().height

  // Start the incoming layer as a collapsed diamond
  incomingLayer.style.clipPath = CLIP_HIDDEN

  const morphState = { t: 0 }
  $anime({
    targets: morphState,
    t: 1,
    duration: EDITOR_PREVIEW_REVEAL_DURATION,
    easing: 'easeInOutCubic',
    update: () => {
      const r = morphState.t * 160
      const rx = r
      const ry = r * 0.88
      incomingLayer.style.clipPath
        = `polygon(50% ${50 - ry}%, ${50 + rx}% 50%, 50% ${50 + ry}%, ${50 - rx}% 50%)`
    },
    complete: () => {
      // Mirror new src to layer 0, but keep layer 1 visible until layer 0 has
      // actually rendered it — prevents old image flashing during the reset.
      layerSrcs.value[0] = layerSrcs.value[incomingIndex]
      waitForLayerImage(0).then(() => {
        const layer0 = layerRefs[0].value
        const layer1 = layerRefs[1].value
        if (layer0) layer0.style.clipPath = 'none'
        if (layer1) layer1.style.clipPath = CLIP_HIDDEN
        activeLayer.value = 0
      })
    },
  })

  if (nextHeight && nextHeight !== currentHeight) {
    $anime({
      targets: frame,
      height: nextHeight,
      duration: EDITOR_PREVIEW_REVEAL_DURATION,
      easing: 'easeInOutCubic',
      complete: () => {
        frame.style.height = 'auto'
      },
    })
  }
  else {
    frame.style.height = 'auto'
  }
}

if (import.meta.client) {
  watch(previewSrc, async (nextSrc) => {
    const incomingIndex: 0 | 1 = activeLayer.value === 0 ? 1 : 0

    if (nextSrc === layerSrcs.value[activeLayer.value]) return

    swapToken += 1
    const token = swapToken

    // Lock frame height before source swap changes rendered dimensions
    const frame = frameRef.value
    if (frame) {
      const h = frame.getBoundingClientRect().height
      if (h) frame.style.height = `${h}px`
    }

    await preloadImage(nextSrc)
    if (token !== swapToken) return

    layerSrcs.value[incomingIndex] = nextSrc
    await waitForLayerImage(incomingIndex)
    if (token !== swapToken) return

    animateSwap(incomingIndex)
  })
}

onMounted(() => {
  const layer1 = layerRefs[1].value
  if (layer1) layer1.style.clipPath = CLIP_HIDDEN
})

onBeforeUnmount(() => {
  if (frameRef.value) $anime.remove(frameRef.value)
  layerRefs.forEach(r => r.value && $anime.remove(r.value))
})
</script>

<template>
  <div ref="frameRef" class="preview-frame">
    <div :ref="(el) => setLayerRef(el, 0)" class="preview-layer">
      <NuxtImg
        :src="layerSrcs[0]"
        :alt="previewAlt"
        class="preview-image"
        sizes="sm:70vw md:80vw"
        densities="x1 x3"
      />
    </div>
    <div :ref="(el) => setLayerRef(el, 1)" class="preview-layer preview-layer--top">
      <NuxtImg
        :src="layerSrcs[1]"
        :alt="previewAlt"
        class="preview-image"
        sizes="sm:70vw md:80vw"
        densities="x1 x3"
      />
    </div>
  </div>
</template>

<style scoped>
.preview-frame {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* Layer 0: relative — its rendered height drives frame auto-height */
.preview-layer {
  position: relative;
  width: 100%;
  pointer-events: none;
}

/* Layer 1: absolute on top — always overlays layer 0 */
.preview-layer--top {
  position: absolute;
  inset: 0;
}

.preview-image {
  display: block;
  width: 100%;
  height: auto;
}
</style>
