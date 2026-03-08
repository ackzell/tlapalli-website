<script setup lang="ts">
import './styles/base.css'
import { computed } from 'vue'
import { useThemeVariant } from './composables/useThemeVariant'

const colorMode = useColorMode()
const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })

const surfaceClass = computed(() => {
  const suffix = colorMode.value === 'light' ? '-l' : ''
  return `bg-${variant.value}-bg${suffix} text-${variant.value}-foreground${suffix}`
})
</script>
<template>
  <div 
      m-0 p-0 min-h-screen  :class="surfaceClass"
      flex="~ col items-center justify-start gap-4">

    <TplColorModeToggle/>

    <TplLogo/>

    <TplThemeSwitcher/>

    <h1>Tlapalli</h1>
    <p>Color in Náhuatl</p>
  </div>
</template>