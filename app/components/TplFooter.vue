<script setup lang="ts">
  import { useLogoColor } from '@/composables/useLogoColor';
  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';
  import { useThemeVariant } from '@/composables/useThemeVariant';

  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();
  const { logoColor } = useLogoColor();


  const cta = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return [
      `decoration-none px-4 py-2 rounded-md`,
      `bg-${variant.value}-${mode}-ui-widgetBg`,
      `text-${variant.value}-${mode}-ui-widgetText`,
      `hover:bg-${variant.value}-${mode}-ui-widgetHoverBg`,
      `hover:text-${variant.value}-${mode}-ui-widgetHoverForeground`,
    ].join(' ');
  });
</script>

<template>
  <footer class="flex flex-col items-center gap-8 pb-150px lg:flex-row justify-evenly">
    <div>
      <div class="flex items-center justify-center gap-4">
        <span>VSCode Marketplace</span>
        <a
          href="https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli"
          :class="cta"
          target="_blank"
          rel="noopener noreferrer"
          >GET</a
        >
      </div>
      <p class="flex flex-wrap items-center justify-center gap-4">
        <a href="https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli">
          <img
            :src="`https://vsmarketplacebadges.dev/version-short/ackzell.tlapalli.jpg?style=&colorA=${logoColor(variant, 'wbg').replace('#', '')}&colorB=${logoColor(variant, 'fg').replace('#', '')}&label=version`"
            alt="Version"
          />
        </a>
        <a href="https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli">
          <img
            :src="`https://vsmarketplacebadges.dev/rating-short/ackzell.tlapalli.jpg?style=&colorA=${logoColor(variant, 'wbg').replace('#', '')}&colorB=${logoColor(variant, 'fg').replace('#', '')}&label=rating`"
            alt="Rating"
          />
        </a>
        <a href="https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli">
          <img
            :src="`https://vsmarketplacebadges.dev/installs-short/ackzell.tlapalli.jpg?style=&colorA=${logoColor(variant, 'wbg').replace('#', '')}&colorB=${logoColor(variant, 'fg').replace('#', '')}&label=installs`"
            alt="Installs"
          />
        </a>
        <a href="https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli">
          <img
            :src="`https://vsmarketplacebadges.dev/downloads-short/ackzell.tlapalli.jpg?style=&colorA=${logoColor(variant, 'wbg').replace('#', '')}&colorB=${logoColor(variant, 'fg').replace('#', '')}&label=downloads`"
            alt="Downloads"
          />
        </a>
      </p>
    </div>

    <div>
      <div class="flex items-center justify-center gap-4">
        <span>Open VSX</span>
        <a
          href="https://open-vsx.org/extension/ackzell/tlapalli"
          :class="cta"
          target="_blank"
          rel="noopener noreferrer"
          >GET</a
        >
      </div>
      <p class="flex flex-wrap items-center justify-center gap-4">
        <a href="https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli">
          <img
            :src="`https://img.shields.io/open-vsx/v/ackzell/tlapalli?style=&colorA=${logoColor(variant, 'bg').replace('#', '')}&colorB=${logoColor(variant, 'mid').replace('#', '')}&label=version`"
            alt="Version"
          />
        </a>
        <a href="https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli">
          <img
            :src="`https://img.shields.io/open-vsx/dt/ackzell/tlapalli?style=&colorA=${logoColor(variant, 'bg').replace('#', '')}&colorB=${logoColor(variant, 'mid').replace('#', '')}&label=downloads`"
            alt="Downloads"
          />
        </a>
        <a href="https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli">
          <img
            :src="`https://img.shields.io/open-vsx/rating/ackzell/tlapalli?style=&colorA=${logoColor(variant, 'bg').replace('#', '')}&colorB=${logoColor(variant, 'mid').replace('#', '')}&label=rating`"
            alt="Rating"
          />
        </a>
      </p>
    </div>

    <!-- github icon link -->
    <div class="flex items-center justify-center gap-8 px-6 pt-12 text-sm text-center md:pt-0">
      <a href="https://github.com/ackzell/tlapalli" target="_blank" rel="noopener noreferrer">
        <GithubIcon class="inline-block w-7 h-7" />
      </a>

      <a
        href="https://github.com/ackzell/tlapalli-vscode-theme/blob/main/LICENSE.md"
        target="_blank"
        rel="noopener noreferrer"
        >MIT License</a
      >

      <span>
        Made by
        <a href="https://ackzell.dev" target="_blank" rel="noopener noreferrer">ackzell</a>
      </span>

      <!-- github sponsor badge -->
      <a href="https://github.com/sponsors/ackzell" target="_blank" rel="noopener noreferrer">
        <img
          src="https://img.shields.io/badge/sponsor-ackzell-ff69b4?style=flat&logo=github&logoColor=white"
          alt="Sponsor on GitHub"
        />
      </a>
    </div>
  </footer>
</template>

<style scoped></style>
