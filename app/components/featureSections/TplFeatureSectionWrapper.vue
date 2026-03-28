<script setup lang="ts">
  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();


  const borderClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return [
      `lg:border-none`,
      `border-${variant.value}-${mode}-ui-border`,
      `border-1`,
      `border-solid`,
      `border-r-transparent border-b-transparent`,
    ].join(' ');
  });
</script>
<template>
  <section
    p-4
    rounded-lg
    :class="borderClass"
    flex
    flex-col
    lg:flex-row
    items-center
    justify-evenly
    gap-8
    flex-wrap
    class=""
  >
    <slot />
  </section>
</template>
