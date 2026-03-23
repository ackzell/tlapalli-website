<script setup lang="ts">
import './styles/base.css'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useThemeVariant } from '@/composables/useThemeVariant'
import { useResolvedColorMode } from '@/composables/useResolvedColorMode'
import TplErrors from './components/featureSections/TplErrors.vue'
import TplVariantModeImageSwap from './components/shared/TplVariantModeImageSwap.vue'
import TplVersionControl from './components/featureSections/TplVersionControl.vue'
import TplAiChat from './components/featureSections/TplAiChat.vue'
import TplExtensions from './components/featureSections/TplExtensions.vue'
import TplEditorWidgets from './components/featureSections/TplEditorWidgets.vue'
import { themePalette } from './models/variants'
import TplStatusBar from './components/featureSections/TplStatusBar.vue'
const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })
const { resolvedMode, value: colorModeValue, preference: colorModePreference, hasStoredPreference } = useResolvedColorMode()

const showDebugBadge = import.meta.dev && false
const osPrefersDark = ref<boolean | null>(null)
const storedColorMode = ref<string | null>(null)

const sampleImageSrc = computed(() => `images/variants/${variant.value}${resolvedMode.value}.png`)

if (import.meta.client) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const syncBadgeState = () => {
    osPrefersDark.value = mediaQuery.matches
    storedColorMode.value = localStorage.getItem('tpl-color-mode')
  }

  const handleMediaChange = () => {
    syncBadgeState()
  }

  onMounted(() => {
    syncBadgeState()
    mediaQuery.addEventListener('change', handleMediaChange)
  })

  watch(
    [() => colorModePreference.value, () => colorModeValue.value, () => resolvedMode.value],
    () => {
      syncBadgeState()
    },
  )

  onBeforeUnmount(() => {
    mediaQuery.removeEventListener('change', handleMediaChange)
  })
}

const surfaceClass = computed(() => {
  const mode = resolvedMode.value.toLowerCase()
  return `bg-${variant.value}-${mode}-ui-bg text-${variant.value}-${mode}-ui-foreground`
})

const borderClass = computed(() => {
  const mode = resolvedMode.value.toLowerCase()
  return `border-${variant.value}-${mode}-ui-border`
})

const selectionClass = computed(() => {
  const mode = resolvedMode.value.toLowerCase()
  return `selection:bg-${variant.value}-${mode}-logo-fg selection:text-${variant.value}-${mode}-logo-bg`
})

const shadowColor = computed(() => {
  const mode = resolvedMode.value.toLowerCase() as 'dark' | 'light'
  return themePalette[variant.value][mode].ui.shadow
})

const boxShadow = computed(() => {
  const mode = resolvedMode.value.toLowerCase()
  console.log(mode, shadowColor.value)
  return mode === 'dark' ?
  `0 12px 12px color-mix(in srgb, ${shadowColor.value} 90%, transparent)`
  : `0 6px 12px color-mix(in srgb, ${shadowColor.value} 45%, transparent)`;
})

