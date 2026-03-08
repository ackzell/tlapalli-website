import type { LogoVariant } from "~/models/variants"

type UseThemeVariantOptions = {
  defaultVariant?: LogoVariant
  persist?: boolean
  cookieKey?: string
}

const THEME_VARIANT_STATE_KEY = 'themeVariant'
const THEME_VARIANT_COOKIE_KEY = 'theme_variant'
const DEFAULT_VARIANT: LogoVariant = 'obsidian'

export const useThemeVariant = (options: UseThemeVariantOptions = {}) => {
  const {
    defaultVariant = DEFAULT_VARIANT,
    persist = true,
    cookieKey = THEME_VARIANT_COOKIE_KEY
  } = options

  const cookie = persist
    ? useCookie<string>(cookieKey, { sameSite: 'lax' })
    : null

  const variant = useState<LogoVariant>(THEME_VARIANT_STATE_KEY, () => {
    const initial = cookie?.value || defaultVariant
    return (initial.trim() || defaultVariant) as LogoVariant
  })

  const setVariant = (nextVariant: LogoVariant) => {
    const normalized = (nextVariant.trim() || defaultVariant) as LogoVariant
    variant.value = normalized
  }

  const clearVariant = () => {
    variant.value = defaultVariant
  }

  useHead(() => ({
    htmlAttrs: {
      'data-variant': variant.value
    }
  }))

  if (persist) {
    watch(
      variant,
      (value) => {
        cookie!.value = value
      },
      { immediate: true }
    )
  }

  return {
    variant,
    setVariant,
    clearVariant
  }
}