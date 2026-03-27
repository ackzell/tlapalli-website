<script setup lang="ts">
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
</script>

<template>
  <div class="preview-shell">
    <TplVariantModeImageSwap
      image-section="versionControl"
      alt="Preview of version control styling for the selected theme variant."
      sizes="100vw sm:60vw md:70vw lg:50vw xl:720px"
      densities="x1 x2"
    />
  </div>

  <section>
    <h2>Version Control</h2>

    <p>
      Carefully selected colors for version control highlights to make sure they convey the right
      meaning in both light and dark modes.
    </p>
  </section>
</template>

<style scoped>
  .preview-shell {
    -webkit-mask-image: linear-gradient(to top, transparent 5%, black 40%);
    mask-image: linear-gradient(to top, transparent 5%, black 40%);
  }
</style>
