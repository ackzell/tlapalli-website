<script setup lang="ts">
import './styles/base.css'
import { computed } from 'vue'
import { useThemeVariant } from '@/composables/useThemeVariant'

const colorMode = useColorMode()
const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })

const surfaceClass = computed(() => {
  const mode = colorMode.value === 'light' ? 'light' : 'dark'
  return `bg-${variant.value}-${mode}-ui-bg text-${variant.value}-${mode}-ui-foreground`
})

const borderClass = computed(() => {
  const mode = colorMode.value === 'light' ? 'light' : 'dark'
  return `border-${variant.value}-${mode}-ui-border`
})

</script>
<template>
  <div
m-0 p-0 min-h-screen :class="surfaceClass"
    :style="{ transition: 'background-color 260ms ease, color 260ms ease' }" 
    flex="~ col gap-2">
    <TplMenu />


    <div
      px-4 flex="~" items-center justify-between
      border="b-solid b-1"
      :class="borderClass"
    >
      <h1>Tlapalli <small font-sans opacity-80>VSCode Theme</small></h1>
      <TplColorModeToggle />
    </div>

    <div w-full flex items-center justify-center h-16>
      
        <div relative flex="~" items-center justify-center>
          <span font-mono absolute right-40px>
          selected:
        </span>
        <div absolute>
          <TplCurrentVariantGem />
        </div>
        <TplCurrentVariantName font-mono absolute left-40px />
        </div>
      
    </div>


    <div
        m-auto p-4
        w="sm:70vw md:80vw" 
        rounded-lg
        flex items-center justify-center
        border-solid
        :class="borderClass"
      >
      <TplEditorPreview />
    </div>
    


    <!-- <TplThemeSwitcher/> -->


    <div h-2xl>
      more content here
    </div>
  </div>
</template>
