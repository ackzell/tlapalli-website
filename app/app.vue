<script setup lang="ts">
  import { computed, nextTick, onMounted, watch } from 'vue';

  import './styles/base.css';
  import pkg from '../package.json';
  import TplFeatureSectionWrapper from './components/featureSections/TplFeatureSectionWrapper.vue';
  import { themePalette } from './models/variants';
  import TplAiChat from '@/components/featureSections/TplAiChat.vue';
  import TplEditorWidgets from '@/components/featureSections/TplEditorWidgets.vue';
  import TplErrors from '@/components/featureSections/TplErrors.vue';
  import TplExtensions from '@/components/featureSections/TplExtensions.vue';
  import TplStatusBar from '@/components/featureSections/TplStatusBar.vue';
  import TplVersionControl from '@/components/featureSections/TplVersionControl.vue';
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
  import TplShaderBackground from '@/components/TplShaderBackground.vue';
  import { useEditor } from '@/composables/useEditor';
  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';
  import { useThemeVariant } from '@/composables/useThemeVariant';
  import { useVariantPreload } from '@/composables/useVariantPreload';

  import type { SectionId } from './models/editors';
  if (import.meta.client) {
    console.log('[DEPLOY INFO]', {
      node: typeof process !== 'undefined' ? process.version : 'browser',
      version: pkg.version,
    });
  }


  // ...existing code...


  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const {
    ready: variantsReady,
    started: variantsStarted,
    percent: variantsPercent,
  } = useVariantPreload();
  const { editor } = useEditor({ defaultEditor: 'vscode' });
  const hasSection = (id: SectionId) => editor.value.sections.includes(id);
  const {
    resolvedMode,
    value: colorModeValue,
    preference: colorModePreference,
  } = useResolvedColorMode();


  type MarketplaceReview = {
    author: string;
    datePublished: string;
    rating: number;
    body: string;
  };


  type MarketplaceReviews = {
    reviewCount: number;
    ratingValue: number | null;
    reviews: MarketplaceReview[];
  };


  const { data: reviews } = await useFetch<MarketplaceReviews>('/api/reviews');


  const reviewCount = reviews.value?.reviewCount ?? 0;
  const ratingValue = reviews.value?.ratingValue ?? null;


  // Google requires real reviews for `aggregateRating` and `review`. Only emit
  // them when the marketplace has at least one rating, so the schema never
  // carries a fabricated value.
  const ratingBlock =
    ratingValue !== null && reviewCount > 0
      ? {
          aggregateRating: defineAggregateRating({
            ratingValue,
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          }),
          review: (reviews.value?.reviews ?? []).map((review) =>
            defineReview({
              author: review.author,
              datePublished: review.datePublished,
              reviewRating: { '@type': 'Rating', ratingValue: review.rating },
              reviewBody: review.body || undefined,
            }),
          ),
        }
      : {};


  useSchemaOrg([
    defineProduct({
      name: 'Tlapalli',
      category: 'Code Editor Theme',
      description:
        'Tlah-PAH-lee means color in Náhuatl. Monochromatic theme with colored variations. Inspired by minerals found in Mexico.',
      image: 'https://tlapalli.ackzell.dev/images/og.jpg',
      offers: defineOffer({ price: 0, priceCurrency: 'USD' }),
      url: 'https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli',
      ...ratingBlock,
      additionalProperty: editor.value.distributions.map((distribution) => ({
        '@type': 'PropertyValue' as const,
        name: distribution.name,
        value: distribution.url,
      })),
    }),
  ]);


  // ─── Color mode badge sync ────────────────────────────────────────────────
  const { osPrefersDark, storedColorMode } = useColorModeBadge(
    colorModePreference,
    colorModeValue,
    resolvedMode,
  );


  // ─── Theme-derived classes ────────────────────────────────────────────────


  const surfaceClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `text-${variant.value}-${mode}-ui-foreground`;
  });


  const LOGO_SHADES = ['bg', 'fg', 'mid', 'wbg', 'wb'] as const;


  useHead(() => {
    const lightBg = themePalette[variant.value].light.ui.bg;
    const darkBg = themePalette[variant.value].dark.ui.bg;

    // Paint the surface color from CSS so the server HTML is correct before
    // hydration. Without this the server only knows the light theme, and dark
    // mode users would see light text until Vue takes over.
    const surfaceColors = (selector: string, mode: 'light' | 'dark') =>
      Object.entries(themePalette)
        .map(
          ([name, palette]) =>
            `${selector}[data-variant="${name}"] [data-tpl-surface] { color: ${palette[mode].ui.foreground}; }`,
        )
        .join('\n');

    // Same idea for the logo. Each SVG fill reads a custom property, so the
    // browser paints the right shade on the first frame.
    const logoVariables = (mode: 'light' | 'dark') =>
      Object.entries(themePalette)
        .map(([name, palette]) =>
          LOGO_SHADES.map(
            (shade) => `--tpl-logo-${name}-${shade}: ${palette[mode].logo[shade]};`,
          ).join('\n'),
        )
        .join('\n');

    return {
      style: [
        {
          key: 'tpl-body-background',
          innerHTML: [
            // Light is the server default (no class on <html>).
            `html { background-color: ${lightBg}; }`,
            `body { background-color: ${lightBg}; }`,
            surfaceColors('html', 'light'),
            `html {\n${logoVariables('light')}\n}`,
            // Dark via the `dark` class, which the color-mode inline script
            // adds. This works even when that script is deferred, as long as a
            // real browser runs it.
            `html.dark { background-color: ${darkBg}; }`,
            `html.dark body { background-color: ${darkBg}; }`,
            surfaceColors('html.dark', 'dark'),
            `html.dark {\n${logoVariables('dark')}\n}`,
            // Dark via the system preference before any script runs. This is a
            // pure-CSS path, so a system-dark visitor never sees a light flash
            // even if Cloudflare defers the color-mode script. The `:not(.light)`
            // guard lets an explicit light preference still win.
            `@media (prefers-color-scheme: dark) {`,
            `html:not(.light) { background-color: ${darkBg}; }`,
            `html:not(.light) body { background-color: ${darkBg}; }`,
            surfaceColors('html:not(.light)', 'dark'),
            `html:not(.light) {\n${logoVariables('dark')}\n}`,
            `}`,
          ].join('\n'),
        },
      ],
    };
  });


  // The `tpl-color-ready` CSS gate hides mode-dependent images until hydration
  // has applied the resolved mode to every `src`, so a light server image can
  // never flash in dark mode.
  onMounted(() => {
    document.documentElement.classList.add('tpl-color-ready');
  });


  const currentBorderColor = computed(() => {
    const mode = resolvedMode.value.toLowerCase() as 'dark' | 'light';
    return themePalette[variant.value][mode].ui.border;
  });


  const selectionClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `selection:bg-${variant.value}-${mode}-logo-fg selection:text-${variant.value}-${mode}-logo-bg`;
  });


  const shadowColor = computed(() => {
    const mode = resolvedMode.value.toLowerCase() as 'dark' | 'light';
    return themePalette[variant.value][mode].ui.shadow;
  });


  const boxShadow = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return mode === 'dark'
      ? `0 12px 12px color-mix(in srgb, ${shadowColor.value} 90%, transparent)`
      : `0 6px 12px color-mix(in srgb, ${shadowColor.value} 45%, transparent)`;
  });


  // ─── Scroll reveals ───────────────────────────────────────────────────────
  const {
    supportsViewTimeline,
    prefersReducedMotion,
    enableImageReveals,
    enableParagraphReveals,
    enableGenericReveals,
    setupSectionRevealStages,
    collectScrollRevealTargets,
    setupScrollRevealFallback,
  } = useScrollReveal();


  const { canUseTextSplitReveal, setupHeadingCharacterReveal, setupParagraphWordReveal } =
    useTextSplitReveal(resolvedMode);


  async function setupScrollReveals() {
    if (!import.meta.client) return;


    await nextTick();
    if (prefersReducedMotion) return;


    setupSectionRevealStages();
    if (canUseTextSplitReveal) {
      setupHeadingCharacterReveal();
      setupParagraphWordReveal();
    }


    if (supportsViewTimeline) return;


    const targets = collectScrollRevealTargets().filter(({ role }) => {
      if (role === 'heading') return false;
      if (role === 'image') return enableImageReveals;
      if (role === 'paragraph') return enableParagraphReveals;
      return enableGenericReveals;
    });
    if (targets.length) setupScrollRevealFallback(targets);
  }


  watch(
    () => editor.value.id,
    async () => {
      const previousScrollY = import.meta.client ? window.scrollY : 0;
      await setupScrollReveals();
      if (!import.meta.client) return;
      const contentHeight =
        document.getElementById('__nuxt')?.offsetHeight || document.body.offsetHeight || 0;
      const maxScroll = Math.max(0, contentHeight - window.innerHeight);
      if (previousScrollY > maxScroll) {
        window.scrollTo(0, 0);
      }
    },
  );


  // ─── Intro animation ──────────────────────────────────────────────────────
  const {
    showContent,
    startMenuRotation,
    headerRef,
    editorPreviewRef,
    onGemsRevealed,
    onLogoIntroFinished,
    onMenuPositioned,
  } = useIntroAnimation(variant, setupScrollReveals);
