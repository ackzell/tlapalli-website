<script setup lang="ts">
import './styles/base.css'
import { computed } from 'vue'
import { useThemeVariant } from '@/composables/useThemeVariant'

const colorMode = useColorMode()
const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })

const surfaceClass = computed(() => {
  const suffix = colorMode.value === 'light' ? '-l' : ''
  return `bg-${variant.value}-bg${suffix} text-${variant.value}-foreground${suffix}`
})
</script>
<template>
  <div m-0 p-0 min-h-screen :class="surfaceClass"
    :style="{ transition: 'background-color 260ms ease, color 260ms ease' }" flex="~ col gap-4">
    <TplMenu />


    <div px-4 flex="~" items-center justify-between gap-5>

      <h1>Tlapalli VSCode Theme</h1>

      <TplColorModeToggle />
    </div>

    <div flex="~" items-center gap-4 px-4 translate-x-70>
      <span font-mono>
        selected:
      </span>
      <div>
        <TplCurrentVariant />
      </div>
      <span font-mono>
        {{ variant }}
      </span>
    </div>



    <p>Color in Náhuatl</p>
    <p>Color in Náhuatl</p>
    <p>Color in Náhuatl</p>


    <!-- <TplThemeSwitcher/> -->


    <div h-2xl>
      more content here
    </div>
  </div>
</template>