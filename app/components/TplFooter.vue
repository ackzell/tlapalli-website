<script setup lang="ts">
  import { computed } from 'vue';

  import { useEditor } from '@/composables/useEditor';
  import { useLogoColor } from '@/composables/useLogoColor';
  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';
  import { useThemeVariant } from '@/composables/useThemeVariant';

  import type { BadgeKind, Distribution } from '@/models/editors';

  const { editor } = useEditor({ defaultEditor: 'vscode' });
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


  const marketplaceBadge = (kind: BadgeKind): { src: string; alt: string } => {
    const route = {
      version: 'version-short',
      rating: 'rating-short',
      installs: 'installs-short',
      downloads: 'downloads-short',
    }[kind];
    const labelColor = logoColor(variant.value, 'wbg').replace('#', '');
    const color = logoColor(variant.value, 'fg').replace('#', '');
    return {
      src: `https://vsmarketplacebadges.dev/${route}/ackzell.tlapalli.jpg?style=&labelColor=${labelColor}&color=${color}&label=${kind}`,
      alt: kind,
    };
  };


  const openVsxBadge = (kind: BadgeKind): { src: string; alt: string } => {
    const route = {
      version: 'v',
      downloads: 'dt',
      rating: 'rating',
      installs: 'installs',
    }[kind];
    const colorA = logoColor(variant.value, 'bg').replace('#', '');
    const colorB = logoColor(variant.value, 'mid').replace('#', '');
    return {
      src: `https://img.shields.io/open-vsx/${route}/ackzell/tlapalli?style=&colorA=${colorA}&colorB=${colorB}&label=${kind}`,
      alt: kind,
    };
  };


  const zedBadge = (): { src: string; alt: string } => {
    const params = new URLSearchParams();
    if (resolvedMode.value === 'Light') params.set('theme', 'light');


    // params.set('style', 'flat'); //flat	thin flat badge instead of the card
    // params.set('label', ''); //	override the title (card) or left label (flat)
    // params.set('desc', ''); //	replace the description with your own text; {{downloads}}, {{version}} (extension) and {{extensions}} (author) are substituted, and the first variable renders bold (max 48 chars)
    // params.set('desc=0', '0'); //0 / author=0	hide the description or author line; the card recenters
    // params.set('category', '1'); //1	show the extension category tag (Language, Theme, LSP, ...)
    // params.set('metric', 'downloads'); //version	version instead of downloads (extension only)
    // params.set('raw', '1'); //1	full count with commas (1,234) instead of 1.2k or 1.2M
    // params.set('color', ''); //	flat badge value color (default Zed brand blue)
    // params.set('labelColor', ''); //	flat badge label color, name or hex (default black; gray matches shields.io)
    // params.set('logo', '0'); //0	remove the logo (flat only); the default downloads label becomes zed so the badge stays identifiable


    return {
      src: `/badges/zed-extension.svg${params.size ? `?${params}` : ''}`,
      alt: 'Zed extension badge',
    };
  };


  const resolveBadge = (distribution: Distribution, kind: BadgeKind) => {
    if (distribution.badgeProvider === 'openvsx') return openVsxBadge(kind);
    return marketplaceBadge(kind);
  };


  const distributions = computed(() =>
    editor.value.distributions.map((distribution) => ({
      ...distribution,
      badges:
        distribution.badgeProvider === 'zed'
          ? [{ href: distribution.url, ...zedBadge() }]
          : distribution.badges.map((kind) => ({
              href: distribution.url,
              ...resolveBadge(distribution, kind),
            })),
    })),
  );
</script>

<template>
  <footer class="flex flex-col items-center gap-8 pb-150px lg:flex-row justify-evenly">
    <div v-for="distribution in distributions" :key="distribution.id">
      <div class="flex items-center justify-center gap-4">
        <span>{{ distribution.name }}</span>
        <a :href="distribution.url" :class="cta" target="_blank" rel="noopener noreferrer">GET</a>
      </div>
      <p
        v-if="distribution.badges.length"
        class="flex flex-wrap items-center justify-center gap-4 px-1"
      >
        <a
          v-for="badge in distribution.badges"
          :key="badge.alt"
          :href="badge.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="badge.src" :alt="badge.alt" />
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
