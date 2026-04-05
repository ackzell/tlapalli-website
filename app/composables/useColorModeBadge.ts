import { type Ref, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export function useColorModeBadge(
  colorModePreference: Ref<string>,
  colorModeValue: Ref<string>,
  resolvedMode: Ref<string>,
) {
  const osPrefersDark = ref<boolean | null>(null);
  const storedColorMode = ref<string | null>(null);

  if (import.meta.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const syncBadgeState = () => {
      osPrefersDark.value = mediaQuery.matches;
      storedColorMode.value = localStorage.getItem('tpl-color-mode');
    };

    onMounted(() => {
      syncBadgeState();
      mediaQuery.addEventListener('change', syncBadgeState);
    });

    watch(
      [() => colorModePreference.value, () => colorModeValue.value, () => resolvedMode.value],
      syncBadgeState,
    );

    onBeforeUnmount(() => {
      mediaQuery.removeEventListener('change', syncBadgeState);
    });
  }

  return { osPrefersDark, storedColorMode };
}
