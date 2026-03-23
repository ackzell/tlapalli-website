<script lang="ts" setup>
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onBeforeUpdate,
    ref,
    type ComponentPublicInstance,
  } from 'vue';
  import { useWebHaptics } from 'web-haptics/vue';

  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';
  import { useThemeVariant } from '@/composables/useThemeVariant';

  const { $anime } = useNuxtApp();
  const { resolvedMode, preference } = useResolvedColorMode();
  const menuRoot = ref<HTMLElement | null>(null);
  const triggerButton = ref<HTMLElement | null>(null);
  const isMenuOpen = ref(false);
  const shouldRenderMenu = ref(false);
  const menuPanel = ref<HTMLElement | null>(null);
  const menuItems = ref<HTMLElement[]>([]);
  const prefersDark = usePreferredDark();
  const osModeLabel = computed<'Light' | 'Dark'>(() => (prefersDark.value ? 'Dark' : 'Light'));
  const { trigger } = useWebHaptics();
  let menuAnimation: { pause: () => void } | null = null;


  // Panel position state for teleported element
  const panelStyle = ref({
    position: 'fixed' as const,
    top: '0px',
    right: '0px',
    left: 'auto' as const,
  });


  type ColorPreference = 'system' | 'light' | 'dark';


  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const borderClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `border-${variant.value}-${mode}-ui-border`;
  });
  const surfaceClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `bg-${variant.value}-${mode}-ui-widgetBg/60`;
  });


  const textClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `text-${variant.value}-${mode}-ui-foreground`;
  });


  const hoverButtonClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `hover:pointer hover:bg-${variant.value}-${mode}-ui-widgetHoverBg hover:text-${variant.value}-${mode}-ui-widgetHoverForeground`;
  });


  const modeOptions: Array<{
    value: ColorPreference;
    label: string;
    iconClass: string;
    helper: string;
  }> = [
    { value: 'light', label: 'Light', iconClass: 'i-mynaui:sun', helper: 'Always use light mode' },
    { value: 'dark', label: 'Dark', iconClass: 'i-mynaui:moon', helper: 'Always use dark mode' },
    {
      value: 'system',
      label: 'Auto',
      iconClass: 'i-ph:monitor',
      helper: 'Follow system appearance',
    },
  ];


  const iconClass = computed(() => {
    if (preference.value === 'light') return 'i-mynaui:sun hover:i-mynaui:sun-solid';
    if (preference.value === 'dark') return 'i-mynaui:moon hover:i-mynaui:moon-solid';
    return 'i-ph:monitor :hover:i-ph:monitor-fill';
  });


  const iconClassMenuOpen = computed(() => {
    if (preference.value === 'light') return 'i-mynaui:sun-solid';
    if (preference.value === 'dark') return 'i-mynaui:moon-solid';
    return 'i-ph:monitor-fill';
  });


  const buttonLabel = computed(() => {
    if (preference.value === 'light') return 'Color mode: Light. Open menu';
    if (preference.value === 'dark') return 'Color mode: Dark. Open menu';
    return `Color mode: Auto (System, currently ${resolvedMode.value}). Open menu`;
  });


  function positionPanel() {
    const btn = triggerButton.value;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    panelStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 5.6}px`,
      // Align right edge of panel with right edge of button
      right: `${window.innerWidth - rect.right}px`,
      left: 'auto',
    };
  }


  function toggleMenu() {
    if (isMenuOpen.value) {
      void closeMenu();
      return;
    }
    void openMenu();
  }


  function setMode(nextMode: ColorPreference) {
    preference.value = nextMode;
    void closeMenu();
  }


  function setMenuItemRef(element: Element | ComponentPublicInstance | null) {
    if (!element || !(element instanceof Element)) return;
    menuItems.value.push(element as HTMLElement);
  }


  onBeforeUpdate(() => {
    menuItems.value = [];
  });


  async function openMenu() {
    positionPanel();
    shouldRenderMenu.value = true;
    isMenuOpen.value = true;


    await nextTick();


    const panel = menuPanel.value;
    if (!panel) return;


    menuAnimation?.pause();


    const items = [...menuItems.value];


    // Apply will-change only for the duration of the animation
    panel.style.willChange = 'height, padding-top, padding-bottom';
    panel.style.height = '0px';
    panel.style.paddingTop = '0px';
    panel.style.paddingBottom = '0px';


    $anime.set(items, { opacity: 0, translateY: 6 });


    const targetHeight = panel.scrollHeight;


    menuAnimation = $anime
      .timeline({
        easing: 'easeOutCubic',
        complete: () => {
          panel.style.willChange = '';
          panel.style.height = 'auto';
          panel.style.paddingTop = '';
          panel.style.paddingBottom = '';
        },
      })
      .add({
        targets: panel,
        height: [0, targetHeight],
        paddingTop: [0, 5.6],
        paddingBottom: [0, 5.6],
        duration: 320,
      })
      .add(
        {
          targets: items,
          opacity: [0, 1],
          translateY: [6, 0],
          duration: 150,
          delay: $anime.stagger(45),
          easing: 'easeOutQuad',
        },
        '-=120',
      );
  }


  async function closeMenu() {
    isMenuOpen.value = false;


    await nextTick();


    const panel = menuPanel.value;
    if (!panel) {
      shouldRenderMenu.value = false;
      return;
    }


    menuAnimation?.pause();


    const items = [...menuItems.value];
    const reverseItems = [...items].reverse();
    const currentHeight = panel.getBoundingClientRect().height;


    panel.style.willChange = 'height, padding-top, padding-bottom';
    panel.style.height = `${currentHeight}px`;


    menuAnimation = $anime
      .timeline({
        complete: () => {
          shouldRenderMenu.value = false;
          panel.style.willChange = '';
          panel.style.height = '';
          panel.style.paddingTop = '';
          panel.style.paddingBottom = '';
        },
      })
      .add({
        targets: reverseItems,
        opacity: [1, 0],
        translateY: [0, 5],
        duration: 110,
        delay: $anime.stagger(30),
        easing: 'easeInQuad',
      })
      .add(
        {
          targets: panel,
          height: [currentHeight, 0],
          paddingTop: [5.6, 0],
          paddingBottom: [5.6, 0],
          duration: 240,
          easing: 'easeInOutQuad',
        },
        '-=40',
      );
  }


  // Reposition on scroll or resize while open
  function handleScrollResize() {
    if (isMenuOpen.value) positionPanel();
  }


  window.addEventListener('scroll', handleScrollResize, { passive: true, capture: true });
  window.addEventListener('resize', handleScrollResize, { passive: true });


  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScrollResize, { capture: true });
    window.removeEventListener('resize', handleScrollResize);
  });


  onClickOutside(menuRoot, (event) => {
    if (!isMenuOpen.value) return;
    // Don't close if clicking inside the teleported panel
    const panel = menuPanel.value;
    if (panel && panel.contains(event.target as Node)) return;
    void closeMenu();
  });
</script>

<template>
  <div ref="menuRoot" class="color-mode-menu-root">
    <button
      ref="triggerButton"
      bg-transparent
      border-none
      cursor-pointer
      p-2
      relative
      z-20
      touch-manipulation
      hover:scale-110
      active:scale-95
      transition-transform
      :class="textClass"
      :aria-label="buttonLabel"
      :title="buttonLabel"
      :aria-expanded="isMenuOpen"
      aria-haspopup="menu"
      @click="
        toggleMenu();
        trigger();
      "
    >
      <div text-xl :class="[iconClass, textClass, isMenuOpen ? iconClassMenuOpen : '']" />
    </button>

    <Teleport to="body">
      <div
        v-if="shouldRenderMenu"
        ref="menuPanel"
        class="color-mode-menu-panel"
        border-solid
        border-1
        :class="[borderClass, surfaceClass]"
        rounded-md
        role="menu"
        aria-label="Choose color mode"
        :style="panelStyle"
      >
        <button
          v-for="option in modeOptions"
          :key="option.value"
          :ref="setMenuItemRef"
          type="button"
          class="color-mode-menu-item"
          :class="{
            'color-mode-menu-item-active': preference === option.value,
            [surfaceClass]: true,
            [textClass]: true,
            [hoverButtonClass]: true,
          }"
          role="menuitemradio"
          :aria-checked="preference === option.value"
          @click="
            setMode(option.value);
            trigger();
          "
        >
          <span class="color-mode-menu-icon" :class="option.iconClass" />
          <span class="color-mode-menu-copy">
            <span class="color-mode-menu-title">{{ option.label }}</span>
            <small class="color-mode-menu-helper">
              {{ option.value === 'system' ? `Follow system (${osModeLabel})` : option.helper }}
            </small>
          </span>
          <span
            v-if="preference === option.value"
            class="color-mode-menu-check i-mynaui:check"
            aria-hidden="true"
          />
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
  .color-mode-menu-root {
    position: relative;
  }

  button {
    transition: background-color 220ms ease;
  }

  .color-mode-menu-panel {
    min-width: 13.5rem;
    padding: 0.35rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    transform-origin: top right;
    overflow: hidden;
    /* backdrop-filter lives here freely — no stacking context trapping it */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .color-mode-menu-item {
    width: 100%;
    border: none;
    border-radius: 0.45rem;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.5rem;
    cursor: pointer;
  }

  .color-mode-menu-icon {
    font-size: 1.05rem;
    opacity: 0.95;
  }

  .color-mode-menu-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  .color-mode-menu-title {
    font-size: 0.84rem;
    line-height: 1.2;
  }

  .color-mode-menu-helper {
    opacity: 0.7;
    font-size: 0.64rem;
    line-height: 1.2;
  }

  .color-mode-menu-check {
    font-size: 0.95rem;
    opacity: 0.9;
  }
</style>
