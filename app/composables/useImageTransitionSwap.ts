import { computed, nextTick, onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue';

import { EDITOR_PREVIEW_REVEAL_DURATION } from '@/composables/useEditorPreviewTiming';

import type { ComponentPublicInstance, MaybeRefOrGetter, Ref } from 'vue';

const CLIP_HIDDEN = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)';
const CLIP_VISIBLE = 'polygon(50% -90%, 260% 50%, 50% 190%, -160% 50%)';

// Upper bound for waiting on the incoming layer's image. Preview images are
// lazy-loaded and the incoming layer can be hidden or off-screen, so the load
// event may never fire; without a cap the swap would hang on the old variant.
const LAYER_IMAGE_LOAD_TIMEOUT = 1500;

type UseImageTransitionSwapOptions = {
  source: MaybeRefOrGetter<string>;
  baseDuration?: MaybeRefOrGetter<number>;
  easing?: string;
  syncToken?: Ref<number>;
  syncStartedAt?: Ref<number>;
  syncDuration?: MaybeRefOrGetter<number>;
};

export function useImageTransitionSwap(options: UseImageTransitionSwapOptions) {
  const { $anime } = useNuxtApp();

  const baseDuration = computed(
    () => toValue(options.baseDuration) ?? EDITOR_PREVIEW_REVEAL_DURATION,
  );
  const syncDuration = computed(() => toValue(options.syncDuration) ?? baseDuration.value);

  const layerSrcs = ref<[string, string]>([toValue(options.source), toValue(options.source)]);
  const activeLayer = ref<0 | 1>(0);
  const frameRef = ref<HTMLElement | null>(null);
  const layerRefs: [Ref<HTMLElement | null>, Ref<HTMLElement | null>] = [
    ref<HTMLElement | null>(null),
    ref<HTMLElement | null>(null),
  ];

  let swapToken = 0;

  const setLayerRef = (element: Element | ComponentPublicInstance | null, index: 0 | 1) => {
    const resolved =
      element instanceof Element
        ? element
        : element && '$el' in element
          ? (element.$el as Element)
          : null;
    layerRefs[index].value = resolved as HTMLElement | null;
  };

  const waitForLayerImage = async (index: 0 | 1) => {
    await nextTick();
    const layer = layerRefs[index].value;
    if (!layer) {
      return;
    }

    const img = layer.querySelector('img') as HTMLImageElement | null;
    if (!img) {
      return;
    }

    // Force the lazy image to fetch even while the incoming layer is hidden or
    // below the fold, otherwise the load event never fires for this swap.
    img.loading = 'eager';

    if (img.complete && img.naturalWidth > 0) {
      return;
    }

    await new Promise<void>((resolve) => {
      let settled = false;
      let timeoutId: number | undefined;
      const done = () => {
        if (settled) {
          return;
        }
        settled = true;
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
        resolve();
      };

      timeoutId = window.setTimeout(done, LAYER_IMAGE_LOAD_TIMEOUT);
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  };

  const resolveDuration = () => {
    return syncDuration.value;
  };

  const animateSwap = (incomingIndex: 0 | 1, duration: number, token: number) => {
    const incomingLayer = layerRefs[incomingIndex].value;
    const outgoingIndex: 0 | 1 = incomingIndex === 0 ? 1 : 0;
    const outgoingLayer = layerRefs[outgoingIndex].value;

    if (!incomingLayer) {
      return;
    }

    const incomingImage = incomingLayer.querySelector('img') as HTMLImageElement | null;
    if (!incomingImage) {
      return;
    }

    $anime.remove(incomingLayer);
    if (outgoingLayer) {
      $anime.remove(outgoingLayer);
    }

    incomingLayer.style.clipPath = CLIP_HIDDEN;
    incomingLayer.style.zIndex = '2';
    if (outgoingLayer) {
      outgoingLayer.style.zIndex = '1';
    }

    const morphState = { t: 0 };
    $anime({
      targets: morphState,
      t: 1,
      duration,
      easing: options.easing ?? 'easeInOutCubic',
      update: () => {
        const radius = morphState.t * 160;
        const radiusX = radius;
        const radiusY = radius * 0.88;
        incomingLayer.style.clipPath = `polygon(50% ${50 - radiusY}%, ${50 + radiusX}% 50%, 50% ${50 + radiusY}%, ${50 - radiusX}% 50%)`;
      },
      complete: () => {
        if (token !== swapToken) {
          return;
        }

        const incoming = layerRefs[incomingIndex].value;
        const outgoing = layerRefs[outgoingIndex].value;
        if (incoming) {
          incoming.style.clipPath = CLIP_VISIBLE;
          incoming.style.zIndex = '2';
        }
        if (outgoing) {
          outgoing.style.clipPath = CLIP_HIDDEN;
          outgoing.style.zIndex = '1';
        }
        activeLayer.value = incomingIndex;
      },
    });
  };

  const settleLayers = () => {
    layerRefs.forEach((layerRef, index) => {
      const layer = layerRef.value;
      if (!layer) {
        return;
      }
      $anime.remove(layer);
      const isActive = index === activeLayer.value;
      layer.style.clipPath = isActive ? CLIP_VISIBLE : CLIP_HIDDEN;
      layer.style.zIndex = isActive ? '2' : '1';
    });
  };

  if (import.meta.client) {
    watch(
      () => toValue(options.source),
      async (nextSrc) => {
        // Always invalidate any in-flight swap first. Otherwise a slow swap for
        // an earlier variant can finish last and reveal that outdated variant.
        swapToken += 1;
        const token = swapToken;
        const incomingIndex: 0 | 1 = activeLayer.value === 0 ? 1 : 0;

        if (nextSrc === layerSrcs.value[activeLayer.value]) {
          // The active layer already shows the requested image. Cancel any
          // in-flight swap so it cannot reveal an outdated variant later.
          settleLayers();
          return;
        }

        layerSrcs.value[incomingIndex] = nextSrc;
        await waitForLayerImage(incomingIndex);
        if (token !== swapToken) {
          return;
        }

        animateSwap(incomingIndex, resolveDuration(), token);
      },
    );
  }

  onMounted(() => {
    const layer1 = layerRefs[1].value;
    if (layer1) {
      layer1.style.clipPath = CLIP_HIDDEN;
      layer1.style.zIndex = '1';
    }

    const layer0 = layerRefs[0].value;
    if (layer0) {
      layer0.style.clipPath = CLIP_VISIBLE;
      layer0.style.zIndex = '2';
    }
  });

  onBeforeUnmount(() => {
    layerRefs.forEach((layerRef) => {
      if (layerRef.value) {
        $anime.remove(layerRef.value);
      }
    });
  });

  return {
    frameRef,
    layerSrcs,
    setLayerRef,
  };
}
