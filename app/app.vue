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

    <div w-full flex="~" items-center justify-center>
      
        <div relative flex="~" items-center justify-center>
          <span font-mono absolute right-40px>
          selected:
        </span>
        <div absolute>
          <TplCurrentVariant />
        </div>
        <span font-mono absolute left-40px>
          {{ variant }}
        </span>
        </div>
      
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

<style scoped>
.gaaa {
  width: 300px;
  left: calc(50% - 150px);
}
</style>