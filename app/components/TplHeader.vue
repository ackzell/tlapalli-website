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
    px-4
    py-8
    sticky
    top-0
    z-10
    :class="$colorMode.value !== 'dark' ? 'scroll-shadow-header' : ''"
  >
    <div class="backdrop">
      <div relative m-0 p-2 flex="~" items-center justify-between>
        <h1 font-serif>Tlapalli <small font-sans opacity-80 text-sm>VSCode Theme</small></h1>

        <div
          md:absolute
          w-max
          pointer-events-none
          class="md:-translate-x-1/2 md:-translate-y-1/2 md:left-1/2 md:top-1/2"
        >
          <div relative flex="~" items-center justify-center>
            <span
              font-mono
              absolute
              right-40px
              opacity-0
              md:opacity-100
              transition-opacity
              duration-250
            >
              selected:
            </span>
            <div hidden absolute md:inline>
              <TplCurrentVariantGem />
            </div>
            <TplCurrentVariantName font-mono absolute -left-50px class="md:left-40px" />
          </div>
        </div>

        <TplColorModeToggle pointer-events-initial />
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
