import { onBeforeUnmount } from 'vue';

type ScrollRevealRole = 'heading' | 'paragraph' | 'image' | 'generic';

type ScrollRevealTarget = {
  el: HTMLElement;
  role: ScrollRevealRole;
  delayMs: number;
};

export function useScrollReveal() {
  const supportsViewTimeline = import.meta.client
    ? CSS.supports('animation-timeline', 'view()')
    : true;

  const prefersReducedMotion = import.meta.client
    ? window.matchMedia('(prefers-reduce-motion: reduce)').matches
    : false;

  const useSectionRevealFallback = import.meta.client
    ? !supportsViewTimeline || window.navigator.userAgent.toLowerCase().includes('firefox')
    : false;

  const enableImageReveals = true;
  const enableParagraphReveals = true;
  const enableGenericReveals = false;

  const sectionRevealStops: Array<() => void> = [];

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
        { threshold: 0.38, rootMargin: '0px 0px -18% 0px' },
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
      return { el, role, delayMs: getRevealDelay(role, roleIndex) };
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
          if (isTallImage && entry.intersectionRatio <= 0 && !isElementInRevealZone(el)) return;
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

  onBeforeUnmount(() => {
    for (const stop of sectionRevealStops) stop();
    sectionRevealStops.length = 0;
  });

  return {
    supportsViewTimeline,
    prefersReducedMotion,
    enableImageReveals,
    enableParagraphReveals,
    enableGenericReveals,
    isElementInRevealZone,
    setupSectionRevealStages,
    collectScrollRevealTargets,
    setupScrollRevealFallback,
  };
}
