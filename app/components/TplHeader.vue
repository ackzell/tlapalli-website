<script setup lang="ts">
  import { themePalette } from '~/models/variants';

  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();


  const currentBackground = computed(() => {
    const mode = resolvedMode.value.toLowerCase() as 'light' | 'dark';
    return themePalette[variant.value][mode].ui.bg;
  });


  const currentBorder = computed(() => {
    const mode = resolvedMode.value.toLowerCase() as 'light' | 'dark';
    return themePalette[variant.value][mode].ui.border;
  });
</script>

<template>
  <header
    class="sticky top-0 z-10 px-4 py-8"
    :class="$colorMode.value !== 'dark' ? 'scroll-shadow-header' : ''"
  >
    <div class="backdrop">
      <div class="relative flex items-center justify-between p-2 m-0">
        <h1 class="font-serif">
          Tlapalli <small class="font-sans text-sm opacity-80">VSCode Theme</small>
        </h1>

        <div
          class="pointer-events-none md:absolute md:-translate-x-1/2 md:-translate-y-1/2 md:left-1/2 md:top-1/2 w-max"
        >
          <div class="relative flex items-center justify-center">
            <span
              class="absolute font-mono transition-opacity opacity-0 right-40px md:opacity-100 duration-250"
            >
              selected:
            </span>
            <div hidden absolute class="md:inline">
              <TplCurrentVariantGem />
            </div>
            <TplCurrentVariantName class="absolute font-mono -left-50px md:left-40px" />
          </div>
        </div>

        <TplColorModeToggle class="pointer-events-initial" />
      </div>
    </div>
    <div class="backdrop-edge" :class="`${$colorMode.value}-backdrop-edge`" />
  </header>
</template>

<style scoped>
  header {
    --thickness: 2px;
  }

  @supports (backdrop-filter: blur(12px)) or (-webkit-backdrop-filter: blur(12px)) {
    .backdrop {
      position: absolute;
      inset: 0;
      /*
        These prefixed properties are usually
        added automatically by tooling:
      */
      -webkit-backdrop-filter: blur(12px) saturate(2);
      backdrop-filter: blur(12px) saturate(2);
      background: linear-gradient(to bottom, v-bind(currentBackground), transparent 50%);
      pointer-events: none;
    }

    .backdrop-edge {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: var(--thickness);

      transform: translateY(100%);
      pointer-events: none;
    }

    .dark-backdrop-edge {
      background: oklch(from v-bind(currentBorder) l c h / 0.2);
      -webkit-backdrop-filter: blur(6px) brightness(2);
      backdrop-filter: blur(6px) brightness(2);
    }

    .light-backdrop-edge {
      background: hsl(0deg 0% 100% / 0.1);
      -webkit-backdrop-filter: blur(6px) brightness(0.96) saturate(2);
      backdrop-filter: blur(6px) brightness(0.96) saturate(2);
    }
  }

  @supports (mask-image: none) or (-webkit-mask-image: none) {
    .backdrop {
      height: 200%;
      -webkit-mask-image: linear-gradient(to bottom, black 0% 50%, transparent 50% 100%);
      mask-image: linear-gradient(to bottom, black 0% 50%, transparent 50% 100%);
    }
    .backdrop-edge {
      height: 100%;
      inset: 0;
      -webkit-mask-image: linear-gradient(
        to bottom,
        black 0,
        black var(--thickness),
        transparent var(--thickness)
      );
      mask-image: linear-gradient(
        to bottom,
        black 0,
        black var(--thickness),
        transparent var(--thickness)
      );
    }
  }
</style>
