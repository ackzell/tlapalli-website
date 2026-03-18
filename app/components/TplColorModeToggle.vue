<script lang="ts" setup>
import { computed } from 'vue'
import { useResolvedColorMode } from '@/composables/useResolvedColorMode'

const { resolvedMode, preference } = useResolvedColorMode()

const iconClass = computed(() => {
  if (preference.value === 'light') {
    return 'i-mynaui:sun hover:i-mynaui:sun-solid'
  }

  if (preference.value === 'dark') {
    return 'i-mynaui:moon hover:i-mynaui:moon-solid'
  }

  return 'i-ph:monitor'
})

const buttonLabel = computed(() => {
  if (preference.value === 'light') {
    return 'Color mode: Light. Click to switch to Dark'
  }

  if (preference.value === 'dark') {
    return 'Color mode: Dark. Click to switch to Auto'
  }

  return `Color mode: Auto (System, currently ${resolvedMode.value}). Click to switch to Light`
})

function toggleMode() {
  if (preference.value === 'system') {
    preference.value = 'light'
    return
  }

  if (preference.value === 'light') {
    preference.value = 'dark'
    return
  }

  preference.value = 'system'
}

</script>

<template>
  <button
    hover="bg-active"
    bg-transparent
    border-none
    cursor-pointer
    p-2
    relative
    z-20
    touch-manipulation
    :aria-label="buttonLabel"
    :title="buttonLabel"
    @click="toggleMode"
  >
  <div
    text-xl
    :class="iconClass"
  />
  </button>
</template>

<style scoped>
button {
  color: inherit;
  transition: background-color 220ms ease;
}
</style>