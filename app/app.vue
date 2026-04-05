<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    type ComponentPublicInstance,
  } from 'vue';

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
  const { $anime } = useNuxtApp();
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


  type ScrollRevealRole = 'heading' | 'paragraph' | 'image' | 'generic';


  type ScrollRevealTarget = {
    el: HTMLElement;
    role: ScrollRevealRole;
    delayMs: number;
  };


  const headingRevealState = new WeakMap<HTMLElement, 'hidden' | 'visible'>();
  const headingRevealAnimations = new WeakMap<HTMLElement, { pause: () => void }>();
  const headingRevealStops: Array<() => void> = [];
  const paragraphRevealState = new WeakMap<HTMLElement, 'hidden' | 'visible'>();
  const paragraphRevealAnimations = new WeakMap<HTMLElement, { pause: () => void }>();
  const paragraphRevealStops: Array<() => void> = [];
  const sectionRevealStops: Array<() => void> = [];
  const prefersReducedMotion = import.meta.client
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  const canUseTextSplitReveal = import.meta.client;
  const useSectionRevealFallback = import.meta.client
    ? !supportsViewTimeline || window.navigator.userAgent.toLowerCase().includes('firefox')
    : false;
  const enableImageReveals = true;
  const enableParagraphReveals = true;
  const enableGenericReveals = false;


  function isElementInRevealZone(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;
  }


  function setupSectionRevealStages() {
    if (prefersReducedMotion || !useSectionRevealFallback) return;


    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-reveal]'));
    for (const section of sections) {
      if (section.dataset.sectionRevealObserverAttached === 'true') continue;
      section.dataset.sectionRevealObserverAttached = 'true';
      section.classList.add('section-reveal-fallback', 'section-reveal-pending');


      const revealSection = () => {
        section.classList.remove('section-reveal-pending');
        section.classList.add('section-reveal-done');
      };


      const { stop } = useIntersectionObserver(
        section,
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) return;
          revealSection();
          stop();
        },
        {
          threshold: 0.38,
          rootMargin: '0px 0px -18% 0px',
        },
      );


      if (isElementInRevealZone(section)) {
        revealSection();
        stop();
      } else {
        sectionRevealStops.push(stop);
      }
    }
  }


  function getRevealRole(el: HTMLElement): ScrollRevealRole {
    const roleFromData = el.dataset.revealRole;


    if (roleFromData === 'heading') return 'heading';
    if (roleFromData === 'paragraph') return 'paragraph';
    if (roleFromData === 'image') return 'image';
    if (roleFromData === 'generic') return 'generic';


    if (el.matches('h1, h2, h3, h4, h5, h6')) return 'heading';
    if (el.matches('p')) return 'paragraph';
    if (
      el.matches('img, picture, .preview-shell, .errors-preview-shell, .activity-bar-preview-shell')
    ) {
      return 'image';
    }


    return 'generic';
  }


  function getRevealDelay(role: ScrollRevealRole, roleIndex: number) {
    if (role === 'heading') return roleIndex * 40;
    if (role === 'paragraph') return 80 + roleIndex * 60;
    if (role === 'image') return 160 + roleIndex * 70;
    return 100 + roleIndex * 50;
  }


  function collectScrollRevealTargets() {
    const roleIndexMap: Record<ScrollRevealRole, number> = {
      heading: 0,
      paragraph: 0,
      image: 0,
      generic: 0,
    };


    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-reveal]'));
    return targets.map((el) => {
      const role = getRevealRole(el);
      const roleIndex = roleIndexMap[role];
      roleIndexMap[role] += 1;

      return {
        el,
        role,
        delayMs: getRevealDelay(role, roleIndex),
      };
    });
  }


  function setupScrollRevealFallback(targets: ScrollRevealTarget[]) {
    for (const target of targets) {
      const { el, role, delayMs } = target;
      if (role === 'image' && !enableImageReveals) continue;
      if (role === 'paragraph' && !enableParagraphReveals) continue;
      if (role === 'generic' && !enableGenericReveals) continue;


      const isTallImage = role === 'image' && el.dataset.revealSize === 'tall';
      const imageThreshold = isTallImage ? 0.18 : 0.62;
      const imageRootMargin = isTallImage ? '0px 0px -8% 0px' : '0px 0px -34% 0px';


      el.classList.add('scroll-reveal-pending');
      el.classList.add(`scroll-reveal-role-${role}`);
      el.style.setProperty('--scroll-reveal-delay', `${delayMs}ms`);


      const { stop } = useIntersectionObserver(
        el,
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) return;

          if (isTallImage && entry.intersectionRatio <= 0 && !isElementInRevealZone(el)) {
            return;
          }

          el.classList.remove('scroll-reveal-pending');
          el.classList.add('scroll-reveal-done');
          stop();
        },
        {
          threshold: role === 'image' ? imageThreshold : 0.52,
          rootMargin: role === 'image' ? imageRootMargin : '0px 0px -28% 0px',
        },
      );


      if (isTallImage && isElementInRevealZone(el)) {
        el.classList.remove('scroll-reveal-pending');
        el.classList.add('scroll-reveal-done');
        stop();
      }
    }
  }


  function splitHeadingIntoChars(heading: HTMLElement) {
    if (heading.dataset.charSplitReady === 'true') {
      return Array.from(heading.querySelectorAll<HTMLElement>('.scroll-heading-char'));
    }


    const rawText = heading.textContent ?? '';
    if (!rawText.trim()) return [];


    heading.dataset.charSplitReady = 'true';
    heading.setAttribute('aria-label', rawText);


    const fragment = document.createDocumentFragment();
    for (const char of Array.from(rawText)) {
      if (char === ' ') {
        fragment.append(document.createTextNode(' '));
        continue;
      }


      const span = document.createElement('span');
      span.className = 'scroll-heading-char';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = char;
      span.style.opacity = '0';
      fragment.append(span);
    }


    heading.textContent = '';
    heading.append(fragment);


    return Array.from(heading.querySelectorAll<HTMLElement>('.scroll-heading-char'));
  }


  function splitParagraphIntoWords(paragraph: HTMLElement) {
    if (paragraph.dataset.wordSplitReady === 'true') {
      return Array.from(paragraph.querySelectorAll<HTMLElement>('.scroll-paragraph-word'));
    }


    const rawText = paragraph.textContent ?? '';
    if (!rawText.trim()) return [];


    paragraph.dataset.wordSplitReady = 'true';
    paragraph.setAttribute('aria-label', rawText);


    const sourceNodes = Array.from(paragraph.childNodes);
    const fragment = document.createDocumentFragment();


    // Helper to split text into word spans, optionally inheriting classes from parent
    const splitTextNodeIntoWords = (text: string, inheritedClasses: string[] = []) => {
      const tokens = text.split(/(\s+)/);
      const output = document.createDocumentFragment();
      for (const token of tokens) {
        if (!token) continue;
        if (/^\s+$/.test(token)) {
          output.append(document.createTextNode(token));
          continue;
        }
        const span = document.createElement('span');
        span.className = ['scroll-paragraph-word', ...inheritedClasses].join(' ');
        span.setAttribute('aria-hidden', 'true');
        span.textContent = token;
        span.style.opacity = '0';
        output.append(span);
      }
      return output;
    };


    // Recursively transform nodes, passing down classes from element nodes
    const transformNode = (node: Node, inheritedClasses: string[] = []) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return splitTextNodeIntoWords(node.textContent ?? '', inheritedClasses);
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        // Merge parent classes with this element's classes
        const mergedClasses = [...inheritedClasses, ...Array.from(element.classList)];
        const clone = element.cloneNode(false) as HTMLElement;
        for (const child of Array.from(element.childNodes)) {
          clone.append(transformNode(child, mergedClasses));
        }
        return clone;
      }
      return node.cloneNode(true);
    };


    for (const node of sourceNodes) {
      fragment.append(transformNode(node));
    }


    paragraph.replaceChildren(fragment);


    return Array.from(paragraph.querySelectorAll<HTMLElement>('.scroll-paragraph-word'));
  }


  function runParagraphWordReveal(paragraph: HTMLElement, direction: 'in' | 'out') {
    const words = splitParagraphIntoWords(paragraph);
    if (!words.length) return;


    paragraphRevealAnimations.get(paragraph)?.pause();


    const isDarkMode = resolvedMode.value.toLowerCase() === 'dark';
    const hiddenBrightness = isDarkMode ? 0.86 : 1.14;
    const fromBrightness = direction === 'in' ? hiddenBrightness : 1;
    const toBrightness = direction === 'in' ? 1 : hiddenBrightness;
    const fromOpacity = direction === 'in' ? 0 : 1;
    const toOpacity = direction === 'in' ? 1 : 0;
    const fromY = direction === 'in' ? 6 : 0;
    const toY = direction === 'in' ? 0 : 6;


    $anime.set(words, {
      opacity: fromOpacity,
      translateY: fromY,
      filter: `brightness(${fromBrightness})`,
    });


    const animation = $anime({
      targets: words,
      brightnessLevel: [fromBrightness, toBrightness],
      opacity: [fromOpacity, toOpacity],
      translateY: [fromY, toY],
      duration: direction === 'in' ? 540 : 380,
      delay:
        direction === 'in'
          ? $anime.stagger(22, { start: 40 })
          : $anime.stagger(12, { from: 'last' }),
      easing: 'easeOutCubic',
      update(animation) {
        for (const item of animation.animatables) {
          const target = item.target as HTMLElement & { brightnessLevel?: number };
          const brightness =
            typeof target.brightnessLevel === 'number' ? target.brightnessLevel : 1;
          target.style.filter = `brightness(${brightness.toFixed(3)})`;
        }
      },
      complete() {
        for (const word of words) {
          const target = word as HTMLElement & { brightnessLevel?: number };
          if (direction === 'in') {
            target.style.filter = '';
          }
          delete target.brightnessLevel;
        }
        paragraphRevealState.set(paragraph, direction === 'in' ? 'visible' : 'hidden');
      },
    });


    paragraphRevealAnimations.set(paragraph, animation as { pause: () => void });
  }


  function setupParagraphWordReveal() {
    if (prefersReducedMotion || !canUseTextSplitReveal) return;


    const paragraphs = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-reveal][data-reveal-role="paragraph"]'),
    );


    for (const paragraph of paragraphs) {
      if (paragraph.dataset.wordRevealObserverAttached === 'true') continue;
      paragraph.dataset.wordRevealObserverAttached = 'true';


      const words = splitParagraphIntoWords(paragraph);
      if (words.length) {
        const isDarkMode = resolvedMode.value.toLowerCase() === 'dark';
        const startBrightness = isDarkMode ? 0.86 : 1.14;
        $anime.set(words, {
          opacity: 0,
          translateY: 6,
          filter: `brightness(${startBrightness})`,
        });
        paragraphRevealState.set(paragraph, 'hidden');
      }


      const { stop } = useIntersectionObserver(
        paragraph,
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting) {
            if (paragraphRevealState.get(paragraph) !== 'visible') {
              runParagraphWordReveal(paragraph, 'in');
            }
            return;
          }

          if (paragraphRevealState.get(paragraph) !== 'hidden') {
            runParagraphWordReveal(paragraph, 'out');
          }
        },
        { threshold: 0.22, rootMargin: '0px 0px -10% 0px' },
      );


      if (isElementInRevealZone(paragraph) && paragraphRevealState.get(paragraph) !== 'visible') {
        runParagraphWordReveal(paragraph, 'in');
      }


      paragraphRevealStops.push(stop);
    }
  }


  function runHeadingCharacterReveal(heading: HTMLElement, direction: 'in' | 'out') {
    const chars = splitHeadingIntoChars(heading);
    if (!chars.length) return;


    const isDarkMode = resolvedMode.value.toLowerCase() === 'dark';
    const hiddenBrightness = isDarkMode ? 0.55 : 1.45;
    const fromBrightness = direction === 'in' ? hiddenBrightness : 1;
    const toBrightness = direction === 'in' ? 1 : hiddenBrightness;
    const fromOpacity = direction === 'in' ? 0 : 1;
    const toOpacity = direction === 'in' ? 1 : 0;


    headingRevealAnimations.get(heading)?.pause();


    $anime.set(chars, {
      opacity: fromOpacity,
      filter: `brightness(${fromBrightness})`,
    });


    const animation = $anime({
      targets: chars,
      brightnessLevel: [fromBrightness, toBrightness],
      opacity: [fromOpacity, toOpacity],
      duration: direction === 'in' ? 560 : 420,
      delay:
        direction === 'in'
          ? $anime.stagger(24, { start: 60 })
          : $anime.stagger(14, { from: 'last' }),
      easing: 'easeOutCubic',
      update(animation) {
        for (const item of animation.animatables) {
          const target = item.target as HTMLElement & { brightnessLevel?: number };
          const brightness =
            typeof target.brightnessLevel === 'number' ? target.brightnessLevel : 1;
          target.style.filter = `brightness(${brightness.toFixed(3)})`;
        }
      },
      complete() {
        for (const char of chars) {
          const target = char as HTMLElement & { brightnessLevel?: number };
          if (direction === 'in') {
            target.style.filter = '';
          }
          delete target.brightnessLevel;
        }
        headingRevealState.set(heading, direction === 'in' ? 'visible' : 'hidden');
      },
    });


    headingRevealAnimations.set(heading, animation as { pause: () => void });
  }


  function setupHeadingCharacterReveal() {
    if (prefersReducedMotion || !canUseTextSplitReveal) return;


    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-reveal][data-reveal-role="heading"]'),
    );


    for (const heading of headings) {
      if (heading.dataset.charRevealObserverAttached === 'true') continue;
      heading.dataset.charRevealObserverAttached = 'true';


      const chars = splitHeadingIntoChars(heading);
      if (chars.length) {
        const isDarkMode = resolvedMode.value.toLowerCase() === 'dark';
        const startBrightness = isDarkMode ? 0.55 : 1.45;
        $anime.set(chars, {
          opacity: 0,
          filter: `brightness(${startBrightness})`,
        });
        headingRevealState.set(heading, 'hidden');
      }


      const { stop } = useIntersectionObserver(
        heading,
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting) {
            if (headingRevealState.get(heading) !== 'visible') {
              runHeadingCharacterReveal(heading, 'in');
            }
            return;
          }

          if (headingRevealState.get(heading) !== 'hidden') {
            runHeadingCharacterReveal(heading, 'out');
          }
        },
        { threshold: 0.26, rootMargin: '0px 0px -12% 0px' },
      );


      if (isElementInRevealZone(heading) && headingRevealState.get(heading) !== 'visible') {
        runHeadingCharacterReveal(heading, 'in');
      }


      headingRevealStops.push(stop);
    }
  }


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


  onBeforeUnmount(() => {
    for (const stop of sectionRevealStops) stop();
    for (const stop of headingRevealStops) stop();
    for (const stop of paragraphRevealStops) stop();
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-reveal][data-reveal-role="heading"]'),
    );
    for (const heading of headings) {
      headingRevealAnimations.get(heading)?.pause();
    }
    const paragraphs = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-reveal][data-reveal-role="paragraph"]'),
    );
    for (const paragraph of paragraphs) {
      paragraphRevealAnimations.get(paragraph)?.pause();
    }
    sectionRevealStops.length = 0;
    headingRevealStops.length = 0;
    paragraphRevealStops.length = 0;
  });


  // ─── Intro animation ──────────────────────────────────────────────────────


  const showContent = ref(false);
  const startMenuRotation = ref(false);
  const isAppMounted = ref(false);
  const headerRef = ref<ComponentPublicInstance | null>(null);
  const editorPreviewRef = ref<HTMLElement | null>(null);
  let headerIntroAnimation: { pause: () => void } | null = null;
  let editorPreviewAnimation: { pause: () => void } | null = null;
  let stopStartMenuRotationTimer: (() => void) | null = null;


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
    // set current variant to obsidian
    if (variant.value !== 'obsidian') {
      useTimeoutFn(() => {
        variant.value = 'obsidian';
      }, 900);
    }
  }


  async function onMenuPositioned() {
    if (!isAppMounted.value) return;
    await nextTick();


    const headerTarget = headerRef.value?.$el as HTMLElement | null;
    if (!headerTarget) return;


    headerIntroAnimation?.pause();
    headerIntroAnimation = $anime({
      targets: headerTarget,
      opacity: [0, 1],
      translateY: [-40, 0],
      duration: 800,
      easing: 'easeInOutCubic',
      async complete() {
        headerTarget.style.transform = '';
        if (!isAppMounted.value) return;
        await nextTick();
        if (!isAppMounted.value) return;
        showContent.value = true;

        const editorPreviewTarget = editorPreviewRef.value;
        if (!editorPreviewTarget) return;

        editorPreviewAnimation?.pause();
        editorPreviewAnimation = $anime({
          targets: editorPreviewTarget,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 620,
          easing: 'easeOutCubic',
          complete: () => {
            if (!isAppMounted.value) return;
            void setupScrollReveals();
          },
        });

        stopStartMenuRotationTimer?.();
        const timer = useTimeoutFn(() => {
          if (!isAppMounted.value) return;
          startMenuRotation.value = true;
        }, 200);
        stopStartMenuRotationTimer = timer.stop;
      },
    });
  }


  onMounted(() => {
    isAppMounted.value = true;
  });


  onBeforeUnmount(() => {
    isAppMounted.value = false;
    headerIntroAnimation?.pause();
    editorPreviewAnimation?.pause();
    stopStartMenuRotationTimer?.();
    stopStartMenuRotationTimer = null;
  });
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
