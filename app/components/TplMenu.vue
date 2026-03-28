<script setup lang="ts">
  import { useSound } from '@vueuse/sound';
  import { nextTick, onMounted, ref, watch } from 'vue';
  import { useWebHaptics } from 'web-haptics/vue';

  import type { LogoVariant } from '@/models/variants';

  const { $anime } = useNuxtApp();
  const emit = defineEmits<{
    'intro-finished': [];
    'gems-revealed': [];
    'menu-positioned': [];
  }>();
  const { variant, setVariant } = useThemeVariant({ defaultVariant: 'obsidian' });


  const props = defineProps<{
    startMenuRotation?: boolean;
  }>();


  const { trigger } = useWebHaptics();
  const { play } = useSound('/sounds/winding.mp3', { volume: 0.2 });


  const logoWidthVw = ref(92);
  const logoBottomVh = ref(50);
  const logoTranslateYPercent = ref(50);
  const logoRotationDeg = ref(0);
  const introInProgress = ref(true);
  const logoRootRef = ref<HTMLElement | null>(null);
  const leftButtonRef = ref<HTMLButtonElement | null>(null);
  const rightButtonRef = ref<HTMLButtonElement | null>(null);


  const rotationStepDeg = 360 / 7;
  const isRotating = ref(false);
  const pendingRotationSteps = ref(0);
  const rotationQueue: (1 | -1)[] = [];


  const ringVariants: LogoVariant[] = [
    'gold',
    'turquoise',
    'quartz',
    'lapisLazuli',
    'amethyst',
    'jade',
    'fireOpal',
  ];


  const introRevealOrder = [
    '#gem-gold',
    '#gem-turquoise',
    '#gem-quartz',
    '#gem-lapisLazuli',
    '#gem-amethyst',
    '#gem-jade',
    '#gem-fireOpal',
  ] as const;


  const topRingIndex = ref(0);
  const variantSyncedFromRotation = ref<LogoVariant | null>(null);
  let onRotationQueueDrained: (() => void) | null = null;


  const logoRotationState = {
    value: 0,
  };


  const logoAnimState = {
    widthVw: 92,
    bottomVh: 50,
    translateYPercent: 50,
  };


  function mod(value: number, base: number) {
    return ((value % base) + base) % base;
  }


  function syncVariantFromTopSlot() {
    const nextVariant = ringVariants[topRingIndex.value];
    if (!nextVariant || variant.value === nextVariant) {
      return;
    }


    variantSyncedFromRotation.value = nextVariant;
    setVariant(nextVariant);
  }


  function runSingleRotationStep(direction: 1 | -1, onComplete?: () => void) {
    isRotating.value = true;
    play();


    const btn = direction === -1 ? leftButtonRef.value : rightButtonRef.value;
    if (btn) {
      $anime.remove(btn);
      $anime({
        targets: btn,
        opacity: [1, 0.15, 1],
        duration: 280,
        easing: 'easeOutSine',
      });
    }


    const targetRotation = logoRotationState.value + direction * rotationStepDeg;


    $anime({
      targets: logoRotationState,
      value: targetRotation,
      duration: 280,
      easing: 'easeOutCubic',
      update: () => {
        logoRotationDeg.value = logoRotationState.value;
      },
      complete: () => {
        topRingIndex.value = mod(topRingIndex.value - direction, ringVariants.length);
        syncVariantFromTopSlot();
        onComplete?.();
      },
    });
  }


  function rotateMenu(direction: 1 | -1) {
    rotationQueue.push(direction);


    if (!isRotating.value) {
      runNextRotationStep();
    }
  }


  function runNextRotationStep(interStepDelay = 0, waitBeforeStep = false) {
    if (rotationQueue.length === 0) {
      isRotating.value = false;
      pendingRotationSteps.value = 0;


      const buttons = [leftButtonRef.value, rightButtonRef.value].filter(Boolean);
      if (buttons.length) {
        $anime({
          targets: buttons,
          opacity: [1, 0],
          duration: 300,
          easing: 'easeOutSine',
          complete: () => {
            buttons.forEach((btn) => btn && (btn.style.opacity = ''));
          },
        });
      }


      const cb = onRotationQueueDrained;
      onRotationQueueDrained = null;
      cb?.();
      return;
    }


    const direction = rotationQueue.shift()!;
    // keep pendingRotationSteps in sync so external callers (rotateToVariant) still work
    pendingRotationSteps.value = rotationQueue.reduce((acc, d) => acc + d, 0);


    const go = () =>
      runSingleRotationStep(direction, () => runNextRotationStep(interStepDelay, true));
    if (waitBeforeStep && interStepDelay > 0) {
      setTimeout(go, interStepDelay);
    } else {
      go();
    }
  }


  function playSequence(steps: (1 | -1)[], interStepDelay = 0, onDone?: () => void) {
    if (onDone) {
      onRotationQueueDrained = onDone;
    }
    for (const step of steps) {
      rotationQueue.push(step);
    }


    const buttons = [leftButtonRef.value, rightButtonRef.value].filter(Boolean);
    if (buttons.length) {
      $anime({
        targets: buttons,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutSine',
      });
    }


    if (!isRotating.value) {
      runNextRotationStep(interStepDelay, false);
    }
  }


  function getIntroElements() {
    const logoRoot = logoRootRef.value;


    if (!logoRoot) {
      return null;
    }


    const centerGem = logoRoot.querySelector<SVGGElement>('#center-gem');
    const middleStar = logoRoot.querySelector<SVGPathElement>('#STAR_PATH');
    const gemBackdrops = logoRoot.querySelector<HTMLElement>('.gem-backdrops');
    const satelliteGems = introRevealOrder
      .map((selector) => logoRoot.querySelector<SVGGElement>(selector))
      .filter((gem): gem is SVGGElement => gem !== null);


    if (
      !centerGem ||
      !middleStar ||
      !gemBackdrops ||
      satelliteGems.length !== introRevealOrder.length
    ) {
      return null;
    }


    return {
      centerGem,
      middleStar,
      gemBackdrops,
      satelliteGems,
    };
  }


  function startIntroReveal(onComplete: () => void) {
    const introElements = getIntroElements();


    if (!introElements) {
      onComplete();
      return;
    }


    $anime.set(introElements.gemBackdrops, { opacity: 0 });
    $anime.set(introElements.centerGem, { opacity: 0, scale: 1.42 });
    $anime.set(introElements.middleStar, { opacity: 0 });
    $anime.set(introElements.satelliteGems, {
      opacity: 0,
      scale: 0.78,
      translateY: 10,
    });


    $anime
      .timeline({
        easing: 'easeOutCubic',
        complete: () => {
          emit('gems-revealed');
          onComplete();
        },
      })
      .add({
        targets: introElements.gemBackdrops,
        opacity: [0, 1],
        duration: 380,
        easing: 'linear',
      })
      .add(
        {
          targets: introElements.centerGem,
          opacity: [0, 1],
          scale: [1.42, 1.08],
          duration: 620,
          easing: 'easeOutExpo',
        },
        0,
      )
      .add({
        targets: introElements.middleStar,
        opacity: [0, 1],
        duration: 260,
        easing: 'linear',
      })
      .add({
        targets: introElements.satelliteGems,
        opacity: [0, 1],
        scale: [0.78, 1],
        translateY: [10, 0],
        duration: 320,
        delay: $anime.stagger(130),
        easing: 'easeOutBack(1.4)',
      });
  }


  function moveLogoIntoMenuPosition() {
    $anime({
      targets: logoAnimState,
      widthVw: 70,
      bottomVh: 0,
      translateYPercent: 55,
      duration: 950,
      easing: 'easeInBack(1.7)',
      update: () => {
        logoWidthVw.value = logoAnimState.widthVw;
        logoBottomVh.value = logoAnimState.bottomVh;
        logoTranslateYPercent.value = logoAnimState.translateYPercent;
      },
      complete: () => {
        emit('menu-positioned');
      },
    });
  }


  function rotateToVariant(nextVariant: LogoVariant) {
    const targetIndex = ringVariants.indexOf(nextVariant);
    if (targetIndex < 0) {
      if (nextVariant === 'obsidian') {
        setVariant(nextVariant);
      }
      return;
    }


    const clockwiseSteps = mod(topRingIndex.value - targetIndex, ringVariants.length);
    const counterClockwiseSteps = ringVariants.length - clockwiseSteps;


    if (clockwiseSteps === 0) {
      syncVariantFromTopSlot();
      return;
    }


    const direction: 1 | -1 = clockwiseSteps <= counterClockwiseSteps ? 1 : -1;
    const steps = direction === 1 ? clockwiseSteps : counterClockwiseSteps;


    for (let i = 0; i < steps; i++) {
      rotationQueue.push(direction);
    }


    if (!isRotating.value) {
      runNextRotationStep();
    }
  }


  watch(variant, (nextVariant) => {
    if (introInProgress.value) {
      return;
    }

    if (variantSyncedFromRotation.value === nextVariant) {
      variantSyncedFromRotation.value = null;
      return;
    }

    rotateToVariant(nextVariant);
  });


  watch(
    () => props.startMenuRotation,
    (shouldStart) => {
      if (shouldStart) {
        playSequence([-1, 1], 900, () => {
          introInProgress.value = false;
          emit('intro-finished');
        });
      }
    },
  );


  onMounted(async () => {
    const savedIndex = ringVariants.indexOf(variant.value);
    topRingIndex.value = savedIndex >= 0 ? savedIndex : 0;
    const startingRotation = -topRingIndex.value * rotationStepDeg;
    logoRotationState.value = startingRotation;
    logoRotationDeg.value = startingRotation;

    await nextTick();
    startIntroReveal(() => {
      logoRotationState.value = startingRotation;
      logoRotationDeg.value = startingRotation;
      moveLogoIntoMenuPosition();
    });
  });
