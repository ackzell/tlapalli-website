<script setup lang="ts">
  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();


  const borderClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `border-${variant.value}-${mode}-ui-border`;
  });
</script>
<template>
  <section
    data-scroll-reveal
    p-4
    lg:border-none
    rounded-lg
    border-solid
    :class="borderClass"
    flex
    flex-col
    lg:flex-row
    items-center
    justify-evenly
    gap-8
    flex-wrap
  >
    <slot />
  </section>
</template>
