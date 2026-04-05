import {
  type Ref,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  type ComponentPublicInstance,
} from 'vue';

export function useIntroAnimation(variant: Ref<string>, setupScrollReveals: () => Promise<void>) {
  const { $anime } = useNuxtApp();

  const showContent = ref(false);
  const startMenuRotation = ref(false);
  const isAppMounted = ref(false);
  const headerRef = ref<ComponentPublicInstance | null>(null);
  const editorPreviewRef = ref<HTMLElement | null>(null);

  let headerIntroAnimation: { pause: () => void } | null = null;
  let editorPreviewAnimation: { pause: () => void } | null = null;
  let stopStartMenuRotationTimer: (() => void) | null = null;

  async function onGemsRevealed() {
    // reserved for future use
  }

  async function onLogoIntroFinished() {
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

  return {
    showContent,
    startMenuRotation,
    headerRef,
    editorPreviewRef,
    onGemsRevealed,
    onLogoIntroFinished,
    onMenuPositioned,
  };
}
