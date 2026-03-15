<script setup lang="ts">
import type { LogoVariant } from '@/models/variants'
import { onMounted, ref, watch } from 'vue'

const { $anime } = useNuxtApp()
const { variant, setVariant } = useThemeVariant({ defaultVariant: 'obsidian' })

const logoWidthVw = ref(100)
const logoBottomVh = ref(12)
const logoTranslateYPercent = ref(0)
const logoRotationDeg = ref(0)

const rotationStepDeg = 360 / 7
const isRotating = ref(false)
const pendingRotationSteps = ref(0)

const ringVariants: LogoVariant[] = [
  'gold',
  'turquoise',
  'quartz',
  'lapisLazuli',
  'amethyst',
  'jade',
  'fireOpal'
]

const topRingIndex = ref(0)
const variantSyncedFromRotation = ref<LogoVariant | null>(null)

const logoRotationState = {
  value: 0
}

const logoAnimState = {
  widthVw: 100,
  bottomVh: 1,
  translateYPercent: 0
}

function mod(value: number, base: number) {
  return ((value % base) + base) % base
}

function syncVariantFromTopSlot() {
  const nextVariant = ringVariants[topRingIndex.value]
  if (!nextVariant) {
    return
  }

  if (variant.value === nextVariant) {
    return
  }

  variantSyncedFromRotation.value = nextVariant
  setVariant(nextVariant)
}

function rotateMenu(direction: 1 | -1) {
  pendingRotationSteps.value += direction

  if (isRotating.value) {
    return
  }

  runNextRotationStep()
}

function runNextRotationStep() {
  if (pendingRotationSteps.value === 0) {
    isRotating.value = false
    return
  }

  isRotating.value = true

  const direction = pendingRotationSteps.value > 0 ? 1 : -1
  pendingRotationSteps.value -= direction
  const target = logoRotationState.value + direction * rotationStepDeg

  $anime({
    targets: logoRotationState,
    value: target,
    duration: 280,
    easing: 'easeOutCubic',
    update: () => {
      logoRotationDeg.value = logoRotationState.value
    },
    complete: () => {
      topRingIndex.value = mod(topRingIndex.value - direction, ringVariants.length)
      syncVariantFromTopSlot()
      runNextRotationStep()
    }
  })
}

function rotateToVariant(nextVariant: LogoVariant) {
  const targetIndex = ringVariants.indexOf(nextVariant)
  if (targetIndex < 0) {
    if (nextVariant === 'obsidian') {
      setVariant(nextVariant)
    }
    return
  }

  const clockwiseSteps = mod(topRingIndex.value - targetIndex, ringVariants.length)
  const counterClockwiseSteps = ringVariants.length - clockwiseSteps

  if (clockwiseSteps === 0) {
    syncVariantFromTopSlot()
    return
  }

  const direction: 1 | -1 = clockwiseSteps <= counterClockwiseSteps ? 1 : -1
  const steps = direction === 1 ? clockwiseSteps : counterClockwiseSteps

  pendingRotationSteps.value += direction * steps

  if (!isRotating.value) {
    runNextRotationStep()
  }
}

watch(variant, (nextVariant) => {
  if (variantSyncedFromRotation.value === nextVariant) {
    variantSyncedFromRotation.value = null
    return
  }

  rotateToVariant(nextVariant)
})

onMounted(() => {
  const savedIndex = ringVariants.indexOf(variant.value)
  topRingIndex.value = savedIndex >= 0 ? savedIndex : 0
  const startingRotation = -topRingIndex.value * rotationStepDeg
  logoRotationState.value = startingRotation
  logoRotationDeg.value = startingRotation

  $anime({
    targets: logoAnimState,
    widthVw: 70,
    bottomVh: 0,
    translateYPercent: 55,
    duration: 1400,
    easing: 'easeOutCubic',
    update: () => {
      logoWidthVw.value = logoAnimState.widthVw
      logoBottomVh.value = logoAnimState.bottomVh
      logoTranslateYPercent.value = logoAnimState.translateYPercent
    }
  })
})
</script>

<template>
  <div
    class="logo-menu"
    :style="{
      position: 'fixed',
      left: '50%',
      bottom: `${logoBottomVh}vh`,
      width: `${logoWidthVw}vw`,
      maxWidth: '300px',
      transform: `translate(-50%, ${logoTranslateYPercent}%)`,
      zIndex: 20
    }"
  >
    <button
      type="button"
      class="logo-rotate-button logo-rotate-button-left"
      aria-label="Rotate menu left"
      @click="rotateMenu(-1)"
    >
      <div
        i-mynaui:fat-corner-left-down
        hover:i-mynaui:fat-corner-left-down-solid
        hover:scale-150
        active:scale-98
        transition="transform 220ms ease"
      />
    </button>

    <div :style="{ transform: `rotate(${logoRotationDeg}deg)` }">
      <TplLogo class="block w-full h-auto" @select-variant="rotateToVariant" />
    </div>

    <button
      type="button"
      class="logo-rotate-button logo-rotate-button-right"
      aria-label="Rotate menu right"
      @click="rotateMenu(1)"
    >
      <div
        i-mynaui:fat-corner-right-down
        hover:i-mynaui:fat-corner-right-down-solid
        hover:scale-150
        active:scale-98
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
  transition: opacity 220ms ease, transform 220ms ease;
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
