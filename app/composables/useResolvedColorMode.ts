import { computed } from 'vue'

export function useResolvedColorMode() {
  const colorMode = useColorMode()

  const preference = computed<'system' | 'light' | 'dark'>({
    get: () => {
      if (colorMode.preference === 'light' || colorMode.preference === 'dark') {
        return colorMode.preference
      }

      return 'system'
    },
    set: (nextPreference) => {
      colorMode.preference = nextPreference
    },
  })

  const value = computed<'light' | 'dark'>(() => {
    return colorMode.value === 'dark' ? 'dark' : 'light'
  })

  const resolvedMode = computed<'Light' | 'Dark'>(() => {
    return value.value === 'dark' ? 'Dark' : 'Light'
  })

  const isAuto = computed(() => preference.value === 'system')
  const isReady = computed(() => !colorMode.unknown)
  const hasStoredPreference = computed(() => preference.value !== 'system')

  return {
    value,
    preference,
    resolvedMode,
    isAuto,
    isReady,
    hasStoredPreference,
  }
}
