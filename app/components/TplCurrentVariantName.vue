<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { getVariantTypingDurations } from '@/composables/useEditorPreviewTiming'

const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })
const { $anime } = useNuxtApp()

const displayedVariant = ref<string>(variant.value)
const isTyping = ref(false)
const cursorState = ref<'hidden' | 'typing' | 'settling'>('hidden')
const cursorKey = ref(0)

let variantAnimation: { pause: () => void } | null = null
let cursorHideTimer: number | undefined

function clearCursorHideTimer() {
  if (cursorHideTimer) {
    window.clearTimeout(cursorHideTimer)
    cursorHideTimer = undefined
  }
}

function showTypingCursor() {
  clearCursorHideTimer()
  cursorState.value = 'typing'
  cursorKey.value += 1
}

function settleCursor() {
  clearCursorHideTimer()
  cursorState.value = 'settling'
  cursorKey.value += 1
  cursorHideTimer = window.setTimeout(() => {
    cursorState.value = 'hidden'
    cursorHideTimer = undefined
  }, 1680)
}

function animateVariantText(nextValue: string) {
  if (!import.meta.client) {
    displayedVariant.value = nextValue
    return
  }

  isTyping.value = true
  variantAnimation?.pause()
  showTypingCursor()

  const current = displayedVariant.value
  const state = {
    count: current.length
  }

  const { removeDuration, pauseDuration, typeDuration } = getVariantTypingDurations(current, nextValue)

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
      duration: pauseDuration
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
        settleCursor()
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
  clearCursorHideTimer()
  variantAnimation?.pause()
  variantAnimation = null
  isTyping.value = false
  cursorState.value = 'hidden'
})
</script>

<template>
  <span class="variant-value">
    <span>{{ displayedVariant }}</span>
    <span
      :key="cursorKey"
      class="type-cursor"
      :class="{
        'type-cursor-typing': cursorState === 'typing',
        'type-cursor-settling': cursorState === 'settling',
        'type-cursor-hidden': cursorState === 'hidden',
      }"
    >█</span>
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
  opacity: 0;
}

.type-cursor-typing {
  animation: cursor-phase 520ms ease-in-out infinite;
}

.type-cursor-settling {
  animation: cursor-phase 560ms ease-in-out 3;
}

.type-cursor-hidden {
  animation: none;
  opacity: 0;
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
