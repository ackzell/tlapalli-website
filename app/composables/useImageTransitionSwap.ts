import type { ComponentPublicInstance, MaybeRefOrGetter, Ref } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'
import { EDITOR_PREVIEW_REVEAL_DURATION } from '@/composables/useEditorPreviewTiming'

const CLIP_HIDDEN = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)'

type UseImageTransitionSwapOptions = {
  source: MaybeRefOrGetter<string>
  baseDuration?: MaybeRefOrGetter<number>
  easing?: string
  syncToken?: Ref<number>
  syncStartedAt?: Ref<number>
  syncDuration?: MaybeRefOrGetter<number>
}

export function useImageTransitionSwap(options: UseImageTransitionSwapOptions) {
  const { $anime } = useNuxtApp()

  const baseDuration = computed(() => toValue(options.baseDuration) ?? EDITOR_PREVIEW_REVEAL_DURATION)
  const syncDuration = computed(() => toValue(options.syncDuration) ?? baseDuration.value)

  const layerSrcs = ref<[string, string]>([toValue(options.source), toValue(options.source)])
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
    if (!layer) {
      return
    }

    const img = layer.querySelector('img') as HTMLImageElement | null
    if (!img) {
      return
    }

    if (img.complete && img.naturalWidth > 0) {
      return
    }

    await new Promise<void>((resolve) => {
      const done = () => resolve()
      img.addEventListener('load', done, { once: true })
      img.addEventListener('error', done, { once: true })
    })
  }

  const resolveDuration = () => {
    return syncDuration.value
  }

  const animateSwap = (incomingIndex: 0 | 1, duration: number, token: number) => {
    const incomingLayer = layerRefs[incomingIndex].value

    if (!incomingLayer) {
      return
    }

    const incomingImage = incomingLayer.querySelector('img') as HTMLImageElement | null
    if (!incomingImage) {
      return
    }

    $anime.remove(incomingLayer)

    incomingLayer.style.clipPath = CLIP_HIDDEN

    const morphState = { t: 0 }
    $anime({
      targets: morphState,
      t: 1,
      duration,
      easing: options.easing ?? 'easeInOutCubic',
      update: () => {
        const radius = morphState.t * 160
        const radiusX = radius
        const radiusY = radius * 0.88
        incomingLayer.style.clipPath = `polygon(50% ${50 - radiusY}%, ${50 + radiusX}% 50%, 50% ${50 + radiusY}%, ${50 - radiusX}% 50%)`
      },
      complete: () => {
        if (token !== swapToken) {
          return
        }

        layerSrcs.value[0] = layerSrcs.value[incomingIndex]
        waitForLayerImage(0).then(() => {
          if (token !== swapToken) {
            return
          }

          const layer0 = layerRefs[0].value
          const layer1 = layerRefs[1].value
          if (layer0) {
            layer0.style.clipPath = 'none'
          }
          if (layer1) {
            layer1.style.clipPath = CLIP_HIDDEN
          }
          activeLayer.value = 0
        })
      },
    })

  }

  if (import.meta.client) {
    watch(
      () => toValue(options.source),
      async (nextSrc) => {
        const incomingIndex: 0 | 1 = activeLayer.value === 0 ? 1 : 0

        if (nextSrc === layerSrcs.value[activeLayer.value]) {
          return
        }

        swapToken += 1
        const token = swapToken

        await preloadImage(nextSrc)
        if (token !== swapToken) {
          return
        }

        layerSrcs.value[incomingIndex] = nextSrc
        await waitForLayerImage(incomingIndex)
        if (token !== swapToken) {
          return
        }

        animateSwap(incomingIndex, resolveDuration(), token)
      },
    )
  }

  onMounted(() => {
    const layer1 = layerRefs[1].value
    if (layer1) {
      layer1.style.clipPath = CLIP_HIDDEN
    }
  })

  onBeforeUnmount(() => {
    layerRefs.forEach((layerRef) => {
      if (layerRef.value) {
        $anime.remove(layerRef.value)
      }
    })
  })

  return {
    frameRef,
    layerSrcs,
    setLayerRef,
  }
}
