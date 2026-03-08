<script setup lang="ts">
import { onMounted, ref } from 'vue'

const { $anime } = useNuxtApp()

const logoWidthVw = ref(100)
const logoBottomVh = ref(12)
const logoTranslateYPercent = ref(0)
const logoRotationDeg = ref(0)

const rotationStepDeg = 360 / 7
const isRotating = ref(false)
const pendingRotationSteps = ref(0)

const logoRotationState = {
  value: 0
}

const logoAnimState = {
  widthVw: 100,
  bottomVh: 1,
  translateYPercent: 0
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
      runNextRotationStep()
    }
  })
}

onMounted(() => {
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
      maxWidth: '400px',
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
      <TplLogo class="block w-full h-auto" />
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
