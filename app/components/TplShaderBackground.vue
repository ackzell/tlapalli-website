<script setup lang="ts">
  import { onBeforeUnmount, onMounted, nextTick, ref, watch } from 'vue';

  import { themePalette } from '~/models/variants';

  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();


  const props = defineProps<{
    revealed?: boolean;
  }>();


  const { canvas, configure, resize } = useCrystalShader();


  const headerOffset = ref(0);
  const canvasHeight = ref(0);


  let resizeObserver: ResizeObserver | null = null;
  let contentObserver: ResizeObserver | null = null;


  const measureHeader = () => {
    const header = document.querySelector('header');
    const nextOffset = header ? header.offsetHeight : 0;
    if (nextOffset !== headerOffset.value) {
      headerOffset.value = nextOffset;
    }
  };


  const measurePage = () => {
    if (!canvas.value) {
      return;
    }
    const docHeight =
      document.body.offsetHeight || document.documentElement.clientHeight || 0;
    const nextHeight = Math.max(0, docHeight - headerOffset.value);
    if (nextHeight !== canvasHeight.value) {
      canvasHeight.value = nextHeight;
    }
  };


  const resizeFromMetrics = async () => {
    await nextTick();
    resize();
  };


  onMounted(async () => {
    await nextTick();
    measureHeader();
    measurePage();
    const header = document.querySelector('header');
    if (header && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measureHeader);
      resizeObserver.observe(header);
    }
    if (typeof ResizeObserver !== 'undefined') {
      contentObserver = new ResizeObserver(measurePage);
      contentObserver.observe(document.body);
    }
    window.addEventListener('resize', measurePage);
  });


  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    contentObserver?.disconnect();
    contentObserver = null;
    window.removeEventListener('resize', measurePage);
  });


  watch(headerOffset, measurePage);
  watch(canvasHeight, resizeFromMetrics);
  watch(
    () => props.revealed,
    (revealed) => {
      if (revealed) {
        measurePage();
      }
    },
  );


  const currentColors = computed(() => {
    const mode = resolvedMode.value.toLowerCase() as 'light' | 'dark';
    const palette = themePalette[variant.value][mode];
    const number = Math.max(6, Math.round((canvasHeight.value || 900) / 150));
    return {
      color0: palette.ui.bg,
      color1: palette.ui.widgetBorder,
      number,
      seed: 'tlapalli',
    };
  });


  watch(currentColors, (colors) => configure(colors), { immediate: true });
</script>

<template>
  <canvas
    ref="canvas"
    class="absolute left-0 right-0 w-full pointer-events-none"
    :style="{
      top: `${headerOffset}px`,
      height: `${canvasHeight}px`,
      opacity: props.revealed ? 1 : 0,
      transition: 'opacity 500ms ease',
    }"
    aria-hidden="true"
  />
</template>
