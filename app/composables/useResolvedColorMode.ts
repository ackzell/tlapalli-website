import { computed } from 'vue'

export function useResolvedColorMode() {
  const colorMode = useColorMode()

  const resolvedMode = computed<'Light' | 'Dark'>(() => {
    if (colorMode.value === 'light') {
      return 'Light'
    }

    if (colorMode.value === 'dark') {
      return 'Dark'
    }

    if (import.meta.client && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'Light'
    }

    return 'Dark'
  })

  return {
    resolvedMode,
  }
}
