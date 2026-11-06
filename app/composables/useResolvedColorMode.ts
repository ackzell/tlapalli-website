import { computed } from 'vue';

export function useResolvedColorMode() {
  const colorMode = useColorMode();

  const preference = computed<'system' | 'light' | 'dark'>({
    get: () => {
      if (colorMode.preference === 'light' || colorMode.preference === 'dark') {
        return colorMode.preference;
      }

      return 'system';
    },
    set: (nextPreference) => {
      colorMode.preference = nextPreference;
    },
  });

  const value = computed<'light' | 'dark'>(() => {
    // The server always renders the light palette. While the client has not
    // resolved the real mode, return the same value so hydration matches the
    // server HTML. Vue does not patch mismatched attributes or classes during
    // hydration, so a different first render would leave light markup in place.
    if (colorMode.unknown) {
      return 'light';
    }

    // An explicit preference always wins. The module can leave `value` stale on
    // the server and for one client pass, so do not depend on it when the user
    // has already chosen a mode.
    if (colorMode.preference === 'light' || colorMode.preference === 'dark') {
      return colorMode.preference;
    }

    return colorMode.value === 'dark' ? 'dark' : 'light';
  });

  const resolvedMode = computed<'Light' | 'Dark'>(() => {
    return value.value === 'dark' ? 'Dark' : 'Light';
  });

  const isAuto = computed(() => preference.value === 'system');
  const isReady = computed(() => !colorMode.unknown);
  const hasStoredPreference = computed(() => preference.value !== 'system');

  return {
    value,
    preference,
    resolvedMode,
    isAuto,
    isReady,
    hasStoredPreference,
  };
}