</script>

<template>
  <div
    class="logo-menu"
    :class="{ 'is-intro': introInProgress }"
    :style="{
      position: 'fixed',
      left: '50%',
      bottom: `${logoBottomVh}vh`,
      width: `${logoWidthVw}vw`,
      maxWidth: '300px',
      transform: `translate(-50%, ${logoTranslateYPercent}%)`,
      zIndex: 20,
    }"
  >
    <button
      ref="leftButtonRef"
      type="button"
      class="logo-rotate-button logo-rotate-button-left"
      aria-label="Rotate menu left"
      :disabled="introInProgress"
      @click="
        trigger();
        rotateMenu(-1);
      "
    >
      <div
        class="i-mynaui:fat-corner-left-down hover:i-mynaui:fat-corner-left-down-solid hover:scale-150 active:scale-98"
        transition="transform 220ms ease"
      />
    </button>

    <div
      ref="logoRootRef"
      :style="{
        transform: `rotate(${logoRotationDeg}deg)`,
        pointerEvents: introInProgress ? 'none' : 'auto',
      }"
    >
      <TplLogo class="block w-full h-auto" @select-variant="rotateToVariant" />
    </div>

    <button
      ref="rightButtonRef"
      type="button"
      class="logo-rotate-button logo-rotate-button-right"
      aria-label="Rotate menu right"
      :disabled="introInProgress"
      @click="
        trigger();
        rotateMenu(1);
      "
    >
      <div
        class="i-mynaui:fat-corner-right-down hover:i-mynaui:fat-corner-right-down-solid hover:scale-150 active:scale-98"
        transition="transform 220ms ease"
      />
    </button>
  </div>
</template>

<style scoped>
  .logo-menu {
    position: relative;
  }

  .logo-rotate-button {
    position: absolute;
    top: 35%;
    width: 2.5rem;
    height: 2.5rem;
    z-index: 5;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1;
    opacity: 0;
    transition:
      opacity 220ms ease,
      transform 220ms ease;
  }

  .logo-menu:hover .logo-rotate-button,
  .logo-menu:focus-within .logo-rotate-button {
    opacity: 1;
  }

  .logo-rotate-button-left {
    left: 0;
    transform: translate(-130%, -50%);
  }

  .logo-rotate-button-right {
    right: 0;
    transform: translate(130%, -50%);
  }
</style>
