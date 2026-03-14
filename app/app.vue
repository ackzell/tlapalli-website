<script setup lang="ts">
import './styles/base.css'
import { computed } from 'vue'
import { useThemeVariant } from '@/composables/useThemeVariant'
import TplErrors from './components/featureSections/TplErrors.vue'

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

const selectionClass = computed(() => {
  const mode = colorMode.value === 'light' ? 'light' : 'dark'
  return `selection:bg-${variant.value}-${mode}-logo-fg selection:text-${variant.value}-${mode}-logo-bg`
})

</script>
<template>
  <div
    id="page"
    m-0 p-0 
    min-h-screen :class="[surfaceClass, selectionClass]"
    :style="{ transition: 'background-color 260ms ease, color 260ms ease' }" 
    flex="~ col gap-2">
    <TplMenu />


    <nav
      flex="~" items-center justify-between
      px-4
      relative
      border="b-solid b-1"
      :class="borderClass"
      sticky top-0 z-10
      backdrop-blur-md    >
    
      <h1 font-serif>Tlapalli <small font-sans opacity-80 text-sm>VSCode Theme</small></h1>

      <div
        absolute w-max
        class="-translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">

        <div relative flex="~" items-center justify-center>
          <span font-mono absolute right-40px opacity-0 md:opacity-100 transition-opacity duration-250 >
          selected:
        </span>
        <div absolute>
          <TplCurrentVariantGem />
        </div>
        <TplCurrentVariantName font-mono absolute left-40px />
        </div>
      
    </div>

      <TplColorModeToggle />
    </nav>

    
    <main px-12>


    <div
        m-auto p-4
        w="full sm:60vw md:70vw"
        max-w="screen"
        rounded-lg
        flex items-center justify-center
        border-solid
        :class="borderClass"
      >
      <TplEditorPreview />
    </div>
    


    <!-- <TplThemeSwitcher/> -->

    <div>
      <TplErrors />
    </div>
    
    </main>
</div>
</template>