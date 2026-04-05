<script setup lang="ts">
  import { computed, nextTick } from 'vue';

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
  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';
  import { useThemeVariant } from '@/composables/useThemeVariant';
  if (import.meta.client) {
    console.log('[DEPLOY INFO]', {
      node: typeof process !== 'undefined' ? process.version : 'browser',
      version: pkg.version,
    });
  }


  // ...existing code...


  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const {
    resolvedMode,
    value: colorModeValue,
    preference: colorModePreference,
  } = useResolvedColorMode();


  useSchemaOrg([
    defineProduct({
      name: 'Tlapalli',
      category: 'Visual Studio Code Theme',
      description:
        'Tlah-PAH-lee means color in Náhuatl. Monochromatic theme with colored variations. Inspired by minerals found in Mexico.',
      image: 'https://tlapalli.ackzell.dev/images/og/og.png',
      offers: defineOffer({ price: 0, priceCurrency: 'USD' }),
      url: 'https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli',
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
    return `bg-${variant.value}-${mode}-ui-bg text-${variant.value}-${mode}-ui-foreground`;
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
  <ColorScheme tag="div" placeholder-tag="div">
    <div
      :class="[surfaceClass, selectionClass]"
      :style="{ transition: 'background-color 260ms ease, color 260ms ease' }"
    >
      <TplHeader ref="headerRef" class="opacity-0" />

      <div id="page" class="relative flex flex-col gap-2 p-0 m-0">
        <TplMenu
          :start-menu-rotation="startMenuRotation"
          @gems-revealed="onGemsRevealed"
          @intro-finished="onLogoIntroFinished"
          @menu-positioned="onMenuPositioned"
        />

        <section
          data-scroll-reveal
          data-reveal-role="image"
          data-reveal-direction="left"
          class="absolute left-0 top-53% w-5% activity-bar-preview-shell z-0"
        >
          <TplVariantModeImageSwap
            image-section="activityBar"
            alt="Preview of activity bar styling for the selected theme variant."
            sizes="sm:123px"
          />
        </section>

        <div
          class="flex flex-col items-center justify-center gap-12 px-12"
          :style="{ opacity: showContent ? 1 : 0 }"
        >
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

          <main class="flex flex-col gap-12 pb-36">
            <section class="p-4 rounded-lg md:px-10% lg:border-none" data-section-reveal>
              <h2 data-scroll-reveal data-reveal-role="heading" data-reveal-style="lift-soft">
                A monochromatic, distraction free theme
              </h2>
              <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="lift-soft">
                It will allow you to focus on the coding experience and reduce the amount of things
                trying to get your attention in the editor.
              </p>
              <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="lift-soft">
                I have personally felt less fatigued especially when using the dark modes on low
                light conditions.
              </p>
              <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="lift-soft">
                The light themes will provide a comfortable coding experience in well-lit
                environments.
              </p>
            </section>

            <TplFeatureSectionWrapper>
              <TplErrors />
            </TplFeatureSectionWrapper>

            <TplFeatureSectionWrapper>
              <TplVersionControl />
            </TplFeatureSectionWrapper>

            <div class="flex flex-col items-center justify-center gap-12 lg:gap-8 lg:flex-row">
              <section
                class="flex flex-wrap items-center justify-center gap-8 p-4 rounded-lg lg:border-none"
                data-section-reveal
              >
                <TplAiChat />
              </section>
              <section
                class="flex flex-wrap items-center justify-center gap-8 p-4 rounded-lg lg:border-none"
                data-section-reveal
              >
                <TplExtensions />
              </section>
            </div>

            <TplFeatureSectionWrapper>
              <TplEditorWidgets />
            </TplFeatureSectionWrapper>

            <TplFeatureSectionWrapper>
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
  </ColorScheme>
</template>

<style scoped>
  @media (prefers-reduced-motion: no-preference) {
    :deep([data-scroll-reveal][data-reveal-role='heading']:not([data-char-split-ready='true'])) {
      visibility: hidden;
    }

    :deep([data-scroll-reveal][data-reveal-role='paragraph']:not([data-word-split-ready='true'])) {
      visibility: hidden;
    }
  }

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
    max-width: 5%;
    -webkit-mask-image: linear-gradient(to top, transparent 10%, black 100%);
    mask-image: linear-gradient(to top, transparent 10%, black 100%);
  }
</style>