</script>

<template>
  <div
    data-tpl-surface
    :class="['relative', surfaceClass, selectionClass]"
    :style="{ transition: 'color 260ms ease' }"
  >
    <TplShaderBackground :revealed="showContent" />
    <TplHeader ref="headerRef" class="opacity-0" />

    <div id="page" class="relative flex flex-col gap-2 p-0 m-0">
      <TplMenu
        :start-menu-rotation="startMenuRotation"
        :variants-ready="variantsReady"
        :variants-started="variantsStarted"
        :variants-percent="variantsPercent"
        @gems-revealed="onGemsRevealed"
        @intro-finished="onLogoIntroFinished"
        @menu-positioned="onMenuPositioned"
      />

      <section
        v-if="hasSection('activityBar')"
        data-scroll-reveal
        data-reveal-role="image"
        data-reveal-direction="left"
        data-reveal-size="tall"
        class="absolute left-0 top-73% w-16 activity-bar-preview-shell z-0"
      >
        <TplVariantModeImageSwap
          image-section="activityBar"
          alt="Preview of activity bar styling for the selected theme variant."
          sizes="sm:123px"
          :expandable="false"
        />
      </section>

      <div class="flex flex-col items-center justify-center gap-12 px-12" data-intro-content>
        <section
          class="flex flex-col w-full gap-12 px-8 pb-2 sm:w-60vw md:w-70vw lg:justify-evenly"
        >
          <h2 class="transition-opacity transition-discrete text-center p-0 pt-6 my-25% md:my-0">
            <a
              href="https://nahuatl.wired-humanities.org/content/tlapalli"
              target="_blank"
              rel="noopener noreferrer"
              >tlah-PAH-lee</a
            >
            means "color" in
            <a
              href="https://en.wikipedia.org/wiki/Nahuatl"
              target="_blank"
              rel="noopener noreferrer"
              >N&aacute;huatl</a
            >
          </h2>
          <div ref="editorPreviewRef">
            <TplEditorPreview />
          </div>
        </section>

        <main :key="editor.id" class="flex flex-col gap-12 pb-36">
          <section
            class="p-4 rounded-lg md:px-10% lg:border-none mx-auto max-w-3xl text-center"
            data-section-reveal
          >
            <h2 data-scroll-reveal data-reveal-role="heading" data-reveal-style="lift-soft">
              A monochromatic, distraction free theme
            </h2>
            <p
              class="mx-auto"
              data-scroll-reveal
              data-reveal-role="paragraph"
              data-reveal-style="lift-soft"
            >
              It will allow you to focus on the coding experience and reduce the amount of things
              trying to get your attention in the editor.
            </p>
            <p
              class="mx-auto"
              data-scroll-reveal
              data-reveal-role="paragraph"
              data-reveal-style="lift-soft"
            >
              I have personally felt less fatigued especially when using the dark modes on low light
              conditions.
            </p>
            <p
              class="mx-auto"
              data-scroll-reveal
              data-reveal-role="paragraph"
              data-reveal-style="lift-soft"
            >
              The light themes will provide a comfortable coding experience in well-lit
              environments.
            </p>
          </section>

          <TplFeatureSectionWrapper v-if="hasSection('errors')">
            <TplErrors />
          </TplFeatureSectionWrapper>

          <TplFeatureSectionWrapper v-if="hasSection('versionControl')">
            <TplVersionControl />
          </TplFeatureSectionWrapper>

          <div
            v-if="hasSection('aiChat') || hasSection('extensions')"
            class="flex flex-col items-center justify-center gap-12 lg:gap-8 lg:flex-row"
          >
            <section
              v-if="hasSection('aiChat')"
              class="flex flex-wrap items-center justify-center gap-8 p-4 rounded-lg lg:border-none"
              data-section-reveal
            >
              <TplAiChat />
            </section>
            <section
              v-if="hasSection('extensions')"
              class="flex flex-wrap items-center justify-center gap-8 p-4 rounded-lg lg:border-none"
              data-section-reveal
            >
              <TplExtensions />
            </section>
          </div>

          <TplFeatureSectionWrapper v-if="hasSection('editorWidgets')">
            <TplEditorWidgets />
          </TplFeatureSectionWrapper>

          <TplFeatureSectionWrapper v-if="hasSection('statusBar')">
            <TplStatusBar />
          </TplFeatureSectionWrapper>
        </main>
      </div>
    </div>
    <TplFooter
      class="scroll-reveal"
      data-scroll-reveal
      data-reveal-role="footer"
      data-reveal-style="lift-soft"
    />
  </div>
