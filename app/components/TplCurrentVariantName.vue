<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })
const { $anime } = useNuxtApp()

const displayedVariant = ref<string>(variant.value)
const isTyping = ref(false)

let variantAnimation: { pause: () => void } | null = null

function animateVariantText(nextValue: string) {
  if (!import.meta.client) {
    displayedVariant.value = nextValue
    return
  }

  isTyping.value = true
  variantAnimation?.pause()

  const current = displayedVariant.value
  const state = {
    count: current.length
  }

  const removeDuration = Math.max(120, current.length * 36)
  const typeDuration = Math.max(140, nextValue.length * 52)

  variantAnimation = $anime
    .timeline({ autoplay: true })
    .add({
      targets: state,
      count: 0,
      duration: removeDuration,
      easing: 'linear',
      update: () => {
        displayedVariant.value = current.slice(0, Math.floor(state.count))
      }
    })
    .add({
      duration: 120
    })
    .add({
      targets: state,
      count: nextValue.length,
      duration: typeDuration,
      easing: 'linear',
      update: () => {
        displayedVariant.value = nextValue.slice(0, Math.floor(state.count))
      },
      complete: () => {
        displayedVariant.value = nextValue
        isTyping.value = false
      }
    })
}

watch(variant, (nextValue) => {
  if (!import.meta.client) {
    displayedVariant.value = nextValue
    return
  }

  animateVariantText(nextValue)
})

onBeforeUnmount(() => {
  variantAnimation?.pause()
  variantAnimation = null
  isTyping.value = false
})
</script>

<template>
  <span class="variant-value">
    <span>{{ displayedVariant }}</span>
    <span class="type-cursor" :class="{ 'type-cursor-typing': isTyping }">█</span>
  </span>
</template>

<style scoped>
.type-cursor {
  display: inline-block;
  margin-left: 1px;
  line-height: 1;
  vertical-align: baseline;
  transform: translateY(-0.02em);
  font-size: 1.2rem;
  animation: cursor-phase 1100ms ease-in-out infinite;
}

.type-cursor-typing {
  animation: cursor-phase 520ms ease-in-out infinite;
}

.variant-value {
  display: inline-flex;
  align-items: baseline;
  white-space: nowrap;
  line-height: 1;
}

@keyframes cursor-phase {
  0% {
    opacity: 0.25;
    transform: translateY(-0.02em) scaleY(0.94);
  }
  50% {
    opacity: 1;
    transform: translateY(-0.02em) scaleY(1);
  }
  100% {
    opacity: 0.25;
    transform: translateY(-0.02em) scaleY(0.94);
  }
}
</style>
