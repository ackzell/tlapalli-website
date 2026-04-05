import { type Ref, onBeforeUnmount } from 'vue';

export function useTextSplitReveal(resolvedMode: Ref<string>) {
  const { $anime } = useNuxtApp();

  function createScreenReaderOnlySpan(text: string) {
    const srSpan = document.createElement('span');
    srSpan.textContent = text;
    srSpan.style.position = 'absolute';
    srSpan.style.width = '1px';
    srSpan.style.height = '1px';
    srSpan.style.padding = '0';
    srSpan.style.margin = '-1px';
    srSpan.style.overflow = 'hidden';
    srSpan.style.clip = 'rect(0, 0, 0, 0)';
    srSpan.style.whiteSpace = 'nowrap';
    srSpan.style.border = '0';
    return srSpan;
  }

  const prefersReducedMotion = import.meta.client
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const canUseTextSplitReveal = import.meta.client;

  const headingRevealState = new WeakMap<HTMLElement, 'hidden' | 'visible'>();
  const headingRevealAnimations = new WeakMap<HTMLElement, { pause: () => void }>();
  const headingRevealStops: Array<() => void> = [];
  const paragraphRevealState = new WeakMap<HTMLElement, 'hidden' | 'visible'>();
  const paragraphRevealAnimations = new WeakMap<HTMLElement, { pause: () => void }>();
  const paragraphRevealStops: Array<() => void> = [];

  // ─── Viewport helper ────────────────────────────────────────────────────

  function isElementInRevealZone(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;
  }

  // ─── DOM split helpers ──────────────────────────────────────────────────

  function splitHeadingIntoChars(heading: HTMLElement) {
    if (heading.dataset.charSplitReady === 'true') {
      return Array.from(heading.querySelectorAll<HTMLElement>('.scroll-heading-char'));
    }

    const rawText = heading.textContent ?? '';
    if (!rawText.trim()) return [];

    heading.dataset.charSplitReady = 'true';

    // Visually-hidden span read by screen readers — more reliable than aria-label on headings.
    const srSpan = createScreenReaderOnlySpan(rawText);

    const animWrapper = document.createElement('span');
    animWrapper.setAttribute('aria-hidden', 'true');
    for (const char of Array.from(rawText)) {
      if (char === ' ') {
        animWrapper.append(document.createTextNode(' '));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'scroll-heading-char';
      span.textContent = char;
      span.style.opacity = '0';
      animWrapper.append(span);
    }

    heading.textContent = '';
    heading.append(srSpan, animWrapper);

    return Array.from(heading.querySelectorAll<HTMLElement>('.scroll-heading-char'));
  }

  function splitParagraphIntoWords(paragraph: HTMLElement) {
    if (paragraph.dataset.wordSplitReady === 'true') {
      return Array.from(paragraph.querySelectorAll<HTMLElement>('.scroll-paragraph-word'));
    }

    const rawText = paragraph.textContent ?? '';
    if (!rawText.trim()) return [];

    paragraph.dataset.wordSplitReady = 'true';

    // Visually-hidden span: aria-label on <p> is not reliably announced by screen readers.
    const srSpan = createScreenReaderOnlySpan(rawText);

    const sourceNodes = Array.from(paragraph.childNodes);
    // Animated content wrapped in aria-hidden so readers skip the split spans.
    const animWrapper = document.createElement('span');
    animWrapper.setAttribute('aria-hidden', 'true');
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

    animWrapper.append(fragment);
    paragraph.replaceChildren(srSpan, animWrapper);

    return Array.from(paragraph.querySelectorAll<HTMLElement>('.scroll-paragraph-word'));
  }

  // ─── Paragraph word reveal ───────────────────────────────────────────────

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
          if (direction === 'in') target.style.filter = '';
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

  // ─── Heading character reveal ────────────────────────────────────────────

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
          if (direction === 'in') target.style.filter = '';
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

  // ─── Cleanup ─────────────────────────────────────────────────────────────

  onBeforeUnmount(() => {
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

    headingRevealStops.length = 0;
    paragraphRevealStops.length = 0;
  });

  return {
    canUseTextSplitReveal,
    setupHeadingCharacterReveal,
    setupParagraphWordReveal,
  };
}