</template>

<style scoped>
  :deep(.scroll-heading-char) {
    display: inline;
    will-change: opacity, filter;
  }

  :deep(.scroll-paragraph-word) {
    display: inline-block;
    will-change: opacity, transform, filter;
  }

  @media (prefers-reduced-motion: reduce) {
    :deep([data-scroll-reveal]) {
      animation: none !important;
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
      visibility: visible !important;
    }
  }

  @media (max-width: 1023px) and (prefers-reduced-motion: no-preference) {
    :deep([data-section-reveal]) {
      position: relative;
    }

    :deep([data-section-reveal]::before) {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      clip-path: polygon(0 0, 0 0, 0 0, 0 0, 0 0, 0 0);
      border: 1px solid v-bind(currentBorderColor);
      border-radius: inherit;
    }
  }

  @supports (animation-timeline: view()) {
    @media (max-width: 1023px) and (prefers-reduced-motion: no-preference) {
      :deep([data-section-reveal]:not(.section-reveal-fallback)::before) {
        animation: section-reveal-clip linear both;
        animation-timeline: view();
        animation-range: entry 50% cover 70%;
        will-change: clip-path;
      }

      :deep([data-section-reveal].section-reveal-fallback::before) {
        animation: none;
      }
    }
  }

  @supports not (animation-timeline: view()) {
    @media (max-width: 1023px) and (prefers-reduced-motion: no-preference) {
      :deep([data-section-reveal]::before) {
        clip-path: polygon(0 0, 100% 0, 100% 2px, 2px 2px, 2px 100%, 0 100%);
      }
    }
  }

  @media (max-width: 1023px) and (prefers-reduced-motion: no-preference) {
    :deep([data-section-reveal].section-reveal-fallback.section-reveal-pending::before) {
      clip-path: polygon(0 0, 0 0, 0 0, 0 0, 0 0, 0 0);
    }

    :deep([data-section-reveal].section-reveal-fallback.section-reveal-done::before) {
      animation: section-reveal-clip 780ms cubic-bezier(0.215, 0.61, 0.355, 1) both;
      will-change: clip-path;
    }
  }

  @keyframes section-reveal-clip {
    0% {
      clip-path: polygon(0 0, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    52% {
      clip-path: polygon(0 0, 100% 0, 100% 2px, 2px 2px, 2px 100%, 0 100%);
    }
    100% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 100%, 0 0);
    }
  }

  /* ── Scroll-triggered reveal — CSS-native path (Chrome 115+, FF 110+, Safari 18+) ── */
  @supports (animation-timeline: view()) {
    @keyframes scroll-reveal-soft-rise {
      from {
        opacity: 0;
        transform: translate3d(var(--scroll-reveal-x, 0), var(--scroll-reveal-y, 18px), 0)
          scale(var(--scroll-reveal-scale, 0.985)) rotate(var(--scroll-reveal-rotate, 0deg));
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
      }
    }

    :deep([data-scroll-reveal]) {
      animation: scroll-reveal-soft-rise linear both;
      animation-timeline: view();
      animation-range: entry 80% contain 60%;
    }

    :deep([data-scroll-reveal][data-reveal-role='heading']) {
      --scroll-reveal-y: 0;
      --scroll-reveal-scale: 1;
      --scroll-reveal-x: 0;
      --scroll-reveal-rotate: 0deg;
      animation-range: entry 82% contain 72%;
    }

    :deep([data-scroll-reveal][data-reveal-role='paragraph']) {
      --scroll-reveal-y: 16px;
      --scroll-reveal-scale: 0.985;
      animation-range: entry 86% contain 58%;
    }

    :deep([data-scroll-reveal][data-reveal-role='image']) {
      --scroll-reveal-x: 18px;
      --scroll-reveal-y: 0;
      --scroll-reveal-scale: 0.965;
      animation-range: entry 95% contain 35%;
    }

    :deep([data-scroll-reveal][data-reveal-role='image'][data-reveal-direction='left']) {
      --scroll-reveal-x: -36px;
      --scroll-reveal-y: 0;
    }

    :deep([data-scroll-reveal][data-reveal-role='image'][data-reveal-direction='right']) {
      --scroll-reveal-x: 36px;
      --scroll-reveal-y: 0;
    }

    :deep([data-scroll-reveal][data-reveal-role='image'][data-reveal-direction='up']) {
      --scroll-reveal-x: 0;
      --scroll-reveal-y: -36px;
    }

    :deep([data-scroll-reveal][data-reveal-role='image'][data-reveal-direction='down']) {
      --scroll-reveal-x: 0;
      --scroll-reveal-y: 36px;
    }

    :deep([data-scroll-reveal][data-reveal-role='image'][data-reveal-size='tall']) {
      animation-range: entry 40% cover 35%;
    }

    :deep(
      [data-scroll-reveal][data-reveal-role='image'][data-reveal-size='tall'].activity-bar-preview-shell
    ) {
      animation-range: entry 15% cover 40%;
    }

    :deep([data-scroll-reveal][data-reveal-role='footer']) {
      --scroll-reveal-y: 16px;
      --scroll-reveal-scale: 0.985;
      animation-range: entry 16% contain 20%;
    }

    :deep([data-scroll-reveal][data-reveal-role='generic']) {
      --scroll-reveal-y: 12px;
      --scroll-reveal-scale: 0.99;
      animation-range: entry 84% contain 55%;
    }

    :deep([data-scroll-reveal][data-reveal-style='lift-soft']:not([data-reveal-role='heading'])) {
      --scroll-reveal-y: 20px;
      --scroll-reveal-scale: 0.978;
    }

    :deep([data-scroll-reveal][data-reveal-style='drift-left']) {
      --scroll-reveal-x: -36px;
      --scroll-reveal-y: 6px;
      --scroll-reveal-scale: 0.97;
    }

    :deep([data-scroll-reveal][data-reveal-style='drift-right']) {
      --scroll-reveal-x: 36px;
      --scroll-reveal-y: 6px;
      --scroll-reveal-scale: 0.97;
    }

    :deep([data-scroll-reveal][data-reveal-style='float-up']) {
      --scroll-reveal-y: 14px;
      --scroll-reveal-scale: 0.985;
    }

    :deep([data-scroll-reveal][data-reveal-style='snap-up']) {
      --scroll-reveal-y: 22px;
      --scroll-reveal-scale: 0.955;
      --scroll-reveal-duration: 560ms;
    }

    :deep([data-scroll-reveal][data-reveal-style='tilt-in']) {
      --scroll-reveal-x: 12px;
      --scroll-reveal-y: 10px;
      --scroll-reveal-scale: 0.97;
      --scroll-reveal-rotate: -1.8deg;
    }

    :deep([data-scroll-reveal][data-reveal-style='glide-left']) {
      --scroll-reveal-x: -18px;
      --scroll-reveal-y: 0;
      --scroll-reveal-scale: 0.975;
    }

    :deep([data-scroll-reveal][data-reveal-style='crisp']) {
      --scroll-reveal-y: 8px;
      --scroll-reveal-scale: 0.995;
      --scroll-reveal-duration: 520ms;
    }
  }

  /* ── Scroll-triggered reveal — VueUse/IntersectionObserver fallback path ── */
  @supports not (animation-timeline: view()) {
    :deep(.scroll-reveal-pending) {
      opacity: 0;
      transform: translate3d(var(--scroll-reveal-x, 0), var(--scroll-reveal-y, 18px), 0)
        scale(var(--scroll-reveal-scale, 0.985)) rotate(var(--scroll-reveal-rotate, 0deg));
      transition:
        opacity var(--scroll-reveal-duration, 620ms) cubic-bezier(0.215, 0.61, 0.355, 1),
        transform var(--scroll-reveal-duration, 700ms) cubic-bezier(0.215, 0.61, 0.355, 1);
      transition-delay: var(--scroll-reveal-delay, 0ms);
    }

    :deep(.scroll-reveal-pending.scroll-reveal-role-heading) {
      --scroll-reveal-y: 0;
      --scroll-reveal-scale: 1;
      --scroll-reveal-x: 0;
      --scroll-reveal-rotate: 0deg;
    }

    :deep(.scroll-reveal-pending.scroll-reveal-role-paragraph) {
      --scroll-reveal-y: 16px;
      --scroll-reveal-scale: 0.985;
    }

    :deep(.scroll-reveal-pending.scroll-reveal-role-image) {
      --scroll-reveal-x: 18px;
      --scroll-reveal-y: 0;
      --scroll-reveal-scale: 0.965;
    }

    :deep(.scroll-reveal-pending.scroll-reveal-role-image[data-reveal-direction='left']) {
      --scroll-reveal-x: -36px;
      --scroll-reveal-y: 0;
    }

    :deep(.scroll-reveal-pending.scroll-reveal-role-image[data-reveal-direction='right']) {
      --scroll-reveal-x: 36px;
      --scroll-reveal-y: 0;
    }

    :deep(.scroll-reveal-pending.scroll-reveal-role-image[data-reveal-direction='up']) {
      --scroll-reveal-x: 0;
      --scroll-reveal-y: -36px;
    }

    :deep(.scroll-reveal-pending.scroll-reveal-role-image[data-reveal-direction='down']) {
      --scroll-reveal-x: 0;
      --scroll-reveal-y: 36px;
    }

    :deep(.scroll-reveal-pending.scroll-reveal-role-generic) {
      --scroll-reveal-y: 12px;
      --scroll-reveal-scale: 0.99;
    }

    :deep(.scroll-reveal-pending[data-reveal-style='lift-soft']:not([data-reveal-role='heading'])) {
      --scroll-reveal-y: 20px;
      --scroll-reveal-scale: 0.978;
    }

    :deep(.scroll-reveal-pending[data-reveal-style='drift-left']) {
      --scroll-reveal-x: -22px;
      --scroll-reveal-y: 6px;
      --scroll-reveal-scale: 0.97;
    }

    :deep(.scroll-reveal-pending[data-reveal-style='drift-right']) {
      --scroll-reveal-x: 22px;
      --scroll-reveal-y: 6px;
      --scroll-reveal-scale: 0.97;
    }

    :deep(.scroll-reveal-pending[data-reveal-style='float-up']) {
      --scroll-reveal-y: 14px;
      --scroll-reveal-scale: 0.985;
    }

    :deep(.scroll-reveal-pending[data-reveal-style='snap-up']) {
      --scroll-reveal-y: 22px;
      --scroll-reveal-scale: 0.955;
      --scroll-reveal-duration: 560ms;
    }

    :deep(.scroll-reveal-pending[data-reveal-style='tilt-in']) {
      --scroll-reveal-x: 12px;
      --scroll-reveal-y: 10px;
      --scroll-reveal-scale: 0.97;
      --scroll-reveal-rotate: -1.8deg;
    }

    :deep(.scroll-reveal-pending[data-reveal-style='glide-left']) {
      --scroll-reveal-x: -18px;
      --scroll-reveal-y: 0;
      --scroll-reveal-scale: 0.975;
    }

    :deep(.scroll-reveal-pending[data-reveal-style='crisp']) {
      --scroll-reveal-y: 8px;
      --scroll-reveal-scale: 0.995;
      --scroll-reveal-duration: 520ms;
    }

    :deep(.scroll-reveal-done) {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
      transition:
        opacity var(--scroll-reveal-duration, 620ms) cubic-bezier(0.215, 0.61, 0.355, 1),
        transform var(--scroll-reveal-duration, 700ms) cubic-bezier(0.215, 0.61, 0.355, 1);
      transition-delay: var(--scroll-reveal-delay, 0ms);
    }
  }

  .scroll-shadow-header {
    animation: scroll-shadow linear forwards;
    animation-timeline: scroll();
    animation-range: 0% 1vh;
  }

  @keyframes scroll-shadow {
    from {
      box-shadow: none;
    }
    to {
      box-shadow: v-bind(boxShadow);
    }
  }

  /* ── Activity bar fade mask ── */
  .activity-bar-preview-shell {
    max-width: 4rem;
    -webkit-mask-image: linear-gradient(to top, transparent 10%, black 100%);
    mask-image: linear-gradient(to top, transparent 10%, black 100%);
  }
</style>
