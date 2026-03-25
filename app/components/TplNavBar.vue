<script setup lang="ts">
  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();


  const borderClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `border-${variant.value}-${mode}-ui-border`;
  });
</script>

<template>
  <nav
    ref="navHeaderRef"
    px-4
    py-2
    border="b-solid b-1"
    :class="borderClass"
    sticky
    top-0
    z-10
    backdrop-blur-md
    class="scroll-shadow-nav"
  >
    <div relative w-full m-0 p-0 flex="~" items-center justify-between>
      <h1 font-serif>Tlapalli <small font-sans opacity-80 text-sm>VSCode Theme</small></h1>

      <div
        md:absolute
        w-max
        pointer-events-none
        class="md:-translate-x-1/2 md:-translate-y-1/2 md:left-1/2 md:top-1/2"
      >
        <div relative flex="~" items-center justify-center>
          <span
            font-mono
            absolute
            right-40px
            opacity-0
            md:opacity-100
            transition-opacity
            duration-250
          >
            selected:
          </span>
          <div hidden absolute md:inline>
            <TplCurrentVariantGem />
          </div>
          <TplCurrentVariantName font-mono absolute -left-50px class="md:left-40px" />
        </div>
      </div>

      <TplColorModeToggle />
    </div>
  </nav>
</template>

<style scoped></style>