</script>
<template>
  <ColorScheme>
    <div
      id="page"
      m-0 p-0
      min-h-screen :class="[surfaceClass, selectionClass]"
      :style="{ transition: 'background-color 260ms ease, color 260ms ease' }"
      flex="~ col gap-2"
    >
    <TplMenu />


    <nav
      flex="~" items-center justify-between
      px-4 py-2
      relative
      border="b-solid b-1"
      :class="borderClass"
      sticky top-0 z-10
      backdrop-blur-md
      class="scroll-shadow-nav"
    >
    
      <h1 font-serif>Tlapalli <small font-sans opacity-80 text-sm>VSCode Theme</small></h1>

      <div
        md:absolute w-max pointer-events-none
        class="md:-translate-x-1/2 md:-translate-y-1/2 md:left-1/2 md:top-1/2">

        <div relative flex="~" items-center justify-center>
          <span font-mono absolute right-40px opacity-0 md:opacity-100 transition-opacity duration-250 >
          selected:
        </span>
        <div hidden absolute md:inline>
          <TplCurrentVariantGem />
        </div>
        <TplCurrentVariantName font-mono absolute -left-50px class="md:left-40px"/>
        </div>
      
    </div>

      <TplColorModeToggle />
    </nav>

    <h2 self-center py-5>Tlapalli means "color" in Nahuatl</h2>
    
    <main px-12 pb-36 relative flex="~ col gap-12 justify-center items-center">

    <section
        p-4
        w="full sm:60vw md:70vw"
        max-w="screen"
        rounded-lg
        flex items-center justify-center
        border-solid
        :class="borderClass"
      >
      <TplEditorPreview />
    </section>

     <section class="absolute left-0 top-1/3 w-5% activity-bar-preview-shell z-0">
      <TplVariantModeImageSwap
        image-section="activityBar"
        alt="Preview of activity bar styling for the selected theme variant."
        sizes="sm:123px"
      />
     </section>


      <section
        p-4
        lg:border-none
        rounded-lg
        border-solid
        :class="borderClass"
        flex items-center justify-center gap-8 flex-wrap 
        w="full sm:60vw md:70vw"
        >

      <div >
        <h2>A monochromatic, distraction free theme</h2>
        
        <p>It will allow you to focus on the coding experience and reduce the amount of things trying to get your attention in the editor.</p>

        <p>I have personally felt less fatigued especially when using the dark modes on low light conditions.</p>

        <p>The light themes will provide a comfortable coding experience in well-lit environments.</p>
      </div>
    </section>  

    <section
      p-4
      lg:border-none
      rounded-lg
        border-solid
        :class="borderClass"
        flex items-center justify-center gap-8 flex-wrap 
        w="full sm:60vw md:70vw">
      <TplErrors />
    </section>
  
     <section
      p-4
      lg:border-none
      rounded-lg
        border-solid
        :class="borderClass"
        flex items-center justify-center gap-8 flex-wrap
        w="full sm:60vw md:70vw">
       <TplVersionControl />
    </section>

    <div
      flex flex-col gap-12 lg:gap-8 lg:flex-row justify-center items-center
      w="sm:60vw md:70vw">
      <section
        p-4
        lg:border-none
        rounded-lg
        border-solid
        :class="borderClass"
        flex items-center justify-center gap-8 flex-wrap w-full>
         <TplAiChat/>
       
      </section>

      <section
          p-4
          lg:border-none
          rounded-lg
          border-solid
          :class="borderClass"
          flex items-center justify-center gap-8 flex-wrap w-full
        >
       
         <TplExtensions/>
      </section>
    </div>


     <section
      p-4
      lg:border-none
      rounded-lg
        border-solid
        :class="borderClass"
        flex items-center justify-center gap-8 flex-wrap 
        w="full sm:60vw md:70vw">
      <TplEditorWidgets />
    </section>

    

   <section
      p-4
      lg:border-none
      rounded-lg
        border-solid
        flex flex-col
        :class="borderClass"
        w="full">
       <TplStatusBar />
    </section>
     
    </main>
    
    <footer>
      
      and then some
    </footer>

    <aside
      v-if="showDebugBadge"
      class="dev-mode-badge"
      font-mono
    >
      <div><strong>mode debug</strong></div>
      <div>pref: {{ colorModePreference }}</div>
      <div>value: {{ colorModeValue }}</div>
      <div>resolved: {{ resolvedMode }}</div>
      <div>osDark: {{ osPrefersDark }}</div>
      <div>stored: {{ storedColorMode ?? 'null' }}</div>
      <div>hasStored: {{ hasStoredPreference }}</div>
      <div>variant: {{ variant }}</div>
      <div>src: {{ sampleImageSrc }}</div>
    </aside>
    </div>
  </ColorScheme>
</template>

<style scoped>

.scroll-shadow-nav {
  animation: scroll-shadow linear forwards;
  animation-timeline: scroll(root block);
  animation-range: 0% 1vh;
}

@keyframes scroll-shadow {
  from {
    box-shadow: none;
  }
  to {
    box-shadow: v-bind(boxShadow)
  }
}

.activity-bar-preview-shell {
  -webkit-mask-image: linear-gradient(to top, transparent 10%, black 100%);
  mask-image: linear-gradient(to top, transparent 10%, black 100%);
}

.dev-mode-badge {
  position: fixed;
  right: 0.75rem;
  bottom: 0.75rem;
  z-index: 100;
  pointer-events: none;
  border: 1px solid currentColor;
  background: color-mix(in srgb, currentColor 10%, transparent);
  backdrop-filter: blur(6px);
  border-radius: 0.5rem;
  padding: 0.5rem 0.625rem;
  font-size: 0.65rem;
  line-height: 1.2;
  max-width: min(92vw, 420px);
  word-break: break-all;
}
</style>