import { computed, effectScope, watch } from 'vue'
import {
  EDITOR_PREVIEW_REVEAL_DURATION,
  getVariantTypingDurations,
} from '@/composables/useEditorPreviewTiming'

const SWITCH_TOKEN_KEY = 'variantSwitchTimeline:token'
const SWITCH_FROM_KEY = 'variantSwitchTimeline:from'
const SWITCH_TO_KEY = 'variantSwitchTimeline:to'
const SWITCH_STARTED_AT_KEY = 'variantSwitchTimeline:startedAt'
const SWITCH_IS_ACTIVE_KEY = 'variantSwitchTimeline:isActive'
const SWITCH_REMOVE_DURATION_KEY = 'variantSwitchTimeline:removeDuration'
const SWITCH_PAUSE_DURATION_KEY = 'variantSwitchTimeline:pauseDuration'
const SWITCH_TYPE_DURATION_KEY = 'variantSwitchTimeline:typeDuration'

let timelineScope: ReturnType<typeof effectScope> | null = null
let clearSwitchTimer: (() => void) | null = null

export function useVariantSwitchTimeline() {
  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })

  const switchToken = useState<number>(SWITCH_TOKEN_KEY, () => 0)
  const fromVariant = useState<string>(SWITCH_FROM_KEY, () => variant.value)
  const toVariant = useState<string>(SWITCH_TO_KEY, () => variant.value)
  const switchStartedAt = useState<number>(SWITCH_STARTED_AT_KEY, () => 0)
  const isSwitching = useState<boolean>(SWITCH_IS_ACTIVE_KEY, () => false)

  const initialDurations = getVariantTypingDurations(variant.value, variant.value)
  const removeDuration = useState<number>(SWITCH_REMOVE_DURATION_KEY, () => initialDurations.removeDuration)
  const pauseDuration = useState<number>(SWITCH_PAUSE_DURATION_KEY, () => initialDurations.pauseDuration)
  const typeDuration = useState<number>(SWITCH_TYPE_DURATION_KEY, () => initialDurations.typeDuration)

  if (import.meta.client && !timelineScope) {
    timelineScope = effectScope(true)
    timelineScope.run(() => {
      watch(
        variant,
        (nextVariant, previousVariant) => {
          if (nextVariant === previousVariant) {
            return
          }

          const nextDurations = getVariantTypingDurations(previousVariant, nextVariant)

          fromVariant.value = previousVariant
          toVariant.value = nextVariant
          removeDuration.value = nextDurations.removeDuration
          pauseDuration.value = nextDurations.pauseDuration
          typeDuration.value = nextDurations.typeDuration
          switchToken.value += 1
          switchStartedAt.value = Date.now()
          isSwitching.value = true

          clearSwitchTimer?.()
          const timeoutId = window.setTimeout(() => {
            isSwitching.value = false
            clearSwitchTimer = null
          }, EDITOR_PREVIEW_REVEAL_DURATION)

          clearSwitchTimer = () => {
            window.clearTimeout(timeoutId)
          }
        },
        { flush: 'sync' },
      )
    })
  }

  const phaseDurations = computed(() => ({
    removeDuration: removeDuration.value,
    pauseDuration: pauseDuration.value,
    typeDuration: typeDuration.value,
  }))

  return {
    switchToken,
    switchStartedAt,
    isSwitching,
    fromVariant,
    toVariant,
    phaseDurations,
    totalDuration: computed(() => EDITOR_PREVIEW_REVEAL_DURATION),
  }
}
