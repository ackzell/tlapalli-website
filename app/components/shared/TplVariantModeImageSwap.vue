<script setup lang="ts">
import { computed } from 'vue'
import TplImageTransitionSwap from '@/components/shared/TplImageTransitionSwap.vue'
import { useResolvedColorMode } from '@/composables/useResolvedColorMode'
import { useThemeVariant } from '@/composables/useThemeVariant'
import { useVariantSwitchTimeline } from '@/composables/useVariantSwitchTimeline'

const props = withDefaults(defineProps<{
  imageSection: string
  alt?: string
  sizes?: string
  densities?: string
}>(), {
  alt: undefined,
  sizes: 'sm:70vw md:80vw',
  densities: 'x1 x3',
})

const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })
const { resolvedMode } = useResolvedColorMode()
const { switchToken, switchStartedAt, totalDuration } = useVariantSwitchTimeline()

const normalizedSection = computed(() => props.imageSection.replace(/^\/+|\/+$/g, ''))
const resolvedSrc = computed(() => `images/${normalizedSection.value}/${variant.value}${resolvedMode.value}.png`)
const resolvedAlt = computed(() => props.alt
  ?? `Preview image for ${variant.value} variant in ${resolvedMode.value.toLowerCase()} mode.`)
</script>

<template>
  <TplImageTransitionSwap
    :src="resolvedSrc"
    :alt="resolvedAlt"
    :sizes="sizes"
    :densities="densities"
    :sync-token="switchToken"
    :sync-started-at="switchStartedAt"
    :sync-duration="totalDuration"
  >
    <template #image="{ src, alt }">
      <slot name="image" :src="src" :alt="alt">
        <NuxtImg
          :src="src"
          :alt="alt"
          class="preview-image"
          :sizes="sizes"
          :densities="densities"
        />
      </slot>
    </template>
  </TplImageTransitionSwap>
</template>

<style scoped>
.preview-image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
