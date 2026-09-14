<script setup lang="ts">
  import { themePalette } from '~/models/variants';

  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();


  const { canvas, configure } = useCrystalShader();


  const currentColors = computed(() => {
    const mode = resolvedMode.value.toLowerCase() as 'light' | 'dark';
    const palette = themePalette[variant.value][mode];
    return {
      color0: palette.ui.bg,
      color1: palette.ui.widgetBorder,
      number: 5,
      seed: 'tlapalli',
    };
  });


  watch(currentColors, (colors) => configure(colors), { immediate: true });
</script>

<template>
  <canvas ref="canvas" class="fixed inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
</template>
