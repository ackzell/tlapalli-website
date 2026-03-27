<script setup lang="ts">
  import './styles/base.css';
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

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

  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { $anime } = useNuxtApp();
  const {
    resolvedMode,
    value: colorModeValue,
    preference: colorModePreference,
  } = useResolvedColorMode();


  // ─── Color mode badge sync ────────────────────────────────────────────────
  const osPrefersDark = ref<boolean | null>(null);
  const storedColorMode = ref<string | null>(null);


  if (import.meta.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');


    const syncBadgeState = () => {
      osPrefersDark.value = mediaQuery.matches;
      storedColorMode.value = localStorage.getItem('tpl-color-mode');
    };


    onMounted(() => {
      syncBadgeState();
      mediaQuery.addEventListener('change', syncBadgeState);
    });


    watch(
      [() => colorModePreference.value, () => colorModeValue.value, () => resolvedMode.value],
      syncBadgeState,
    );


    onBeforeUnmount(() => {
      mediaQuery.removeEventListener('change', syncBadgeState);
    });
  }


  // ─── Theme-derived classes ────────────────────────────────────────────────


  const surfaceClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `bg-${variant.value}-${mode}-ui-bg text-${variant.value}-${mode}-ui-foreground`;
  });


  const borderClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `border-${variant.value}-${mode}-ui-border`;
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


  /**
   * Modern browsers (Chrome 115+, Firefox 110+, Safari 18+) support
   * `animation-timeline: view()` natively — zero JS needed there.
   *
   * For older browsers (notably Safari < 18) we fall back to
   * useIntersectionObserver + CSS transitions.
   */
  const supportsViewTimeline = import.meta.client
    ? CSS.supports('animation-timeline', 'view()')
    : true; // SSR: assume support so we don't inject JS unnecessarily


  function setupScrollRevealFallback(targets: HTMLElement[]) {
    for (const el of targets) {
      el.classList.add('scroll-reveal-pending');


      const { stop } = useIntersectionObserver(
        el,
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) return;
          el.classList.remove('scroll-reveal-pending');
          el.classList.add('scroll-reveal-done');
          stop();
        },
        { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
      );
    }
  }


  async function setupScrollReveals() {
    if (!import.meta.client || supportsViewTimeline) return;


    await nextTick();
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-reveal]'));
    if (targets.length) setupScrollRevealFallback(targets);
  }


  // ─── Intro animation ──────────────────────────────────────────────────────


  const showContent = ref(false);
  const startMenuRotation = ref(false);


  async function onGemsRevealed() {
    // $anime({
    //   targets: 'nav',
    //   opacity: [0, 1],
    //   translateY: [-40, 0],
    //   duration: 800,
    //   easing: 'easeInOutCubic',
    //   complete() {
    //     showContent.value = true;
    //   },
    // });
  }


  async function onLogoIntroFinished() {
    // if (hasRunInitialReveal.value) return;
    // hasRunInitialReveal.value = true;
    // await nextTick();
    // if (!editorPreviewSectionRef.value) return;
    // $anime.set(editorPreviewSectionRef.value, { opacity: 0, translateY: 30 });
    // $anime({
    //   targets: editorPreviewSectionRef.value,
    //   opacity: [0, 1],
    //   translateY: [30, 0],
    //   duration: 620,
    //   easing: 'easeOutCubic',
    //   complete: setupScrollReveals,
    // });
  }


  async function onMenuPositioned() {
    await nextTick();


    $anime({
      targets: 'nav',
      opacity: [0, 1],
      translateY: [-40, 0],
      duration: 800,
      easing: 'easeInOutCubic',
      async complete() {
        await nextTick();
        showContent.value = true;

        $anime({
          targets: '.editor-preview',
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 620,
          easing: 'easeOutCubic',
          complete: setupScrollReveals,
        });

        useTimeoutFn(() => {
          startMenuRotation.value = true;
        }, 200);
      },
    });
  }
</script>

<template>
  <ColorScheme>
    <div
      :class="[surfaceClass, selectionClass]"
      :style="{ transition: 'background-color 260ms ease, color 260ms ease' }"
    >
      <TplNavBar opacity-0 />

      <div id="page" m-0 p-0 flex="~ col gap-2" relative>
        <TplMenu
          :start-menu-rotation="startMenuRotation"
          @gems-revealed="onGemsRevealed"
          @intro-finished="onLogoIntroFinished"
          @menu-positioned="onMenuPositioned"
        />

        <section
          data-scroll-reveal
          class="absolute left-0 top-53% w-5% activity-bar-preview-shell z-0"
        >
          <TplVariantModeImageSwap
            image-section="activityBar"
            alt="Preview of activity bar styling for the selected theme variant."
            sizes="sm:123px"
          />
        </section>

        <div
          flex
          flex-col
          items-center
          justify-center
          px-12
          gap-12
          :style="{ opacity: showContent ? 1 : 0 }"
          snap-start
        >
          <section px-8 pb-2 flex flex-col gap-12 w="full sm:60vw md:70vw" h-dvh lg:justify-evenly>
            <h2 data-scroll-reveal text-center p-0 pt-6 md:my-0 class="my-25%">
              Tlapalli means "color" in Náhuatl
            </h2>
            <TplEditorPreview />
          </section>

          <main snap-start snap-always pb-36 flex="~ col" gap-12>
            <section
              data-scroll-reveal
              p-4
              lg:border-none
              rounded-lg
              border-solid
              :class="borderClass"
              class="md:px-10%"
            >
              <h2>A monochromatic, distraction free theme</h2>
              <p>
                It will allow you to focus on the coding experience and reduce the amount of things
                trying to get your attention in the editor.
              </p>
              <p>
                I have personally felt less fatigued especially when using the dark modes on low
                light conditions.
              </p>
              <p>
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

            <div flex flex-col gap-12 lg:gap-8 lg:flex-row justify-center items-center>
              <section
                data-scroll-reveal
                p-4
                lg:border-none
                rounded-lg
                border-solid
                :class="borderClass"
                flex
                items-center
                justify-center
                gap-8
                flex-wrap
              >
                <TplAiChat />
              </section>
              <section
                data-scroll-reveal
                p-4
                lg:border-none
                rounded-lg
                border-solid
                :class="borderClass"
                flex
                items-center
                justify-center
                gap-8
                flex-wrap
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
      <footer snap-end data-scroll-reveal>footer here</footer>
    </div>
  </ColorScheme>
</template>

<style scoped>
  /* ── Scroll-triggered reveal — CSS-native path (Chrome 115+, FF 110+, Safari 18+) ── */
  @supports (animation-timeline: view()) {
    @keyframes scroll-reveal {
      from {
        opacity: 0;
        translate: 0 52px;
      }
      to {
        opacity: 1;
        translate: 0 0;
      }
    }

    [data-scroll-reveal] {
      animation: scroll-reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 30%;
    }
  }

  /* ── Scroll-triggered reveal — VueUse/IntersectionObserver fallback path ── */
  @supports not (animation-timeline: view()) {
    .scroll-reveal-pending {
      opacity: 0;
      translate: 0 52px;
      transition:
        opacity 650ms cubic-bezier(0.215, 0.61, 0.355, 1),
        translate 650ms cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .scroll-reveal-done {
      opacity: 1;
      translate: 0 0;
      transition:
        opacity 650ms cubic-bezier(0.215, 0.61, 0.355, 1),
        translate 650ms cubic-bezier(0.215, 0.61, 0.355, 1);
    }
  }

  /* ── Nav scroll shadow ── */
  .scroll-shadow-nav {
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
